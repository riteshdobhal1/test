angular.module('gbApp.controllers', ['gbApp', 'gbApp.services', 'gbApp.globals'])
.controller('AppCtrl', ['$rootScope', '$scope', '$localStorage', 'session', 'metaDataService', 'AppService', '$cookieStore', '$cookies', '$location', 'GlobalService', '$sce', '$timeout','$filter', '$window', '$interval', '$controller', '$sce', 'PasswordService', 'UserTrackingService',
function($rootScope, $scope, $localStorage, session, metaDataService, AppService,  $cookieStore, $cookies, $location, GlobalService, $sce, $timeout, $filter,  $window, $interval, $controller, $sce, PasswordService, UserTrackingService) {
	var appCtrl = this;	
	session.then(function() {
		var domainMetaObj = metaDataService.getDomain();
		var featureMetaObj = metaDataService.getFeatures();
		var userMetaObj = metaDataService.getUser();
		var infoserverDomain = GlobalService.getVal('infoserverDomain');

		var manufacturer = GlobalService.getVal('manufacturer');
		var product = GlobalService.getVal('product');
		var schema = GlobalService.getVal('schema');
		if ($location.absUrl().match(/serialNumber=(.*)/)) {
			var dserialNumber = $location.absUrl().match(/serialNumber=(.*)/)[1];
			dserialNumber = unescape(dserialNumber);
			GlobalService.setSessionCookies("serialNumber=" + dserialNumber);
		}

		// Holds application info
		appCtrl.info = {};
		appCtrl.form = {};
		appCtrl.info.loaded = false;
		appCtrl.domainList = {};
		appCtrl.projectsList = {};
		appCtrl.currentDomain = GlobalService.getVal('primaryDomain');
		appCtrl.currentDomainFullName = $location.host();
		appCtrl.appsVersion = GlobalService.getVal('appsVersion');

		$scope.firstTimeLoading = false;
		appCtrl.info.mps = manufacturer + ":" + product + ":" + schema;

		if ($cookies.loginurl) {
			appCtrl.info.logoutLink = $cookies.loginurl;
		} else {
			appCtrl.info.logoutLink = GlobalService.getVal('redirect_login_url');
		}

		var domain = GlobalService.getVal('primaryDomain');

		var cookieLogoutUrl;
		if (metaDataService.getSsoUser()) {
			if (metaDataService.getSsoLogoutUrl()) {
				cookieLogoutUrl = metaDataService.getSsoLogoutUrl();
			} else {
				cookieLogoutUrl = GlobalService.getVal('session_redirect_url').replace(/\?.*/, '');
			}

		} else {
			cookieLogoutUrl = appCtrl.info.logoutLink.replace(/\?.*/, '');
		}
		
		var landingPage = document.location.href.split("&");
		var landingPageUrl = landingPage[0];

		document.cookie = 'logouturl=' + cookieLogoutUrl + ";domain=" + domain + ";path=/";
		document.cookie = 'landingPageUrl=' + landingPageUrl + ";domain=" + domain + ";path=/";
		document.cookie = 'adminAddUserDefUrl='+window.location.pathname.replace('/', '');


		// Holds the user name of the user.
		appCtrl.info.user = metaDataService.getUserEmail();
		appCtrl.info.userName = metaDataService.getUserName();
		appCtrl.info.is_external = metaDataService.getUserType();
		appCtrl.info.external_logo = '/apps/app/img/' + metaDataService.getLogo();
		appCtrl.info.external_logourl = metaDataService.getlogourl();
		// Defines whether sso user or not ??
		appCtrl.info.ssoUser = metaDataService.getSsoUser();
		appCtrl.info.infoserverDomain = infoserverDomain;
		infoserverDomain = appCtrl.info.infoserverDomain;
		// Defines whether File Upload should be old or new
		// Defines the completion of authentication
		appCtrl.info.complete = false;
		appCtrl.info.dashboards_url = GlobalService.getVal('dashboards');

		//Set for features
		appCtrl.info.features = metaDataService.getFeatures();
		var userInfo = metaDataService.getUser();
		appCtrl.info.powerUser = ((appCtrl.info.features['admin']) ? true : false);
		//appCtrl.info.loaded = true;
		var loadPage = metaDataService.getDefaultFeature();
		document.cookie = 'default_feature=' + loadPage + ";domain=" + domain + ";path=/";
		var freshLanding = true;
		var username = userInfo['email'];
		username = username?username.toLowerCase():'';
		
		document.cookie = 'username=' + username + ";domain=" + domain + ";path=/";

		GlobalService.setVal('features', appCtrl.info.features);
		appCtrl.info.complete = true;
		// Stores whether session is timed out or not
		appCtrl.info.sessionTimedOut = false;
		//HACK
		AppService.setAuthorized(true);
		AppService.setInfoServerUp(true);
		appCtrl.complete = true;
		appCtrl.dashboards_url = GlobalService.getVal('dashboards');
		appCtrl.analytics_url = GlobalService.getVal('analytics');


		window.checkIframeLoaded = function () {
			// Get a handle to the iframe element
			var iframe = document.getElementById('i_frame');
			var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

			// Check if loading is complete
			if (  iframeDoc.readyState  == 'complete' ) {
				//iframe.contentWindow.alert("Hello");
				iframe.contentWindow.onload = function(){
					//console.log("-------------------------->>>I am loaded");
				};
				// The loading is complete, call the function we want executed once the iframe is loaded
				afterLoading();
				return;
			} 

			// If we are here, it is not loaded. Set things up so we check   the status again in 100 milliseconds
			window.setTimeout(checkIframeLoaded, 100);
		}

		window.afterLoading = function (){
			$timeout(function(){
				appCtrl.info.loaded = true;
			}, 5000);
		}

		function getApplicationForTracking(page) {
			var application;
			if (page == 'logvault' || page == 'apps') {
				application = appCtrl.nav.navLog;
			} else if (page == 'explorer') {
				application = appCtrl.nav.navExplorer;
			} else if (page == 'rules_and_alerts') {
				application = appCtrl.nav.navRules;
			} else if (page == 'dashboards') {
				application = appCtrl.nav.navDashboards;
			} else if (page == 'healthcheck') {
				application = appCtrl.nav.navHealth;
			} else if (page == 'workbench') {
				application = appCtrl.nav.navWorkbench;
			} else if (page == 'file_upload') {
				application = appCtrl.nav.navUpload;
			} else {
				application = page;
			}
			return application;
		}
		//Get values from url
		$scope.getQueryVariable = function(variable) {
			var query = $window.location.search.substring(1);
			var vars = query.split("&");
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split("=");
				if (decodeURIComponent(pair[0]) == decodeURIComponent(variable)) {
					return decodeURIComponent(pair[1]);
				}
			}
		}
		//Get values from locastorage
		$scope.getQueryLocalstorage = function(LStorage, variable) {
			var query = LStorage;
			var vars = query.split("&");
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split("=");
				if (decodeURIComponent(pair[0]) == decodeURIComponent(variable)) {
					return decodeURIComponent(pair[1]);
				}
			}
		}

		appCtrl.logoutUser = function() {
			localStorage.clear();
			AppService.logoutInfoserver(getApplicationForTracking(appCtrl.info.current)).then(handleLogoutInfoserver, handleLogoutInfoserver);

		};

		// Returns the trusted compiled html template from the given html snippet.
		$scope.renderHtml = function(html) {
			return $sce.trustAsHtml(html);
		};
		// Gets the values from the globals based on the given key.
		appCtrl.getValue = function(key) {
			return GlobalService.getVal(key);
		};
		// Set the 'submitted' flag to true
		
		 // sets the given url as the secure url to load on the ui.
		appCtrl.sceURL = function (url) {
			return $sce.trustAsResourceUrl(url);
		};
		appCtrl.sceHTML = function (html) {
			return $sce.trustAsHtml(html);
		};
		appCtrl.getURL = function () {
			//red url from cookie
			var url = $cookies.summaryDashboardUrl;
			url = appCtrl.sceURL (url);
			return url;
		}
		checkIframeLoaded();
		function handleLogoutInfoserver() {
			/*
			*  clear cookies for current domain
			*/

			//Get all cookies for the current domain
			var theCookies = document.cookie.split(';');
			var cookiesList = [],
			    cookiesNameValue,
			    cookiesName;
			for (var i = 1; i <= theCookies.length; i++) {
				cookiesNameValue = theCookies[i - 1];
				cookiesName = cookiesNameValue.split("=")[0];
				cookiesName = cookiesName.trim();
				cookiesList.push(cookiesName);
			}

			//Set post date to expiry date fo all cookie
			for (var i = 0; i < cookiesList.length; i++) {
				cookiesName = cookiesList[i];
				document.cookie = cookiesName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=" + appCtrl.currentDomain + ";path=/";
			}
			//clear local storage
			$localStorage.$reset();
			//Redirect to login page
			$window.open(cookieLogoutUrl, '_self');
			// $window.location.href = GlobalService.getVal('logout_url');
		}
		$window.updateLogiTracking = function() {
        	UserTrackingService.standard_user_tracking('application', appCtrl.nav["navDashboards"], "logi_tracking", JSON.stringify({details: "logi"})).then(handleLogPortalSuccess, handleLogPortalError);
        };
		$window.tableauUserTracking = function() {
        	UserTrackingService.standard_user_tracking('application', appCtrl.nav["navDashboards"], "tableau_tracking", JSON.stringify({details: "tableau"})).then(handleLogPortalSuccess, handleLogPortalError);
		};
		function handleLogPortalSuccess() {

		}

		function handleLogPortalError(response) {
			if (!appCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
				appCtrl.info.sessionTimedOut = true;
				appCtrl.logoutUser();
				return;
			}
		}

		appCtrl.logout = function(){
			AppService.logoutSessionTimeout();
		}
	});
}])
.controller('PasswordCntr', ['$rootScope', '$scope','$http', 'GlobalService', 'metaDataService', 'PasswordService','$timeout',
    function ($rootScope, $scope,$http, GlobalService, metaDataService, PasswordService, $timeout) {
		$scope.submitted = false;
		$scope.user = {};
		$scope.changePassword = function() {

			// Set the 'submitted' flag to true
			$scope.submitted = true;

			if ($scope.userForm.$valid) {
				PasswordService.change($scope.user.password, metaDataService.getUserEmail())
				.then(function(){
					$("#changePasswordModal").modal('hide');
					$('.toast.gb-update-password-success').toast('show');
					$scope.clearField();
					$timeout(function(){
						$('.toast.gb-update-password-success').toast('hide');
					}, 5000);
				}, function(){
					$("#changePasswordModal").modal('hide');
					$('.toast.gb-update-password-error').toast('show');
					$scope.clearField();
					$timeout(function(){
						$('.toast.gb-update-password-error').toast('hide');
					}, 5000);
				});
			}
		},
		$scope.clearField = function () {
			$scope.user.password = "";
			$scope.user.confirmPassword = "";
			$scope.submitted = false;
			$scope.userForm.$setPristine();

		}
    }]);
