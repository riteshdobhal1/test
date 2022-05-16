// AppCtrl - Responsible for holding the app-level info such as current page, profile options.
angular.module('gbApp.controllers', ['gbApp', 'gbApp.services', 'gbApp.globals']).controller('AppCtrl', ['$rootScope', '$scope', '$localStorage', 'session', 'metaDataService', 'SectionsMetaService', 'MenuService', 'AppService', 'NavigationService', 'ErrorService', '$cookieStore', '$cookies', '$location', 'GlobalService', '$sce', '$timeout', 'ModalService', 'InstanceHandler', 'FileUploader', 'UserTrackingService', 'DefaultFilterService', '$filter', 'WorkbenchService', '$window', '$interval', '$modal', '$controller', 'ExplorerService', 'LogVaultService', 'ConfigDiffService', 'RulesService',
function($rootScope, $scope, $localStorage, session, metaDataService, SectionsMetaService, MenuService, AppService, NavigationService, ErrorService, $cookieStore, $cookies, $location, GlobalService, $sce, $timeout, ModalService, InstanceHandler, FileUploader, UserTrackingService, DefaultFilterService, $filter, WorkbenchService, $window, $interval, $modal, $controller, ExplorerService, LogVaultService, ConfigDiffService, RulesService) {
	var appCtrl = this;
	appCtrl.info = {};
	appCtrl.info.currentToken = '';
	appCtrl.updateUserSuccessLogin = function(){
	
		 AppService.updateUserSuccessLogin().then(function(response) {
                                console.log(response)
                        })

	}		
	appCtrl.addPushToken = function(){
		console.log(Notification.permission);
		if(appCtrl.info.currentToken.length){
			var payload = {
				"username": metaDataService.getUserEmail(),
				"device_token": appCtrl.info.currentToken,
				"app_type": 1,
				"app_id": ""
			}
			console.log(payload)
			AppService.addPushToken(payload).then(function(response) {
				console.log(response)
			})
		}
		
	}

	appCtrl.removePushToken = function(){
		console.log(Notification.permission);
		if(appCtrl.info.currentToken.length){
			var payload = {
				"username": metaDataService.getUserEmail(),
				"device_token": appCtrl.info.currentToken,
				"app_type": 1,
				"app_id": ""
			}
			console.log(payload)
			AppService.removePushToken(payload).then(function(response) {
				console.log(response)
			})
		}
	}
	if ('permissions' in navigator) {
		navigator.permissions.query({ name: 'notifications' }).then(function (notificationPerm) {
			notificationPerm.onchange = function () {
				console.log("User decided to change his settings. New permission: " + notificationPerm.state);
				if (notificationPerm.state == "granted") {
					//call add token api
					appCtrl.addPushToken()
				}
				else if (notificationPerm.state == "denied" || notificationPerm.state == "prompt") {
					//call remove token api
					appCtrl.removePushToken()
				}
			};
		});
	}
	var milliseconds = (new Date).getTime();

	appCtrl.noSummaryDashboardMsg = GlobalService.getVal('noSummaryDashboardMsg');
	session.then(function() {
		if (!!GlobalService.getVal('invalidProjectLoaded')) {
			var modalInstance = ModalService.alertBox({
				msgKey : 'gbstudio_invalid_project'
			});
			modalInstance.result.then(function(response) {
				loadDefaultProduct();
			}, function(response) {
				loadDefaultProduct();
			});
		}

		if(!!GlobalService.getVal('projectListMsg')) {
			ModalService.alertBox({msgKey : 'projectListMsg'});
		}

		function loadDefaultProduct() {
			angular.forEach(appCtrl.domainList, function(value, key) {
				if (key == appCtrl.defaultProduct) {
					appCtrl.changeProduct(value, key);
				}
			});
		}

		appCtrl.showHelpModal = function(showBox) {
			if (!$localStorage.hideModal) {
				$modal.open({
					templateUrl : 'partials/show_info_modal.html',
					windowClass : 'show-info-modal',
					backdrop : 'static',
					controller : 'ShowInfoController as showInfoCtrl',
					resolve : {
						showCheckbox : function() {
							return showBox;
						}
					}
				});
			} else {
				delete $localStorage.hideModal;
			}
		};
		//appCtrl.updateUserSuccessLogin();
		var domainMetaObj = metaDataService.getDomain();
		var featureMetaObj = metaDataService.getFeatures();
		var userMetaObj = metaDataService.getUser();
		var infoserverDomain = GlobalService.getVal('infoserverDomain');
		appCtrl.showGlobalNotification = false;
		appCtrl.showGlobalNotificationMsg = GlobalService.getVal('apiCallCancelMsg');

		var manufacturer = GlobalService.getVal('manufacturer');
		var product = GlobalService.getVal('product');
		var schema = GlobalService.getVal('schema');
		if ($location.absUrl().match(/serialNumber=(.*)/)) {
			var dserialNumber = $location.absUrl().match(/serialNumber=(.*)/)[1];
			dserialNumber = unescape(dserialNumber);
			GlobalService.setSessionCookies("serialNumber=" + dserialNumber);
		}
		var feedbackButtonEnabled = !!GlobalService.getVal('feedbackButtonEnabled');
		// Holds application info
		
		appCtrl.info.hideWorkbench = false;
		appCtrl.info.loaded = false;
		appCtrl.domainList = {};
		appCtrl.projectsList = {};
		appCtrl.info.showStudio = GlobalService.getVal('showStudio');
		appCtrl.info.showLogStatus = GlobalService.getVal('logstatusEnabled');
		appCtrl.currentDomain = GlobalService.getVal('primaryDomain');
		appCtrl.currentDomainFullName = $location.host();
		appCtrl.gbHelpManualLink = GlobalService.getVal('help_link_2');
		appCtrl.appsVersion = GlobalService.getVal('appsVersion');
		appCtrl.info.mdvizFullIframe = true;
		appCtrl.info.explorerDataRestriction = metaDataService.getExplorerDataDuration();
		appCtrl.info.explorerDataRestrictionMsg = '';
		appCtrl.hideInfoPanel = function(){
			return (GlobalService.gbAPI.length > 0);
		};
		if(appCtrl.info.explorerDataRestriction !== ''){
			var msg = GlobalService.getVal('data_restriction_msg');
            appCtrl.info.explorerDataRestrictionMsg = msg.replace("${val}", appCtrl.info.explorerDataRestriction);
		}
		if(GlobalService.getVal('feature_label') === null || GlobalService.getVal('feature_label') === "" || GlobalService.getVal('feature_label').length === 0 || GlobalService.getVal('feature_label')[0] === "" || GlobalService.getVal('feature_label')[0] === "NA"){
		
			appCtrl.nav = {
							navExplorer : GlobalService.getVal('navExplorer'),
							navApps : GlobalService.getVal('navApps'),
							navWorkbench : GlobalService.getVal('navWorkbench'),
							navSupport : GlobalService.getVal('navSupport'),
							navHealth : GlobalService.getVal('navHealth'),
							navDashboards : GlobalService.getVal('navDashboards'),
							navRules : GlobalService.getVal('navRules'),
							navLog : GlobalService.getVal('navLog'),
							navUpload : GlobalService.getVal('navUpload'),
							mdViz: GlobalService.getVal('mdViz')
					};
		
						
	
			}else{
			appCtrl.nav = {
				navExplorer : GlobalService.getVal('feature_label')[0],
				navApps : GlobalService.getVal('navApps'),
				navWorkbench : GlobalService.getVal('feature_label')[1],
				navSupport : GlobalService.getVal('navSupport'),
				navHealth : GlobalService.getVal('feature_label')[2],
				navDashboards : GlobalService.getVal('feature_label')[3],
				navRules : GlobalService.getVal('feature_label')[4],
				navLog : GlobalService.getVal('feature_label')[5],
				navUpload : GlobalService.getVal('feature_label')[6],
				mdViz: GlobalService.getVal('mdViz')
			};
	
			}	
		appCtrl.info.showFeedback = false;

		if (!!feedbackButtonEnabled) {
			appCtrl.info.feedbackPluginOptions = {
				ajaxURL : infoserverDomain + "/feedback/" + manufacturer + "/" + product + "/" + schema,
				html2canvasURL : GlobalService.getVal('html2canvasUrl'),
				initialBox : true,
				postHTML : false,
				initButtonText : "Feedback",
				feedbackButton : ".feedback-button",
				"tpl.description" : "<div id='feedback-welcome' class='card'>                                 <div class='card-title input-field'>                                     <i class='material-icons left prefix feedback-icon'>feedback</i>                                     <div class='prefixed-header'>Feedback</div>                                 </div>                                 <p>Help us improve Glassbeam Studio by reporting issues, providing new feature ideas and/or suggestions to make your experience better.</p>                                 <textarea id='feedback-note-tmp' placeholder='Please add a description to your feedback'></textarea>                                 <p>Next, please help us identify areas of the page related to your description.</p>                                 <button id='feedback-welcome-next' class='btn-flat feedback-next-btn feedback-btn-gray' type='button'>Next</button>                                 <div id='feedback-welcome-error'>Please enter a description.</div>                                 <div class='feedback-wizard-close'>                                     <i class='material-icons waves-effect waves-red'>close</i>                                 </div>                             </div>",
				"tpl.highlighter" : "<div id='feedback-highlighter' class='card'>                                 <div class='card-title input-field'>                                     <i class='material-icons left prefix feedback-icon'>feedback</i>                                     <div class='prefixed-header'>Feedback</div>                                 </div>                                 <p>Please use the 'HIGHLIGHT' and 'BLACKOUT' tools to help us focus on the feature you would like to report.</p>                                 <p>You can drag this dialog box if it overlaps an area you want to focus/hide.</p>                                 <button class='btn waves-effect feedback-sethighlight feedback-active' type='button'>                                     <i class='material-icons left'>highlight</i>                                     <span>Highlight</span>                                 </button>                                 <label class='passive-text'>Highlight areas relevant to your feedback.</label>                                 <button class='btn waves-effect waves-light feedback-setblackout' type='button'>                                     <i class='material-icons left'>content_cut</i>                                     <span>Blackout</span>                                 </button>                                 <label class='passive-text lower'>Black out any personal information.</label>                                 <div class='feedback-buttons'>                                     <button id='feedback-highlighter-next' class='btn-flat feedback-next-btn feedback-btn-gray' type='button'>Next</button>                                     <button id='feedback-highlighter-back' class='btn-flat feedback-back-btn feedback-btn-gray left' type='button'>Back</button>                                 </div>                                 <div class='feedback-wizard-close'>                                     <i class='material-icons waves-effect waves-red'>close</i>                                 </div>                             </div>",
				"tpl.overview" : "<div id='feedback-overview' class='card'>                                 <div class='card-title input-field'>                                     <i class='material-icons left prefix feedback-icon'>feedback</i>                                     <div class='prefixed-header'>Feedback Overview</div>                                 </div>                                 <div id='feedback-overview-description'>                                     <div id='feedback-overview-description-text'>                                         <h3>Description</h3>                                     </div>                                 </div>                                 <div id='feedback-overview-screenshot'>                                     <h3>Screenshot</h3>                                 </div>                                 <div class='feedback-buttons'>                                     <button id='feedback-submit' class='btn-flat feedback-submit-btn feedback-btn-blue' type='button'>Submit</button>                                     <button id='feedback-overview-back' class='btn-flat feedback-back-btn feedback-btn-gray left' type='button'>Back</button>                                 </div>                                 <div id='feedback-overview-error'>Please enter a description.</div>                                 <div class='feedback-wizard-close'>                                     <i class='material-icons waves-effect waves-red'>close</i>                                 </div>                             </div>",
				"tpl.submitSuccess" : "<div id='feedback-submit-success' class='card'>                                 <div class='card-title input-field'>                                     <i class='material-icons left prefix feedback-icon'>feedback</i>                                     <div class='prefixed-header'>Feedback</div>                                 </div>                                     <p>Thank you for your feedback.</p>                                     <p>Please know that we appreciate your effort in helping us improve the application.</p>                                     <button class='btn-flat feedback-close-btn feedback-btn-gray' type='button'>OK</button>                                     <div class='feedback-wizard-close'>                                         <i class='material-icons waves-effect waves-red'>close</i>                                     </div>                                 </div>",
				"tpl.submitError" : "<div id='feedback-submit-error' class='card'>                                 <div class='card-title input-field'>                                     <i class='material-icons left prefix feedback-icon'>feedback</i>                                     <div class='prefixed-header'>Feedback</div>                                 </div>                                 <p>Sadly an error occured while sending your feedback. Please try again.</p>                                 <button class='btn-flat feedback-close-btn feedback-btn-gray' type='button'>OK</button>                                 <div class='feedback-wizard-close'>                                     <i class='material-icons waves-effect waves-red'>close</i>                                 </div>                             </div>"
			};

			$timeout(function() {
				appCtrl.info.showFeedback = true;
			}, 200);
		}

		appCtrl.hideLeftNav = false;
		$scope.firstTimeLoading = false;
		appCtrl.info.mps = manufacturer + "/" + product + "/" + schema;
		appCtrl.info.manufacturer = manufacturer;
		// Holds the greeting message.
		appCtrl.info.greeting = 'Welcome ';
		// Holds the valid logout link
		//check for SSO and normal user and do the necessary changes
		if ($cookies.loginurl) {
			appCtrl.info.logoutLink = $cookies.loginurl;
		} else {
			///appCtrl.info.logoutLink = GlobalService.getVal('redirect_login_url'); //removing gbapps login page to be logouturl 
			appCtrl.info.logoutLink = GlobalService.getVal('session_redirect_url');
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

		// Holds the help guide link for explorer help guide.
		if ($cookies.globalLogin == 0) {
			appCtrl.info.helpLink = GlobalService.getVal('help_link_local');
		} else {
			appCtrl.info.helpLink = GlobalService.getVal('help_link_global');
		}

		// Holds the user name of the user.
		appCtrl.info.user = metaDataService.getUserEmail();
		appCtrl.info.userName = metaDataService.getUserName();
		appCtrl.info.is_external = metaDataService.getUserType();
		if(appCtrl.info.is_external){
		    document.cookie = 'sessionRedirectUrl=' + GlobalService.getVal('session_redirect_url') + ";domain=" + domain + ";path=/";
		}
		appCtrl.info.external_logo = '/apps/app/img/' + metaDataService.getLogo();
		appCtrl.info.external_logourl = 'https://' + metaDataService.getlogourl();
		// appCtrl.info.internal_logo = metaDataService.getInternalLogo() ? '/apps/app/img/' + metaDataService.getInternalLogo() : '/apps/app/img/glassbeam.png';
		// appCtrl.info.showPoweredBy = metaDataService.getInternalLogo() ? true : false;
		var val = metaDataService.getInternalLogo();
		document.cookie = 'internal_logo=' + val + ";domain=" + domain + ";path=/";
		if(val && val !=='NA'){
			appCtrl.info.showPoweredBy = true;
			appCtrl.info.internal_logo = '/apps/app/img/' + metaDataService.getInternalLogo()
		}else{
			appCtrl.info.showPoweredBy = false;
			appCtrl.info.internal_logo = '/apps/app/img/glassbeam.png'
		}
		// Defines whether sso user or not ??
		appCtrl.info.ssoUser = metaDataService.getSsoUser();
		appCtrl.info.infoserverDomain = infoserverDomain;
		appCtrl.info.userOrg = metaDataService.getUserOrg();
		infoserverDomain = appCtrl.info.infoserverDomain;
		// Defines whether File Upload should be old or new
		// Defines the completion of authentication
		appCtrl.info.complete = false;
		appCtrl.info.dashboards_url = GlobalService.getVal('dashboards');
		appCtrl.info.analytics_url = GlobalService.getVal('analytics');
		appCtrl.info.health_check_dashboards_url = GlobalService.getVal('health_check_dashboards');
		//Set for features
		appCtrl.info.features = metaDataService.getFeatures();
		var userInfo = metaDataService.getUser();
		appCtrl.info.powerUser = ((appCtrl.info.features['admin']) ? true : false);
		appCtrl.info.loaded = true;
		var loadPage = metaDataService.getDefaultFeature();
		document.cookie = 'default_feature=' + loadPage + ";domain=" + domain + ";path=/";
		var freshLanding = true;
		var username = userInfo['email'];
		username = username?username.toLowerCase():'';
		if(appCtrl.info.ssoUser){

                var urlParams = new URLSearchParams(window.location.search);
                var mps = urlParams.get('mps');
		if(!$cookies.mps){	
                	document.cookie = "mps=" + mps + ";domain=" + domain + ";path=/";
		   }	
                }


		if (userInfo['show_info'] == true) {
			appCtrl.showHelpModal(true);
		}
		document.cookie = 'username=' + username + ";domain=" + domain + ";path=/";
		
		if (!!appCtrl.info.features['workbench'] && (userInfo['wb_user_name'] == "NA" || !userInfo['wb_user_name'])) {
			// fix for BG-8715
			// appCtrl.info.features['workbench'] = false;
			if (loadPage === 'workbench') {
				loadPage = 'dashboards';
			}
		}

		if (AppService.hideWorkbenchTab()) {
			appCtrl.info.hideWorkbench = true;
			if (loadPage === 'workbench') {
				loadPage = 'dashboards';
			}
		}

		if (!!appCtrl.info.features['workbench']) {
			if(GlobalService.getVal('createDataSourcePemission')){
				document.cookie = 'createDataSource=' + 1 + ";domain=" + domain + ";path=/";	
			}else{
				document.cookie = 'createDataSource=' + 0 + ";domain=" + domain + ";path=/";
			}
			document.cookie = 'gb_hide_options=' + 1 + ";domain=" + domain + ";path=/";
			if (userInfo['email'] !== WorkbenchService.getTableauUser() && userInfo['role'] !== 'glassbeam') {
				document.cookie = 'show_tableau_save_options=' + 0 + ";domain=." + domain + ";path=/";
			} else {
				document.cookie = 'show_tableau_save_options=' + 1 + ";domain=." + domain + ";path=/";
			}
		}

		$window.updateLogiTracking = function() {
        	UserTrackingService.standard_user_tracking('application', appCtrl.nav["navDashboards"], "logi_tracking", JSON.stringify({details: "logi"})).then(handleLogPortalSuccess, handleLogPortalError);
        };
		$window.tableauUserTracking = function() {
        	UserTrackingService.standard_user_tracking('application', appCtrl.nav["navDashboards"], "tableau_tracking", JSON.stringify({details: "tableau"})).then(handleLogPortalSuccess, handleLogPortalError);
        };
		$window.scratchpadUserTracking = function() {
                UserTrackingService.standard_user_tracking('application', 'scratchpad', "scratchpad_tracking", JSON.stringify({details: "scratchpad"})).then(handleLogPortalSuccess, handleLogPortalError);
		};
		
		$window.resizeIframeHeight = function(height){
			appCtrl.info.mdvizFullIframe = false;
			var iframe = $(window.top.document).find("#gb-mdviz-iframe");
			iframe.height(height+'px');
		}
		
		$window.notificationClick = function(data){
			console.log(data)
			//window.open(url, '_blank').focus();
		}
		var firstLoad = true;



		$window.moveToApplication = function(params) {
			if (params.app == "rules_and_alerts") {
				InstanceHandler.setVisible(false);
				//broadcast events with selected bundle
				$scope.$broadcast('bundleListFromLogVault');
				appCtrl.changeCurrentPage(params.app, null, true);
			}else if (params.app == "logvault") {
				LogVaultService.setLoadView(params);
				InstanceHandler.setVisible(false);
				appCtrl.changeCurrentPage(params.app, null, true);
			} else if (params.app == "explorer") {
				ExplorerService.setLoadView(params);
				InstanceHandler.setVisible(false);
				appCtrl.changeCurrentPage(params.app, null, true);
			} else if (params.app == "apps") {
				var result = {
					obs_url : params.observation,
					namespace_id : $filter('bundleName')(params.observation) + '-0',
					serial_num : params.sysid1,
					obs_date : params.obs_date
				};
				if(params['bundle_type']){
					result['bundle_type'] = params['bundle_type'];
				}
				var instance = {
					"type" : 'apps',
					"title" : 'View section/config diff',
					"name" : $filter('bundleName')(result.obs_url),
					"module" : getApplicationForTracking('dashboards'),
					"data" : {
						"result" : result,
						"bundle" : $filter('bundleName')(result.obs_url),
						"sysId" : params.sysid1,
						"sysId2" : params.sysid2,
						'observation' : result.obs_date
					}
				};
				if(params.type == 'savedView'){
					instance.data['view'] = params.view;
				}
				InstanceHandler.addInstance(instance);
				/*var dashboardView = params;
				if (params.sub_app == "section") {
					GlobalService.setVal("default_landing_page", "sectionview");
					GlobalService.setVal("default_landing_label", "Section View");
				} else if (params.sub_app == "config") {
					GlobalService.setVal("default_landing_page", "configdiff");
					GlobalService.setVal("default_landing_label", "Config Diff");
					ConfigDiffService.setLoadView(params);
					$timeout(function() {
						$scope.$broadcast('LoadConfigDiffView');
					}, 1000);
				}
				var instances = InstanceHandler.getInstances();
				var found = false;
				for (var i = 0; i < instances.length; i++) {
					if (instances[i].type == 'apps') {
						InstanceHandler.removeInstance(instances[i]);
						found = true;
						break;
					}
				}*/

				/*$timeout(function() {
					DefaultFilterService.setDefaultSysId({
						sys_id : instance.data["sysId"]
					});
					ConfigDiffService.setClusterId(instance.data["sysId"]);
					var bundle_name = instance.data.result["obs_url"];
					var obs_time = instance.data.result["obs_date"];
					var obs_url = instance.data.result["obs_url"];
					DefaultFilterService.setSelectedObservation({
						'bundle_name' : bundle_name,
						'obs_time' : obs_time,
						'obs_url' : obs_url
					});
					DefaultFilterService.setDefaultObservation({
						'bundle_name' : bundle_name,
						'obs_time' : obs_time,
						'obs_url' : obs_url
					});
					NavigationService.setUrl(GlobalService.getVal("default_landing_page"));
					MenuService.setCurrentLabel(GlobalService.getVal("default_landing_label"));
					SectionsMetaService.clearSectionView();
					//clear selected section
	                var sections = ConfigDiffService.getSections();
	                for (var i in sections) {
	                    sections[i]['selected'] = false;
	                    sections[i]['default'] = false;
	                    sections[i]['count'] = 2;
	                    ConfigDiffService.resetFilter(sections[i]);
	                }
	                ConfigDiffService.setSections(sections);
					ConfigDiffService.setAppliedView(null);
					UserTrackingService.getAllConfig().then(function(response) {
						var responseData = response.data.Data;
						if(AppService.isGbStudioApp()) {
				            responseData['config'] = !!responseData['default_config'] ? responseData['default_config'] : responseData['config'];
				        }
						metaDataService.setGbConfig(responseData['config']);
						InstanceHandler.addInstance(instance);
						var loadTimeout = !!firstLoad || params.sub_app == 'config' ? 5000 : 0;
						firstLoad = false;
						$timeout(function() {
							SectionsMetaService.getS2().then(function(response) {
								DefaultFilterService.setSubSys(response.data.Data);
								if(params.sub_app == 'section') {
									if(dashboardView.type == "custom") {
					                    var view = dashboardView.view;
					                    view.view_name = "Select View";
					                    $timeout(function() {
					                    	SectionsMetaService.applyView(view);
						                    SectionsMetaService.setSelectedView(view);
						                    SectionsMetaService.setSectionLoading(false);
					                    }, loadTimeout);

					                } else if (dashboardView.type == "savedView") {
					                    SectionsMetaService.getAllViews().then(function(response) {
					                        var view = $filter('filter')(response.data.Data, {view_name: dashboardView.view}, true) || [];
					                        if(view.length == 1) {
					                            $timeout(function() {
					                            	SectionsMetaService.loadView(view[0])
									                    .then(function (response) {
									                        SectionsMetaService.setSectionLoading(false);
									                        var appliedView;
									                        appliedView = response.data.Data[0];
									                        if (!!appliedView) {
									                            SectionsMetaService.applyView(appliedView);
									                            SectionsMetaService.setSelectedView(view[0]);
									                            // Applying the view that is fetched.
									                            UserTrackingService.standard_user_tracking(getApplicationForTracking('logvault'), 'Section View', 'Apply View', "{\'" + view[0]['view_name'] + "\'}")
									                                .then(successHandler, handleLogPortalError);
									                        } else {
									                            SectionsMetaService.setSectionLoading(false);
									                            ModalService.alertBox({msg: 'No Applied View'});
									                        }
									                    }, handleLogPortalError);
					                            }, loadTimeout);
					                        } else {
					                            SectionsMetaService.setSectionLoading(false);
					                            ModalService.alertBox({msg: "View not found"});
					                        }
					                    }, function(response) {
					                        SectionsMetaService.setSectionLoading(false);
					                        ModalService.alertBox({msg: "View not found"});
					                    });
					                }
								}
							}, function(response) {
								DefaultFilterService.setSubSys([]);
							});
						}, 500);
					}, function() {
					});
				}, 500);*/
			}
		};

		// Check whether a given feature is enabled or not
		$scope.isFeatureEnable = function(feature) {
			return appCtrl.info.features[feature];
		};
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
		//Read value from url if this is new tab view for section viewer and config diff
		var tabview = $localStorage.tabview;
		// $scope.getQueryVariable('tabview');
		var searchView = $scope.getQueryVariable('Log Bundle');
		if (tabview) {
			loadPage = "apps";
			freshLanding = false;
			var selsysid = $scope.getQueryLocalstorage(tabview, 'selsysid');
			var defaultSysId = eval("(" + selsysid + ")");
			DefaultFilterService.setDefaultSysId(defaultSysId);
			var selobservation = $scope.getQueryLocalstorage(tabview, 'selobservation');
			var selectedObservation = eval("(" + selobservation + ")");
			DefaultFilterService.setSelectedObservation(selectedObservation);

			var selobsgroup = $scope.getQueryLocalstorage(tabview, 'selobsgroup');
			DefaultFilterService.setSelectedObsGrp(selobsgroup);

			var selendcustomer = $scope.getQueryLocalstorage(tabview, 'selendcustomer');
			DefaultFilterService.setDefaultEndCust(eval("(" + selendcustomer + ")"));
			var tabType = $scope.getQueryLocalstorage(tabview, 'tabview')
			if (tabType === 'config') {
				GlobalService.setVal('default_landing_label', 'Config Diff');
				GlobalService.setVal('default_landing_page', 'configdiff');
			} else {
				GlobalService.setVal('default_landing_label', 'Section View');
				GlobalService.setVal('default_landing_page', 'sectionview');
			}
			var defaultObservation = defaultSysId["observations"][0];
			DefaultFilterService.setDefaultObservation(defaultObservation);
			//clear local storage one read it
			$localStorage.$reset();

		} else if (searchView) {
			loadPage = "explorer";
			freshLanding = false;
			var bundleData = {};

			bundleData['Log Bundle'] = searchView;
			bundleData['bundlename'] = $scope.getQueryVariable('bundlename');
			bundleData['bundle_id'] = $scope.getQueryVariable('bundle_id');
			ExplorerService.setBundleData(bundleData);
		}
		$scope.$on('changePageEvent', function(event, page) {
			appCtrl.changeCurrentPage(page, null, true);
		});
		// Changes the current page
		appCtrl.changeCurrentPage = function(page, bundleName, reload) {
			var domain = GlobalService.getVal('primaryDomain');
			document.cookie = 'currentApp=' + page + ";domain=" + domain + ";path=/";
			// $cookies.currentApp = page;
			if(sessionStorage.getItem("dash_mode") == "true"){
				if(metaDataService.getFeatures().dashboards!=undefined && metaDataService.getFeatures().dashboards==true){
					page = "dashboards";
				}else {
					sessionStorage.setItem("dash_mode","false");
					var adminEmail = GlobalService.getVal('dashmodeadminemail');
					ModalService.alertBox({msg : 'Error! You do not have access to dashboard page. Please contact <a href="mailto:'+adminEmail+'">'+adminEmail+'</a>.'});
				}
			}
			if(sessionStorage.getItem("clin_mode") == "true"){
				if(metaDataService.getFeatures().healthcheck!=undefined && metaDataService.getFeatures().healthcheck==true){
					page = "healthcheck";
				}else {
					sessionStorage.setItem("clin_mode","false");
					var adminEmail = GlobalService.getVal('dashmodeadminemail');
					ModalService.alertBox({msg : 'Error! You do not have access to healthcheck page. Please contact <a href="mailto:'+adminEmail+'">'+adminEmail+'</a>.'});
				}
			}
			metaDataService.setCurrentPage(page);
			if (bundleName) {
				reload = true;
				if (!bundleName.page) {
					DefaultFilterService.setLoadPage('sectionview');
				} else {
					if (bundleName.page == "section") {
						DefaultFilterService.setLoadPage('sectionview');
					} else if (bundleName.page == "config") {
						DefaultFilterService.setLoadPage('configdiff');
					}
				}

				DefaultFilterService.setLoadSysId(bundleName.sysid);
				DefaultFilterService.setLoadObservation(bundleName.obs_url);
				DefaultFilterService.setSelectedObsGrp('Last N');
				NavigationService.setUrl(GlobalService.getVal('default_landing_label'));
				if (MenuService.getAppsLoaded()) {
					if (!bundleName.page) {
						NavigationService.setUrl('sectionview');
						MenuService.setCurrentLabel('Section View');
					} else {
						if (bundleName.page == "section") {
							NavigationService.setUrl('sectionview');
							MenuService.setCurrentLabel('Section View');
						} else if (bundleName.page == "config") {
							NavigationService.setUrl('configdiff');
							MenuService.setCurrentLabel('Config Diff');
						}
					}
				}
				// if(angular.element(document.getElementById("sysIdDiv")).scope()) {
				// angular.element(document.getElementById("sysIdDiv")).scope().init();
				// }
				SectionsMetaService.setReady(false);
				var details = {
					'System ID' : bundleName.sysid,
					'Bundle Name' : $filter('bundleName')(bundleName.obs_url)
				};
				UserTrackingService.standard_user_tracking(getApplicationForTracking('logvault'), getApplicationForTracking('logvault'), "Switch to " + getApplicationForTracking('apps'), JSON.stringify(details)).then(handleLogPortalSuccess, handleLogPortalError);
			} else if (!freshLanding) {
				if (!!ExplorerService.getBundleData()) {
					UserTrackingService.standard_user_tracking(getApplicationForTracking('logvault'), getApplicationForTracking('logvault'), "Switch to " + getApplicationForTracking('explorer'), JSON.stringify(ExplorerService.getBundleData())).then(handleLogPortalSuccess, handleLogPortalError);
				} else {
					UserTrackingService.standard_user_tracking(getApplicationForTracking(page), getApplicationForTracking(page), "landing", JSON.stringify({})).then(handleLogPortalSuccess, handleLogPortalError);
				}
			}
			appCtrl.info.current = page;
			// if (page === 'dashboards') {
			// 	WorkbenchService.updateWorkbooks();
			// }
			//Show page loader
			angular.element(document.getElementById("gb-tab-loader")).css('display', 'block');
			//hide page gb-apps-body
			angular.element(document.getElementById("gb-tab-cntr")).css('display', 'none');
			$scope.$broadcast('AppLoadEvent-' + page, reload);
		};
		// Shows the modal for file upload.
		appCtrl.showUpload = function() {
			ErrorService.clearErrors('fileupload');
			UserTrackingService.getAllConfig().then(function(response) {
				// if (response.data.Msg.match(/timeout/)) {
				// $window.location.href = GlobalService.getVal('logout_url');
				// }

				if (!userInfo['is_external']) {
					$modal.open({
						templateUrl : 'partials/upload_popup.html',
						windowClass : false,
						backdrop : 'static',
						controller : 'FileUploadController as fileUploadCtrl',
						resolve : {
							fileUploadData : function() {
								return response.data.Data.file_upload_config;
							}
						}
					});
				} else {
					AppService.setFileUploadData(response.data.Data.file_upload_config);
					appCtrl.changeCurrentPage('file_upload');
				}

				UserTrackingService.standard_user_tracking(appCtrl.nav.navUpload, appCtrl.nav.navUpload, 'View', "{\'\'}").then(handleLogPortalSuccess, handleLogPortalError);
			}, handleLogPortalError);
		};

		appCtrl.showScratchpad = function() {
			appCtrl.info.mdvizFullIframe = true;
			metaDataService.setCurrentPage('scratchpad');
			appCtrl.info.current = 'scratchpad';
		};

		appCtrl.reloadIframe = function(){
			document.getElementById('gb-mdviz-iframe').src = './MDViz/index.html';
			appCtrl.info.mdvizFullIframe = true;
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

		if (loadPage == 'file_upload') {
			appCtrl.showUpload();
		} else {
			appCtrl.changeCurrentPage(loadPage);
		}

		if (freshLanding) {
			var module = "";
			if (loadPage == "apps") {
				module = GlobalService.getVal('default_landing_label');
			} else if (loadPage == "rules_and_alerts") {
				module = "Rules list";
			} else {
				module = getApplicationForTracking(loadPage);
			}
			delete $cookies.prevApplication;
			freshLanding = false;
			UserTrackingService.standard_user_tracking(getApplicationForTracking(loadPage), module, 'Default landing', "{\'\'}").then(handleLogPortalSuccess, handleLogPortalError);
		}

		GlobalService.setVal('features', appCtrl.info.features);
		appCtrl.info.complete = true;
		// Stores whether session is timed out or not
		appCtrl.info.sessionTimedOut = false;
		// Returns true or false based on whether or not to show the help link
		appCtrl.showHelp = function() {
			var bool = false;
			if (appCtrl.info.current === 'explorer' || appCtrl.info.current === 'apps' || appCtrl.info.current === 'dashboards' || appCtrl.info.current === 'logvault') {
				bool = true;
			}
			return bool;
		};

		appCtrl.logShowHelp = function() {
			UserTrackingService.standard_user_tracking(getApplicationForTracking(appCtrl.info.current), getApplicationForTracking(appCtrl.info.current), 'Show help', "{}").then(handleLogPortalSuccess, handleLogPortalError);
		};
		//HACK
		AppService.setAuthorized(true);
		AppService.setInfoServerUp(true);
		appCtrl.complete = true;
		appCtrl.dashboards_url = GlobalService.getVal('dashboards');
		appCtrl.analytics_url = GlobalService.getVal('analytics');

		//Get product list to display on man page
		AppService.getUserDomain(userInfo['role']).then(function(response) {
			if (response.data.Data) {
				var tempDomains = response.data.Data.domains;
				var domainList = {};
				angular.forEach(tempDomains, function(value, key) {
					if (!!key.length && key != "-") {
						domainList[key] = value;
					}
				});
				appCtrl.domainsCount = Object.keys(domainList).length;
				var realm_mps = response.data.Data.mps_uidomain;

				var filteredList = {};
				//filter this list with current product
				//var currentProduct = metaDataService.getManufacturer();
				//if(currentProduct) {
				for (var key in domainList) {
					var mps = domainList[key];
					/* var product = "";
					if(mps.indexOf(":") != -1){
					mps = mps.split(":");
					if(mps){
					product = mps[1];
					}
					}else if(mps.indexOf("/") != -1){
					mps = mps.split("/");
					if(mps){
					product = mps[1];
					}

					}*/
					//if(currentProduct == product) {
					if (appCtrl.info.mps == mps && !AppService.isGbStudioApp()) {
						appCtrl.currentProduct = key;
						//filteredList[key] = domainList[key];
					}
					if (userInfo['mps_def'] == mps) {
						appCtrl.defaultProduct = key;
					}
					/* else
					{
					filteredList[key] = domainList[key];
					} */
					//  }
				}
				appCtrl.domainList = domainList;
				appCtrl.realm_mps = realm_mps;
			}
		}, function(error) {
				appCtrl.domainList = [];
				appCtrl.realm_mps = '';
		});

		if (GlobalService.getVal('showStudio')) {
			appCtrl.projectsList = GlobalService.getVal('projectsList');
			angular.forEach(appCtrl.projectsList, function(value, key) {
				if (AppService.isGbStudioApp() && key == GlobalService.getVal('projectname')) {
					appCtrl.currentProduct = key;
				}
			});
		}

		appCtrl.showMultipleDomainList = function() {
			var productKeys = Object.keys(appCtrl.domainList) || [];
			var projectKeys = Object.keys(appCtrl.projectsList) || [];

			if ((productKeys.length + projectKeys.length) > 0) {
				return true;
			}
			return false;
		}
		appCtrl.changeProduct = function(mps, url) {
			var url = appCtrl.realm_mps[mps];
			//var curUrl = $location.absUrl().replace(/\?.*/, '');
			var curUrl = $location.absUrl();
			if(appCtrl.info.ssoUser){
				curUrl = $location.absUrl().replace(/\?.*/, '');
			}
			if (mps) {
				document.cookie = "mps=" + mps + ";domain=" + appCtrl.currentDomain + ";path=/";
				if (!!userInfo['show_info']) {
					$localStorage.hideModal = true;
				}
				UserTrackingService.standard_user_tracking(getApplicationForTracking(appCtrl.info.current), getApplicationForTracking(appCtrl.info.current), 'Switch product', JSON.stringify({
					'URL' : url,
					'MPS' : mps
				})).then(handleLogPortalSuccess, handleLogPortalError);
				$timeout(function() {
					if(appCtrl.info.ssoUser){
						$window.open(curUrl.replace($location.host(), url) + '?mps=' + mps, '_self');
					}else{
						$window.open(curUrl.replace($location.host(), url), '_self');
					}
				}, 200);
			}
		};
		appCtrl.changeProject = function(mps, project) {
			var curUrl = $location.absUrl().replace(/\?.*/, '');
			var url = $location.absUrl().replace(/\?.*/, '') + "?mps=" + mps + "&projectname=" + project;
			if (mps) {
				$timeout(function() {
					$window.open(url.replace($location.host(), GlobalService.getVal('role_details')['mps_uidomain'][GlobalService.getVal("gb_studio_apps_realm")]), '_self');
				}, 200);
			}
		};
		appCtrl.trackFeedback = function() {
			UserTrackingService.standard_user_tracking(getApplicationForTracking(appCtrl.info.current), getApplicationForTracking(appCtrl.info.current), 'Feedback', JSON.stringify({})).then(handleLogPortalSuccess, handleLogPortalError);
		};
		appCtrl.setDefaultDomain = function(mps, url) {
			var newUrl = appCtrl.realm_mps[mps];
			var urlDef = $window.location.pathname;
			urlDef = urlDef.replace(/^\//, "");
			var param = {
				realm_def : newUrl,
				url_def : urlDef,
				mps_def : mps
			};
			AppService.setDefaultDomain(param).then(function(response) {
				ModalService.alertBox({
					msg : 'Default domain set as \'' + url + '\''
				});
				appCtrl.defaultProduct = url;
			}, function(error) {
				ModalService.alertBox({
					msg : 'Failed!'
				});
			});
		};
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

		// Returns the url for given feature
		appCtrl.getURL = function(key) {
			if (appCtrl.info.current == key && !appCtrl.info[key]) {
				appCtrl.info[key] = GlobalService.getVal(key);
			}
			return appCtrl.info[key];
		};
		// Defines whether the instance viewer is full screen or not.
		appCtrl.instanceViewerFullscreen = function() {
			return (InstanceHandler.isVisible());
		};

		// Defines whether instance viewer is active or not.
		appCtrl.isThereInstanceViewer = function() {
			return (InstanceHandler.getNumberOfInstances());
		};

		appCtrl.changePassword = function() {
			$modal.open({
				templateUrl : 'partials/changepassword.html',
				controller : 'ChangePasswordCtrl as changePswdCtrl',
				resolve : {
					application : function() {
						return getApplicationForTracking(appCtrl.info.current);
					}
				}
			})
		};
		appCtrl.loadGBStudio = function() {
			if (GlobalService.getVal('studioDown')) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[5]);
				ModalService.alertBox({
					msgKey : 'studio_down_message'
				});
			} else {
				$window.open(GlobalService.getVal('gb_studio_protocol') + "://" + GlobalService.getVal('studioSPLURL'), "gbstudio_tab");
			}
		};

		appCtrl.loadAdminConsole = function() {
			var adminUrl = GlobalService.getVal('umsDomain').replace('/v1','');
                        document.cookie = "adminClick=1;domain=" + domain + ";path=/";
			$window.open(adminUrl);
		};

		appCtrl.loadLogStatusConsole = function() {
			$window.open(GlobalService.getVal('logStatusUrl')+"?"+milliseconds, "logstatus_tab");
		};

		appCtrl.createRuleFromText = function() {
			InstanceHandler.setVisible(false);
			RulesService.loadExplorerRules();
			appCtrl.changeCurrentPage('rules_and_alerts');
		};
		$interval(function(){
			if(AppService.getRequestFromApps()){
				appCtrl.createRuleFromText();
				AppService.setRequestFromApps(false);
			}
		}, 1000);
		$scope.createRuleFromExplorer = function() {
			appCtrl.createRuleFromText();
		};

		function handleLogPortalSuccess() {

		}

		function handleLogPortalError(response) {
			if (!appCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
				appCtrl.info.sessionTimedOut = true;
				ModalService.sessionTimeout();
				return;
			}
		}

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
			var adminUrl = GlobalService.getVal('umsDomain').replace('/v1','');
                        //$window.open(adminUrl,'_self');

			//Redirect to login page
			
			$window.location.href = cookieLogoutUrl;

			//$window.open(cookieLogoutUrl, '_self');
			// $window.location.href = GlobalService.getVal('logout_url');
		}
		appCtrl.APICallWait = function() {
			GlobalService.APICallWait();
		};
		appCtrl.cancelHTTPCall = function() {
			//$window.location.reload();
			GlobalService.APICallCancel();
			appCtrl.showGlobalNotification = true;
		};
		appCtrl.closeGlobalNotification = function(){
			appCtrl.showGlobalNotification = false;
		};

		appCtrl.openSystemInfoPopup = function(){
			$modal.open({
				templateUrl : 'partials/systemInfo.html',
				controller : 'SystemInfoCtrl',
				resolve : {
					application : function() {
						return getApplicationForTracking(appCtrl.info.current);
					}
				},
				size: 'lg',
				backdrop: 'static'
			})
		}

		//Hide page loader
		if(sessionStorage.getItem("dash_mode") != "true"){
			document.getElementById("gb-full-page-loader").style.display = 'none';
		}
		//remove bpdytransparent from body
		document.body.className = document.body.className.replace('gb-bg-trasparent', '')
		//show page gb-apps-body
		document.getElementById("gb-apps-body").style.display = 'block';

		// BO: Inline help code
		$scope.enableContextualHelp = false;
		
		$scope.loadHelpContent = function(){
			$scope.enableContextualHelp = !$scope.enableContextualHelp;
			if($scope.enableContextualHelp){
				gbInlineHelp.showContextualIcon();
			}else{
				gbInlineHelp.hideContextualIcon();
			}
		}
		var rules_and_alerts_templates_inline_help = ['rules_list', 'add_rule', 'add_edit_template', 'add_edit_API_template', 'api_admin_config'];
		$scope.$on("$includeContentLoaded", function(event, templateName){
			var template = templateName.split('/');
			var page = template[template.length - 1].split(".")[0];
			if(rules_and_alerts_templates_inline_help.indexOf(page) >= 0 && $scope.enableContextualHelp){
				$timeout(function() {
					gbInlineHelp.resetRulesInlineHelp();
					gbInlineHelp.showContextualIcon();
					return;
				});
			}else{
				$timeout(function() {
					if($scope.enableContextualHelp){
						gbInlineHelp.showContextualIcon();
					}
				});
			}
		});

		// EO: Inline help code

		

		
		
		//service worker reristration
		appCtrl.info.currentToken = '';
		if ('serviceWorker' in navigator && 'PushManager' in window) {
			//console.log('Service Worker and Push is supported');
			var swRegistration = null;
			//initialize firebase app
			firebase.initializeApp(metaDataService.getFirebaseConfig().firebaseConfig);

			//initialize firebase messenging
			var messaging = firebase.messaging();

			//register the service worker
			navigator.serviceWorker.register("../../../../firebase-messaging-sw.js").then(function (swReg) {
				//console.log('Service Worker is registered', swReg);
				swRegistration = swReg;

				//check for the notification status
				if (Notification.permission == "default" || Notification.permission == "granted") {
					messaging.getToken({ vapidKey: metaDataService.getFirebaseConfig().vapidKey, serviceWorkerRegistration: swRegistration })
						.then(function (currentToken) {
							appCtrl.info.currentToken = currentToken;
							if (currentToken) {
								//console.log('current token for client: ', currentToken);
								appCtrl.addPushToken();
							} else {
								//console.log('No registration token available. Request permission to generate one.');

								// shows on the UI that permission is required 
							}
						}).catch(function (err) {
							//console.log('An error occurred while retrieving token. ', err);
							// catch error while creating client token
						});
				}
				//appCtrl.initializeFirebase(swRegistration)
			})
				.catch(function (error) {
					//console.error('Service Worker Error', error);
				});
			messaging.onMessage(function (payload) {
				console.log('foreground notification received. ', payload);

				//sampleNotification data
				// {
				// 	"data": {
				// 	  "rule_name": "Rule_1605009445897",
				// 	  "serial_number": "CT50059"
				// 	},
				// 	"from": "238274278844",
				// 	"priority": "normal",
				// 	"notification": {
				// 	  "title": "GDI rule triggered Subscription template 7.3",
				// 	  "body": "Updated-The rulename Rule_1605009445897 with name GDI notification rule & with priority EMERGENCY got triggered"
				// 	}
				//   }

				var notificationOptions = {
					body: payload.notification.body,
					icon: '/apps/dist/img/clinsight_resize2.png',
					data: payload.data
				};
				swRegistration.showNotification(payload.notification.title, notificationOptions);

				//broadcast event to healthcheck to call update the unread count
				if (appCtrl.info.current == 'healthcheck') {
					$timeout(function () {
						$scope.$broadcast('updateUnreadCount');
					}, 1000);
				}

			});
		} else {
			console.log('Push messaging is not supported');
			
		}
	});

	

}])

// ChangePasswordCtrl - Responsible for everything related to changing the password.
.controller('ChangePasswordCtrl', ['$modalInstance', 'PasswordService', 'GlobalService', 'metaDataService', 'UserTrackingService',
function($modalInstance, PasswordService, GlobalService, metaDataService, UserTrackingService) {
	var changePswdCtrl = this;
	changePswdCtrl.form = {
		visible : true,
		message : "",
		character_limit : GlobalService.getVal('passwd_maxlimit')
	};
	changePswdCtrl.getValue = function(key) {
		return GlobalService.getVal(key);
	}
	// Returns the whether the two new passwords matches each other or not.
	changePswdCtrl.matchPassword = function() {
		return changePswdCtrl.form.new_passwd !== changePswdCtrl.form.renew_passwd;
	};
	changePswdCtrl.maxLimit = function() {
		if (changePswdCtrl.form.new_passwd != undefined && changePswdCtrl.form.renew_passwd != undefined) {
			return changePswdCtrl.form.new_passwd.length > changePswdCtrl.form.character_limit || changePswdCtrl.form.renew_passwd.length > changePswdCtrl.form.character_limit;
		} else {
			return true;
		}

	};
	changePswdCtrl.checkPasswordValid = function(){
		var regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/;
        return regex.test(changePswdCtrl.form.new_passwd);
	}
	// Submits the form for changing the password.
	changePswdCtrl.submitForm = function(form) {
		if (form.userForm.$valid && !changePswdCtrl.matchPassword() && !changePswdCtrl.maxLimit() && changePswdCtrl.checkPasswordValid()) {
			// XHR to change the password.
			PasswordService.change(changePswdCtrl.form.new_passwd, metaDataService.getUserEmail()).then(successHandler, errorHandler);
		}
	};
	// Ok button click handler to close the modal.
	changePswdCtrl.ok = function() {
		$modalInstance.close("Ok");
	};
	// Cancel button click handler to close the modal.
	changePswdCtrl.cancel = function() {
		$modalInstance.dismiss("Dismissed");
	};
	function successHandler(response) {
		var application="ChangePassword";
		if (response.data == 'ERR_6') {
			changePswdCtrl.form.message = GlobalService.getVal('invalid_old_passwd');
		} else {
			changePswdCtrl.form.message = GlobalService.getVal('passwd_change_success');
			UserTrackingService.standard_user_tracking(application, application, "Change Password", "{}");
		}
		changePswdCtrl.form.visible = false;
	}

	function errorHandler(error) {
		changePswdCtrl.form.visible = false;
		changePswdCtrl.form.message = GlobalService.getVal('passwd_change_failure');
	}

}]).controller('SessionController', ['$modalInstance', 'GlobalService', 'AppService',
function($modalInstance, GlobalService, AppService) {
	var sessionCtrl = this;
	sessionCtrl.msg = GlobalService.getVal('session_timeout_msg');
	sessionCtrl.ok = function() {
		sessionTimeout();
		$modalInstance.close("Ok");
	};
	function sessionTimeout() {
		AppService.logoutSessionTimeout();
	}

	function badrequest() {

	}

}]).controller('AbortUploadController', ['$modalInstance', 'GlobalService',
function($modalInstance, GlobalService) {
	var abortCtrl = this;
	abortCtrl.msg = GlobalService.getVal('abort_upld');
	abortCtrl.hideAbortUpload = function() {
		$modalInstance.dismiss("cancel");
	};
	abortCtrl.abortUpload = function() {
		$modalInstance.close("ok");
	};
}]).controller('AlertController', ['$modalInstance', 'GlobalService', 'items', '$sce',
function($modalInstance, GlobalService, items, $sce) {
	var alertCtrl = this;
	if (items.msg) {
		alertCtrl.msg = items.msg
	} else {
		alertCtrl.msg = GlobalService.getVal(items.msgKey);
	}
	alertCtrl.ok = function() {
		$modalInstance.close("ok");
	};
	alertCtrl.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};
}]).controller('ConfirmationController', ['$modalInstance', 'GlobalService', '$sce', 'titleObj', 'msgObj', 'successText', 'cancelText',
function($modalInstance, GlobalService, $sce, titleObj, msgObj, successText, cancelText) {
	var confirmationCtrl = this;
	if (titleObj.msg) {
		confirmationCtrl.title = titleObj.msg
	} else {
		confirmationCtrl.title = GlobalService.getVal(titleObj.msgKey);
	}
	if (msgObj.msg) {
		confirmationCtrl.msg = msgObj.msg
	} else {
		confirmationCtrl.msg = GlobalService.getVal(msgObj.msgKey);
	}
	confirmationCtrl.ok = function() {
		$modalInstance.close("ok");
	};
	confirmationCtrl.successText = successText;
	confirmationCtrl.cancelText = cancelText;
	confirmationCtrl.cancel = function() {
		$modalInstance.dismiss("cancel");
	};
	confirmationCtrl.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};
}]).controller('FileUploadController', ['$modalInstance', 'FileUploader', 'GlobalService', 'ErrorService', 'ModalService', 'UserTrackingService', 'AppService', '$filter', 'fileUploadData', '$interval', '$sce',
function($modalInstance, FileUploader, GlobalService, ErrorService, ModalService, UserTrackingService, AppService, $filter, fileUploadData, $interval, $sce) {
	var fileUploadCtrl = this;
	fileUploadCtrl.uploadForm = {};
	fileUploadCtrl.info = {};
	fileUploadCtrl.fadeUploadModal = false;
	fileUploadCtrl.info.showCancelAllConfirmBox = false;
	fileUploadCtrl.info.mandatoryLabel = GlobalService.getVal('fileupload_mandatory_label');
	fileUploadCtrl.info.showMandatoryLabel = false;
	if (!fileUploadData || fileUploadData === 'NA') {
		AppService.hidePanelLoading();
		fileUploadData = AppService.getFileUploadData();
	}
	fileUploadCtrl.info.uploadData = fileUploadData.json_form ? JSON.parse(fileUploadData.json_form) : fileUploadData.json_form;
	for (i in fileUploadCtrl.info.uploadData) {
                if(fileUploadCtrl.info.uploadData[i]['mandatory'])
                        fileUploadCtrl.info.showMandatoryLabel = true;
        }

	fileUploadCtrl.info.uploadDataMaxSize = fileUploadData.max_upload_size;
	var infoserverDomain = GlobalService.getVal('infoserverDomain');
	var manufacturer = GlobalService.getVal('manufacturer');
	var product = GlobalService.getVal('product');
	var schema = GlobalService.getVal('schema');
	// Uploader object for file upload.
	fileUploadCtrl.info.uploader = new FileUploader({
		url : infoserverDomain + '/fileupload/uploadfile/' + manufacturer + '/' + product + '/' + schema,
		queueLimit : GlobalService.getVal('file_upld_limit'),
		filters : [{
			name : 'extensionFilter',
			fn : function(item) {
				var match = false,
				    i,
				    extList = fileUploadData.allowed_extension.split(', ');
				for (i in extList) {
					if (item.name.endsWith(extList[i])) {
						match = true;
					}
				}

				return match;
			}
		}],
		onAfterAddingFile : function(item) {
			checkSizeLimit();
		},
		onWhenAddingFileFailed : function(item, filter, options) {
			if (filter.name == 'queueLimit') {
				ErrorService.setError('fileupload', GlobalService.getVal('file_upld_limit_exceeded'));
			} else {
				ErrorService.setError('fileupload', GlobalService.getVal('file_upld_unsupported'));
			}
		},
		onErrorItem : function(item, response, status, headers) {
			if (!fileUploadCtrl.info.sessionTimedOut && response && response.hasOwnProperty('Msg') && response.Msg.match(/timeout/)) {
				if (!!$modalInstance) {
					$modalInstance.close("Ok");
				}
				fileUploadCtrl.info.sessionTimedOut = true;
				ModalService.sessionTimeout();
				return;
			}
		},
		onBeforeUploadItem : function(item) {
			var t_obj;
			angular.forEach(fileUploadCtrl.uploadForm, function(value, key) {
				t_obj = {};
				t_obj[key] = value.nodeVal;
				item.formData.push(t_obj);
				// console.info(item.formData);
			});
			fileUploadCtrl.info.uploadDone = false;
		},
		onCompleteAll : function() {
			var i,
			    success = false,
			    failure = false,
			    cancel = false,
			    details;
			details = {};
			for (i in fileUploadCtrl.uploadForm)
			if (fileUploadCtrl.uploadForm.hasOwnProperty(i)) {
				details[i] = fileUploadCtrl.uploadForm[i]['nodeVal'];
			}
			details['files'] = [];
			for (i in fileUploadCtrl.info.uploader.queue) {
				if (fileUploadCtrl.info.uploader.queue[i].isSuccess) {
					success = true;
					details['files'].push(fileUploadCtrl.info.uploader.queue[i]['file']['name']);
				} else if (fileUploadCtrl.info.uploader.queue[i].isCancel) {
					cancel = true;
				} else {
					failure = true;
				}
			}

			if (details['files'].length > 0) {
				UserTrackingService.standard_user_tracking(GlobalService.getVal('navUpload'), GlobalService.getVal('navUpload'), 'Upload', "{\'" + JSON.stringify(details) + "\'}").then(handleLogPortalSuccess, handleLogPortalError);
			}

			checkSizeLimit();
			if ((success && cancel && failure) || (success && cancel && !failure)) {
				ErrorService.setError('fileupload', GlobalService.getVal('file_upld_partial'));
			} else if (!success && cancel && !failure) {
				ErrorService.setError('fileupload', GlobalService.getVal('file_upld_cancel'));
			} else if (success && !cancel && !failure) {
				fileUploadCtrl.info.uploadDone = true;
			} else if ((!success && !cancel && failure) || (!success && cancel && failure) || (success && !cancel && failure)) {
				ErrorService.setError('fileupload', GlobalService.getVal('file_upld_fail'));
			} else {

			}
		}
	});
	
	fileUploadCtrl.beginUpload = function() {
		var i,
		    empty,
		    upload = true;
		checkSizeLimit();
		for (i in fileUploadCtrl.info.uploadData) {
			try {
				if (!!fileUploadCtrl.info.uploadData[i]['required']) {
					if (!!fileUploadCtrl.info.uploadData[i]['mandatory']) {
						if (fileUploadCtrl.uploadForm[fileUploadCtrl.info.uploadData[i]['name']].nodeVal == undefined || fileUploadCtrl.uploadForm[fileUploadCtrl.info.uploadData[i]['name']].nodeVal == "") {
							fileUploadCtrl.uploadForm[fileUploadCtrl.info.uploadData[i]['name']].error = true;
							empty = true;
						} else {
							fileUploadCtrl.uploadForm[fileUploadCtrl.info.uploadData[i]['name']].error = false;
						}
					}
				}
			} catch (e) {
				fileUploadCtrl.uploadForm[fileUploadCtrl.info.uploadData[i]['name']] = {};
				fileUploadCtrl.uploadForm[fileUploadCtrl.info.uploadData[i]['name']].error = true;
				empty = true;
			}

		}
		if (empty)
			upload = false;
		if (ErrorService.getErrors('fileupload').length == 0 && upload) {
			fileUploadCtrl.info.uploader.uploadAll();
		}
	};
	// Clears the upload queue
	fileUploadCtrl.removeAll = function() {
		fileUploadCtrl.info.uploadDone = false;
		fileUploadCtrl.info.uploader.clearQueue();
		ErrorService.clearErrors('fileupload');
	};
	// fileUploadCtrl.cancelAllUploads = function () {
	// var items = fileUploadCtrl.info.uploader.getNotUploadedItems().filter(function (item) {
	// return item.isUploading;
	// });
	// if (items.length > 0) {
	// fileUploadCtrl.info.showCancelAllConfirmBox = true;
	// }
	// }
	// fileUploadCtrl.cancelAllUploadsYES = function () {
	// fileUploadCtrl.info.showCancelAllConfirmBox = false;
	// cancelAll();
	// }
	// fileUploadCtrl.cancelAllUploadsNO = function () {
	// fileUploadCtrl.info.showCancelAllConfirmBox = false;
	// }
	// Removes the file from the queue.
	fileUploadCtrl.removeFile = function(item) {
		item.remove();
		checkSizeLimit();
		if (fileUploadCtrl.info.uploader.queue.length == 0) {
			fileUploadCtrl.info.uploadDone = false;
		}
	};
	// Returns all the file upload errors
	fileUploadCtrl.getUploadErrors = function() {
		return ErrorService.getErrors('fileupload');
	};
	fileUploadCtrl.closeUploadModal = function() {
		if (fileUploadCtrl.info.uploader.isUploading) {
			var modalInstance = ModalService.abortUpload();
			modalInstance.result.then(function() {
				cancelAll();
				cancelUpload();
			});
			fileUploadCtrl.fadeUploadModal = true;
		} else {
			cancelUpload();
		}
	};
	// Returns the trusted compiled html template from the given html snippet.
	fileUploadCtrl.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};
	// Gets the values from the globals based on the given key.
	fileUploadCtrl.getValue = function(key) {
		return GlobalService.getVal(key);
	};
	// Clears the upload queue
	function cancelAll() {
		var uploadTimer = $interval(function() {
			var items = fileUploadCtrl.info.uploader.getNotUploadedItems().filter(function(item) {
				return item.isUploading;
			});
			if (items.length == 0) {
				$interval.cancel(uploadTimer);
				fileUploadCtrl.info.showCancelAllConfirmBox = false;
			}
			angular.forEach(items, function(item) {
				item.cancel && item.cancel();
			});
		}, 100);
	}

	function cancelUpload() {
		fileUploadCtrl.info.uploader.clearQueue();
		for (var i in fileUploadCtrl.uploadForm)
		if (fileUploadCtrl.uploadForm.hasOwnProperty(i)) {
			fileUploadCtrl.uploadForm[i].nodeVal = "";
			fileUploadCtrl.uploadForm[i].error = false;
		}
		ErrorService.clearErrors('fileupload');
		$modalInstance.close("Ok");
		fileUploadCtrl.info.uploadDone = false;
		fileUploadCtrl.fadeUploadModal = false;
	}

	// Checks the file size limit
	function checkSizeLimit() {
		var i,
		    sum = 0;
		for (i in fileUploadCtrl.info.uploader.queue) {
			sum += fileUploadCtrl.info.uploader.queue[i].file.size;
		}
		ErrorService.clearErrors('fileupload');
		if (sum > fileUploadCtrl.info.uploadDataMaxSize) {
			ErrorService.setError('fileupload', GlobalService.getVal('file_upld_maxsize') + '<span title="' + fileUploadCtrl.info.uploadDataMaxSize + ' B">' + $filter('fileSize')(fileUploadCtrl.info.uploadDataMaxSize) + '</span>');
		}
	}

	function handleLogPortalSuccess() {

	}

	function handleLogPortalError(response) {
		if (!fileUploadCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
			fileUploadCtrl.info.sessionTimedOut = true;
			ModalService.sessionTimeout();
			return;
		}
	}

}]).controller('InstanceCtrl', ['$scope', '$filter', 'InstanceHandler', 'GlobalService', '$timeout', '$sce', 'WorkbenchService', '$window', 'AppService', 'ExplorerService', 'ModalService',
function($scope, $filter, InstanceHandler, GlobalService, $timeout, $sce, WorkbenchService, $window, AppService, ExplorerService, ModalService) {

	$scope.selectedSections = {};
	$scope.delay = false;
	$scope.info = {};
	$scope.info.application = 'Explorer';
	// Stores whether session is timed out or not
	$scope.info.sessionTimedOut = false;
	$window.dashboardLoadingDone = function(event) {
		if(!event || !event.target) return;
		var instanceMd5 = event.target.className.match(/idashboard\-[^\s]*/)[0].replace("idashboard-", "");
		if(instanceMd5.indexOf("}}") == -1) {
			var instance = InstanceHandler.getInstanceByMD5(instanceMd5);
			if(!instance.iframeLoadingCheck){
				instance.iframeLoadingCheck = 1;
			}else{
				instance.iframeLoadingCheck++;				
			}
			$scope.checkIframeLoader(instance, instanceMd5);
		};
		/*if (((count - 2) % 2 == 0 && count > 2) && (navigator.userAgent.match(/Chrome/) || navigator.userAgent.match(/Safari/)) || navigator.userAgent.match(/Firefox/) || navigator.userAgent.match(/Edge/)) {
			$scope.checkIframeLoader(instanceMd5);
		}*/
	};
	$scope.checkIframeLoader = function(instance, instanceMd5){
		if (angular.element('#idashboard-iframe-div-' + instanceMd5 + '.gb-opacity-50-per')) {
			angular.element('#idashboard-iframe-div-' + instanceMd5 + '.gb-opacity-50-per').removeClass("gb-opacity-50-per").addClass("gb-opacity-100-per");
		}
		if (angular.element('#dashboard-content-loader-' + instanceMd5 + '.gb-show')) {
			angular.element('#dashboard-content-loader-' + instanceMd5 + '.gb-show').removeClass("gb-show").addClass("gb-hide");
		}
		if (!!instance) {
			delete instance.loading;
			InstanceHandler.updateInstanceByMD5(instanceMd5, instance);
			$scope.$apply();
		}
	}
	$scope.getDefaultTab = function() {
		return InstanceHandler.getDefaultTab();
	};
	$scope.setDefaultTab = function(tab, instance) {
		if (tab == 'changes') {
			if (instance.getNumberofSelectedSection() > 10) {
				ModalService.alertBox({
					msgKey : 'instance_view_max_section'
				});
				return;
			}
		}
		if (instance) {
			if (InstanceHandler.getDefaultTab() != tab) {
				instance.applyFilter(tab);
			}
		}
		InstanceHandler.setDefaultTab(tab);
	};

	$scope.showDisabledMsgViewChangesTab = function(tab) {
		InstanceHandler.showDisabledMsgViewChangesTab(tab);
	};

	$scope.getInstances = function() {
		return InstanceHandler.getInstances();
	};
	$scope.isVisible = function() {
		return !!InstanceHandler.getNumberOfInstances();
	};

	$scope.addInstance = function(instance, dname, d_id) {
		InstanceHandler.addInstance(instance, dname, d_id);
	};
	$scope.removeInstance = function(instance) {
		InstanceHandler.removeInstance(instance);
	};
	$scope.showInstance = function(instance) {
		InstanceHandler.showInstance(instance);
	};

	$scope.isViewerVisible = function() {
		return InstanceHandler.isVisible();
	};

	$scope.setViewerVisible = function(bool) {
		return InstanceHandler.setVisible(bool);
	};
	
	$scope.getiTabId = function(instance){
		return instance.md5+"-gb-instance-viewer-tab";
	};
	$scope.secureURL = function(url) {
		return $sce.trustAsResourceUrl(url);
	};

	// Returns the dynamic id generate to handle scrolling in section viewer.
	$scope.getId = function(section, md5) {
		if (!!section) {
			return section.namespace_id.split('-').pop() + md5 + '-section-content';
		} else {
			return "";
		}
	};

	// To refresh the dashboards
	$scope.getRefreshCount = function() {
		return InstanceHandler.getRefreshCount();
	};

	// Filter out the sections and subsections
	$scope.filterSections = function(sections, key) {
		var i,
		    result = {};
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
	};

	$scope.getURL = function(type) {
		if (type == "event") {
			return GlobalService.getVal('intanceviewer_event');
		}

		if (type == "section") {
			return GlobalService.getVal('intanceviewer_section');
		}
	};

	// Generates the URL needed to download the bundle from instance viewer.
	$scope.generateUrlForBundle = function() {
		var i,
		    url = "",
		    tempUrl = "";
		if (arguments.length) {
			tempUrl = arguments[0].obs_url;
			tempUrl = tempUrl.split("/");
			tempUrl = tempUrl[tempUrl.length - 1];
			url += "obs_url=" + tempUrl;
		} else {
			for (i in $scope.bundleList) {
				if (url != "") {
					url += "&";
				}
				tempUrl = $scope.bundleList[i].obs_url;
				tempUrl = tempUrl.split("/");
				tempUrl = tempUrl[tempUrl.length - 1];
				url += "obs_url=" + tempUrl;
			}
		}
		return url;
	};
	// Returns the string for download of single file.
	$scope.generateUrlForFile = function(bundle, file, result) {
		if (result && result.bundleList && result.bundleList.bundles) {
			var bundlesList = result.bundleList.bundles;
			var filePath = "";
			for (var k = 0; k < bundlesList.length; k++) {
				if (($filter('bundleName')(bundlesList[k])) == result.file) {
					filePath = bundlesList[k];
					file = filePath;
					break;
				}
			}
		}
		var url = {},
		    t_bundle = {};
		t_bundle['bundle_name'] = bundle;
		t_bundle['files'] = [];
		t_bundle['files'].push(file);
		url['bundles'] = [];
		url['bundles'].push(t_bundle);
		url['download_type'] = "files";
		return JSON.stringify(url);
	};

	// Checks whether logged in user owns the given dashboard.
	$scope.isOwner = function(instance) {
		// console.info(instance.data.view.owner);
		return WorkbenchService.getUserId() === instance.owner;
	};

	// Takes the user to edit mode of tableau within instance viewer
	$scope.goToEdit = function(instance) {
		instance.data.mode = 'editor';
		instance.delay = false;
	};

	// Takes the user back to view mode within Instance Viewer
	$scope.goToView = function(instance) {
		instance.data.mode = 'viewer';
		instance.delay = false;
	};

	$scope.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};

	$scope.unescape = function(content) {
		if (!content) {
			return;
		}
		return content.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, '\'').replace(/&quot;/g, '"');
	};
}]).controller('ShowInfoController', ['$modalInstance', 'GlobalService', 'showCheckbox', 'AppService', '$filter',
function($modalInstance, GlobalService, showCheckbox, AppService, $filter) {
	var showInfoCtrl = this;

	showInfoCtrl.openedOnStartup = showCheckbox;
	showInfoCtrl.modalElements = $filter('filter')(GlobalService.getVal('startupModalFields'), {
		enabled : true
	}) || [];

	if (!!GlobalService.getVal('showVersionOnHelpModal')) {
		showInfoCtrl.appsVersion = GlobalService.getVal('appsVersion');
	}

	showInfoCtrl.close = function() {
		if (!!showInfoCtrl.startupModalCheckbox) {
			AppService.disableStartupModal();
		}
		$modalInstance.close('ok');

	};
}]).controller('SystemInfoCtrl', ['$modalInstance', 'GlobalService', 'RulesService', '$scope', '$cookies',
function($modalInstance, GlobalService, RulesService, $scope, $cookies) {
	$scope.info = {};
	$scope.info.sysPageSize = 200;
	$scope.info.sysidSearchObj = { "search": {} };
	$scope.info.sysIdList = [];
	$scope.loading = false;

	$scope.info.sysidPagination = {
		pageSiz: $scope.info.sysPageSize,
		startIndex: 0,
		endIndex: $scope.info.sysPageSize - 1,
		noOfPages: 0,
		currentPage: 1,
		paginationText: ''
	};

	$scope.init = function(){
		$scope.info.loading = true;
		$scope.info.colsLoading = true;
		RulesService.getSysidColList().then(function(response){
			$scope.info.sysIdAttributeList = response.data.Data.cols;
			$scope.info.colsLoading = false;
			$scope.getInitialSysidList();
		})
	}

	$scope.cancel = function() {
		$modalInstance.dismiss("cancel");
	};

	$scope.getInitialSysidList = function(){
		RulesService.getSysidList($scope.info.sysidPagination.startIndex, $scope.info.sysidPagination.endIndex + 1, $scope.info.sysidSearchObj, $cookies.username).then(function (response) {
			$scope.info.totalSysidCount = parseInt(response.data.Count);
			$scope.info.sysIdList = response.data.Data;
			$scope.info.loading = false;
			$scope.getPages();
		})
	}

	$scope.getSysId = function () {
		$scope.info.sysIdList = []
		$scope.info.loading = true;
		RulesService.getSysidList($scope.info.sysidPagination.startIndex, $scope.info.sysidPagination.endIndex, $scope.info.sysidSearchObj, $cookies.username).then(function (response) {
			$scope.info.totalSysidCount = parseInt(response.data.Count);
			$scope.info.sysIdList = response.data.Data;
			// $scope.info.shouldCallLoadPages && $scope.getPages();
			var endIndex = $scope.info.totalSysidCount <= $scope.info.sysidPagination.endIndex ? $scope.info.totalSysidCount : $scope.info.sysidPagination.endIndex + 1;
			$scope.info.sysidPagination.paginationText = 'Showing ' + ($scope.info.sysidPagination.startIndex + 1) + ' to ' + endIndex + ' of ' + $scope.info.totalSysidCount;
			$scope.info.loading = false
			// $scope.info.shouldCallLoadPages = false

		},function (response) {
			console.error("Unable to load ");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				
			}else{

			}
			handleSessionTimeout(response);
			$scope.info.sysIdList = []
		})
	}

	//getpage label
	$scope.getPageLabel = function (total, pageSiz, pageNo) {
		var start = Math.max($scope.getPageStart(pageSiz, pageNo), 0);
		var end = Math.min($scope.getPageStart(pageSiz, pageNo + 1), total);
		var obj = {};
		obj.startIndex = start;
		obj.endIndex = (end === $scope.info.totalSysidCount) ? $scope.info.totalSysidCount : end - 1;
		return obj;
	}

	//get page start
	$scope.getPageStart = function (pageSiz, pageNo) {
		return pageSiz * pageNo;
	}

	$scope.loadNextSet = function () {
		$scope.info.sysidPagination.currentPage = $scope.info.sysidPagination.currentPage + 1;
		var page = $scope.info.pages[$scope.info.sysidPagination.currentPage - 1];
		$scope.info.sysidPagination.startIndex = page.startIndex;
		$scope.info.sysidPagination.endIndex = page.endIndex;
		$scope.getSysId();

	}

	$scope.loadPrevSet = function () {
		$scope.info.sysidPagination.currentPage = $scope.info.sysidPagination.currentPage - 1;
		var page = $scope.info.pages[$scope.info.sysidPagination.currentPage - 1];
		$scope.info.sysidPagination.startIndex = page.startIndex;
		$scope.info.sysidPagination.endIndex = page.endIndex;
		$scope.getSysId();
	}

	$scope.resetPagination = function () {
		$scope.info.sysidPagination = {
			pageSiz: $scope.info.sysPageSize,
			startIndex: 0,
			endIndex: $scope.info.sysPageSize - 1,
			noOfPages: 0,
			currentPage: 1,
			paginationText: ''
		}
	}

	$scope.getPages = function () {
		$scope.resetPagination();
		$scope.info.sysidPagination.noOfPages = Math.ceil($scope.info.totalSysidCount / $scope.info.sysidPagination.pageSiz);
		$scope.info.pages = Array.from({ length: $scope.info.sysidPagination.noOfPages }, function (_, i) {
			return $scope.getPageLabel($scope.info.totalSysidCount, $scope.info.sysidPagination.pageSiz, i);
		});
	}

	$scope.init();
}])
