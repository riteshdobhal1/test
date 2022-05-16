
angular.module('gbApp.controllers.workbench', ['xml', 'ngCookies']).controller('WorkbenchCtrl', ['$scope', '$timeout', '$location', 'x2js', 'WorkbenchService', '$cookies', 'GlobalService', '$sce', '$filter', 'UserTrackingService', 'AppService', 'ModalService', 'InstanceHandler', 'UserTrackingService',
function($scope, $timeout, $location, x2js, WorkbenchService, $cookies, GlobalService, $sce, $filter, UserTrackingService, AppService, ModalService, InstanceHandler, UserTrackingService) {
	$scope.primaryDomain = GlobalService.getVal('primaryDomain');
	$scope.appName = 'Workbench';
	$scope.info = {
		'reverse' : true,
		'requestFailed': false,
		'tableauServerDown': false,
		'pageLoading' : true
	};

	$scope.info.application = GlobalService.getVal('navWorkbench');

	// Stores whether session is timed out or not
	$scope.info.sessionTimedOut = false;
	$scope.sources = [];
	// Defines the page object for pagination.
	$scope.info.page = {
		"total" : 0,
		"current" : 0,
		"pages" : 0,
		"count" : 20
	};
	$scope.info.selectAll = false;
    $scope.info.unSelectAll = false;
    $scope.info.errMsg = "";

    $scope.$watch('info.pageLoading', function() {
        if(!$scope.info.pageLoading){
            AppService.hidePanelLoading();
        }
    });
    //Event to check when application is ready
    $scope.$on('AppLoadEvent-workbench', function (event, args) {
        if(!$scope.info.pageLoading){
        	AppService.hidePanelLoading();
        }
    });

	$scope.getValue = function(keyword) {
		return GlobalService.getVal(keyword);
	};

	$scope.isInstanceViewerVisible = function() {
        return !InstanceHandler.isVisible() && InstanceHandler.getNumberOfInstances() > 0;
	};
	$scope.getSaveDatasourceFlag = function() {
        return $cookies.saveDatasource;
	};
	$scope.$watch($scope.getSaveDatasourceFlag, function(newValue) {
        if($cookies.saveDatasource == "True"){
			WorkbenchService.getDataSources().then(function(response) {
				$scope.oldData = angular.copy($scope.datasources);
				var jsonResponse = x2js.xml_str2json(response.data);
				if(jsonResponse['tsResponse'].hasOwnProperty('error')) {
					$scope.info.unAuthorizedUser = true;
				} else {
					var data = jsonResponse['tsResponse']['datasources']['datasource'];
					if (Array.isArray(data)) {
						$scope.datasources = data;
					} else {
						$scope.datasources = [];
						if (data) {
							$scope.datasources.push(data);
						}
					}
					var newDataCopy = angular.copy($scope.datasources);
					if($scope.oldData && $scope.createNewDatasourceFlag){
						if($scope.oldData.length < $scope.datasources.length) {
							for(i =0;i<$scope.oldData.length;i++){
								newDataCopy.forEach(function(element, index) {
									if($scope.oldData[i]._id == element._id){
										newDataCopy.splice(index,1);								
									}
								});
							}
						}
					}
					if(newDataCopy.length>0 && $scope.createNewDatasourceFlag){
						$scope.info.pageLoading = true;
						WorkbenchService.getDatasourceConnection(newDataCopy[0]._id).then(function(response) {
							var connecJson = x2js.xml_str2json(response.data);
							var connectionID = connecJson.tsResponse.connections.connection._id;
							WorkbenchService.updateEmbedAuth(newDataCopy[0]._id, connectionID).then(function(response) {
								$scope.info.pageLoading = false;
								document.cookie = 'saveDatasource=False;domain=.'+ $scope.primaryDomain+';path=/';
								$scope.createNewDatasourceFlag = false;
								$scope.createNewDatasourceFlagDone = true;
							})
						});
					}
				};
			})
		}
	});
	$scope.init = function(reload) {
		// Setting the sort order
		$scope.info.pageLoading = true;
		$scope.info.reverse = false;
		$scope.datasourcesShown = true;
		$scope.info.tableauServerDown = false;
		if(!!WorkbenchService.getSiteId() && !!WorkbenchService.getUserId() && !reload) {
		    getDataSources();
		} else {
		    WorkbenchService.init().then(function(response) {
		        WorkbenchService.setSiteId(response.data.Data.site_id);
                WorkbenchService.setUserId(response.data.Data.user_id);
				WorkbenchService.setTableauDomain(response.data.Data.tableau_domain);
				WorkbenchService.getRealmInfo().then(function(response) {
					var realmData = response.data.Data[0];
					WorkbenchService.getUsers().then(function(response) {
						var jsonResponse = x2js.xml_str2json(response.data);
						if(jsonResponse['tsResponse'].hasOwnProperty('error')) {
							$scope.info.unAuthorizedUser = true;
							$scope.info.pageLoading = false;
						}else {
							var tabuserData = jsonResponse.tsResponse.users.user;
							if(Array.isArray(tabuserData)){
								for(i=0;i<tabuserData.length;i++){
									if(WorkbenchService.getUserId() == tabuserData[i]._id && tabuserData[i]._siteRole == "SiteAdministratorCreator"){
										$scope.iscreator = true;
									}
								}
							}else{
								if(WorkbenchService.getUserId() == tabuserData._id && tabuserData._siteRole == "SiteAdministratorCreator"){
									$scope.iscreator = true;
								}
							}
							if((realmData.vertica_port != null || realmData.vertica_port != "") && (realmData.vertica_pwd != null || realmData.vertica_pwd != "") && (realmData.vertica_server != null || realmData.vertica_server != "") && (realmData.vertica_user != null || realmData.vertica_user != "")){
								if($scope.iscreator){
									$scope.createDataSourcePermission = true;
								}else {
									$scope.createDataSourcePermission = false;
								}
							}else {
								$scope.createDataSourcePermission = false;
							}
							getDataSources();
						}
					});
				})
                WorkbenchService.loadTableauScripts(response.data.Data.tableau_domain, response.data.Data.tableau_version);
            }).catch(function(response) {
				$scope.info.pageLoading = false;
				$scope.info.tableauServerDown = true;		
			})
		}

	};

	function getDataSources() {
		$scope.info.pageLoading = true;
	    WorkbenchService.getDataSources().then(function(response) {
	        var jsonResponse = x2js.xml_str2json(response.data);
	        if(jsonResponse['tsResponse'].hasOwnProperty('error')) {
	            $scope.info.unAuthorizedUser = true;
	        } else {
	            var data = jsonResponse['tsResponse']['datasources']['datasource'];
                if (Array.isArray(data)) {
                    $scope.datasources = data;
                } else {
                    $scope.datasources = [];
                    if (data) {
                        $scope.datasources.push(data);
                    }
				}
				$scope.info.pageLoading = false;
                $scope.refresh();
	        };
	        WorkbenchService.getAllWorkbenchLocal().then(function(response) {
	        	var localList = response.data;
	        	for(i=0;i<localList.Data.length;i++) {
	        		for(j=0;j<$scope.datasources.length;j++){
	        			if(localList.Data[i].ds_id == $scope.datasources[j]._id){
		        			$scope.datasources[j].tags = localList.Data[i].tag.toString();
		        		};
	        		}
	        	}
	        });
            // console.info($scope.datasources);
        }, handleSessionTimeout);
	};

	// Initializing the controller
	$scope.init();
	$('#tabContainer').load(function(){
        var iframe = $('#tabContainer').contents();
        iframe.find(".tabAuthMenubarArea").click(function(){
               alert("test");
        });
	});
	//Create New Datasource button function
	$scope.createNewDatasource = function(){
		$scope.hideDatasources();
		$scope.info.authenticating = true;
		WorkbenchService.getTrustedAuthKey().then(function(response) {
            $scope.info.authenticating = false;
            WorkbenchService.setTrustedKey(response.data.Data);
            if(WorkbenchService.getTrustedKey() != '-1') {
				$scope.createNewDatasourceFlag = true;
				document.cookie = "saveDatasource=False;domain=."+ $scope.primaryDomain+ ";path=/";
				//Get default datasource name from globaljs and use it as create new datasource
				var url = WorkbenchService.getTableauDomain() + '/trusted/' + WorkbenchService.getTrustedKey() + '/t/' + WorkbenchService.getSiteName() + '/newWorkbook/justJunk/';
                var placeholderDiv = document.getElementById("tabContainer");
                var options = {
                    hideTabs : true,
                    width : "100%",
                    height : "800px",
                    onFirstInteractive : function() {
                        $scope.$apply(function(){
                            $scope.backLink = "Back to datasources";
                        });
                    }
                };
                if ($scope.viz) {
                    $scope.viz.dispose();
                }
				$scope.viz = new tableau.Viz(placeholderDiv, url, options);
                WorkbenchService.addTableauEventListeners($scope.viz, $scope.info.application, UserTrackingService);
                var domain = $scope.primaryDomain;
                document.cookie = 'show_tableau_save_options=' + 1 + ";domain=" + domain + ";path=/";
				document.cookie = 'gb_hide_options=' + 1 + ";domain=" + domain + ";path=/";
                // UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.application, 'Create report', datasource).then(function(response) {
                //     console.info(response);
                //     // console.info(response);
                // }, handleSessionTimeout);
            } else {
                $scope.showDatasources();
                // Implement some error message display to the user
                ModalService.alertBox({msgKey: 'tableau_auth_failed'});
            }
        }, function(response) {
            $scope.info.authenticating = false;
            $scope.showDatasources();
            handleSessionTimeout(response);
        });
	}
	$scope.removeDatasourceConf = function() {
		$scope.dataCount = 0;
		for(i=0;i<$scope.datasources.length;i++){
			if($scope.datasources[i].selected){
				$scope.dataCount++;
			}
		}
		$scope.modal1 = ModalService.openModal('partials/workbench_remove_datasource.html', $scope, false, true);
	}
	$scope.removeDatasource = function() {
		var datasourceIDs = [];
		$scope.info.pageLoading = true;
		for(i=0;i<$scope.datasources.length;i++){
			if($scope.datasources[i].selected){
				datasourceIDs.push($scope.datasources[i]._id);
			}
		}
		for(i=0;i<datasourceIDs.length;i++){
			WorkbenchService.removeDatasource(datasourceIDs[i]).then(function(response) {
				$scope.dataCount--;
				if($scope.dataCount == 0){
					$scope.info.pageLoading = false;
					$scope.init();	
				}
			}, function(response) {
			});
		}
	}
	// Takes to edit mode with the selected datasource.
    $scope.goToEditMode = function(datasource) {
        $scope.hideDatasources();
        $scope.info.authenticating = true;
        WorkbenchService.getTrustedAuthKey().then(function(response) {
            $scope.info.authenticating = false;
            WorkbenchService.setTrustedKey(response.data.Data);
            if(WorkbenchService.getTrustedKey() != '-1') {
				if(GlobalService.getVal('isTableau2018')){
					var url = WorkbenchService.getTableauDomain() + '/trusted/' + WorkbenchService.getTrustedKey() + '/t/' + WorkbenchService.getSiteName() + '/authoringNewWorkbook/' + datasource.replace(/[\s\~\!\@\#\$\%\^\&\*\(\)\`\+\=\[\]\{\}\\\|\:\;\"\'\<\>\,\?\/]/g, '').replace(/\./g, '_');
				}else {
					var url = WorkbenchService.getTableauDomain() + '/trusted/' + WorkbenchService.getTrustedKey() + '/t/' + WorkbenchService.getSiteName() + '/authoringNewWorkbook/justJunk/' + datasource.replace(/[\s\~\!\@\#\$\%\^\&\*\(\)\`\+\=\[\]\{\}\\\|\:\;\"\'\<\>\,\?\/]/g, '').replace(/\./g, '_');
				}
                // console.info(url);
                // $scope.tabUrl = $sce.trustAsResourceUrl(GlobalService.getVal('tab_base_url') + '/t/' + WorkbenchService.getSiteName() + '/authoringNewWorkbook/' + datasource.replace(/[\s()]/g, ''));
                var placeholderDiv = document.getElementById("tabContainer");
                var options = {
                    hideTabs : true,
                    width : "100%",
                    height : "800px",
                    onFirstInteractive : function() {
                        $scope.$apply(function(){
                            $scope.backLink = "Back to datasources";
                        });
                    }
                };
                if ($scope.viz) {
                    $scope.viz.dispose();
                }
                $scope.viz = new tableau.Viz(placeholderDiv, url, options);
                WorkbenchService.addTableauEventListeners($scope.viz, $scope.info.application, UserTrackingService);
                var domain = $location.host().split(/\.(.+)?/)[1];
                document.cookie = 'show_tableau_save_options=' + 1 + ";domain=" + domain + ";path=/";
				document.cookie = 'gb_hide_options=' + 1 + ";domain=" + domain + ";path=/";
				$scope.trackUser('Workbench', 'Create report',{'datasrc_name': datasource});
                // UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.application, 'Create report', datasource).then(function(response) {
                //     console.info(response);
                //     // console.info(response);
                // }, handleSessionTimeout);
            } else {
                $scope.showDatasources();
                // Implement some error message display to the user
                ModalService.alertBox({msgKey: 'tableau_auth_failed'});
            }
        }, function(response) {
            $scope.info.authenticating = false;
            $scope.showDatasources();
            handleSessionTimeout(response);
        });

    };

	// Shows the list of datasources
	$scope.showDatasources = function() {
		(function(){
			(new Image()).src = WorkbenchService.getTableauDomain()+"/auth/logout";
		})();
		if($scope.createNewDatasourceFlagDone){
			$scope.createNewDatasourceFlagDone = false;
			$scope.init(true);
		}
		$scope.datasourcesShown = true;
		$scope.backLink = "";
	};

	// Hides the datasources
	$scope.hideDatasources = function() {
		$scope.datasourcesShown = false;
	};

	// Toggles the order of datasources based on name.
	$scope.toggleSort = function() {
		$scope.info.reverse = !$scope.info.reverse;
	};

	// Populates the page object with the latest data.
	$scope.paginator = function(count) {
		$scope.info.page['total'] = count;
		$scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
		// $scope.info.page['current'] = 0;
	};

	// Increment the results per page
	$scope.increaseCount = function() {
		if ($scope.info.page['count'] < 100) {
			$scope.info.page['count'] += 10;
			$scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
			// alert($scope.info.page['current']);
			if ($scope.info.page['current'] >= $scope.info.page['pages'] - 1) {
				$scope.info.page['current'] = $scope.info.page['pages'] - 1;
			}
			$scope.refresh();
		}
	};

	// Decrement the result per page
	$scope.decreaseCount = function() {
		if ($scope.info.page['count'] > 20) {
			$scope.info.page['count'] -= 10;
			$scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
			$scope.info.page['current'] = 0;
			$scope.refresh();
		}
	};

	$scope.changePageSize = function(){
		$scope.info.page['count']  = parseInt( $scope.info.page['count']);
		$scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
		$scope.info.page['current'] = 0;
		$scope.refresh();
	}

	// Navigates to next page of results
	$scope.nextPage = function() {
		if ($scope.info.page['current'] < $scope.info.page['pages'] - 1) {
			$scope.info.page['current'] += 1;
			$scope.refresh();
		}
	};

	// Navigate to previous page of results
	$scope.prevPage = function() {
		if ($scope.info.page['current'] > 0) {
			$scope.info.page['current'] -= 1;
			$scope.refresh();
		}
	};

	// Navigate to first page of results
	$scope.firstPage = function() {
		if ($scope.info.page['current'] == 0)
			return;
		$scope.info.page['current'] = 0;
		$scope.refresh();
	};

	// Navigate to last page of results
	$scope.lastPage = function() {
		if ($scope.info.page['current'] == $scope.info.page['pages'] - 1)
			return;
		$scope.info.page['current'] = $scope.info.page['pages'] - 1;
		$scope.refresh();
	};

	// Returns the filtered, sorted and paginated list of datasources.
	$scope.refresh = function() {
		var filteredData, orderedData;
		if (Array.isArray($scope.datasources)) {
			// console.info($scope.datasources.length);
			/* Custom Filter Function For Multiple Column */
			var data = $scope.datasources;
			filteredData = $filter('filter')(data, function(data) {
			  if ($scope.info.key) {
			    return data.tags.toLowerCase().indexOf($scope.info.key.toLowerCase()) > -1 || data._name.toLowerCase().indexOf($scope.info.key.toLowerCase()) > -1;
			  } else {
			    return true;
			  }
			});

			$scope.paginator(filteredData.length);
			// console.info("Filtered : "+filteredData.length);
			orderedData = $filter('orderBy')(filteredData, '_name', $scope.info.reverse);
			// console.info("Start : "+ $scope.info.page['current'] * $scope.info.page['count'] + "Last :" + ($scope.info.page['current'] * $scope.info.page['count'])+$scope.info.page['count']);
			$scope.sources = orderedData.slice($scope.info.page['current'] * $scope.info.page['count'], ($scope.info.page['current'] * $scope.info.page['count']) + $scope.info.page['count']);
			// console.info("Results : "+$scope.sources.length);
			if($scope.info.unSelectAll == false && $scope.info.selectAll == true) {
				for(i=0;i<$scope.sources.length;i++){
					$scope.sources[i].selected = true;
				}
			}
			else if ($scope.info.unSelectAll == true && $scope.info.selectAll == false) {
				for(i=0;i<$scope.sources.length;i++){
					$scope.sources[i].selected = false;
				}
			}
		}
		return $scope.sources;
	};

	$scope.sceHTML = function(html) {
    	return $sce.trustAsHtml(html);
	};
    function handleSessionTimeout(response) {
        if(!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
            $scope.info.sessionTimedOut = true;
            ModalService.sessionTimeout();
        }
    };
    $scope.toggleSelectAll = function(param){
        if(param == 'all'){
            //$scope.info.selectAll = !$scope.info.selectAll;
            if(!$scope.info.selectAll){
                $scope.info.unSelectAll = true;
            }else{
                $scope.info.unSelectAll = false;
            }
        }else{
           // param.selected = !param.selected;
            $scope.info.unSelectAll = false;
            $scope.info.selectAll = false;
        }
        $scope.refresh();
    };
    $scope.showAddTagsDd = function() {
        var list = $scope.refresh();
        for(var i=0; i< list.length; i++) {
            if(list[i]['selected']){
                return true;
            }
        }
        return false;
    };
    $scope.addTagsMultiple = function() {
        var list = $scope.refresh();
        $scope.processMultipleTags();
        $scope.info.selectedBooks = [];
        var selectedWorkbenchs = [];
        for(var i=0; i< list.length; i++) {
            if(list[i]['selected'] && list[i]['_id']){
                $scope.info.selectedBooks.push(list[i]['_id']);
            }else{
                if(list[i]['selected']){
                    //selectedWorkbenchs.push(list[i]["id"]);
                    $scope.info.selectedBooks.push(list[i]['id']);
                }
            }
        };
        if($scope.info.tags && $scope.info.selectedBooks.length > 0){
            var param = {
                ds_ids : $scope.info.selectedBooks.join(','),
                tags : $scope.info.tags
            };
            $scope.info.loading = true;
			WorkbenchService.addTagsToDatasources(param);
			$scope.trackUser('Workbench', 'Tag', param);
        };
        $scope.info.tags = "";
        if(list.length == $scope.info.selectedBooks.length)
        	$scope.toggleSelectAll("all");
        getDataSources();
    };
    $scope.processMultipleTags = function(){
        //trim first and last space(s)
        $scope.info.tags = $scope.info.tags.trim();
        //check if spaces are there within the strings
        $scope.info.tags = $scope.info.tags.replace(/\s{1,}/g," ");
        //if space found remove a space or multiple spaces with a comma
        $scope.info.tags = $scope.info.tags.replace(/\s+/g,",");
        //replace continues mulitpl comma with a single comma
        $scope.info.tags = $scope.info.tags.replace(/,{1,}/g,",");
        //remove comma if it happend on as first character
        $scope.info.tags = $scope.info.tags.replace(/^,/, '');
        //remove comma if it happend on as last character
        $scope.info.tags = $scope.info.tags.replace(/,$/, '');

    };
    $scope.getAllTagsName = function(dsId) {
    	var tags = [], tmp=[];
    	if (Array.isArray($scope.datasources)) {
	    	if(typeof dsId != 'undefined') {
	    		for(var i=0; i < $scope.datasources.length; i++) {
		            tmp=[];
		            if($scope.datasources[i]._id == dsId){
		            	if($scope.datasources[i].tags){
			                tags = $scope.datasources[i].tags.split(',');
			            }
		            }
		        }
	    	}
	    	else {
	    		for(var i=0; i < $scope.datasources.length; i++) {
		            tmp=[];
		            if($scope.datasources[i].tags){
		                tmp = $scope.datasources[i].tags.split(',');
		            }
		            for(var j=0;j<tmp.length;j++){
		                tags.push(tmp[j]);
		            }
		        }
	    	};
	    }
        //remove duplicate
        tags = $scope.unique(tags);
     	return tags;
    };
    $scope.unique = function(list) {
        var uList = [];
        for(var i=0;i<list.length;i++) {
            if(uList.indexOf(list[i]) < 0){
                uList.push(list[i]);
            }
        }
        return uList;
    };
    $scope.removeTagFromWorkbook = function(dsId, tag) {
    	$scope.info.pageLoading = true;
    	WorkbenchService.removeTagsFromDatasources(dsId._id, tag).then(function(response) {
    		$scope.info.pageLoading = false;
    		getDataSources();
    	});
    };
    $scope.showMsg = function() {
        if($scope.info.errMsg == ""){
			return false;
		}else{
			return true;
		}
    };
    $scope.getAllTagsNameOfSelectedDashboards = function() {
				var tempTagList = [];
				var tmp= [];
        for(i=0;i<$scope.datasources.length;i++){
        	if($scope.datasources[i].selected) {
						tmp= [];
        		tmp = $scope.datasources[i].tags.split(",");
						for(j=0;j<tmp.length;j++){
							tempTagList.push(tmp[j].toString());
						}
        	};
        };
				tempTagList = $scope.unique(tempTagList);
				return tempTagList;
    };
    $scope.isAlphaNumeric =  function(){
		var all_tags_name = $scope.info.tags.split(/,|\s/), duplicateTagname = [], error=false;
		if($scope.info.tags == ""){
			$scope.info.errMsg = "";
			return;
		}
        var allTags = $scope.getAllTagsNameOfSelectedDashboards();
		for(var j=0; j< all_tags_name.length; j++){
            var tag_name = all_tags_name[j];
            if(tag_name == ""){
                continue;
            }else if(tag_name.length > $scope.info.tag_max_characters){
                error = true;
				$scope.info.errMsg = GlobalService.getVal('dashboard_tagname_max_len');
                return;
            }else if(!tag_name.match(/^[0-9a-zA-Z]+$/)){
                error = true;
				$scope.info.errMsg = GlobalService.getVal('dashboard_tagname_special_char');
                return;
            }
            //check for duplicate
            for(var i=0; i < allTags.length;i++){
                if(allTags[i] == tag_name){
                    error = true;
                    duplicateTagname.push(tag_name);
                }
            }
        }
        if(duplicateTagname.length > 0){
            $scope.info.errMsg = GlobalService.getVal('dashboard_tagbname_duplicate') + duplicateTagname.join(', ');
            return;
        }else if(!error){
            $scope.info.errMsg = "";
            return;
        }

	};
	$scope.addExistingTag = function(tag){
        //clear and give proper format to the tag list
        $scope.processMultipleTags();
        var tagList = $scope.info.tags.split(',');
        if(tagList.indexOf(tag) != -1){
            return;
        }
        if($scope.info.tags == ""){
            $scope.info.tags = tag;
        }else{
            $scope.info.tags = $scope.info.tags + ',' + tag;
        }
        $scope.isAlphaNumeric();
	};
	
	//usertracking function
	$scope.trackUser = function(app_Page, operation, details){
		var details = JSON.stringify(details);
		UserTrackingService.standard_user_tracking($scope.info.application, app_Page, operation, details).then(function(response) {

		}, handleSessionTimeout);
	};
}]);
