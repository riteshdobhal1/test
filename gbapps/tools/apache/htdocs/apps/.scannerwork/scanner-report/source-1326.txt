angular.module('gbApp.services', []).factory('Authenticate', ['$http', '$cookies', '$location',
    function ($http, $cookies, $location) {
        return {
            authorize: function () {

            }
        };
    }]);
angular.module('gbApp.services').factory('ModalService', ['$modal', '$cookies',
    function ($modal, $cookies) {
        return {
            openModal: function (url, scope, myStyle, backdrop, escapeKey) {
                return $modal.open({
                    templateUrl: url,
                    windowClass: myStyle ? myStyle : '',
                    backdrop: backdrop ? backdrop : false,
                    keyboard  : !escapeKey?true:false,
                    scope: scope
                });
            },
            sessionTimeout: function () {

                delete $cookies.prevApplication;
		
                return $modal.open({
                    templateUrl: 'partials/session_timeout.html',
                    windowClass: false,
                    backdrop: 'static',
                    controller: 'SessionController as sessionCtrl'
                });
            },
            abortUpload: function () {
                return $modal.open({
                    templateUrl: 'partials/abort_upload.html',
                    windowClass: false,
                    backdrop: 'static',
                    controller: 'AbortUploadController as abortCtrl'
                });
            },
            alertBox: function (msgObj, backdrop) {
                return $modal.open({
                    templateUrl: 'partials/alert_box.html',
                    windowClass: false,
                    backdrop: backdrop === false?false: true,
                    controller: 'AlertController as alertCtrl',
                    resolve: {
                        items: function () {
                            return msgObj;
                        }
                    }
                });
            },
            confirmationBox: function (titleObj, msgObj, successText, cancelText) {
                return $modal.open({
                    templateUrl: 'partials/confirmation_box.html',
                    windowClass: false,
                    backdrop: true,
                    controller: 'ConfirmationController as confirmationCtrl',
                    resolve: {
                        titleObj: function () {
                            return titleObj;
                        },
                        msgObj: function () {
                            return msgObj;
                        },
                        successText: function () {
                            return successText;
                        },
                        cancelText: function () {
                            return cancelText;
                        }
                    }
                });
            }
        };
    }]);
angular.module('gbApp.services').factory('metaDataService', ['$modal', '$cookies', 'GlobalService', '$location', 'RulesTestWithLogvault',
function($modal, $cookies, GlobalService, $location, RulesTestWithLogvault) {
    var domain = {};
    var feature = {};
    var user = {};
    var config = {};
    var gbconfig = {};
    var explorerDataDuration = "";
    var currentPage = "", dashboardtype = "", raACurrentPage="";
    var firebaseConfig = {};
    var clinsightReportUrl = "";
    function gbTrim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }
    return {
        setCurrentPage : function(page){
            currentPage = page;
        },
        getCurrentPage : function(page){
            return currentPage;
        },
        setDashboardType : function(type){
            dashboardtype = type;
        },
        getDashboardType : function(){
            return dashboardtype;
        },
        setRaACurrentPage : function(page){
            raACurrentPage = page;
            RulesTestWithLogvault.setCurrentPage(page);
        },
        getRaACurrentPage : function(){
            return raACurrentPage;
        },
        setDomain : function(domainInfo) {
            domain = domainInfo;
            GlobalService.setVal('feature_label', domain["feature_label"]);
            GlobalService.setVal('ssoLogoutUrl', domain["sso_logout_url"]);
        },
        setFeature : function(featuresInfo) {
            feature = featuresInfo;
        },
        setUser : function(userInfo) {
            user = userInfo;
            GlobalService.setVal('userSso', user.sso);
        },
        setExplorerDataDuration : function(duration) {
            explorerDataDuration = duration;
        },
        getExplorerDataDuration : function() {
            return explorerDataDuration;
        },
        getDomain : function(){
            return domain;
        },
        getDefaultFeature : function(){
           return !!user.is_external ? domain["def_feature_external"] : domain["def_feature_internal"];
        },
        getUser : function() {
            return user;
        },
        //DOMAIN INFO -GETTER
        getManufacturer : function() {
            return domain.mfr;
        },
        getProduct : function() {
            return domain.prod;
        },
        getSchema : function() {
            return domain.sch;
        },
        getNsrEnabled : function() {
            return domain["nsr_enabled"];         
        },
        getNsrType : function() {
            return domain["nsr_type"];            
        },
        getSsoIdpId : function() {
            return domain["sso_idp_id"];          
        },
        getSsoLoginUrl : function() {
            return domain["sso_login_url"];           
        },
        getSsoLogoutUrl : function() {
            return domain["sso_logout_url"];          
        },
        getSsoParams : function() {
            return domain["sso_params"];          
        },
        getSsoParamsSfdc : function() {
            return domain["sso_params_sfdc"];         
        },
        getSsoRoles : function() {
            return domain["sso_roles"];           
        },
        getEndCustomer : function() {
            return domain["ec"];          
        },
        getFeedbackApiKey: function() {
            return domain["feedback_api_key"];            
        },
        getFeedbackBtn : function() {
            return domain["feedback_button"];         
        },
        getLogo : function() {
            return domain["logo"];            
        },
        getInternalLogo : function() {
            return domain["logo_internal"];          
        },
        getlogourl : function() {
            return domain["logo_url"];            
        },
        //FEATURES INFO -GETTER
        getFeatures : function() {
            var mps = null;
            if(!!GlobalService.getVal('showStudio') && GlobalService.getVal('role_details').mps_uidomain[GlobalService.getVal('gb_studio_apps_realm')] == $location.host()) {
                mps = this.getStudioMPS().replace(/\//g, ":");
            } else {
                mps = GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
            }
            
            if(feature) {
                var tabList = [];
                /*for(var key in feature["features"]) {
                    tabList = feature["features"][key];
                    break;
                }*/
                for(var key in feature) {
						
					if(key == mps)
					{ 
                    tabList = feature[key];
                    break;
					}
                }
                if(tabList && tabList.split) {
                    tabList = tabList.split(',');
                    //trim white sapaces
                    for(var i = 0; i < tabList.length; i++) {
                        tabList[i] = gbTrim(tabList[i]);
                    }
                }else{
                    return {};
                }
                var  jsonObj = {};
                for(var i = 0; i < tabList.length; i++) {
                    jsonObj[tabList[i]] = true;
                }
                return jsonObj;
            }
        },
        //GET USER INFO
        getUserEmail : function() {
            return user.email;
        },
	    getUserType : function() {
            return user.is_external;
        },
        getUserFirstName : function() {
            return user.first_name;
        },
        getUserLastName : function() {
            return user.last_name;
        },
        getDashAdmin : function() {
            return user.dashboard_admin;
        },
        getUserName : function() {
            if((!user.first_name && !user.last_name) || (user.first_name == 'NA' && user.last_name == 'NA')){
                return user.email;
            }
            return (user.first_name != 'NA' ? (user.first_name + " ") : '') + (user.last_name != 'NA'? user.last_name : '');
        },
        getUserRole : function() {
            return user.role;
        },

        getUserEndCustomer: function () {
            return user.end_customer;
        },
        getUserOrgType : function() {
            return user.org_type;
        },
        getUserOrg : function() {
            return user.org;
        },
        getSsoUser : function() {
            return user.sso;
        },
        //UI Config
        setUiConfig : function(uiconfig){
            config = uiconfig;
        },
        getUiConfig : function(uiconfig){
            return config;
        },
        //GB Config
        setGbConfig : function(config){
            gbconfig = config;
        },
        getGbConfig : function(uiconfig){
            return gbconfig;
        },
        isSysid2Enable : function(){
            if(gbconfig['filter_columns'] && gbconfig['filter_columns'].length && gbconfig['filter_columns'].length > 0){
                if(gbconfig['filter_columns'].indexOf('sysid2') != -1){
                    return true;
                }
            }
            return false;
        },
        getStudioURL : function(){
            if(GlobalService.getVal('role_details')){
                var roleDetails = GlobalService.getVal('role_details');
                var studioUrl = roleDetails['mps_uidomain'][GlobalService.getVal('gb_studio_apps_realm')];
                return studioUrl;
            }else{
                return null;
            }
            
        },
        getStudioMPS : function(){
            return GlobalService.getVal('gbstudio_manufacturer')+"/"+GlobalService.getVal('gbstudio_product')+"/"+GlobalService.getVal('gbstudio_schema');
        },
        getStringToDate : function(str){
            return moment(str, 'YYYY-MM-DD HH:mm:ss').toDate();
        },
        getTodayDate : function(){
            return moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        },
        //firebase Config
        setFirebaseConfig : function(fobj){
            firebaseConfig = fobj;
        },
        getFirebaseConfig : function(){
            return firebaseConfig;
        }
    };
}]);
angular.module('gbApp.services').factory('AppService', ['$http', '$window', 'GlobalService', '$cookies', '$location', 'metaDataService', 'WorkbenchService',
    function ( $http, $window, GlobalService, $cookies, $location, metaDataService, WorkbenchService) {
        var info_srv_up = false, authorized = false, uploadData, requestFromApps = false;

        return {
            getRequestFromApps: function(){
                return requestFromApps;
            },
            setRequestFromApps: function(value){
                requestFromApps = value;
            },
            logOutUrl: function() {
                $window.location.href = (getCookie("loginurl") ? getCookie("loginurl") : GlobalService.getVal('session_redirect_url')).replace(/\?.*/, '');
            },
            isInfoServerUp: function () {
                return info_srv_up;
            },
            setInfoServerUp: function (bool) {
                info_srv_up = bool;
            },
            setAuthorized: function (bool) {
                authorized = bool;
            },
            setFileUploadData: function(data) {
                uploadData = data;
            },
            getFileUploadData: function() {
                return uploadData;
            },
            isAuthorized: function () {
                return authorized;
            },
            getUploadData: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/fileupload/jsonform/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                    {cache: true}
                );
            },
            logoutUser: function (protocol, domain, username, cust_id, cgi_sess_id) {
                // return $http.get(protocol + '://' + domain + '/gb/ui/prod/redirect_logout.cgi?username=' + username + '&cust_id=' + cust_id + '&CGISESSID=' + cgi_sess_id);
            },
            logoutInfoserver: function (application) {
                var umsDomain = GlobalService.getVal('umsDomain');
                delete $cookies.prevApplication;
                return $http.get(umsDomain + '/aa/logout?mps='+GlobalService.getVal('manufacturer')+':'+GlobalService.getVal('product')+':'+GlobalService.getVal('schema')+'&feature='+application);
            },
	    updateUserSuccessLogin: function (){
		var umsDomain = GlobalService.getVal('umsDomain');    
		return $http.post(umsDomain + '/aa/updateloginsuccess');
	    }, 
            logoutSessionTimeout: function () {
                localStorage.clear();
                this.logoutInfoserver()
                    .then(this.logOutUrl, this.logOutUrl);
            },
            hidePanelLoading: function () {                
                //Show page loader
                angular.element(document.getElementById("gb-tab-loader")).css('display', 'none');
                //hide page gb-apps-body
                angular.element(document.getElementById("gb-tab-cntr")).css('display', 'block');
            },
            getUserDomain: function (role) {
                var umsDomain = GlobalService.getVal('umsDomain');
                return $http.get(umsDomain + '/admin/role/domains/'+ (!!this.isGbStudioApp() ? GlobalService.getVal('gbstudio_manufacturer') : GlobalService.getVal('manufacturer')) + '/' + role);
            },
            getGBStudioProjects: function() {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + "/studio/user/projects");
            },
            setDefaultDomain: function (params) {
                var umsDomain = GlobalService.getVal('umsDomain');
                return $http.post(umsDomain + "/user/update/defaults/" + GlobalService.getVal('manufacturer') , params);
            },
            refreshMeta: function() {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + "/meta/refresh/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
            },
            getMPS : function(gbstudio){
                var mps = $cookies.mps;
                //For GB studion app
                if(this.isGbStudioApp()){
                    //read mps from query parameter and set it into cookies
                    mps = this.getMPSfromQueryParam();
                    return mps;
                }
                //for SSO case
                if(!mps || mps == 'null' || mps == 'Null'){
                    mps = this.getMPSfromQueryParam();
                }else{
                    mps = mps.replace(/:/g,'/');
                }
                return mps;
            },
            isGbStudioApp : function(){
                var gbStudioURL = metaDataService.getStudioURL();
                return(gbStudioURL == $location.host());
            },
            getMPSfromQueryParam: function(){                
                //check if url have mps as parameter; for SSO case
                var regex = new RegExp("(?:[?&]+mps=)([^&]*)?", "i");
                var match = regex.exec($window.location.href);
                var mps =  match === null ? match : match[1];        
                mps = unescape(mps);
                mps = mps.replace(/:/g,'/');                    
                //get domain name from url
                // var domain = $location.host().split(/\.(.+)?/)[1];
                // document.cookie = "mps="+mps.replace(/\//g, ":")+";domain="+domain+";path=/";  
                return mps;
            },

            isDemoUser : function(){
		var demo_realms = GlobalService.getVal('gb_demo_apps_realms');
		
		for(var i=0; i < demo_realms.length ;i++){
		  if(GlobalService.getVal('role_details').mps_uidomain[demo_realms[i]] == $location.host()){
			return true;
		   }
		}
		return false;
	    },	

            hideWorkbenchTab: function() {
            	if((metaDataService.getUser()['email'] == WorkbenchService.getTableauUser()) || (metaDataService.getUser()['org_type'] == GlobalService.getVal('gbUserOrgType')) || (metaDataService.getUser()['org_type'] == GlobalService.getVal('studioUserOrgType') && this.isGbStudioApp()) || (metaDataService.getUser()['org_type'] == GlobalService.getVal('wbUserOrgType')) && this.isDemoUser()) {
            		return false;
            	}
            	return true;
            },
            disableStartupModal: function() {
            	var umsDomain = GlobalService.getVal('umsDomain');
            	return $http.post(umsDomain + "/user/disable/info/" + GlobalService.getVal('manufacturer'));
            },
            
            addPushToken: function(payload) {
            	var umsDomain = GlobalService.getVal('umsDomain');
            	return $http.post(umsDomain + "/user_info/update/device_info", payload)
            },

            removePushToken: function(payload) {
            	var umsDomain = GlobalService.getVal('umsDomain');
            	return $http.post(umsDomain + "/user_info/delete/device_info", payload)
            },

            //get clinsight report url if present else ""
            getClinsightUrl: function(payload) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
            	return $http.get(infoserverDomain + "/dashboards/healthcheckreport/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'))
            },
        };
    }]);

angular.module('gbApp.services').factory('PasswordService', ['$http', 'GlobalService',
    function ($http, GlobalService) {
        return {
            change: function (new_passwd, email) {
                var umsDomain = GlobalService.getVal('umsDomain');
                return $http.post(umsDomain + "/user/change/passwd/" + GlobalService.getVal('manufacturer') , {
                    email: email,
                    token_id : "",
                    passwd: new_passwd
                });
            }
        };
    }]);

angular.module('gbApp.services').factory('UtilService',  [ 'ModalService',
    function (ModalService) {
        return {
            parseDate: function (datestr) {
                return new Date(datestr.replace(/-/g, "/").replace('T', ' ').substring(0, 19));
            },
            localPagination: function(){
                return {
                    currentPage : 1,
                    pageSize : 10,
                    totalPages : 1,
                    totalRecs : 0,
                    firstBtn : false,
                    prevBtn : false,
                    nextBtn :  false,
                    lastBtn :  false,
                    data : [],
                    currentRecordsSet : [],
                    startIndex:0,
                    endIndex:0,
                    msg : "",
                    next : function(){
                        this.firstBtn = true;
                        this.prevBtn = true;
                        this.currentPage++;
                        if(this.currentPage >= this.totalPages){
                            this.nextBtn =  false;
                            this.lastBtn =  false;
                            this.currentPage = this.totalPages;
                        }else{
                            if(this.endIndex > this.totalRecs){
                                this.endIndex = this.totalRecs;
                                this.nextBtn =  false;
                                this.lastBtn =  false;
                            }else{
                                this.nextBtn =  true;
                                this.lastBtn =  true;
                            }
                        }
                        this.startIndex = (this.currentPage - 1)*this.pageSize;
                        this.endIndex = this.currentPage * this.pageSize;
                        if(this.endIndex > this.totalRecs){
                            this.endIndex = this.totalRecs;
                            this.nextBtn =  false;
                            this.lastBtn =  false;
                        }
                        this.process(true);
                    },
                    prev : function(){
                        this.nextBtn = true;
                        this.lastBtn = true;
                        this.currentPage--;
                        if(this.currentPage <= 1){
                        this.currentPage = 1;
                        this.firstBtn = false;
                        this.prevBtn = false;
                        this.startIndex = 0;
                        this.endIndex = this.pageSize;
                        }else{
                        this.firstBtn = true;
                        this.prevBtn = true;
                        }
                        this.startIndex = (this.currentPage - 1)*this.pageSize;
                        this.endIndex = this.currentPage * this.pageSize;
                        this.process(true);
                    },
                    first : function(){
                        this.firstBtn = false;
                        this.prevBtn = false;
                        this.nextBtn =  true;
                        this.lastBtn =  true;
                        this.currentPage = 1;
                        this.startIndex = 0;
                        this.endIndex = this.pageSize;
                        this.process(true);
                    },
                    last : function(){
                        this.firstBtn = true;
                        this.prevBtn = true;
                        this.nextBtn =  false;
                        this.lastBtn =  false;
                        this.currentPage = this.totalPages;
                        this.startIndex = (this.currentPage - 1)*this.pageSize;
                        this.endIndex = this.totalRecs;
                        this.process(true);
                    },
                    init : function(data){
                        this.data = data;
                        this.firstBtn = false;
                        this.prevBtn = false;
                        this.nextBtn =  false;
                        this.lastBtn =  false;
                        this.currentPage = 1;
                        this.totalRecs = this.data.length;
                        this.currentRecordsSet = [];
                        if(this.totalRecs && this.totalRecs > this.pageSize){
                        this.totalPages = Math.ceil(this.totalRecs/this.pageSize);
                        this.startIndex = 0;
                        this.endIndex = this.pageSize;
                        this.nextBtn =  true;
                        this.lastBtn =  true;
                        this.msg = "1-"+this.pageSize+" of "+ this.totalRecs;
                        }else{
                        this.msg = "1-"+this.totalRecs+" of "+ this.totalRecs;
                        this.startIndex = 0;
                        this.endIndex = this.totalRecs;
                        }
                        this.process(false);
                    },
                    process : function(msg){
                        this.currentRecordsSet = angular.copy(this.data.slice(this.startIndex, this.endIndex));
                        if(msg === true){
                        this.msg = (this.startIndex+1) + " - "+this.endIndex+" of "+ this.totalRecs;
                        }
                    }
                }
            },
            downloadCSV : function (csv, filename) {
                var csvFile, downloadLink;
                // CSV file
                csvFile = new Blob([csv], {type: "text/csv"});
                // Download link
                downloadLink = document.createElement("a");
                // File name
                downloadLink.download = filename;
                // Create a link to the file
                downloadLink.href = window.URL.createObjectURL(csvFile);
                // Hide download link
                downloadLink.style.display = "none";
                // Add the link to DOM
                document.body.appendChild(downloadLink);
                // Click download link
                downloadLink.click();
            },
            compareFirstWithSecondList: function (list1, list2) {
                var found = false;
                var result = [];
                for(var i=0;i<list2.length;i++){
                    found = false;
                    for(var j=0;j<list1.length;j++){
                        if(list2[i].split(".")[0] == list1[j].split(".")[0]){
                            found = true;
                            break;
                        }
                    }
                    if(!found){
                        result.push(list2[i].split(".")[0]);
                    }
                }
                return result;
            },
            showModal: function(msg) {
                var modalInstance = ModalService.alertBox({
                    msg : msg
                });
            }
        };
    }]);

angular.module('gbApp.services').factory('ErrorService', [
    function () {
        var errors = {};
        errors['gbApp'] = [];
        return {
            setError: function (appName, errmsg) {
                if (!!!errors[appName]) {
                    errors[appName] = [];
                }
                if (errors[appName].indexOf(errmsg) == -1) {
                    errors[appName].push(errmsg);
                }
            },
            getErrors: function (appName) {
                if (errors['gbApp'].length > 0) {
                    return errors['gbApp'];
                }
                if (errors[appName]) {
                    return errors[appName];
                }
                return [];
            },
            getFeatureErrors: function (appName) {
                if (errors[appName]) {
                    return errors[appName];
                }
                return [];
            },
            clearErrors: function (appName) {
                if (errors[appName]) {
                    errors[appName].length = 0;
                }
            }
        };
    }]);

angular.module('gbApp.services').factory('InstanceHandler', ['UserTrackingService', 'ExplorerService', 'SectionsMetaService', '$filter', '$location', 'GlobalService', 'ModalService', 'WorkbenchService', 'ConfigDiffService', 'DefaultFilterService', '$sce', 'metaDataService', '$timeout', 'AppService', '$modal',
    function (UserTrackingService, ExplorerService, SectionsMetaService, $filter, $location, GlobalService, ModalService, WorkbenchService, ConfigDiffService, DefaultFilterService, $sce, metaDataService, $timeout, AppService, $modal) {
        var openInstances = [], rCount = 0;
        var viewerVisible = false;

        var eventBuckets = function(){
            var bucket = [];
            var size = GlobalService.getVal('eventViewerBucketSize');
            var pageSize = 0;
            var lastRecord = null;
            var position = null;
            var addTop = function(records){
                lastRecord = bucket[0];
                bucket = records.concat(bucket);
                position = 'top';
            };
            var addButtom = function(records){
                lastRecord = bucket[(bucket.length - 1)];
                bucket = bucket.concat(records); 
                position = 'bottom'; 
            };                        
            var trimFromTop = function(){
                if(bucket.length > 0){
                    var sizeToTrim = bucket.length - size;
                    bucket.splice(0, sizeToTrim);
                }
            };
            var trimFromButtom = function(){
                if(bucket.length > 0){
                    var sizeToTrim = bucket.length - size;
                    var stIndex = bucket.length - sizeToTrim;
                    bucket.splice(stIndex, bucket.length);
                }
            };
            var clear = function(){
                if(bucket.length > 0){
                    bucket.splice(0, bucket.length);
                }
            };
            var setPageSize = function(){
            };
            return {
                clear: function(){
                    clear();
                },
                lastRecord: function(){
                    return lastRecord;
                },
                getPosition: function(){
                    return position;
                },
                first: function(){
                    return bucket[0];
                },
                last: function(){
                    return bucket[bucket.length -1];
                },
                get: function (){
                    return bucket;             
                },
                add: function (records, offset, direction){
                    if(offset){
                        pageSize = offset;
                    }
                    if(direction == 'up'){
                        addTop(records);
                    }else if(direction == 'down'){
                        addButtom(records);
                    }else if(direction == 'default'){
                        clear();
                        bucket = records;
                    }else{
                        clear();
                        bucket = records;
                    }
                    if(bucket.length > size){
                        if(direction == 'up'){
                            trimFromButtom(records);
                        }else if(direction == 'down'){
                            trimFromTop(records);
                        }else if(direction == 'default'){
                            bucket = records;
                        }
                    }
                }
            };
        }
        return {
            defaultTab: 'section',
            isVisible: function () {
                return viewerVisible;
            },
            setVisible: function (bool) {
                viewerVisible = bool;
            },
            setRefreshCount: function (val) {
                rCount = val;
            },
            getRefreshCount: function () {
                return rCount;
            },
            setDefaultTab: function (tab) {
                this.defaultTab = tab;
            },
            showDisabledMsgViewChangesTab: function(){
                ModalService.alertBox({msgKey: 'instance_view_changes_disabled_msg'});
            },
            getDefaultTab: function () {
                return this.defaultTab;
            },
            addInstance: function (instance, scope, owner) {
                var c_instance, instanceConfig;
                var instanceHandler = this;
                instance.md5 = CryptoJS.MD5(angular.toJson(instance)).toString();
                c_instance = this.getInstanceByMD5(instance.md5);
                if (instance.defaultTab) {
                    this.setDefaultTab(instance.defaultTab);
                } else {
                    this.setDefaultTab('section');
                }
                //if sysId2 is there the set it to defaultservices
                if (instance.data.sysId2) {
                    DefaultFilterService.setSysId2(instance.data.sysId2);
                }

                if (!c_instance) {
                    if (openInstances.length >= GlobalService.getVal('instance_limit')) {
                        ModalService.alertBox({ msgKey: 'instance_limit_msg' });
                    } else {
                        if (GlobalService.getVal('intanceviewer_iframe_apps').indexOf(instance.type) != -1) {
                            instance.loading = true;
                            openInstances.push(instance);
                            this.showInstance(instance);
                            var domain = GlobalService.getVal('primaryDomain');
                            var userInfo = metaDataService.getUser();
                            if ((metaDataService.getUser()['email'] == WorkbenchService.getTableauUser()) || (metaDataService.getUser()['org_type'] == GlobalService.getVal('gbUserOrgType')) || (metaDataService.getUser()['org_type'] == GlobalService.getVal('studioUserOrgType') && this.isGbStudioApp()) || (metaDataService.getUser()['org_type'] == GlobalService.getVal('wbUserOrgType'))) {
                                document.cookie = 'show_tableau_save_options=' + 1 + ";domain=." + domain + ";path=/";
                            }
                            else {
                                document.cookie = 'show_tableau_save_options=' + 0 + ";domain=." + domain + ";path=/";
                            }
                            /* if(userInfo['email'] !== WorkbenchService.getTableauUser() && userInfo['role'] !== 'glassbeam') {
                                document.cookie = 'show_tableau_save_options=' + 0 + ";domain=." + domain + ";path=/";
                            } else {
                                document.cookie = 'show_tableau_save_options=' + 1 + ";domain=." + domain + ";path=/";
                            } */
                        } else {
                            instanceConfig = {
                                'type': instance.type,
                                'instanceHandler': instanceHandler,
                                'isGbStudio': AppService.isGbStudioApp(),
                                'showEventsAcrossSources': true,
                                'name': instance.title,
                                'id': instance.md5,
                                'md5': instance.md5,
                                'app': instance.app,
                                'module': instance.module,
                                'selectAllSections': false,
                                'filterBatchPageSize': GlobalService.getVal('instance_filter_section_page_size'),
                                'filterBatchCurrentPageNo': 1,
                                'filterBatchTotalCount': 0,
                                'MAXED_OUT': false,
                                'Max_Limit': 0,
                                'Max_Totalrecords': 0,
                                'eventSourcesDuplicate': [],
                                'loadingState': {
                                    section: false,
                                    event: false,
                                    diff: false
                                },
                                'timefilter': {
                                    'currentValue': '1 minute',
                                    'totalRecords': 0,
                                    'startIndex': 0,
                                    'endIndex': 0,
                                    'scrolldirection': 'default',
                                    'baseIndex': 0,
                                    'offset': 0,
                                    'applied': false,
                                    'quickFilters': [
                                        '1 minute',
                                        '5 minutes',
                                        '15 minutes',
                                        '30 minutes',
                                        '1 hour',
                                        '4 hours',
                                        '8 hours',
                                        'Custom time'
                                    ],
                                    'customFilter': {
                                        'fromDate': {
                                            'gDate': new Date(),
                                            'hr': 00,
                                            'min': 00,
                                            'sec': 00
                                        },
                                        'toDate': {
                                            'gDate': new Date(),
                                            'hr': 00,
                                            'min': 00,
                                            'sec': 00
                                        }
                                    }
                                },
                                'event30Buckets': new eventBuckets(),
                                'event60Buckets': new eventBuckets(),
                                'data': {
                                    'loading': true,
                                    'sessionTimedOut': false,
                                    'sysId': instance.data.sysId,
                                    'bundle': instance.data.bundle,
                                    'file': instance.data.file,
                                    'instanceDisplay': instance.data.instanceDisplay,
                                    'eventSource': instance.data.eventSource,
                                    'fileDiffAttr': instance.data.fileDiffAttr,
                                    'content': [],
                                    'isContentLoading': {
                                        'loading1': true
                                    },
                                    'content30': [],
                                    'content60': [],
                                    'observation': instance.data.observation,
                                    'observationStr': instance.data.observationStr,
                                    "facetStr": instance.data.facetStr,
                                    "result": instance.data.result,
                                    'sections': {}, //section tree
                                    'bundleList': {
                                        'bundles': [],
                                        'filter': "",
                                        'isLoading': true
                                    },
                                    'sectionsData': [],
                                    'diffSections': [],
                                    'noDiffSections': [],
                                    'observationList': [],
                                    'selectedSections': [],
                                    'sectionFilterList': {},
                                    "sectionFilterValue": "",
                                    'sectionDiffMsg': "",
                                    'sectionDiffError': false,
                                    'sectionDiffUrl': "",
                                    'sectionLogUrl': "",
                                    'currentObs': ""
                                },
                                'isEventExpanded' : false,
                                'severityFilter': instance.data.severityFilter,
                                'severityFilterApplied': false,
                                'filterLoader': false,
                                'severityPayload': "" ,
                                'expandAll':false,
                                handleSessionTimeout: function (response) {
                                    if (!instanceConfig.data.sessionTimedOut && response && response.hasOwnProperty('Msg') && response.Msg.match(/timeout/)) {
                                        instanceConfig.data.sessionTimedOut = true;
                                        instanceHandler.setVisible(false);
                                        ModalService.sessionTimeout();
                                    }
                                },
                                logSectionData: function (sections) {
                                    var activity = "Section Viewer";
                                    var details = {
                                        "Serial Number": instanceConfig.data.sysId,
                                        "Bundle": instanceConfig.data.bundle,
                                        "File": instanceConfig.data.file,
                                        "Observation": instanceConfig.data.observationStr,
                                        "Sections Selected": sections
                                    };
                                    if (!!sections.length) {
                                        UserTrackingService.standard_user_tracking(instanceConfig.app, instanceConfig.module, activity, JSON.stringify(details)).then(function (response) {
                                        }, instanceConfig.handleSessionTimeout);
                                    }
                                },
                                getAllSectionsListForAFile: function (data) {
                                    var result = data.result;
                                    var params = {};
                                    params['ts'] = result.obs_date;
                                    params['bundle'] = data.bundle;
                                    params['ns'] = result.namespace;
                                    instanceConfig.data.loading = true;
                                    ExplorerService.getSectionsContent(params).then(function (response) {
                                        var sectionData = response.data.Data;
                                        instanceConfig.data.loading = false;
                                        if (sectionData) {
                                            instanceConfig.data.sectionsData = sectionData;
                                        }
                                        if (instanceConfig.data.sectionsData && instanceConfig.data.sectionsData.length && instanceConfig.data.sectionsData.length == 0) {
                                            instanceConfig.data.sectionsData = [];
                                        }
                                        //if its a gbStdio app don't call bundle api or load diff
                                        if (!instanceConfig.isGbStudio) {
                                            //get file diff
                                            instanceConfig.logSectionData(result.namespace);
                                            instanceConfig.data.result.currentNS = params['ns'];
                                            if (instanceConfig.data.observationList.length == 0) {
                                                instanceConfig.getObservations(result);
                                            } else {
                                                instanceConfig.getFileDiffSection(result);
                                            }
                                        }
                                    }, function (response) {
                                        console.log("Error:" + response);
                                        instanceConfig.handleSessionTimeout(response);
                                    });
                                },
                                sectionLoading: function () {
                                    var cntr, child;
                                    if (instanceConfig.data.loading) {
                                        return true;
                                    } else {
                                        cntr = document.getElementById(this.md5 + '-section-container');
                                        child = document.getElementById(this.id + this.md5 + '-section-content');
                                        if (child) {
                                            cntr.scrollTop = child.offsetTop;
                                        }
                                        return false;
                                    }
                                },
                                getObservations: function (result) {
                                    instanceConfig.data.loading = true;
                                    var sysid1 = result.sysid1 ? result.sysid1 : result.sysid;
                                    var sysid2 = result.sysid2 ? result.sysid2 : '';
                                    ExplorerService.getAllBundles(sysid1, sysid2).then(function (response) {
                                        instanceConfig.data.loading = false;
                                        var observationList = response.data.Data;
                                        instanceConfig.data.observationList = [];
                                        if (observationList && observationList.length && observationList.length > 0) {
                                            angular.forEach(observationList, function (obs) {
                                                if ($filter('utcDate')(obs.obs_ts) < $filter('utcDate')(instanceConfig.data.observation)) {
                                                    instanceConfig.data.observationList.push(obs);
                                                }
                                            });
                                            if (instanceConfig.data.observationList.length && instanceConfig.data.observationList.length > 0) {
                                                instanceConfig.data.currentObs = instanceConfig.data.observationList[0];
                                            }
                                        }
                                        instanceConfig.getFileDiffSection(result);
                                    }, function (response) {
                                        console.log("Error:" + response);
                                        instanceConfig.handleSessionTimeout(response);
                                    });
                                },
                                getFileDiffSection: function (result) {
                                    var infoserverDomain = GlobalService.getVal('infoserverDomain');
                                    if (!(instanceConfig.data.observationList && instanceConfig.data.observationList.length > 0)) {
                                        instanceConfig.data.sectionDiffError = true;
                                        instanceConfig.data.loading = false;
                                        instanceConfig.data.sectionDiffMsg = GlobalService.getVal("section_ErrorMsg1");
                                        instanceConfig.data.loading = false;
                                        return;
                                    }
                                    var srcts = instanceConfig.data.currentObs.obs_ts;
                                    var tgtts = result.obs_date;
                                    var params = {
                                        srcbundle: $filter('bundleName')(instanceConfig.data.currentObs.bundle_name),
                                        tgtbundle: instanceConfig.data.bundle,
                                        ns: []
                                    };
                                    var sectionNameMap = {};
                                    if (instanceConfig.data.selectedSections.length == 0) {
                                        params.ns.push(result.namespace);
                                    } else {
                                        angular.forEach(instanceConfig.data.selectedSections, function (section) {
                                            params.ns.push(instanceConfig.data.sections[parseInt(section)].name);
                                            sectionNameMap[instanceConfig.data.sections[parseInt(section)].name] = instanceConfig.data.sections[parseInt(section)].label;
                                        });
                                    }

                                    instanceConfig.data.loading = true;
                                    instanceConfig.data.diffSections = [];
                                    instanceConfig.data.noDiffSections = [];
                                    instanceConfig.data.sectionDiffError = false;
                                    instanceConfig.loadingState.diff = true;
                                    ExplorerService.getFileDiffSection(srcts, tgtts, params).then(function (response) {
                                        instanceConfig.data.loading = false;
                                        instanceConfig.loadingState.diff = false;
                                        var responseData = response.data.Data;
                                        if (responseData.hasOwnProperty('gb_error')) {
                                            instanceConfig.data.sectionDiffError = true;
                                            switch (responseData.gb_error) {
                                                case 'ERR_9':
                                                    instanceConfig.data.sectionDiffMsg = GlobalService.getVal("section_ErrorMsg6");
                                                    break;
                                            }
                                        } else {
                                            angular.forEach(responseData, function (value, key) {
                                                var section = {};
                                                section.name = sectionNameMap[key];
                                                var noDiff = false;
                                                switch (value) {
                                                    case 'MSG_1':
                                                        section.error = true;
                                                        instanceConfig.data.noDiffSections.push(section);
                                                        section.errorMsg = GlobalService.getVal("section_ErrorMsg2");
                                                        noDiff = true;
                                                        break;
                                                    case 'MSG_2':
                                                        section.error = true;
                                                        section.errorMsg = GlobalService.getVal("section_ErrorMsg3");
                                                        break;
                                                    case 'MSG_3':
                                                        section.error = true;
                                                        section.errorMsg = GlobalService.getVal("section_ErrorMsg4");
                                                        break;
                                                    case 'MSG_7':
                                                        section.error = true;
                                                        section.errorMsg = GlobalService.getVal("section_ErrorMsg5");
                                                        break;
                                                    case 'ERR_1':
                                                        section.error = true;
                                                        section.errorMsg = GlobalService.getVal("section_ErrorMsg6");
                                                        break;
                                                    case 'ERR_0':
                                                        section.error = true;
                                                        section.errorMsg = GlobalService.getVal("section_ErrorMsg7");
                                                        break;
                                                    case 'ERR_7':
                                                        section.error = true;
                                                        section.errorMsg = GlobalService.getVal("section_ErrorMsg8");
                                                        break;
                                                    default:
                                                        section.error = false;
                                                        section.URL = $sce.trustAsResourceUrl(infoserverDomain + '/explorer/sectiondiff/view/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + value);
                                                }
                                                if (!noDiff) {
                                                    instanceConfig.data.diffSections.push(section);
                                                }
                                            });
                                        }
                                        var activity = "Section Viewer Changes";
                                        var details = {
                                            "Serial Number": instanceConfig.data.sysId,
                                            "Bundle": instanceConfig.data.bundle,
                                            "File": instanceConfig.data.file,
                                            "Observation": $filter('utcDate')(srcts) + " -- " + $filter('utcDate')(tgtts),
                                            "Sections Selected": params.ns
                                        };
                                        UserTrackingService.standard_user_tracking(instanceConfig.app, instanceConfig.module, activity, JSON.stringify(details)).then(function (response) {
                                        }, instanceConfig.handleSessionTimeout);

                                    }, function (response) {
                                        instanceConfig.data.diffSections = [];
                                        instanceConfig.data.noDiffSections = [];
                                        instanceConfig.data.loading = false;
                                        instanceConfig.data.sectionDiffError = true;
                                        instanceConfig.data.sectionDiffMsg = GlobalService.getVal("section_ErrorMsg6");
                                        console.log("Error:" + response);
                                        instanceConfig.handleSessionTimeout(response);
                                    });
                                },
                                getMyConfig: function () {
                                    return instanceConfig;
                                },
                                isContentLoading: function () {
                                    var me = this, cntrId, dataPositon = 'top', targetRec = null, currLine = null, recId = null, cntr = null;
                                    if (!me.data.isContentLoading.loading1) {
                                        cntrId = me.id + "-main-container";
                                        cntr = document.getElementById(cntrId);

                                        if (instanceConfig.timefilter.scrolldirection == 'default') {
                                            if (instanceConfig.showEventsAcrossSources) {
                                                currLine = document.getElementById("test-with-source");
                                            } else {
                                                currLine = document.getElementById(me.id + "-with-out-source");
                                            }
                                            dataPositon = null;
                                        } else {
                                            if (instanceConfig.showEventsAcrossSources) {
                                                targetRec = instanceConfig.event60Buckets.lastRecord();
                                                dataPositon = instanceConfig.event60Buckets.getPosition();
                                            } else {
                                                targetRec = instanceConfig.event30Buckets.lastRecord();
                                                dataPositon = instanceConfig.event60Buckets.getPosition();
                                            }
                                            if (targetRec) {
                                                recId = targetRec['scrollId'];
                                                currLine = document.getElementById(recId);
                                            } else {
                                                currLine = null;
                                            }
                                        }
                                        if (cntr && (currLine != null) && !me.loadingState.event) {
                                            if (cntr.scrollTop != currLine.offsetTop) {
                                                $timeout(function () {
                                                    me.loadingState.event = true;
                                                    if (dataPositon == 'top') {
                                                        if ((currLine.offsetTop - 20)) {
                                                            cntr.scrollTop = currLine.offsetTop - 20;
                                                        } else {
                                                            cntr.scrollTop = currLine.offsetTop;
                                                        }
                                                    } else if (dataPositon == 'bottom') {
                                                        var cntrHeight = $('#' + cntrId).height();
                                                        if ((currLine.offsetTop - (cntrHeight - 50))) {
                                                            cntr.scrollTop = currLine.offsetTop - (cntrHeight - 50);
                                                        } else {
                                                            cntr.scrollTop = currLine.offsetTop;
                                                        }
                                                    } else {
                                                        cntr.scrollTop = currLine.offsetParent.offsetTop
                                                        // cntr.scrollTop = currLine.offsetTop;
                                                    }

                                                }, 1000, me);
                                            }
                                        }
                                        if (instanceConfig.timefilter.sourceFilter) {
                                            return true;
                                        }
                                        return false;
                                    }//
                                    return true;
                                },
                                getAllSection: function (data) {
                                    instanceConfig.data.sectionsLoading = true;
                                    ExplorerService.getSectionViewerSections()
                                        .then(function (response) {
                                            var sections = $filter('filter')(response.data.Data, { namespace_type: '!EVENT' });
                                            sections = $filter('filter')(sections, { namespace_type: '!UNPARSED' });
                                            sections = $filter('orderBy')(sections, "label");
                                            instanceConfig.data.sections = sections;
                                            instanceConfig.data.sectionsLoading = false;
                                        }, function (response) {
                                            console.log("Error:" + response);
                                            instanceConfig.handleSessionTimeout(response);
                                        });
                                },
                                selectedSectionsChange: function (section, key) {
                                    if (typeof section === 'string' && section.toLowerCase() == 'all') {
                                        var sections = this.getAllSectionOnUI(this.data.sections, this.data.sectionFilterValue);
                                        if (this.selectAllSections) {
                                            //select all sections
                                            this.selectedAllSections(sections);
                                            var selectedSections = instanceConfig.data.sectionFilterList;
                                            this.filterBatchTotalCount = Object.keys(selectedSections).length;
                                            this.applyFilter('all');

                                        } else {
                                            //unselect all sections
                                            this.unselectedAllSections(sections);
                                            var selectedSections = instanceConfig.data.sectionFilterList;
                                            this.filterBatchTotalCount = Object.keys(selectedSections).length;
                                            this.clearFilter(this.data.section);
                                        }
                                        return;
                                    }
                                    //unselect all option
                                    this.selectAllSections = false;

                                    if (!!section.selected) {
                                        instanceConfig.data.sectionFilterList[key] = section.label;
                                    } else {
                                        if (instanceConfig.data.sectionFilterList[key]) {
                                            delete instanceConfig.data.sectionFilterList[key];
                                        }
                                    }

                                    var selectedSections = instanceConfig.data.sectionFilterList;
                                    this.filterBatchTotalCount = Object.keys(selectedSections).length;
                                },
                                //get all section with filtered by sectionFilterValue
                                getAllSectionOnUI: function (sections, key) {
                                    var i, result = {};
                                    if (key && key.length) {
                                        for (i in sections)
                                            if (sections.hasOwnProperty(i) && i != 'label') {
                                                if (sections[i].label.toUpperCase().indexOf(key.toUpperCase()) != -1) {
                                                    result[i] = sections[i];
                                                }
                                            }
                                        return result;
                                    } else {
                                        return sections;
                                    }
                                },
                                selectedAllSections: function (sections) {
                                    var section = "", subsection = "";
                                    for (var sectionkey in sections) {
                                        if (sections.hasOwnProperty(sectionkey)) {
                                            section = sections[sectionkey];
                                            section.selected = true;
                                            this.data.sectionFilterList[sectionkey] = section.label;
                                        }
                                        for (var subsectionkey in section) {
                                            if (sections.hasOwnProperty(subsectionkey)) {
                                                subsection = sections[subsectionkey];
                                                subsection.selected = true;
                                                this.data.sectionFilterList[subsectionkey] = subsection.label;
                                            }

                                        }
                                    }
                                },
                                unselectedAllSections: function (sections) {
                                    var section = "", subsection = "";
                                    for (var sectionkey in sections) {
                                        if (sections.hasOwnProperty(sectionkey)) {
                                            section = sections[sectionkey];
                                            section.selected = false;
                                            if (this.data.sectionFilterList[sectionkey]) {
                                                delete this.data.sectionFilterList[sectionkey];
                                            }
                                        }
                                        for (var subsectionkey in section) {
                                            if (sections.hasOwnProperty(subsectionkey)) {
                                                subsection = sections[subsectionkey];
                                                subsection.selected = false;
                                                if (this.data.sectionFilterList[subsectionkey]) {
                                                    delete this.data.sectionFilterList[subsectionkey];
                                                }
                                            }

                                        }
                                    }
                                },
                                getNumberofSelectedSection: function () {
                                    return Object.keys(instanceConfig.data.sectionFilterList).length;
                                },
                                unselectSection: function (sectionLabel, allsections, selKey) {
                                    for (var section in allsections) {
                                        if ((allsections.hasOwnProperty(section)) && (allsections[section].label == sectionLabel)) {
                                            allsections[section].selected = false;
                                        }
                                        for (var subsection in allsections[section]) {
                                            if (allsections[section][subsection] && allsections[section][subsection].ns_label == sectionLabel) {
                                                allsections[section][subsection].selected = false;
                                            }
                                        }
                                    }
                                    delete instanceConfig.data.sectionFilterList[selKey];
                                },
                                applyFilter: function (tab) {
                                    //get selected section
                                    var selectedSections = instanceConfig.data.sectionFilterList;
                                    instanceConfig.data.selectedSections = [];
                                    for (var key in selectedSections) {
                                        instanceConfig.data.selectedSections.push(key);
                                    }
                                    var selectedSectionsNo = Object.keys(selectedSections).length;
                                    if (selectedSectionsNo == 0) {
                                        return;
                                    }
                                    var startDate = instance.data.start_time;
                                    var endDate = instance.data.end_time;
                                    var params = {};
                                    params['ts'] = instanceConfig.data.result.obs_date;
                                    params['bundle'] = instanceConfig.data.bundle;
                                    params['ns'] = [];
                                    //get namespace for selected sections
                                    instanceConfig.filterBatchCurrentPageNo = 1;
                                    //clear section data and config diff data for UI
                                    instanceConfig.data.sectionsData = [];
                                    params['ns'] = instanceConfig.getNamespaceOfSelectedSection(selectedSections);
                                    /* for (var key in selectedSections) {
                                         var section = instanceConfig.data.sections[parseInt(key)];
                                         params['ns'].push(section.name);
                                     }*/
                                    if (!tab) {
                                        return;
                                    }
                                    if (tab == 'section') {
                                        instanceConfig.data.loading = true;
                                        instanceConfig.apiGetSectionsConten(params);
                                    }
                                    else if (tab == 'changes') {
                                        if (selectedSectionsNo <= GlobalService.getVal('instance_selected_sections_limit')) {
                                            instanceConfig.data.loading = true;
                                            instanceConfig.getFileDiffSection(instance.data.result);
                                        } else {
                                            ModalService.alertBox({ msgKey: 'instance_view_max_section' });
                                        }
                                    } else {
                                        instanceConfig.data.loading = true;
                                        instanceConfig.apiGetSectionsConten(params);
                                    }
                                },
                                apiGetSectionsConten: function (params) {
                                    instanceConfig.loadingState.section = true;
                                    ExplorerService.getSectionsContent(params).then(function (response) {
                                        var sectionData = response.data.Data;
                                        instanceConfig.data.loading = false;
                                        instanceConfig.loadingState.section = false;
                                        if (sectionData) {
                                            instanceConfig.data.sectionsData = instanceConfig.data.sectionsData.concat(sectionData);
                                        }
                                        if (instanceConfig.data.sectionsData && instanceConfig.data.sectionsData.length && instanceConfig.data.sectionsData.length == 0) {
                                            instanceConfig.data.sectionsData = [];
                                        }
                                        instanceConfig.logSectionData(params['ns']);
                                        instanceConfig.data.result.currentNS = params['ns'];
                                        angular.element('#' + instanceConfig.md5 + '-section-container').scrollTop(50000);
                                    }, function (response) {
                                        console.log("Error:" + response);
                                        instanceConfig.handleSessionTimeout(response);
                                        instanceConfig.loadingState.section = false;
                                    });
                                },
                                getNamespaceOfSelectedSection: function (selectedSections) {
                                    var params = [], count, start = 0, end, totalPages = 0, me = instanceConfig;
                                    count = 0;
                                    totalPages = Math.ceil(me.filterBatchTotalCount / me.filterBatchPageSize);
                                    if (totalPages == 0) {
                                        return [];
                                    }
                                    if (me.filterBatchCurrentPageNo == 1) {
                                        start = 0;
                                        end = me.filterBatchPageSize;
                                    } else {
                                        start = (me.filterBatchCurrentPageNo - 1) * me.filterBatchPageSize;

                                        if (me.filterBatchCurrentPageNo > totalPages) {
                                            end = me.filterBatchTotalCount;
                                        } else {
                                            end = me.filterBatchCurrentPageNo * me.filterBatchPageSize;
                                            if (end > me.filterBatchTotalCount) {
                                                end = me.filterBatchTotalCount;
                                            }
                                        }
                                    }
                                    for (var key in selectedSections) {
                                        count++;
                                        if (count > start) {
                                            var section = instanceConfig.data.sections[parseInt(key)];
                                            params.push(section.name);
                                        }
                                        if (count >= end) {
                                            break;
                                        }
                                    }
                                    return params;
                                },
                                scrollInfinite: function (scrollElm) {
                                    var elemId = instanceConfig.md5 + '-section-container';
                                    var scrollElm = angular.element(document.getElementById(elemId));
                                    if (scrollElm[0] && scrollElm[0].scrollHeight) {
                                        var maxScrollHeight = scrollElm[0].scrollHeight - 1100;
                                    } else {
                                        return;
                                    }

                                    if (scrollElm.scrollTop() < maxScrollHeight) {
                                        return;
                                    }
                                    //don't call API if it is loading data for the previouse request
                                    if (instanceConfig.loadingState.section) {
                                        return;
                                    }
                                    //get selected section
                                    var selectedSections = instanceConfig.data.sectionFilterList;
                                    instanceConfig.data.selectedSections = [];
                                    for (var key in selectedSections) {
                                        instanceConfig.data.selectedSections.push(key);
                                    }
                                    if (Object.keys(selectedSections).length == 0) {
                                        return;
                                    }

                                    instanceConfig.filterBatchCurrentPageNo++;
                                    //instanceConfig.data.loading = true;
                                    var startDate = instance.data.start_time;
                                    var endDate = instance.data.end_time;
                                    var params = {};
                                    params['ts'] = instanceConfig.data.result.obs_date;
                                    params['bundle'] = instanceConfig.data.bundle;
                                    params['ns'] = [];
                                    //get namespace for selected sections
                                    params['ns'] = instanceConfig.getNamespaceOfSelectedSection(selectedSections);
                                    //Don't call API for data id namespace list is empty
                                    if (Array.isArray(params['ns']) && params['ns'].length == 0) {
                                        return;
                                    }
                                    instanceConfig.apiGetSectionsConten(params);
                                    //instanceConfig.getFileDiffSection(instance.data.result);
                                },
                                resetObservation: function (sections) {
                                    instanceConfig.clearFilter(sections);
                                },
                                clearFilter: function (allsections) {
                                    //clear filter objext lst
                                    instanceConfig.data.loading = true;
                                    instanceConfig.data.sectionFilterList = {};
                                    instanceConfig.data.selectedSections = [];
                                    instanceConfig.data.diffSections = [];
                                    instanceConfig.data.noDiffSections = [];
                                    instanceConfig.data.sectionsData = [];
                                    instanceConfig.selectAllSections = false;
                                    for (var section in allsections) {
                                        allsections[section]['selected'] = false;
                                        for (var subsection in allsections[section]) {
                                            try {
                                                allsections[section][subsection]['selected'] = false;
                                            } catch (e) {
                                                allsections[section]['selected'] = false;
                                            }
                                        }
                                    }
                                    if (instanceConfig.data.result.namespace == "random.namespace.by.apps") {
                                        instanceHandler.setDefaultTab("section");
                                    }
                                    this.getAllSectionsListForAFile(instanceConfig.data);
                                    //this.getFileDiffSection(instanceConfig.data.result);
                                },
                                changeObservation: function () {
                                    instanceConfig.getFileDiffSection(instance.data.result);
                                },
                                getEventSources: function () {
                                    instanceConfig.eventSourcesAll = true;
                                    instanceConfig.eventSourcesFilter = "";
                                    /*SectionsMetaService.getSectionsFilteredByByndleType(instanceConfig.data.result.bundle_type)
                                    .then(function (response) {
                                        var eventsections = $filter('filter')(response.data.Data, {namespace_type: 'EVENT'});
                                        var sessionsections = $filter('filter')(response.data.Data, {namespace_type: 'SESSION'});
                                        if(!eventsections) eventsections = [];
                                        if(!sessionsections) sessionsections = [];
                                        var sections = eventsections.concat(sessionsections);
                                        sections = $filter('orderBy')(sections, "label");
                                        angular.forEach(sections, function(item){
                                            item.checked = true;
                                        });
                                        instanceConfig.eventSources = sections;
                                        instanceConfig.eventSourcesDuplicate = angular.copy(instanceConfig.eventSources);
                                    });*/

                                    ExplorerService.getEventSources().then(function (response) {
                                        var responseData = response.data.Data;
                                        angular.forEach(responseData, function (item) {
                                            item.checked = true;
                                        });
                                        instanceConfig.eventSources = responseData;
                                        instanceConfig.eventSourcesDuplicate = angular.copy(instanceConfig.eventSources);
                                    });
                                },
                                logEventData: function () {
                                    var activity = 'Event Viewer';
                                    var details = {};
                                    var key = !!instanceConfig.showEventsAcrossSources ? 'Show events across sources' : 'Show events in a file';
                                    var value = {
                                        "Serial Number": instanceConfig.data.sysId,
                                        "Bundle": instanceConfig.data.bundle,
                                        "File": instanceConfig.data.file,
                                        "Observation": instanceConfig.data.observationStr,
                                        "Timefilter": instanceConfig.timefilter.currentValue
                                    };
                                    details[key] = value;
                                    UserTrackingService.standard_user_tracking(instanceConfig.app, instanceConfig.module, activity, JSON.stringify(details)).then(function (response) {
                                    }, instanceConfig.handleSessionTimeout);
                                },
                                getTimeRangeForEventContent: function (obs_date) {
                                    var dateRange = {
                                        sDate: "",
                                        eDate: ""
                                    };
                                    if (!obs_date) {
                                        obs_date = new Date();
                                    }
                                    var cTime = new Date(obs_date);
                                    var st = new Date(obs_date), et = new Date(obs_date);
                                    //set custom date n time filter
                                    //instanceConfig.timefilter.customFilter.fromDate.gDate = cTime;
                                    //instanceConfig.timefilter.customFilter.toDate.gDate = cTime;
                                    if (instanceConfig.timefilter.currentValue == '1 minute') {
                                        st.setMinutes(cTime.getMinutes() - 1);
                                        et.setMinutes(cTime.getMinutes() + 1);
                                    } else if (instanceConfig.timefilter.currentValue == '5 minutes') {
                                        st.setMinutes(cTime.getMinutes() - 5);
                                        et.setMinutes(cTime.getMinutes() + 5);
                                    } else if (instanceConfig.timefilter.currentValue.indexOf(15) != -1) {
                                        st.setMinutes(cTime.getMinutes() - 15);
                                        et.setMinutes(cTime.getMinutes() + 15);
                                    } else if (instanceConfig.timefilter.currentValue.indexOf(30) != -1) {
                                        st.setMinutes(cTime.getMinutes() - 30);
                                        et.setMinutes(cTime.getMinutes() + 30);
                                    } else if (instanceConfig.timefilter.currentValue.indexOf(1) != -1) {
                                        st.setHours(cTime.getHours() - 1);
                                        et.setHours(cTime.getHours() + 1);
                                    } else if (instanceConfig.timefilter.currentValue.indexOf(4) != -1) {
                                        st.setHours(cTime.getHours() - 4);
                                        et.setHours(cTime.getHours() + 4);
                                    } else if (instanceConfig.timefilter.currentValue.indexOf(8) != -1) {
                                        st.setHours(cTime.getHours() - 8);
                                        et.setHours(cTime.getHours() + 8);
                                    } else if (instanceConfig.timefilter.currentValue.indexOf('Custom') != -1) {
                                        // st = $filter('date')(instanceConfig.timefilter.customFilter.fromDate.gDate, 'yyyy-MM-dd');
                                        // et = $filter('date')(instanceConfig.timefilter.customFilter.toDate.gDate, 'yyyy-MM-dd');
                                        st = moment(instanceConfig.timefilter.customFilter.fromDate.gDate).format('YYYY-MM-DD');
                                        et = moment(instanceConfig.timefilter.customFilter.toDate.gDate).format('YYYY-MM-DD');

                                        var hr = instanceConfig.timefilter.customFilter.fromDate.hr;
                                        var min = instanceConfig.timefilter.customFilter.fromDate.min;
                                        var sec = instanceConfig.timefilter.customFilter.fromDate.sec;

                                        var sTime = (hr > 10 ? hr : ('0' + hr)) + ":" + (min > 10 ? min : ('0' + min)) + ":" + (sec > 10 ? sec : ('0' + sec));
                                        var hr = instanceConfig.timefilter.customFilter.toDate.hr;
                                        var min = instanceConfig.timefilter.customFilter.toDate.min;
                                        var sec = instanceConfig.timefilter.customFilter.toDate.sec;
                                        var eTime = (hr > 10 ? hr : ('0' + hr)) + ":" + (min > 10 ? min : ('0' + min)) + ":" + (sec > 10 ? sec : ('0' + sec));
                                        // st = new Date(st + " " + sTime);
                                        // et = new Date(et + " " + eTime);
                                        dateRange.sDate = st + "T" + sTime + "Z";
                                        dateRange.eDate = et + "T" + eTime + "Z";
                                        return dateRange;
                                    }
                                    dateRange.sDate = st.toISOString();
                                    dateRange.eDate = et.toISOString();
                                    return dateRange;
                                },
                                eventScrollUp: function () {
                                    var bucketRef;
                                    if (instance.showEventsAcrossSources) {
                                        bucketRef = instanceConfig.event60Buckets;
                                    } else {
                                        bucketRef = instanceConfig.event30Buckets;
                                    }

                                    if (bucketRef.get().length == 0 || (instanceConfig.timefilter.offset >= instanceConfig.timefilter.totalRecords)) {
                                        return false;
                                    }
                                    if (instanceConfig.timefilter.request) {
                                        return false;
                                    };
                                    instanceConfig.timefilter.request = false;
                                    //read topmost record and read index of that
                                    instanceConfig.timefilter.endIndex = bucketRef.first()['index'];
                                    //if(instanceConfig.timefilter.endIndex == 0){return false;}
                                    instanceConfig.timefilter.startIndex = instanceConfig.timefilter.endIndex - instanceConfig.timefilter.offset;

                                    instanceConfig.timefilter.scrolldirection = 'scroll';
                                    /*instanceConfig.timefilter.startIndex = instanceConfig.timefilter.endIndex - instanceConfig.timefilter.offset;*/
                                    if (instanceConfig.timefilter.startIndex <= 0) {
                                        instanceConfig.timefilter.startIndex = 0;
                                    }
                                    if (instanceConfig.timefilter.endIndex >= instanceConfig.timefilter.totalRecords) {
                                        instanceConfig.timefilter.endIndex = instanceConfig.timefilter.totalRecords;
                                    }
                                    this.eventFilterSources('up');
                                },
                                eventScrollDown: function () {
                                    var bucketRef;
                                    if (instance.showEventsAcrossSources) {
                                        bucketRef = instanceConfig.event60Buckets;
                                    } else {
                                        bucketRef = instanceConfig.event30Buckets;
                                    }
                                    if (bucketRef.get().length == 0 || (instanceConfig.timefilter.offset >= instanceConfig.timefilter.totalRecords)) {
                                        return false;
                                    }
                                    if (instanceConfig.timefilter.request) {
                                        return false;
                                    };
                                    instanceConfig.timefilter.request = false;
                                    //get last record index
                                    instanceConfig.timefilter.startIndex = bucketRef.last()['index'];

                                    if (instanceConfig.timefilter.startIndex >= (instanceConfig.timefilter.totalRecords - 1)) {
                                        return false;
                                    }
                                    instanceConfig.timefilter.scrolldirection = 'scroll';
                                    instanceConfig.timefilter.endIndex = instanceConfig.timefilter.startIndex + instanceConfig.timefilter.offset;

                                    if (instanceConfig.timefilter.endIndex >= instanceConfig.timefilter.totalRecords) {
                                        instanceConfig.timefilter.endIndex = instanceConfig.timefilter.totalRecords;
                                    }
                                    this.eventFilterSources('down');
                                },
                                eventContentApplyFilter: function () {
                                    if (instanceConfig.timefilter.currentValue.indexOf('Custom') != -1) {
                                        var cTime = this.getTimeRangeForEventContent();
                                        var st = cTime.sDate;
                                        var et = cTime.eDate;
                                        if (et === st) {
                                            instanceConfig.timefilter.request = false;
                                            instanceConfig.data.isContentLoading.loading1 = false;
                                            instanceConfig.loadingState.event = false;
                                            instanceConfig.timefilter.applied = false;
                                            return;
                                        };
                                    } else {
                                        //reset custom time tilter
                                        instanceConfig.eventResetCustomFilter();
                                    }
                                    instanceConfig.timefilter.applied = true;
                                    this.eventResetPaginationInfo();
                                    instanceConfig.getEventContent(instance.data);
                                },
                                eventResetPaginationInfo: function () {
                                    instanceConfig.timefilter.startIndex = 0;
                                    instanceConfig.timefilter.endIndex = 0;
                                    instanceConfig.timefilter.baseIndex = 0;
                                    instanceConfig.timefilter.totalRecords = 0;
                                    instanceConfig.timefilter.scrolldirection = 'default';

                                    var bucketRef;
                                    if (instance.showEventsAcrossSources) {
                                        bucketRef = instanceConfig.event60Buckets;
                                    } else {
                                        bucketRef = instanceConfig.event30Buckets;
                                    }
                                    bucketRef.clear();
                                },
                                changeEventAcrossSources: function (instanceData) {
                                    if (instanceConfig.showEventsAcrossSources) {
                                        instanceConfig.eventSourceSelectAll();
                                    }
                                    if (instanceConfig.timefilter.currentValue.indexOf('Custom') != -1) {
                                        var cTime = this.getTimeRangeForEventContent();
                                        var st = cTime.sDate;
                                        var et = cTime.eDate;
                                        if (et === st) {
                                            instanceConfig.timefilter.currentValue = instanceConfig.timefilter.quickFilters[0];
                                            //reset custom time tilter
                                            instanceConfig.eventResetCustomFilter();
                                        } else {
                                            if (!instanceConfig.timefilter.applied) {
                                                instanceConfig.timefilter.currentValue = instanceConfig.timefilter.quickFilters[0];
                                                //reset custom time tilter
                                                instanceConfig.eventResetCustomFilter();
                                            }
                                        }
                                    }
                                    instanceConfig.logEventData();
                                    instanceConfig.eventResetPaginationInfo();
                                    instanceConfig.getEventContent(instanceData);
                                },
                                eventResetCustomFilter: function () {
                                    //reset custom time tilter
                                    var cTime = new Date(instance.data.result.obs_date);
                                    cTime.setHours("0");
                                    cTime.setMinutes("0");
                                    cTime.setSeconds("0");
                                    instanceConfig.timefilter.customFilter.fromDate['hr'] = 00;
                                    instanceConfig.timefilter.customFilter.fromDate['min'] = 00;
                                    instanceConfig.timefilter.customFilter.fromDate['sec'] = 00;
                                    instanceConfig.timefilter.customFilter.toDate['hr'] = 00;
                                    instanceConfig.timefilter.customFilter.toDate['min'] = 00;
                                    instanceConfig.timefilter.customFilter.toDate['sec'] = 00;
                                    instanceConfig.timefilter.customFilter.fromDate.gDate = cTime;
                                    instanceConfig.timefilter.customFilter.toDate.gDate = cTime;
                                },
                                eventScrollUpEnd: function () {
                                    if (instanceConfig.isContentLoading()) return false;
                                    if (instanceConfig.timefilter.request) return false;
                                    if (instanceConfig.timefilter.startIndex == 0) return false;
                                    var bucketRef;
                                    if (instance.showEventsAcrossSources) {
                                        bucketRef = instanceConfig.event60Buckets;
                                    } else {
                                        bucketRef = instanceConfig.event30Buckets;
                                    }
                                    if (bucketRef.get().length == 0 || (instanceConfig.timefilter.offset >= instanceConfig.timefilter.totalRecords)) {
                                        return false;
                                    }
                                    instanceConfig.timefilter.startIndex = bucketRef.first()['index'];
                                    var up = (instanceConfig.timefilter.startIndex > 1);
                                    return up;
                                },
                                evetScrollDownEnd: function () {
                                    if (instanceConfig.isContentLoading()) return false;
                                    if (instanceConfig.timefilter.request) return false;
                                    //if(instanceConfig.timefilter.endIndex == 0) return false;                                   
                                    var bucketRef;
                                    if (instance.showEventsAcrossSources) {
                                        bucketRef = instanceConfig.event60Buckets;
                                    } else {
                                        bucketRef = instanceConfig.event30Buckets;
                                    }
                                    if (bucketRef.get().length == 0 || (instanceConfig.timefilter.offset >= instanceConfig.timefilter.totalRecords)) {
                                        return false;
                                    }
                                    instanceConfig.timefilter.endIndex = bucketRef.last()['index'];
                                    var totalRecords = instanceConfig.timefilter.totalRecords;
                                    totalRecords--;
                                    var down = (instanceConfig.timefilter.endIndex < totalRecords);
                                    return down;
                                },
                                eventPaginationToolbar: function () {
                                    var bucketRef;
                                    if (instance.showEventsAcrossSources) {
                                        bucketRef = instanceConfig.event60Buckets;
                                    } else {
                                        bucketRef = instanceConfig.event30Buckets;
                                    }
                                    var totalRecords = instanceConfig.timefilter.totalRecords;
                                    var startIndex = bucketRef.first() ? bucketRef.first()['index'] : '0';
                                    var endIndex = bucketRef.last() ? bucketRef.last()['index'] : '0';
                                    startIndex = parseInt(startIndex) + 1;
                                    endIndex = parseInt(endIndex) + 1;
                                    return startIndex + " - " + endIndex + " of " + totalRecords;
                                },
                                eventGetSelectedSources: function () {
                                    var ns = [];
                                    for (var i = 0; i < instanceConfig.eventSourcesDuplicate.length; i++) {
                                        var obj = instanceConfig.eventSourcesDuplicate[i];
                                        if (obj.checked) {
                                            ns.push(obj.namespace_actual);
                                            instanceConfig.eventSources[i].checked = true;
                                        } else {
                                            instanceConfig.eventSources[i].checked = false;
                                        }
                                    }
                                    return ns;
                                },
                                eventFilterSources: function (direction) {
                                    if (!direction) {
                                        instanceConfig.timefilter.startIndex = 0;
                                        instanceConfig.timefilter.endIndex = instanceConfig.timefilter.offset;
                                        instanceConfig.timefilter.sourceFilter = true;
                                        instanceConfig.timefilter.scrolldirection = 'scroll';
                                        instanceConfig.event60Buckets.clear();
                                    }
                                    if (direction == 'default') {
                                        var list = this.eventGetSelectedSources(), found = false;
                                        for (var i = 0; i < list.length; i++) {
                                            if (list[i] == instanceConfig.timefilter.defaultNS) {
                                                found = true;
                                                break;
                                            }
                                        }
                                        instanceConfig.timefilter.endIndex = 0;
                                        // if (found) {
                                        //     instanceConfig.timefilter.endIndex = 1;
                                        //     // instanceConfig.timefilter.scrolldirection = 'default';
                                        // } else {
                                        //     instanceConfig.timefilter.endIndex = instanceConfig.timefilter.offset;
                                        //     // instanceConfig.timefilter.scrolldirection = 'scroll';
                                        // }
                                        instanceConfig.timefilter.startIndex = 0;
                                        instanceConfig.timefilter.sourceFilter = true;
                                        instanceConfig.event60Buckets.clear();
                                    }
                                    this.getEventContent(instance.data, direction);
                                },
                                eventResetSourceSelection: function () {
                                    instanceConfig.eventSourcesFilter = "";
                                    for (var i = 0; i < instanceConfig.eventSources.length; i++) {
                                        if (instanceConfig.eventSources[i].checked) {
                                            instanceConfig.eventSourcesDuplicate[i].checked = true;
                                        } else {
                                            instanceConfig.eventSourcesDuplicate[i].checked = false;
                                        }
                                    }
                                },
                                eventSelectAllSources: function () {
                                    if (this.eventSourcesAll) {
                                        angular.forEach(instanceConfig.eventSourcesDuplicate, function (item) {
                                            item.checked = true;
                                        })
                                    } else {
                                        angular.forEach(instanceConfig.eventSourcesDuplicate, function (item) {
                                            item.checked = false;
                                        })
                                    }
                                },
                                eventIsSelectAllOption: function () {
                                    for (var i = 0; i < instanceConfig.eventSourcesDuplicate.length; i++) {
                                        if (!instanceConfig.eventSourcesDuplicate[i].checked) {
                                            this.eventSourcesAll = false;
                                            return false;
                                        }
                                    }
                                    this.eventSourcesAll = true;
                                    return true;
                                },
                                eventSourceSelectAll: function () {
                                    if (instanceConfig.showEventsAcrossSources) {
                                        angular.forEach(instanceConfig.eventSourcesDuplicate, function (item) {
                                            item.checked = true;
                                        })
                                    }
                                },
                                eventClearSourceSelection: function () {
                                    for (var i = 0; i < instanceConfig.eventSources.length; i++) {
                                        if (instanceConfig.eventSources[i].checked) {
                                            instanceConfig.eventSources[i].checked = false;
                                        }
                                    }
                                },
                                showPagination: function () {
                                    var eScope = 'bundle'; //instanceConfig.showEventsAcrossSources ? 'bundle' : 'file';
                                    if ((instanceConfig.data.content30.length == 0 && (eScope == 'file')) || (instanceConfig.data.content60.length == 0 && (eScope == 'bundle'))) {
                                        return false;
                                    }
                                    return true;
                                },
                                getEventContent: function (data, direction) {
                                    instanceConfig.filterLoader = true;
                                    instanceConfig.expandAll = false;
                                    if(direction){
                                        instanceConfig.timefilter.scrolldirection = direction === 'default' ? 'default' : 'scroll';
                                    }
                                    if (instanceConfig.timefilter.scrolldirection == 'default') {
                                        instanceConfig.timefilter.request = true;
                                        instanceConfig.data.isContentLoading.loading1 = true;
                                        //instanceConfig.loadingState.event = true;
                                    } else {
                                        instanceConfig.timefilter.request = true;
                                    }
                                    var cTime = this.getTimeRangeForEventContent(data.result.obs_date);
                                    var eScope = 'bundle'; // instanceConfig.showEventsAcrossSources ? 'bundle' : 'file';

                                    var params = "", nslist = "";
                                    params = 'ns_id=' + data.result.namespace_id;
                                    params = params + '&filename=' + encodeURIComponent(data.result.filename);
                                    if (eScope == 'bundle') {
                                        var ns = this.eventGetSelectedSources();
                                        if (ns && ns.length && ns.length > 0) {
                                            for (var i = 0; i < ns.length; i++) {
                                                if (i == 0) {
                                                    nslist = 'ns=' + ns[i];
                                                } else {
                                                    nslist = nslist + '&ns=' + ns[i];
                                                }
                                            }
                                        } else {
                                            nslist = 'ns=' + data.result.namespace;
                                        }
                                    } else {
                                        nslist = 'ns=' + data.result.namespace;
                                    }
                                    // Do not send nslist in payload if all events have been selected.
                                    if(!this.eventIsSelectAllOption()){
                                        params = params + '&' + nslist;
                                    }

                                    // if(!!instanceConfig.data.facetStr){
                                    //     params = params + '&filter='+ encodeURIComponent(instanceConfig.data.facetStr);
                                    // }

                                    var scrolldirection = instanceConfig.timefilter.scrolldirection;
                                    instanceConfig.timefilter.startIndex++;
                                    var sr = instanceConfig.timefilter.startIndex;
                                    var er = instanceConfig.timefilter.endIndex;
                                    var st = cTime.sDate;
                                    var et = cTime.eDate;
                                    var sp = instanceConfig.severityPayload;
                                    ExplorerService.getEventsContent(data.result.obs_date, params, eScope, st, et, scrolldirection, sr, er,sp).then(function (response) {
                                        var responseData = response.data.Data;

                                        var tmpData = [];
                                        instanceConfig.timefilter.request = false;
                                        instanceConfig.data.content60 = [];
                                        //create unique id
                                        var uniqueId = new Date() - new Date("2000-01-01 00:00:00");
                                        //instanceConfig.event60Buckets.clear();
                                        angular.forEach(responseData.event60, function (evt) {
                                            angular.forEach(evt, function (value, key) {
                                                var tmpEvent = value;
                                                if(tmpEvent.severity == 'NA' || !tmpEvent.severity_color ){
                                                    tmpEvent.severity_color = '#ffffff00'
                                                }
                                                tmpEvent.display = true;
                                                tmpEvent.isExpanded = false;
                                                //tmpEvent.isSourceExpanded = false;
                                                tmpEvent.namespace_id = key;
                                                if (scrolldirection == 'default' && tmpEvent.highlight && tmpEvent.highlight == "true") {
                                                    if (tmpEvent.ns_index) {
                                                        instanceConfig.timefilter.baseIndex = tmpEvent.ns_index;
                                                    }
                                                    if (tmpEvent.num_of_rows) {
                                                        instanceConfig.timefilter.offset = tmpEvent.num_of_rows;
                                                    }
                                                    instanceConfig.timefilter.defaultNS = tmpEvent.namespace;
                                                } else if (instanceConfig.timefilter.currentValue.indexOf('Custom') != -1) {
                                                    if (tmpEvent.ns_index) {
                                                        instanceConfig.timefilter.baseIndex = tmpEvent.ns_index;
                                                    }
                                                } else {
                                                    if (tmpEvent.ns_index) {
                                                        instanceConfig.timefilter.baseIndex = tmpEvent.ns_index;
                                                    }
                                                }
                                                instanceConfig.timefilter.endIndex = tmpEvent.index;
                                                if (tmpEvent.totalRows) {
                                                    instanceConfig.timefilter.totalRecords = tmpEvent.totalRows;
                                                }
                                                tmpEvent['scrollId'] = uniqueId + '-' + tmpEvent['index'];
                                                tmpData.push(tmpEvent);
                                            });
                                        });
                                        if (!instanceConfig.timefilter.offset) {
                                            instanceConfig.timefilter.offset = 200;
                                        }

                                        instanceConfig.event60Buckets.add(tmpData, instanceConfig.timefilter.offset, (scrolldirection == 'default' ? 'default' : direction));
                                        instanceConfig.data.content60 = instanceConfig.event60Buckets.get();
                                        //instanceConfig.severityFilterApplied && instanceConfig.applySeverityFilter();
                                        instanceConfig.data.content30 = [];


                                        //instanceConfig.event30Buckets.clear();
                                        angular.forEach(responseData.event30, function (evt) {
                                            angular.forEach(evt, function (value, key) {
                                                var tmpEvent = value;
                                                if(tmpEvent.severity == 'NA'){
                                                    tmpEvent.severity_color = '#ffffff00'
                                                }
                                                tmpEvent.namespace_id = key;
                                                if (scrolldirection == 'default' && tmpEvent.highlight && tmpEvent.highlight == "true") {

                                                    if (tmpEvent.ns_index) {
                                                        instanceConfig.timefilter.baseIndex = tmpEvent.ns_index;
                                                    }
                                                    if (tmpEvent.num_of_rows) {
                                                        instanceConfig.timefilter.offset = tmpEvent.num_of_rows;
                                                    }
                                                } else if (instanceConfig.timefilter.currentValue.indexOf('Custom') != -1) {
                                                    if (tmpEvent.ns_index) {
                                                        instanceConfig.timefilter.baseIndex = tmpEvent.ns_index;
                                                    }
                                                }
                                                if (tmpEvent.totalRows) {
                                                    instanceConfig.timefilter.totalRecords = tmpEvent.totalRows;
                                                }
                                                instanceConfig.timefilter.endIndex = tmpEvent.index;
                                                tmpEvent['scrollId'] = uniqueId + '-' + tmpEvent['index'];
                                                tmpData.push(tmpEvent);
                                            });
                                        });
                                        if (!instanceConfig.timefilter.offset) {
                                            instanceConfig.timefilter.offset = 200;
                                        }
                                        instanceConfig.event30Buckets.add(tmpData, instanceConfig.timefilter.offset, (scrolldirection == 'default' ? 'default' : direction));
                                        instanceConfig.data.content30 = instanceConfig.event30Buckets.get();
                                        instanceConfig.data.isContentLoading.loading1 = false;
                                        instanceConfig.timefilter.sourceFilter = false;
                                        instanceConfig.logEventData();
                                        instanceConfig.loadingState.event = false;
                                        instanceConfig.filterLoader = false;
                                        // $timeout(function() {
                                        //     instanceConfig.expandAll && instnceConfig.expandAllEvents();
                                        //     // This code runs after the DOM renders
                                        // },1000);
                                        
                                    }, function (response) {
                                        if (response.data.Msg.match(/SURROUNDING_EVENTS_MAXED_OUT/)) {
                                            instanceConfig.Max_Limit = response.data.Data.limit;
                                            instanceConfig.Max_Totalrecords = response.data.Data.totalRecords;
                                            instanceConfig.handleSessionTimeout(response);
                                            instanceConfig.data.isContentLoading.loading1 = false;
                                            instanceConfig.loadingState.event = false;
                                            instanceConfig.timefilter.sourceFilter = false;
                                            instanceConfig.timefilter.request = false;
                                            instanceConfig.MAXED_OUT = true;
                                            console.log(instanceConfig.MAXED_OUT);
                                            // instanceConfig.MAXED_OUT_MSG = responseMsg;
                                        }
                                        else {
                                            console.log("Error:" + response.status + "and" + response.Msg);
                                            instanceConfig.handleSessionTimeout(response);
                                            instanceConfig.data.isContentLoading.loading1 = false;
                                            instanceConfig.loadingState.event = false;
                                            instanceConfig.timefilter.sourceFilter = false;
                                            instanceConfig.timefilter.request = false;
                                        }
                                    });
                                },
                                isOverflowing: function (item, e) {
                                    var element = e.currentTarget;
                                    if (item.isExpanded) {
                                        item.isExpanded = false;
                                    }
                                    else if (element.scrollWidth > element.offsetWidth) {
                                        item.isExpanded = true;
                                    }
                                },
                                // isSourceOverflowing: function (item, e) {
                                //     var element = e.currentTarget;
                                //     if (item.isSourceExpanded) {
                                //         item.isSourceExpanded = false;
                                //     }
                                //     else if (element.scrollWidth > element.offsetWidth) {
                                //         item.isSourceExpanded = true;
                                //     }
                                // },
                                isFilterApplied: function () {
                                    var unselected = instanceConfig.severityFilter.filter(function(e){
                                    return !e.selected
                                    })
                                    if(unselected.length > 0 && instanceConfig.severityFilter.length != unselected.length){
                                        return true;
                                    }
                                    else{
                                        return false;
                                    }
                                },
                                getFilterArr: function () {
                                    return instanceConfig.severityFilter.reduce(function (a, c) {
                                        if (c.selected) {
                                            a.push(c.label);
                                        }
                                        return a
                                    }, [])
                                },
                                showpre: function (cnt) {
                                    var filter = instanceConfig.getFilterArr() || [];
                                    if (instanceConfig.severityFilterApplied) {
                                        if (instanceConfig.severityFilterApplied && (cnt.highlight == 'true' && filter.includes(cnt.severity)) || instanceConfig.severityFilterApplied && (cnt.highlight == 'false' && filter.includes(cnt.severity))) {
                                            return true;
                                        } else if (instanceConfig.severityFilterApplied && (cnt.highlight == 'true' && !filter.includes(cnt.severity))) {
                                            return false
                                        }
                                    } else {
                                        return true;
                                    }

                                },
                                createSeverityPayload: function(){
                                   return instanceConfig.isFilterApplied() ?  instanceConfig.severityFilter.reduce(function (a, c) {
                                        // a += c.selected ? ('~' + c.label) : '';
                                        a += c.selected ? (a.length === 0 ? c.label : '~' + c.label) : '';
                                        return a;
                                    }, "") : "";
                                },
                                applySeverityFilter: function () {
                                    instanceConfig.severityPayload = instanceConfig.createSeverityPayload();
                                    this.eventResetPaginationInfo();
                                    instanceConfig.getEventContent(instance.data);
                                    
                                    // instanceConfig.isFilterApplied();instanceConfig.filterLoader = true;
                                    // instanceConfig.filterLoader = true;
                                    // var filter = instanceConfig.getFilterArr() || [];
                                    // if (filter.length) {
                                    //     instanceConfig.data.content60.forEach(function (cnt) {
                                    //         if (!(cnt.highlight == 'true')) {
                                    //             if (filter.includes(cnt.severity)) {
                                    //                 cnt.display = true;
                                    //             } else {
                                    //                 cnt.display = false;
                                    //             }
                                    //         }
                                    //     })
                                    // } else {
                                    //     instanceConfig.data.content60.forEach(function (cnt) {
                                    //         cnt.display = true;
                                    //     })
                                    // }
                                    // setTimeout(function () {
                                    //     instanceConfig.filterLoader = false;
                                    // }, 0)

                                },
                                clearSeverityFilter: function () {
                                    instanceConfig.filterLoader = true;
                                    instanceConfig.severityFilter.forEach(function (cnt) {
                                        cnt.selected = false;
                                    })
                                    instanceConfig.applySeverityFilter();
                                },
                                expandAllEvents: function () {
                                    var list = instanceConfig.expandAll ?  document.getElementsByClassName("noflow"): document.getElementsByClassName("yesFlow") 
                                    for (var i = 0; i < list.length; i++) {
                                        instanceConfig.isOverflowingElement(list[i], angular.element(list[i]).scope().cnt);
                                    }
                                },
                                isOverflowingElement: function (e, item) {
                                 
                                        var element = e

                                        if (item.isExpanded) {
                                            item.isExpanded = false;
                                        }
                                        else if (element.scrollWidth > element.offsetWidth) {
                                            item.isExpanded = true;
                                        }
                                    

                                },
                            };
                            if (instance.type == "event") {
                                instanceConfig.getEventContent(instance.data);
                                instanceConfig.getEventSources();
                                var cTime = new Date(instance.data.result.obs_date);
                                instanceConfig.timefilter.customFilter.fromDate.gDate = cTime;
                                instanceConfig.timefilter.customFilter.toDate.gDate = cTime;
                                instanceConfig.timefilter.customFilter.todayDate = scope.todayDate != undefined ? scope.todayDate : cTime;
                                instanceConfig.timefilter.customFilter.MinDate = scope.info.MinDate != undefined ? scope.info.MinDate : cTime;
                            } else if (instance.type == "app") {

                            } else if (instance.type == "EVENT_GROUP") {

                            } else {
                                instanceConfig.getAllSection(instance.data);
                                instanceConfig.getAllSectionsListForAFile(instance.data);
                            }
                            openInstances.push(instanceConfig);
                            this.showInstance(instanceConfig);
                        }
                    }
                } else {
                    this.showInstance(c_instance);
                }
            },
            getInstanceByMD5: function (md5) {
                var i;
                for (i in openInstances) {
                    if (openInstances[i].md5 === md5) {
                        return openInstances[i];
                    }
                }
                return null;
            },
            updateInstanceByMD5: function(md5, instance) {
            	var i;
                for (i in openInstances) {
                    if (openInstances[i].md5 === md5) {
                        openInstances[i] = instance;
                    }
                }
            },
            showInstance: function (cur_instance) {
                for (var i in openInstances) {
                    if (openInstances[i].md5 == cur_instance.md5) {
                        openInstances[i].visible = true;
                    } else {
                        openInstances[i].visible = false;
                    }
                }
                this.setVisible(true);
            },
            getInstances: function () {
                return openInstances;
            },
            removeInstance: function (instance) {
                if(instance.type == "dashboard" || instance.type == "tableau"){
                    if(localStorage.getItem("rid")){
                        var tempRidList = localStorage.getItem("rid").split(',');
                        var tempDidList = localStorage.getItem("did").split(',');
                        for(i=0;i<tempRidList.length;i++){
                            if(instance.data.view){
                                if(instance.data.view.id == tempRidList[i]){
                                    tempRidList.splice(i,1);
                                    tempDidList.splice(i,1);
                                    i--;
                                }
                            }else {
                                if(instance.data.report.r_id == tempRidList[i]){
                                    tempRidList.splice(i,1);
                                    tempDidList.splice(i,1);
                                    i--;
                                }
                            }
                        }
                    }
                }
                if(instance.type == "dashboard" || instance.type == "tableau"){
                    if(localStorage.getItem("rid")!=null){
                        localStorage.setItem("rid",tempRidList.toString());
                        localStorage.setItem("did",tempDidList.toString());
                    }
                }
                for (var i in openInstances) {
                    if (openInstances[i].md5 === instance.md5) {
                        openInstances.splice(i, 1);
                        return;
                    }
                }
               /* this.modalInstance = $modal.open({
                    //'scope': scope,
                    'templateUrl': 'partials/instance_tab_change_confirmation.html'
                });*/
            },
            yesRemoveInstance: function(){                
                for (var i in openInstances) {
                    if (openInstances[i].md5 === instance.md5) {
                        openInstances.splice(i, 1);
                        return;
                    }
                }
            },
            noRemoveInstance: function(){ 
                this.modalInstance.close(); 
            },
            getNumberOfInstances: function () {
                return openInstances.length;
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
		 try{	
			var detailsJsonObj = JSON.parse(details);
			if(Object.keys(detailsJsonObj).length > usertrackingDetailsLimit){
	
				for (var index=0;index < usertrackingDetailsLimit;index ++){
					var key = Object.keys(detailsJsonObj)[index];
					result[key] = detailsJsonObj[key]
					}
					details = JSON.stringify(result);
				}
		}catch(err){}

		//} 
                var params = {};
                if($cookies.prevApplication && $cookies.prevApplication != application) {
                    params['switched_feature'] = $cookies.prevApplication;
                }
                url = umsDomain + '/user_tracking/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + application + '/' + module + '/' + activity;
                $cookies.prevApplication = application;
                return $http.post(url, {
                    "details": details,
                    "solr_query": !!solrQuery ? solrQuery : ""
                }, {params: params});
            },
            custom_user_tracking: function (d_id, r_id) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/user_tracking/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + d_id + '/' + r_id);
            },
            getAllConfig: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                if (!setConfig) {
                    setConfig = true;
                    config = $http.get(infoserverDomain + '/uimeta/config/' + GlobalService.getVal('manufacturer') + '/' +  GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
                        cache: true
                    });
                }
                return config;
            }
        };
    }]);
angular.module('gbApp.services').factory('RulesTestWithLogvault', [
    function () {
        var gbObjs = function(){
            var self = this;
            self.page = null;
            self.rules = [];
            self.setCurrentPage = function(page){
                self.page = page;
                if(self.page != "test_rule_history"){
                    self.rules = [];
                }
            };
            self.getCurrentPage = function(){
                return self.page;
            }
            self.setRulesSelected = function(rule){
                self.rules = rule;
            };
            self.getRulesSelected = function(){
                return self.rules;
            };
        }
        var pageObj = new gbObjs();
        return pageObj;
    }]);

