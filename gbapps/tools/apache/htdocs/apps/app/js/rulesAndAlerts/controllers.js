// Controller to handle the change of page
angular.module('gbApp.controllers.rules', ['gbApp', 'gbApp.controllers', 'ngTable', 'ngDraggable']).controller('RulesCtrl', ['$scope', '$sce', 'GlobalService', 'ErrorService', 'ModalService', 'RulesService', 'AppService', 'InstanceHandler', 'metaDataService','$rootScope',
function($scope, $sce, GlobalService, ErrorService, ModalService, RulesService, AppService, InstanceHandler, metaDataService, $rootScope) {
	//get all constants for html files
	
	RulesService.getRulesConstants().then(function(response) {
		$scope.rulesconstants = response.data;
	}, function(response) {});
	
	// Object to store information on Rules page change
	$scope.info = {};

	// Stores the value of current selected page
	$scope.info.current = 'rules_list';

	// Stores whether session is timed out or not
	$scope.info.sessionTimedOut = false;

	// Stores the list of pages
	$scope.info.pagesList = GlobalService.getVal('rulesPages')[$scope.info.current];

	metaDataService.setRaACurrentPage($scope.info.current);
	// Function to get the URL of selected page from globals.js
	$scope.getRulesUrl = function() {
		return GlobalService.getVal($scope.info.current);
	};

	// Defines whether the instance viewer is full screen or not.
	$scope.instanceViewerFullscreen = function() {
		return (InstanceHandler.isVisible());
	};

	// Defines whether instance viewer is active or not.
	$scope.isThereInstanceViewer = function() {
		return (InstanceHandler.getNumberOfInstances());
	};

	$scope.loadHelpMessage = function(selector,link){
		$('#'+selector+'').load(link +'#main');
	}

	// Function to change the current page
	$scope.changeCurrentPage = function(page) {
		metaDataService.setRaACurrentPage(page);
		if(page == 'api_admin_config'){
			$scope.$broadcast("broadPageChange",page);
		}
		
		if ($scope.info.current == 'test_rule_history' && !!RulesService.getLogMoving()) {
			ModalService.alertBox({
				msg : 'Please wait till the log is being moved to the parser'
			});
			return;
		} else if ((page == 'rules_list' && RulesService.getRuleSavedStatus()) || ($scope.info.current == 'add_edit_template' && RulesService.getTemplateSavedStatus()) || ($scope.info.current == 'add_edit_API_template' && RulesService.getAPITemplateSavedStatus()) ) {
			$scope.info.targetPage = page;
			$scope.title = $scope.info.current == 'add_edit_template' ? 'Navigate from Add/Edit Template page' : 'Navigate from Add/Edit Rule page';
			$scope.msg = GlobalService.getVal('rulesMsgs')['add_rule_navigate'];
			$scope.modal = ModalService.openModal("partials/rules-and-alerts/navigate_add_rule.html", $scope, false, 'static');
		} else {
			if(($scope.info.current=='rules_list' && page=='manage_template') || ($scope.info.current=='add_edit_template' && $scope.isFromListPage('manage_template') && page != 'rules_list')){
				//console.log($scope.isFromListPage('manage_template'));
				$scope.info.current = page;
				$scope.info.pagesList = GlobalService.getVal('rulesPages')['manage_email_template_from_list_page'];
				return;
			}
			if(($scope.info.current=='rules_list' && page=='manage_API_template') || ($scope.info.current=='add_edit_API_template' && $scope.isFromListPage('manage_API_template') && page != 'rules_list')){
				$scope.info.current = page;
				$scope.info.pagesList = GlobalService.getVal('rulesPages')['manage_API_template_from_list_page'];
				return;
			}
			if($scope.info.current=='rules_list' && page=='add_category'){
				$scope.info.current = page;
				$scope.info.pagesList = GlobalService.getVal('rulesPages')['add_category_from_list_page'];
				return;
			}
			if(page=='add_edit_template' && $scope.isFromListPage('manage_template')){
				$scope.info.current = page;
				$scope.info.pagesList = GlobalService.getVal('rulesPages')['add_edit_template_from_list_page'];
				return;
			}
			if(page=='add_edit_API_template' && $scope.isFromListPage('manage_API_template')){
				$scope.info.current = page;
				$scope.info.pagesList = GlobalService.getVal('rulesPages')['add_edit_API_template_from_list_page'];
				return;
			}
			$scope.info.current = page;
			$scope.info.pagesList = GlobalService.getVal('rulesPages')[$scope.info.current];
		}
	};

	$scope.isFromListPage = function(src){
		if(src == 'manage_template'){
			var breadCrumb =  [{
				name: 'rules_list',
				label: 'Rules List'
			},{
				name: 'manage_template',
				label: 'Manage Templates'
			}];
			//compare it with $scope.info.pagesList
			return ($scope.info.pagesList[0]['name'] == breadCrumb[0]['name'] && $scope.info.pagesList[1]['name'] == breadCrumb[1]['name']);
		}
		if(src == 'manage_API_template'){
			var breadCrumb =  [{
				name: 'rules_list',
				label: 'Rules List'
			},{
				name: 'manage_API_template',
				label: 'Manage API Templates'
			}];
			//compare it with $scope.info.pagesList
			return ($scope.info.pagesList[0]['name'] == breadCrumb[0]['name'] && $scope.info.pagesList[1]['name'] == breadCrumb[1]['name']);
		}
		
	}
	// Function to navigate to Rules List page from Add/Edit Rule page
	$scope.changeCurrentPageConfirm = function() {
		RulesService.setTemplateSavedStatus(false);
		RulesService.setAPITemplateSavedStatus(false);
		if ($scope.info.targetPage == 'rules_list') {
			RulesService.setRuleSavedStatus(false);
		}
		if (($scope.info.current == 'rules_list' && $scope.info.targetPage == 'manage_template') || ($scope.info.current == 'add_edit_template' && $scope.isFromListPage('manage_template') && $scope.info.targetPage != 'rules_list')) {
			//console.log($scope.isFromListPage('manage_template'));
			$scope.info.current = $scope.info.targetPage;
			$scope.info.pagesList = GlobalService.getVal('rulesPages')['manage_email_template_from_list_page'];

		}
		else if (($scope.info.current == 'rules_list' && $scope.info.targetPage == 'manage_API_template') || ($scope.info.current == 'add_edit_API_template' && $scope.isFromListPage('manage_API_template') && $scope.info.targetPage != 'rules_list')) {
			$scope.info.current = $scope.info.targetPage;
			$scope.info.pagesList = GlobalService.getVal('rulesPages')['manage_API_template_from_list_page'];

		}
		else {
			$scope.info.current = $scope.info.targetPage;
			$scope.info.pagesList = GlobalService.getVal('rulesPages')[$scope.info.current];
		}

	};

	//Event to check when application is ready
	$scope.$on('AppLoadEvent-rules_and_alerts', function(event, args) {
		AppService.hidePanelLoading();

		// Execute this block when landed from explorer/apps to rules
		if (RulesService.getloadExplorerRules()) {
			RulesService.setRuleSavedStatus(false);
			RulesService.setRuleMode('new');
			$scope.info.targetPage = 'add_rule';
			$scope.$broadcast("loadExplorerRulesEvent");
			$scope.changeCurrentPageConfirm();
		}
	});

	// Function to get any system errors
	$scope.getError = function() {
		return ErrorService.getErrors('gbApp');
	};

	// Function to render text in html format
	$scope.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};

}])

// Controller to handle the manage templates page
.controller('ManageTemplateCtrl', ['$scope', '$sce', '$timeout', '$filter', 'ngTableParams', 'RulesService', 'GlobalService', 'ModalService', 'UserTrackingService', 'AppService',
function($scope, $sce, $timeout, $filter, ngTableParams, RulesService, GlobalService, ModalService, UserTrackingService, AppService) {
	// Object to store the information for manage template page
	$scope.info = {};

	// Stores application name which is used for user tracking
	$scope.info.application = GlobalService.getVal('navRules');

	// Object that stores all the filter information
	$scope.info.filter = {};

	// Stores success messages
	$scope.info.successMsg = "";

	// Stores error messages
	$scope.info.errorMsg = "";

	// Stores whether session is timed out or not
	$scope.info.sessionTimedOut = false;

	// Stores the list of columns
	$scope.columns = $filter('filter')(GlobalService.getVal('templatesColumns'), {
		enabled : true
	});

	// Stores the field of initial Sorting
	$scope.info.initialSortField = GlobalService.getVal('templatesSortField');

	// Initializing the filter model of each column
	for (var i in $scope.columns) {
		$scope.info[$scope.columns[i]['field']] = "";
	}

	// Sets the object of initial sorting
	$scope.info.initialSorting = {};
	$scope.info.initialSorting[$scope.info.initialSortField] = 'desc';

	// Object that stores the page information for custom pagination
	$scope.info.page = {
		"total" : 0,
		"current" : 1,
		"pages" : 0,
		"count" : 10,
		"sortField" : $scope.info.initialSortField + "desc"
	};

	// Defines whether templates are loading
	$scope.info.templatesLoading = true;

	// Populate the table data for first load
	$scope.populateTable = function() {
		$scope.tableParams = new ngTableParams({
			page : 1, // show first page
			count : $scope.info.page['count'], // count per page
			sorting : $scope.info.initialSorting // Initial Sorting
		}, {
			total : $scope.templatesList.length, // length of data
			getData : function($defer, params) {
				var orderedData = params.sorting() ? $filter('orderBy')($scope.templatesList, params.orderBy()) : $scope.templatesList;
				orderedData = $filter('filterTemplates')(orderedData, $scope.info.filter);
				params.total(orderedData.length);
				$scope.info.page['total'] = orderedData.length;
				$scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		});
	};

	// Function to reload templates
	$scope.reloadTemplates = function() {
		RulesService.getTemplates().then(function(response) {
			var templatesData = response.data.Data;
			if (!!templatesData.length) {
				for (var i = 0; i < templatesData.length; i++) {
					templatesData[i].subject = templatesData[i].subject.replace(/\{[^\.]+\./g, '{');
				}
			}
			$scope.templatesList = templatesData;
			$scope.clearAppliedFilters();
			$scope.info.page['current'] = 1;
			$scope.tableParams.reload();
			$scope.tableParams.page(1);
			$scope.info.templatesLoading = false;
			RulesService.setTemplatesList(response.data.Data);
			$scope.info.rulesList = RulesService.getRulesList();
			$scope.setTemplatesLabelMap();
		}, function(response) {
			$scope.templatesList = "";
			$scope.clearAppliedFilters();
			$scope.info.page['current'] = 1;
			$scope.tableParams.reload();
			$scope.tableParams.page(1);
			$scope.info.templatesLoading = false;
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				if ($scope.info.errorMsg == "") {
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['temp_load_failed'];
				} else {
					$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_load_failed'];
				}
			}

			handleSessionTimeout(response);
		});
	};

	// Function to clear all messages
	$scope.clearMessage = function() {
		if (!$scope.info.templatesLoading) {
			$scope.info.successMsg = "";
			$scope.info.errorMsg = "";
		}
	};

	// Stores the list of templates
	RulesService.getTemplates().then(function(response) {
		var templatesData = response.data.Data;
		if (!!templatesData.length) {
			for (var i = 0; i < templatesData.length; i++) {
				templatesData[i].subject = templatesData[i].subject.replace(/\{[^\.]+\./g, '{');
			}
		}
		$scope.templatesList = templatesData;
		$scope.populateTable();
		$scope.info.templatesLoading = false;
		RulesService.setTemplatesList(response.data.Data);
		$scope.info.rulesList = RulesService.getRulesList();
		$scope.setTemplatesLabelMap();
	}, function(response) {
		$scope.templatesList = "";
		$scope.populateTable();
		$scope.info.templatesLoading = false;
		console.error('Error loading templates list');
		if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
			GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
			$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
		} else {
			if ($scope.info.errorMsg == "") {
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['temp_load_failed'];
			} else {
				$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_load_failed'];
			}
		}
		handleSessionTimeout(response);
	});

	// Function to set the templates label map
	$scope.setTemplatesLabelMap = function() {
		var map = {};
		for (var i = 0; i < $scope.templatesList.length; i++) {
			map[$scope.templatesList[i]['template_name']] = true;
		}
		RulesService.setTemplatesLabelMap(map);
	};

	// Changes page size
	$scope.changePageSize = function() {
		$scope.info.page['count'] = parseInt($scope.info.page['count']);
		$scope.tableParams.count($scope.info.page['count']);
		$scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
		if ($scope.info.page['current'] > $scope.info.page['pages']) {
			$scope.info.page['current'] = $scope.info.page['pages'];
			$scope.tableParams.page($scope.info.page['current']);
		}
	};

	// Switch to next page if current page is not last page
	$scope.nextPage = function() {
		if ($scope.info.page['current'] < $scope.info.page['pages']) {
			$scope.info.page['current'] += 1;
			$scope.tableParams.page($scope.info.page['current']);
		}
	};

	// Switch to previous page if current page is not first page
	$scope.prevPage = function() {
		if ($scope.info.page['current'] > 1) {
			$scope.info.page['current'] -= 1;
			$scope.tableParams.page($scope.info.page['current']);
		}
	};

	// Switch to first page if not on first page
	$scope.firstPage = function() {
		if ($scope.info.page['current'] == 1)
			return;
		$scope.info.page['current'] = 1;
		$scope.tableParams.page($scope.info.page['current']);
	};

	// Switch to last page if not on last page
	$scope.lastPage = function() {
		if ($scope.info.page['current'] == $scope.info.page['pages'])
			return;
		$scope.info.page['current'] = $scope.info.page['pages'];
		$scope.tableParams.page($scope.info.page['current']);
	};

	// Select/unselect select all checkbox based on templates selection
	$scope.checkTemplatesSelection = function() {
		for (var i in $scope.templatesList) {
			if (!$scope.templatesList[i].selected) {
				$scope.info.selectAll = false;
				return;
			}
		}
		$scope.info.selectAll = true;
	};

	// Select/unselect all templates on the page
	$scope.checkSelectAll = function() {
		if (!!$scope.info.selectAll) {
			for (var i = 0; i < $scope.templatesList.length; i++) {
				$scope.templatesList[i].selected = true;
			}
		} else {
			for (var i = 0; i < $scope.templatesList.length; i++) {
				delete $scope.templatesList[i].selected;
			}
		}
	};

	// Check if any template is selected
	$scope.checkTemplateSelected = function() {
		if (!!$scope.tableParams) {
			var selectedTemplates = $filter('filter')($scope.tableParams.data, {
				selected : true
			});
			if (!!selectedTemplates.length) {
				return true;
			}
		}
		return false;
	};

	// Function to add a new template
	$scope.addNewTemplate = function() {
		RulesService.setTemplateMode('new');
		$scope.$parent.changeCurrentPage('add_edit_template');
	};

	// Function to edit a template
	$scope.editTemplate = function(template) {
		RulesService.setTemplateMode('edit', template);
		$scope.$parent.changeCurrentPage('add_edit_template');
	};

	// Function to delete a single template
	$scope.deleteTemplate = function(template) {
		for (var i = 0; i < $scope.info.rulesList.length; i++) {
			if (!$scope.info.rulesList[i].email_template_id) {
				continue;
			}
			if (template.template_id == parseInt($scope.info.rulesList[i].email_template_id)) {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['temp_rule_associated']
				});
				return;
			}
		}
		$scope.delTemplate = template;
		$scope.msg = GlobalService.getVal('rulesMsgs')['temp_del_single'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_single'][1];
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/delete_template.html", $scope, false, 'static');
	};

	// Confirm the deletion of template
	$scope.deleteTemplateConfirm = function() {
		var template = $scope.delTemplate;
		$scope.info.templatesLoading = true;
		RulesService.deleteTemplate(template.template_id).then(function(response) {
			UserTrackingService.standard_user_tracking($scope.info.application, 'Manage Template', 'delete', template.template_name).then(function(response) {

			}, handleSessionTimeout);
			$scope.reloadTemplates();
			if ($scope.info.successMsg == "") {
				$scope.info.successMsg = GlobalService.getVal('rulesMsgs')['temp_del_success'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_success'][1];
			} else {
				$scope.info.successMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_del_success'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_success'][1];
			}
		}, function(response) {
			console.error('Unable to delete ' + template.template_name);
			$scope.info.templatesLoading = false;
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				if ($scope.info.errorMsg == "") {
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['temp_del_failed'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_failed'][1];
				} else {
					$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_del_failed'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_failed'][1];
				}
			}
			handleSessionTimeout(response);
		});
	};

	// Function to delete selected templates
	$scope.deleteSelectedTemplates = function() {
		$scope.selectedTemplates = $filter('filter')($scope.tableParams.data, {
			selected : true
		});


		var emailtempidstodelete = $scope.rulesList.map(function (ob) {
			if (ob.email_template_id > 0) {
				for (var i = 0; i < $scope.selectedTemplates.length; i++) {
					if ($scope.selectedTemplates[i].template_id == ob.email_template_id) {
						$scope.selectedTemplates.splice(i, 1)
					}
				}
				return ob.email_template_id;

			}
		});
		if ($scope.selectedTemplates.length == 0) {
			ModalService.alertBox({
				msg: GlobalService.getVal('rulesMsgs')['map_temp_multiple_Del_none']
			});
			return;
		}

		// var templatesString = "<br>";
		// for (var i = 0; i < selectedTemplates.length; i++) {
		// 	if (i != selectedTemplates.length - 1) {
		// 		templatesString += "<strong>" + selectedTemplates[i].template_name + "<strong>, ";
		// 	} else {
		// 		templatesString += "<strong>" + selectedTemplates[i].template_name + "<strong>";
		// 	}
		// }
		$scope.msg = GlobalService.getVal('rulesMsgs')['temp_del_multiple']; ///+ templatesString;
		//$scope.modal = ModalService.openModal("partials/rules-and-alerts/delete_templates.html", $scope, false, 'static');
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/delete_email_template_multiple.html", $scope, false, 'static');
	};

	
	// Function to confirm the deletion of selected templates
	$scope.deleteSelectedTemplatesConfirm = function() {
		$scope.info.doneDeletions = 0;
		$scope.info.delFailed = 0;
		$scope.info.deletedTemplates = [];
		 $scope.selectedTemplates = $filter('filter')($scope.tableParams.data, {
			selected : true
		});
		if ($scope.selectedTemplates.length > 0) {
			$scope.info.templatesLoading = true;
		}
		for (var i = 0; i < $scope.selectedTemplates.length; i++) {
			var tempFound = false;
			// for (var j = 0; j < $scope.info.rulesList.length; j++) {
			// 	if (parseInt($scope.info.rulesList[j].email_template_id) == 0) {
			// 		continue;
			// 	}
			// 	if (parseInt(selectedTemplates[i].template_id) == parseInt($scope.info.rulesList[j].email_template_id)) {
			// 		tempFound = true;
			// 		$scope.info.doneDeletions++;
			// 		$scope.printErrorRuleAssociation(selectedTemplates[i].template_name);
			// 		$scope.info.delFailed++;
			// 		break;
			// 	}
			// }
				$scope.callDeleteTemplate($scope.selectedTemplates[i], $scope.selectedTemplates.length);
				$scope.info.delFailed++;
			
		}
		if ($scope.info.delFailed == $scope.selectedTemplates.length) {
			$scope.info.templatesLoading = false;
		}
	};

	// Prints error message after waiting for 700ms
	$scope.printErrorRuleAssociation = function(tempName) {
		$timeout(function() {
			if ($scope.info.errorMsg == "") {
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['temp_del_rule_associated'][0] + tempName + GlobalService.getVal('rulesMsgs')['temp_del_rule_associated'][1];
			} else {
				$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_del_rule_associated'][0] + tempName + GlobalService.getVal('rulesMsgs')['temp_del_rule_associated'][1];
			}
		}, 700);
	};

	// Function to call the delete API for each selected template
	$scope.callDeleteTemplate = function(template, total) {
		RulesService.deleteTemplate(template.template_id).then(function(response) {
			$scope.info.doneDeletions++;
			$scope.info.deletedTemplates.push(template.template_name);
			if ($scope.info.doneDeletions == total) {
				UserTrackingService.standard_user_tracking($scope.info.application, 'Manage Template', 'multiple delete', "[" + $scope.info.deletedTemplates.toString() + "]").then(function(response) {

				}, handleSessionTimeout);
				$scope.reloadTemplates();
			}
			if ($scope.info.successMsg == "") {
				$scope.info.successMsg = GlobalService.getVal('rulesMsgs')['temp_del_success'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_success'][1];
			} else {
				$scope.info.successMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_del_success'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_success'][1];
			}
		}, function(response) {
			console.error('Unable to delete');
			$scope.info.doneDeletions++;
			if ($scope.info.doneDeletions == total) {
				if ($scope.info.deletedTemplates.length) {
					UserTrackingService.standard_user_tracking($scope.info.application, 'Manage Template', 'multiple delete', "[" + $scope.info.deletedTemplates.toString() + "]").then(function(response) {

					}, function(response) {

					});
				}
				$scope.reloadTemplates();
			}
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				if ($scope.info.errorMsg == "") {
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['temp_del_failed'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_failed'][1];
				} else {
					$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_del_failed'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_failed'][1];
				}
			}
			handleSessionTimeout(response);
		});
	};

	// Update the filter object if any of the filter model is updated
	$scope.searchTemplate = function(field) {
		if ($scope.info[field] != "") {
			$scope.info.filter[field] = $scope.info[field];
		} else {
			if (!!$scope.info.filter[field]) {
				delete $scope.info.filter[field];
			}
		}
		$scope.tableParams.reload();
		if ($scope.info.page['current'] > $scope.info.page['pages']) {
			if ($scope.info.page['pages'] == 0) {
				$scope.info.page['current'] = 1;
			} else {
				$scope.info.page['current'] = $scope.info.page['pages'];
			}
			$scope.tableParams.page($scope.info.page['current']);
		}
	};

	// Sort the column on clicking the column header
	$scope.sortColumn = function(field) {
		if (!(document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "BUTTON")) {
			$scope.tableParams.sorting(field, $scope.tableParams.isSortBy(field, 'asc') ? 'desc' : 'asc');
			$scope.info.page['sortField'] = field + ($scope.tableParams.isSortBy(field, 'asc') ? 'asc' : 'desc');
		}
	};

	// Clear all the applied filters
	$scope.clearAppliedFilters = function() {
		if (Object.keys($scope.info.filter).length != 0) {
			for (var i in $scope.columns) {
				delete $scope.columns[i].filterString;
			}

			for (var i in $scope.columns) {
				$scope.info[$scope.columns[i]['field']] = "";
			}

			$scope.info.filter = {};
			$scope.tableParams.reload();

			$scope.info.page['current'] = 1;
			$scope.tableParams.page($scope.info.page['current']);
		}
		if ($scope.info.page['sortField'] != $scope.info.initialSortField + 'desc') {
			$scope.tableParams.sorting($scope.info.initialSortField, 'desc');
			$scope.info.page['sortField'] = $scope.info.initialSortField + 'desc';
		}
	};

	// Check if any filter is applied or not
	$scope.checkAppliedFilters = function() {
		var filters = false;
		if (Object.keys($scope.info.filter).length != 0)
			filters = true;
		if (filters || $scope.info.page['sortField'] != $scope.info.initialSortField + 'desc') {
			return true;
		}
		return false;
	};

	//fetches the rule list
	$scope.rulesList = RulesService.getRulesList();

	// Function to render text in html format
	$scope.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};

	// Function to handle session timeout
	function handleSessionTimeout(response) {
		if (!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
			$scope.info.sessionTimedOut = true;
			ModalService.sessionTimeout();
		}
	};
}])

// Controller to handle adding and editing of templates
.controller('AddEditTemplateCtrl', ['$scope', '$sce', '$timeout', '$filter', 'ModalService', 'RulesService', 'GlobalService', 'UserTrackingService', 'AppService',
function($scope, $sce, $timeout, $filter, ModalService, RulesService, GlobalService, UserTrackingService, AppService) {

	// Object to store all information about Add/Edit Template page
	$scope.info = {};

	// Stores application name which is used for user tracking
	$scope.info.application = GlobalService.getVal('navRules');

	// Defines whether the page is loading
	$scope.info.pageLoading = false;

	// Specifies whether rule is added
	$scope.info.templateAdded = false;

	// Stores the message to be displayed on top
	$scope.info.addTemplateMsg = {};

	// Stores whether session is timed out or not
	$scope.info.sessionTimedOut = false;

	var manufacturer = GlobalService.getVal('manufacturer');
	var product = GlobalService.getVal('product');
	var schema = GlobalService.getVal('schema');

	// Stores the contants to be shown on templates page
	$scope.info.commonConstants = $filter('filter')(GlobalService.getVal('templateConstants')['common'], {
		enabled : true
	});
	$scope.info.customerConstants = $filter('filter')(GlobalService.getVal('templateConstants')['customer'][manufacturer], {
		enabled : true
	});
	$scope.info.templateConstants = [];
	$scope.info.templateConstants.push.apply($scope.info.templateConstants, $scope.info.commonConstants);
	$scope.info.templateConstants.push.apply($scope.info.templateConstants, $scope.info.customerConstants);

	// Load templates list if not already loaded
	if (!RulesService.getTemplatesList()) {
		$scope.info.pageLoading = true;
		RulesService.getTemplates().then(function(response) {
			$scope.templatesList = response.data.Data;
			RulesService.setTemplatesList($scope.templatesList);
			$scope.setTemplatesLabelMap();
			$scope.info.pageLoading = false;
		}, function(response) {
			$scope.info.pageLoading = false;
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addTemplateMsg = {
					type : 'failure',
					msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			} else {
				$scope.info.addTemplateMsg = {
					type : 'failure',
					msg : GlobalService.getVal('rulesMsgs')['temp_load_failed']
				};
			}
			handleSessionTimeout(response);
		});
	}

	// Function to clear all messages
	$scope.clearMessage = function() {
		if (!$scope.info.pageLoading) {
			$scope.info.addTemplateMsg = {};
		}
	};

	// Function to set the templates label map
	$scope.setTemplatesLabelMap = function() {
		var map = {};
		for (var i = 0; i < $scope.templatesList.length; i++) {
			map[$scope.templatesList[i]['template_name']] = true;
		}
		RulesService.setTemplatesLabelMap(map);
	};

	// Function to populate add template data
	$scope.populateAddTemplate = function() {
		$scope.info.pageLabel = 'Add New Template';
		$scope.info.templateName = "";
		$scope.info.initialTemplateName = null;
		$scope.info.toAddress = "";
		$scope.info.cc = "";
		$scope.info.bcc = "";
		$scope.info.subject = "";
		$scope.info.body = "";
		$scope.info.alertPerRow = 'TRUE';
		$scope.setSavedMode();
	};

	// Function to populate edit template data
	$scope.populateEditTemplate = function() {
		$scope.info.pageLabel = 'Edit Template - ' + RulesService.getTemplateMode()['data']['template_name'];
		$scope.info.templateID = RulesService.getTemplateMode()['data']['template_id'];
		$scope.info.templateName = RulesService.getTemplateMode()['data']['template_name'];
		$scope.info.initialTemplateName = RulesService.getTemplateMode()['data']['template_name'];
		$scope.info.toAddress = RulesService.getTemplateMode()['data']['to'];
		$scope.info.cc = RulesService.getTemplateMode()['data']['cc'];
		$scope.info.bcc = RulesService.getTemplateMode()['data']['bcc'];
		$scope.info.subject = RulesService.getTemplateMode()['data']['subject'].replace(/\{[^\.]+\./g, '{');
		$scope.info.body = RulesService.getTemplateMode()['data']['body'].replace(/\{[^\.]+\./g, '{');
		$scope.info.alertPerRow = RulesService.getTemplateMode()['data']['alertperrow'];
		$scope.setSavedMode();
	};

	// Function to set template in saved mode
	$scope.setSavedMode = function() {
		RulesService.setTemplateSavedStatus(false);
	};

	// Function to set template in unsaved mode
	$scope.setUnsavedMode = function() {
		RulesService.setTemplateSavedStatus(true);
	};

	// Set form elements according to new or edit mode
	if (RulesService.getTemplateMode() && RulesService.getTemplateMode()['mode'] == 'edit') {
		$scope.populateEditTemplate();
	} else {
		$scope.populateAddTemplate();
	}

	// Function to add new template
	$scope.addNewTemplate = function() {
		RulesService.setTemplateMode('new');
		$scope.info.templateAdded = false;
		$scope.info.addTemplateMsg = {};
		$scope.populateAddTemplate();
	};

	// Function to save the template
	$scope.saveTemplate = function() {
		if (!$scope.validateTemplate()) {
			return;
		}

		$scope.info.pageLoading = true;

		var subject = $scope.info.subject;
		var body = $scope.info.body;
		for (var i = 0; i < $scope.info.commonConstants.length; i++) {
			if (subject.indexOf($scope.info.commonConstants[i].value) != -1) {
				subject = subject.replace($scope.info.commonConstants[i].value, '{rule.' + $scope.info.commonConstants[i].value.substring(1, $scope.info.commonConstants[i].value.length - 1) + '}');
			}
			if (body.indexOf($scope.info.commonConstants[i].value) != -1) {
				body = body.replace($scope.info.commonConstants[i].value, '{rule.' + $scope.info.commonConstants[i].value.substring(1, $scope.info.commonConstants[i].value.length - 1) + '}');
			}
		}
		if (Array.isArray($scope.info.customerConstants)) {
			for (var i = 0; i < $scope.info.customerConstants.length; i++) {
				if (subject.indexOf($scope.info.customerConstants[i].value) != -1) {
					subject = subject.replace($scope.info.customerConstants[i].value, '{context.' + $scope.info.customerConstants[i].value.substring(1, $scope.info.customerConstants[i].value.length - 1) + '}');
				}
				if (body.indexOf($scope.info.customerConstants[i].value) != -1) {
					body = body.replace($scope.info.customerConstants[i].value, '{context.' + $scope.info.customerConstants[i].value.substring(1, $scope.info.customerConstants[i].value.length - 1) + '}');
				}
			}
		}

		if (RulesService.getTemplateMode() && RulesService.getTemplateMode()['mode'] == 'edit') {
			RulesService.editTemplate($scope.info.templateID, $scope.info.templateName.replace(/\'/g, "\'\'").replace(/^\s+|\s+$/g, ''),  subject.replace(/\'/g, "\'\'").replace(/^\s+|\s+$/g, ''), body.replace(/\'/g, "\'\'").replace(/^\s+|\s+$/g, ''), $scope.info.alertPerRow).then(function(response) {
				$scope.info.addTemplateMsg = {
					type : 'success',
					msg : GlobalService.getVal('rulesMsgs')['add_template_success']
				};

				if ($scope.info.initialTemplateName != $scope.info.templateName) {
					var details = {};
					details['old'] = $scope.info.initialTemplateName;
					details['new'] = $scope.info.templateName;
					details = JSON.stringify(details);
				} else {
					var details = $scope.info.templateName;
				}
				UserTrackingService.standard_user_tracking($scope.info.application, 'Add_Edit template', 'edit', details).then(function(response) {

				}, handleSessionTimeout);

				$scope.info.templateAdded = true;
				$scope.info.pageLoading = false;

				var newData = {
					template_id : response.data.Data,
					template_name : $scope.info.templateName.replace(/^\s+|\s+$/g, ''),
					to : $scope.info.toAddress.replace(/^\s+|\s+$/g, ''),
					cc : $scope.info.cc.replace(/^\s+|\s+$/g, ''),
					bcc : $scope.info.bcc.replace(/^\s+|\s+$/g, ''),
					subject : subject.replace(/^\s+|\s+$/g, ''),
					body : body.replace(/^\s+|\s+$/g, ''),
					alertperrow : $scope.info.alertPerRow
				};

				if ($scope.info.initialTemplateName != $scope.info.templateName) {
					var templatesLabelMap = RulesService.getTemplatesLabelMap();
					delete templatesLabelMap[$scope.info.initialTemplateName];
					templatesLabelMap[$scope.info.templateName.replace(/^\s+|\s+$/g, '')] = true;
					RulesService.setTemplatesLabelMap(templatesLabelMap);
				}

				RulesService.setTemplateMode('edit', newData);
				$scope.populateEditTemplate();
			}, function(response) {
				if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
					GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
					$scope.info.addTemplateMsg = {
						type : 'failure',
						msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
					};
				} else {
					$scope.info.addTemplateMsg = {
						type : 'failure',
						msg : GlobalService.getVal('rulesMsgs')['add_template_fail']
					};
				}
				$scope.info.templateAdded = false;
				$scope.info.pageLoading = false;
				handleSessionTimeout(response);
			});
		} else {
			RulesService.addTemplate($scope.info.templateName.replace(/\'/g, "\'\'").replace(/^\s+|\s+$/g, ''),  subject.replace(/\'/g, "\'\'").replace(/^\s+|\s+$/g, ''), body.replace(/\'/g, "\'\'").replace(/^\s+|\s+$/g, ''), $scope.info.alertPerRow).then(function(response) {
				$scope.info.addTemplateMsg = {
					type : 'success',
					msg : GlobalService.getVal('rulesMsgs')['add_template_success']
				};

				UserTrackingService.standard_user_tracking($scope.info.application, 'Add_Edit template', 'add', $scope.info.templateName).then(function(response) {

				}, handleSessionTimeout);

				$scope.info.templateAdded = true;
				$scope.info.pageLoading = false;

				var newData = {
					template_id : response.data.Data,
					template_name : $scope.info.templateName.replace(/^\s+|\s+$/g, ''),
					to : $scope.info.toAddress.replace(/^\s+|\s+$/g, ''),
					cc : $scope.info.cc.replace(/^\s+|\s+$/g, ''),
					bcc : $scope.info.bcc.replace(/^\s+|\s+$/g, ''),
					subject : subject.replace(/^\s+|\s+$/g, ''),
					body : body.replace(/^\s+|\s+$/g, ''),
					alertperrow : $scope.info.alertPerRow
				};

				var templatesLabelMap = RulesService.getTemplatesLabelMap();
				templatesLabelMap[$scope.info.templateName] = true;
				RulesService.setTemplatesLabelMap(templatesLabelMap);

				RulesService.setTemplateMode('edit', newData);
				$scope.populateEditTemplate();
			}, function(response) {
				if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
					GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
					$scope.info.addTemplateMsg = {
						type : 'failure',
						msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
					};
				} else {
					$scope.info.addTemplateMsg = {
						type : 'failure',
						msg : GlobalService.getVal('rulesMsgs')['add_template_fail']
					};
				}
				$scope.info.templateAdded = false;
				$scope.info.pageLoading = false;
				handleSessionTimeout(response);
			});
		}
	};

	// Function to validate the template details entered
	$scope.validateTemplate = function() {
		if (/^\s*$/.test($scope.info.templateName)) {
			ModalService.alertBox({
				msg : "Template Name" + GlobalService.getVal('rulesMsgs')['temp_field_blank']
			});
			return;
		}

		var templatesLabelMap = RulesService.getTemplatesLabelMap();
		if (!!$scope.info.initialTemplateName) {
			if ($scope.info.templateName != $scope.info.initialTemplateName && templatesLabelMap.hasOwnProperty($scope.info.templateName)) {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['temp_exists'][0] + $scope.info.templateName + GlobalService.getVal('rulesMsgs')['temp_exists'][1]
				});
				return;
			}
		} else {
			if (templatesLabelMap.hasOwnProperty($scope.info.templateName)) {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['temp_exists'][0] + $scope.info.templateName + GlobalService.getVal('rulesMsgs')['temp_exists'][1]
				});
				return;
			}
		}

		// if (/^\s*$/.test($scope.info.toAddress)) {
		// 	ModalService.alertBox({
		// 		msg : "To Address" + GlobalService.getVal('rulesMsgs')['temp_field_blank']
		// 	});
		// 	return;
		// }

		var supportedDomains = GlobalService.getVal('templateSupportedDomains');

		var emailAddressSoFar = {};

		var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		//var toAddresses = $scope.info.toAddress.split(',');
		// for (var i = 0; i < toAddresses.length; i++) {
		// 	if (/^\s*$/.test(toAddresses[i])) {
		// 		ModalService.alertBox({
		// 			msg : GlobalService.getVal('rulesMsgs')['temp_email_error']
		// 		});
		// 		return;
		// 	}
		// 	if (!emailRegex.test(toAddresses[i].replace(/^\s+|\s+$/g, ''))) {
		// 		ModalService.alertBox({
		// 			msg : toAddresses[i].replace(/^\s+|\s+$/g, '') + GlobalService.getVal('rulesMsgs')['temp_email_invalid']
		// 		});
		// 		return;
		// 	}

		// 	//check for domains if enabled
		// 	if(GlobalService.getVal('emailDomainCheck')){
		// 		var domainMatch = toAddresses[i].match(/\@([^\s]+)\s*$/);
		// 		var domainFound = false;
		// 		for (var j = 0; j < supportedDomains.length; j++) {
		// 			if (supportedDomains[j] == domainMatch[1]) {
		// 				domainFound = true;
		// 				break;
		// 			}
		// 		}
		// 		if (!domainFound) {
		// 			ModalService.alertBox({
		// 				msg : domainMatch[1] + GlobalService.getVal('rulesMsgs')['temp_email_unsupported']
		// 			});
		// 			return;
		// 		}
		// 	}
		

		// 	if (emailAddressSoFar.hasOwnProperty(toAddresses[i].replace(/^\s*|\s*$/g, ""))) {
		// 		ModalService.alertBox({
		// 			msg : GlobalService.getVal('rulesMsgs')['temp_email_repeated']
		// 		});
		// 		return;
		// 	} else {
		// 		emailAddressSoFar[toAddresses[i].replace(/^\s*|\s*$/g, "")] = true;
		// 	}
		// }

		// if (!/^\s*$/.test($scope.info.cc)) {
		// 	var ccs = $scope.info.cc.split(',');
		// 	for (var i = 0; i < ccs.length; i++) {
		// 		if (/^\s*$/.test(ccs[i])) {
		// 			ModalService.alertBox({
		// 				msg : GlobalService.getVal('rulesMsgs')['temp_email_error']
		// 			});
		// 			return;
		// 		}
		// 		if (!emailRegex.test(ccs[i].replace(/^\s+|\s+$/g, ''))) {
		// 			ModalService.alertBox({
		// 				msg : ccs[i].replace(/^\s+|\s+$/g, '') + GlobalService.getVal('rulesMsgs')['temp_email_invalid']
		// 			});
		// 			return;
		// 		}
				
		// 		//check for domains if enabled
		// 		if(GlobalService.getVal('emailDomainCheck')){
		// 			var domainMatch = ccs[i].match(/\@([^\s]+)\s*$/);
		// 			var domainFound = false;
		// 			for (var j = 0; j < supportedDomains.length; j++) {
		// 				if (supportedDomains[j] == domainMatch[1]) {
		// 					domainFound = true;
		// 					break;
		// 				}
		// 			}
		// 			if (!domainFound) {
		// 				ModalService.alertBox({
		// 					msg : domainMatch[1] + GlobalService.getVal('rulesMsgs')['temp_email_unsupported']
		// 				});
		// 				return;
		// 			}
		// 		}
			
		// 		if (emailAddressSoFar.hasOwnProperty(ccs[i].replace(/^\s*|\s*$/g, ""))) {
		// 			ModalService.alertBox({
		// 				msg : GlobalService.getVal('rulesMsgs')['temp_email_repeated']
		// 			});
		// 			return;
		// 		} else {
		// 			emailAddressSoFar[ccs[i].replace(/^\s*|\s*$/g, "")] = true;
		// 		}
		// 	}
		// }

		if (/^\s*$/.test($scope.info.subject)) {
			ModalService.alertBox({
				msg : "Subject" + GlobalService.getVal('rulesMsgs')['temp_field_blank']
			});
			return;
		}

		var constantMatches = $scope.info.subject.match(/\{[^\}]+\}/g);
		if (!!constantMatches) {
			for (var i = 0; i < constantMatches.length; i++) {
				var found = false;
				if (constantMatches[i] == '{alert_msg}') {
					ModalService.alertBox({
						msg : constantMatches[i] + " is allowed only in template body"
					});
					return;
				}
				for (var j = 0; j < $scope.info.templateConstants.length; j++) {
					if (constantMatches[i] == $scope.info.templateConstants[j].value) {
						found = true;
						break;
					}
				}
				if (!found) {
					ModalService.alertBox({
						msg : constantMatches[i] + GlobalService.getVal('rulesMsgs')['temp_invalid_constant']
					});
					return;
				}
			}
		}

		if (/^\s*$/.test($scope.info.body)) {
			ModalService.alertBox({
				msg : "Body" + GlobalService.getVal('rulesMsgs')['temp_field_blank']
			});
			return;
		}

		constantMatches = $scope.info.body.match(/\{[^\}]+\}/g);
		if (!!constantMatches) {
			for (var i = 0; i < constantMatches.length; i++) {
				var found = false;
				for (var j = 0; j < $scope.info.templateConstants.length; j++) {
					if (constantMatches[i] == $scope.info.templateConstants[j].value) {
						found = true;
						break;
					}
				}
				if (!found) {
					ModalService.alertBox({
						msg : constantMatches[i] + GlobalService.getVal('rulesMsgs')['temp_invalid_constant']
					});
					return;
				}
			}
		}

		return true;
	};

	// Function to render text in html format
	$scope.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};

	// Function to handle session timeout
	function handleSessionTimeout(response) {
		if (!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
			$scope.info.sessionTimedOut = true;
			ModalService.sessionTimeout();
		}
	};
}])

// Controller to handle the page to show list of rules
.controller('RulesListCtrl', ['$scope','$q', '$sce', 'GlobalService', '$window', '$filter', '$timeout', 'ngTableParams', 'RulesService', 'ModalService', 'UserTrackingService', 'AppService', 'metaDataService', 'RulesTestWithLogvault','$cookies','$document', 'UtilService', 
function($scope, $q, $sce, GlobalService, $window, $filter, $timeout, ngTableParams, RulesService, ModalService, UserTrackingService, AppService, metaDataService, RulesTestWithLogvault, $cookies, $document, UtilService) {

	$scope.supportEmail = GlobalService.getVal('supportEmail');
	// Object to store all information about Rules list page
	if(!RulesService.getInfoData()){
		$scope.info = {};
	}else{
		$scope.info = RulesService.getInfoData();
	}

	// Stores application name which is used in user tracking
	$scope.info.application = GlobalService.getVal('navRules');

	// Object that stores the filter information for all the columns
	$scope.info.filter = {};

	// Stores list of rules
	$scope.rulesList = [];
	$scope.filterCount = 0;

	// Defines whether rules are loading
	$scope.info.rulesLoading = true;

	// Defines whether rules are loading
	$scope.info.rulesPageLoading = true;

	// Stores whether session is timed out or not
	$scope.info.sessionTimedOut = false;

	// Stores the list of columns
	$scope.columns = $filter('filter')(GlobalService.getVal('rulesColumns'), {
		enabled : true
	});
	// Stores the list of columns for export CSV
	$scope.columnsToExport = $filter('filter')(GlobalService.getVal('rulesColumnsForExport'), {
		enabled : true
	});

	// Stores the field of initial Sorting
	$scope.info.initialSortField = GlobalService.getVal('rulesSortField');

	// Stores the message to be displayed
	$scope.info.rulesListMsg = {};

	// Stores the number of recursions done
	$scope.info.recursionDone = 0;

	// Stores the count of maximum recursions allowed
	$scope.info.recursionLimit = GlobalService.getVal('rescursionLimit');

	$scope.hasAccessToUnsupportedRules = GlobalService.getVal('hasAccessToUnsupportedRules');

	$scope.multipleRulesDeleteReq = [];
	$scope.showColumnFilterPanel = false;
	$scope.showColumnFilterPanelLoading = false;
	
	$scope.showAnalyticsDashboards = false;
	//Stores owner details
	$scope.availableRulesOwnerList = [];
	// Stores the list of supported rule status
	$scope.info.supportedStatus = GlobalService.getVal('rulesSupportedStatus');
	// Stores the list of supported rule status
	$scope.info.rulesHistoryTypesOfChanges = GlobalService.getVal('rulesHistoryTypesOfChanges');
	// Sets the object of initial sorting
	$scope.info.initialSorting = {};
	$scope.info.initialSorting[$scope.info.initialSortField] = 'desc';	
	//thse used to change ownership	
	$scope.currentRule = "";
	$scope.currentOwner = "";
	$scope.amIAdmin = (metaDataService.getFeatures()?metaDataService.getFeatures()["admin"] || false:false);
	$scope.amIRuleCreator = (metaDataService.getFeatures()?metaDataService.getFeatures()[GlobalService.getVal('ruleCreatorFielName')]:false);
	$scope.myEmail = metaDataService.getUser()['email'];
	
	$scope.selectedRuleForRuleLabelAnalytics = {};

	//For multiple owner change
	$scope.multipleRuleOwnerChange = [];
	$scope.multipleRuleOwnerChangeRuleIds = [];
	$scope.multipleRulesSelectedOwner = null;
	$scope.multipleRulesOernerFilter = "";
	$scope.selectedRuleName = "";

	$scope.info.enableRuleComments = "";
	$scope.info.enableRuleCommentsLimitMin = GlobalService.getVal('ruleStatusChangeCommentMinLen');
	$scope.info.enableRuleCommentsLimitMax = GlobalService.getVal('ruleStatusChangeCommentMaxLen');

	$scope.info.ruleHistoryTableExpandAll = false;
	$scope.changeDetails = []; 

	$scope.timefilter = GlobalService.getVal('ruleListTimeFilter');
	$scope.showSelectNotify = false;

	$scope.info.actionMessageFlag = false;

	//clinsights enabled flag
	$scope.info.clinsightFlag = GlobalService.getVal('clinsightFlag') || false;

	RulesService.getPriorities().then(function(response) {
		$scope.info.priorities = response.data.Data;
		
	}, function(response) {
		$scope.info.priorities = [];
		if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
			GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
			$scope.info.addRuleMsg = {
				type : 'failure',
				msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
			};
		}
		handleSessionTimeout(response);
	});




	RulesService.getSeverities().then(function(response) {
		$scope.info.severities = response.data.Data;
		RulesService.setSeveritiesList($scope.info.severities);
	}, function(response) {
		$scope.info.severities = [];
		if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
			GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
			$scope.info.addRuleMsg = {
				type : 'failure',
				msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
			};
		}
		handleSessionTimeout(response);
	});


		// Stores the list of categories
		RulesService.getCategories().then(function(response) {
			$scope.info.categories = response.data.Data;
		
		}, function(response) {
			$scope.info.categories = [];
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addRuleMsg = {
					type : 'failure',
					msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}
			console.error("Unable to load categories");
			handleSessionTimeout(response);
		});

		// RulesService.getallSubscriberList().then(function(response){
		// 	$scope.info.allSubscriberList = response.data.Data.length ? response.data.Data: [];
		// 	console.log($scope.info.allSubscriberList)
		// })


	// Initializes the models for each column filter
	// for (var i in $scope.columns) {
	// 	if ($scope.columns[i]['field'] == 'label_display' || $scope.columns[i]['field'] == 'description' || $scope.columns[i]['field'] == 'author' || $scope.columns[i]['field'] == 'rule_name' || $scope.columns[i]['field'] == 'created_ts' || $scope.columns[i]['field'] == 'modified_ts') {
	// 		$scope.info[$scope.columns[i]['field']] = "";
	// 	} else {
	// 		$scope.info[$scope.columns[i]['field']] = {};
	// 	}
	// }
	// Object that stores the page information for custom pagination
	$scope.info.page = {
		"total" : 0,
		"current" : 1,
		"pages" : 0,
		"count" : 10,
		"sortField" : $scope.info.initialSortField + "desc"
	};
	if(RulesService.getPageState())
	{
		$scope.info.page['current'] = RulesService.getPageState();
	}
	$scope.rulesTypeSelected = RulesService.getRuleType();
	//User to change rules type
	$scope.rulesType = [{
		label: 'supported',
		selected: true
	},{
		label: 'unsupported',
		selected: false
	}];
	$scope.isInSupportedRuleListPage = function(){
		return  $scope.rulesTypeSelected=='supported';
	}
	//used to reset to frst page if any filter is applied
	$scope.resettofirst = false;

	$scope.rulesTypeChange = function(item){
		if($scope.rulesTypeSelected == item.label) return ;
		RulesService.setStateGroupData(undefined);
		$scope.showColumnFilterPanel = false;
		RulesService.setFilterState(undefined);
		RulesService.setPageState(undefined);
		$scope.clearAppliedFilters();
		$scope.showFilterCount();
		$scope.rulesTypeSelected = item.label;
		RulesService.setRuleType($scope.rulesTypeSelected);		
		$scope.reloadRules();
	};	
	// Function to clear all messages
	$scope.clearMessage = function() {
		if (!$scope.info.rulesLoading) {
			$scope.info.rulesListMsg = {};
		}
	};
	//Control variables for analytics
	$scope.ruleAnalyticsConfig = GlobalService.getVal('ruleAnalyticsConfig');
	
	$scope.$watch('info.rulesPageLoading', function() {
		if (!$scope.info.rulesPageLoading) {
			AppService.hidePanelLoading();
		}
	})
	// Function to populate the table initially
	$scope.populateTable = function() {
		$scope.tableParams = new ngTableParams({
			page : $scope.resettofirst ? 1: $scope.info.page['current']  , // show first page
			count : $scope.info.page['count'], // count per page
			sorting : $scope.info.initialSorting // Initial sorting
		}, {
			total : $scope.rulesList.length, // length of data
			getData : function($defer, params) {
				//sort it by date
				if (params.sorting() && params.sorting()[$scope.info.initialSortField]) {
					orderedData = $scope.rulesList.sort(function (item1, item2) {
						var tm1 = new Date(item1[$scope.info.initialSortField] + "").getTime();
						tm1 = tm1.toString();
						var tm2 = new Date(item2[$scope.info.initialSortField] + "").getTime();
						tm2 = tm2.toString();
						if (params.orderBy() == ('+' + $scope.info.initialSortField)) {
							return (tm1.localeCompare(tm2));
						} else if (params.orderBy() == ('-' + $scope.info.initialSortField)) {
							return ((-1) * tm1.localeCompare(tm2));
						} else {
							return (tm1.localeCompare(tm2));
						}
					});
				} else if (params.sorting() && params.sorting()['created_ts']) {
					orderedData = $scope.rulesList.sort(function (item1, item2) {
						var tm1 = new Date(item1['created_ts'] + "").getTime();
						tm1 = tm1.toString();
						var tm2 = new Date(item2['created_ts'] + "").getTime();
						tm2 = tm2.toString();
						if (params.orderBy() == ('+created_ts')) {
							return (tm1.localeCompare(tm2));
						} else if (params.orderBy() == ('-created_ts')) {
							return ((-1) * tm1.localeCompare(tm2));
						} else {
							return (tm1.localeCompare(tm2));
						}
					});
				} else {
					orderedData = params.sorting() ? $filter('orderBy')($scope.rulesList, params.orderBy()) : $scope.rulesList;
				}
				orderedData = $scope.getFilterredRules(orderedData);
				$scope.orderedData = orderedData;
				params.total(orderedData.length);
				$scope.info.page['total'] = orderedData.length;
				$scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
				if (RulesService.getPageState()) {
					if (RulesService.getPageState() > $scope.info.page['pages']) {
						$scope.info.page['current'] = $scope.info.page['pages']
					}
					else {
						$scope.info.page['current'] = RulesService.getPageState();;
					}
				} else {
					$scope.info.page['current'] = 1
				}
				if ($scope.resettofirst == true) {
					$scope.info.page['current'] = 1
				}
				// current selected length from rule list
				$scope.currentSelected = orderedData.filter(function (x, i) {
					return x.selected;
				}).length;
				//current rule list in ui
				$scope.currentRuleList = orderedData
				//current page data in ui
				$scope.CurrentPageList = orderedData.slice(($scope.info.page['current'] - 1) * params.count(), $scope.info.page['current'] * params.count());
				//check if all is selected in page the toggle select all
				if ($scope.CurrentPageList.filter(function (x, i) {
					return x.selected;
				}).length == $scope.info.page['count']) {
					$scope.info.selectAllCurrentPage = true;
				}
				else {
					$scope.info.selectAllCurrentPage = false;
				}

				$scope.showSelectNotify = $scope.currentSelected > 0 ? true : false
				$defer.resolve(orderedData.slice(($scope.info.page['current'] - 1) * params.count(), $scope.info.page['current'] * params.count()));
				$scope.resettofirst = false
			}
		});
	};
	// if(Object.keys(RulesService.getFilterState().length !=0))
	if(RulesService.getFilterState())
	{
		$scope.info.filter = RulesService.getFilterState()
	}
	$scope.getFilterredRules = function(orderedData){
		return $filter('filterRules')(orderedData, $scope.info.filter);
	};
	$scope.$watch('info', function (newVal, oldVal) {
		RulesService.setInfoData(newVal);
	}, true);
	// Stores the list of rules
	$scope.loadRules = function() {
		//////

		if(RulesService.getFilterState()){
			$scope.showColumnFilterPanel = Object.keys(RulesService.getFilterState()).length ? true : false;	
		}
		else{
			$scope.showColumnFilterPanel = false;
		}

		//$scope.showColumnFilterPanel = false;
		RulesService.getAllConfig().then(function(response) {
			if(!response.data.Data.config.api_template_feature){
				$scope.showAlertApiFeature = false;
			}
			var responseData = response.data.Data;
			if (AppService.isGbStudioApp()) {
				responseData['config'] = !!responseData['default_config'] ? responseData['default_config'] : responseData['config'];
				responseData['file_upload_config'] = !!responseData['default_file_upload_config'] ? responseData['default_file_upload_config'] : responseData['file_upload_config'];
			}

			if (!RulesService.getStagingDomain() || !RulesService.getStagingKeyspace()) {
				RulesService.setStagingDomain(responseData.config.is_stage_domain);
				RulesService.setStagingKeyspace(responseData.config.is_stage_keyspace);

				var infoserverDomain = GlobalService.getVal('infoserverDomain');
				var umsDomain = GlobalService.getVal('umsDomain');
				var infoserverDomainStaging = responseData.config.is_stage_domain;

				if (infoserverDomain && umsDomain) {
					var tArray = infoserverDomain.split('/');
					var version = tArray.pop();
					var slaves = {};
					slaves[tArray.join("/")] = "/" + version + "/xproxy";

					tArray = umsDomain.split('/');
					version = tArray.pop();
					slaves[tArray.join("/")] = "/" + version + "/xproxy";

					if (infoserverDomainStaging) {
						tArray = infoserverDomainStaging.split('/');
						version = tArray.pop();
						slaves[tArray.join("/")] = "/" + version + "/xproxy";
					}
					xdomain.slaves(slaves);
				}
			}

			RulesService.getAllRules($scope.rulesTypeSelected).then(function(response) {
			    
				if (!response.data.hasOwnProperty('Data') && $scope.info.recursionDone < $scope.info.recursionLimit) {
					$scope.info.recursionDone++;
					if ($scope.info.recursionDone == $scope.info.recursionLimit) {
						$scope.rulesList = "";
						$scope.info.rulesLoading = false;
						return;
					}
					$scope.loadRules();
					return;
				}
				$scope.rulesList = $filter('filterMultiples')((response.data.Data), {
					status : [$scope.info.supportedStatus.Enabled, $scope.info.supportedStatus.Disabled, $scope.info.supportedStatus.Draft]
				}) || [];
				//apply user role and usr permission lavel filter
				/* Get user details i.e role and permission */
				$scope.FilterRulesBasedOnUserRoleAndPermission();
				$scope.populateTable();
				if (!RulesService.getloadExplorerRules()) {
					$scope.info.rulesLoading = false;
					$scope.info.rulesPageLoading = false;
				}
				RulesService.setRulesList($scope.rulesList);

				
				$scope.setRulesLabelMap();
				$scope.setAllRulesMap();
				if (response.status == 303) {
					$scope.info.rulesListMsg = {
						type : 'failure',
						msg : GlobalService.getVal('rulesMsgs')['rules_load_failed']
					}
				}
				
				$scope.rulesList.forEach(function (rule,i) {
					if (rule.email_template_id > 0) {
						var ss = rule["subscribed_users"];
						rule["subscribed_users"] = ss.length ? (ss[ss.length-1] == "," ? ss.substring(0,ss.length-1): ss) : ss;
						rule["subscriberCount"] = rule.subscribed_users.length ? rule.subscribed_users.split(",").filter(Boolean).length : 0
						rule["subscriptionEmailList"] = rule.subscribed_users.length ? rule.subscribed_users.split(",").filter(Boolean) : [];
						if (rule.status == "ENABLED") {
							if (rule.subscription_enabled == false) {
								if (rule.subscriptionEmailList.includes($cookies.username)) {
									rule["subscribeIcon"] = false
									rule["mySubscriedRule"] = rule.subscriptionEmailList.includes($cookies.username) ? 'My Subscribed Rules' : 'Subscribable Rules';
								}else{
									//delete rule.subscribeIcon;
								}
								// rule["mySubscriedRule"] = rule.subscriptionEmailList.includes($cookies.username) ? 'My Subscribed Rules' : 'Subscribable Rules';
							} else if (rule.subscription_enabled == true) {
								rule["subscribeIcon"] = rule.subscriptionEmailList.includes($cookies.username) ? false : true;
								rule["mySubscriedRule"] = rule.subscriptionEmailList.includes($cookies.username) ? 'My Subscribed Rules' : 'Subscribable Rules';
							}
	
						}
						
						// rule.subscription_enabled = true
						// rule["subscribeIcon"] = Math.random() < 0.5;
						// rule["subscriptionEmailList"] = ["siemensqa@glassbeam.com"]

						
						// rule['tag'] = Array.apply(null, Array(3)).map(function (item, index) {
						// 	return {
						// 		"tag_id":Math.floor((Math.random() * 10) + 1),
						// 		"tag_name": $scope.info.tag_list[Math.floor(Math.random() * $scope.info.tag_list.length)]
						// 	};
						// })
							// rule['tag'] = Array.apply(null, Array(Math.floor((Math.random() * (4-1) + 1)))).map(function (item, index) {
							// 	return  $scope.info.tag_list[Math.floor(Math.random() * $scope.info.tag_list.length)]
								
							// });
						
						
						// rule['tag'] = $scope.info.tag_list[Math.floor(Math.random() * $scope.info.tag_list.length)];
					}
					if(rule.tags.length){
						rule.tags.forEach(function(tg){
							tg.label = tg.tag_name;
						})
					}
					
				})
				
				//add api template name to corresponding rule as we dont get it in rule list
				// $scope.rulesList.forEach(function (rule) {
				// 	if ($scope.showAlertApiFeature) {
				// 		$scope.apitemp = RulesService.getApiTemplateList();
				// 		if ($scope.apitemp) {
				// 			if (rule.api_template_id > 0) {
				// 				rule.api_template_name = $scope.mapApiTempName(rule.api_template_id);
				// 			}

				// 		}
				// 	}
				// })

				//check for state data  if not preesent process new data with new rule list
				if (!RulesService.getStateGroupData()) {
					$scope.groupedFilterData = RulesService.getgroupdata($scope.rulesList);
					if (!$scope.showAlertApiFeature) {
						$scope.groupedFilterData.forEach(function (item) {
							if (item.field == "api_template_name") {
								item.enabled = false;
							}
						})
					}
					//check if the length of data is 0, if so dont show it
					$scope.groupedFilterData.forEach(function (groupedItem) {
						if (groupedItem.multiselect) {
							if (groupedItem.data.length) {
								groupedItem.enabled = true;
							}
						}
						groupedItem.expanded = false;	
					})
				}
				//else get the state maintained data with new rule list
				else {
					$scope.groupedFilterData = RulesService.getgroupdata($scope.rulesList);
					$scope.info = RulesService.getInfoData();
					if (!$scope.showAlertApiFeature) {
						$scope.groupedFilterData.forEach(function (item) {
							if (item.field == "api_template_name") {
								item.enabled = false;
							}
						})
					}

					//check if data field is empty for each multiselect filter object and disable it
					$scope.groupedFilterData.forEach(function (groupedItem) {
						if (groupedItem.multiselect) {
							if (!groupedItem.data.length) {
								delete $scope.info.filter[groupedItem.field];
								groupedItem.enabled = false;
								groupedItem.expanded = false;
								groupedItem.selected = false;
							}
							else {
								groupedItem.enabled = true;
							}

						}
						//updating info object when a keyword is searched (applicable only for textbox search in filter)
						if (groupedItem['field'] == 'label_display' || groupedItem['field'] == 'description' ||
							groupedItem['field'] == 'author' || groupedItem['field'] == 'rule_name') {
							for (var key in $scope.info.filter) {
								if (key == [groupedItem['field']]) {
									$scope.info[groupedItem['field']] = $scope.info.filter[groupedItem['field']];
								}
							}
						}
					});
					//example scenario: if apitemplate filter is applied and the rule is edited and the template is replaced by another template the while returning
					//the filter object $scope.info.filter must be updated.
					var keys = Object.keys($scope.info.filter);
					$scope.groupedFilterData.forEach(function (dta) {
						if (dta.multiselect && keys.indexOf(dta.field) != -1) {
							var fitdata = $scope.info.filter[dta.field];
							var gpdata =[];
							dta.data.forEach(function(it){
								gpdata.push(it.label);
						   });
							for (i = 0; i < fitdata.length; i++) {
								if (gpdata.indexOf(fitdata[i]) == -1) {
									fitdata.splice(i, 1);
								}
							}
							$scope.info.filter[dta.field] = fitdata;
							if(!fitdata.length){
								delete $scope.info.filter[dta.field];
							}
						}
					})
				}
			}, function(response) {
				$scope.rulesList = "";
				$scope.populateTable();
				if (!RulesService.getloadExplorerRules()) {
					$scope.info.rulesLoading = false;
					$scope.info.rulesPageLoading = false;
				}
				if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
					GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
					$scope.info.rulesListMsg = {
						type : 'failure',
						msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
					};
				} else {
					$scope.info.rulesListMsg = {
						type : 'failure',
						msg : GlobalService.getVal('rulesMsgs')['rules_load_failed']
					};
				}
				handleSessionTimeout(response);
				console.error('Unable to load Rules List');
				$scope.clearAppliedFilters();
			});
		}, function(response) {
			$scope.info.rulesListMsg = {
				type : 'failure',
				msg : GlobalService.getVal('rulesMsgs')['rules_load_failed']
			};
			handleSessionTimeout(response);
		});
		//read version column name
		UserTrackingService.getAllConfig().then(function(response) {
			if(response && response.data.Data){
				if(response.data.Data.config.col_ver_name){
					$scope.info.addRuleVersionFields =  GlobalService.setVal('addRuleVersionFields', response.data.Data.config.col_ver_name.split(','));
				}
			}			
		}, function(error){

		});
	};

	$scope.loadRules();

	$scope.loadFilterPanelData = function(){
		// $scope.columns.map(function(item){
		// 	item.expanded = false;
		// });
		$scope.showColumnFilterPanel = true;
		RulesService.setStateGroupData($scope.groupedFilterData);
		// $scope.showColumnFilterPanelLoading = true;
		// $('.panel-collapse').collapse('hide');
		//group value by field name
		// $timeout(function(){
		// 	$scope.reloadFilterPanelData();
		// }, 1000);
	}
	// $scope.mapApiTempName = function (id) {
	// 	$scope.namelist = $scope.apitemp.filter(function (temp) {
	// 		return temp.apiTemplateId == id;
	// 	});
	// 	if ($scope.namelist.length) {
	// 		return $scope.namelist[0]["apiTemplateName"];
	// 	}
	// 	else {
	// 		return "";
	// 	}
	// }
	$scope.reloadFilterPanelData = function () {
		//$scope.showColumnFilterPanelLoading = true;
		$scope.rulesList.forEach(function (rule) {
			if (!$scope.showAlertApiFeature) {
				$scope.groupedFilterData.filter(function (item) {
					if (item.field == "api_template_name") {
						item.enabled = false;
					}
				});
				// $scope.apitemp = RulesService.getApiTemplateList();
				// if ($scope.apitemp) {
				// 	if (rule.api_template_id > 0) {
				// 		rule.api_template_name = $scope.mapApiTempName(rule.api_template_id);
				// 	}

				// }
			}
			// else {
			// 	$scope.groupedFilterData.filter(function (item) {
			// 		if (item.field == "api_template_name") {
			// 			item.enabled = false;
			// 		}
			// 	});
			// }
			$scope.groupedFilterData.forEach(function (column) {
				if (column.field != 'label_display' || column.field != 'description' || column.field != 'author' || column.field != 'rule_name' || column.field != 'created_ts' || column.field != 'modified_ts' || column.field != 'rule_owner') {
					if (!column.data) {
						column.data = [];
					} else {
						if (rule[column.field] && rule[column.field].trim() != "" && rule[column.field] && rule[column.field].trim() != null && column.data.indexOf(rule[column.field]) == -1) {
							column.data.push(rule[column.field]);
						}
					}
				}
			});
		});
		$scope.showColumnFilterPanelLoading = false;
	};
	$scope.countListBasedOnStatus = function(field){
		if(!$scope.rulesList || !$scope.rulesList.length) return 0;
		if($scope.orderedData){
		 return ($scope.orderedData.reduce(function(total, item){
			 if(item.status.toLowerCase() === field.toLowerCase()){
				return total + 1;
			 }
			return total;
		},0));
	}
	}
	$scope.filterListBasedOnStatus = function(field){
		//field = field.toUpperCase();
		//$scope.info['status'][field] = true;
		var statusObj = $scope.groupedFilterData.filter(function(item){
			if(item.field == 'status' ){
				return true;
			}
		});
		
		var infoStatusObj = $scope.info.status;
		var data = statusObj[0].data;
		
		var InfoObjkeys = Object.keys(infoStatusObj);
		InfoObjkeys.forEach(function(item){
			data.forEach(function(dataItem){
				 if(dataItem.label === item){
					dataItem.selected = infoStatusObj[item];
				 }

			});

		});

		$scope.changeFilter({'field': 'status'}, field);
	}

	// Function to set the rules label map
	$scope.setRulesLabelMap = function() {
		var map = {};
		for (var i = 0; i < $scope.rulesList.length; i++) {
			map[$scope.rulesList[i]['label']] = true;
		}
		RulesService.setRulesLabelMap(map);
	};

	// Function to set all the rules label map
	$scope.setAllRulesMap = function() {
		RulesService.getRulesLabelsList().then(function(response) {
			if (Array.isArray(response.data.Data)) {
				var map = {};
				for (var i = 0; i < response.data.Data.length; i++) {
					map[response.data.Data[i]] = true;
				}
				RulesService.setRulesLabelMap(map);
			}
		}, handleSessionTimeout);
	};
	$scope.resetColumnFilterPanel = function(){		
		//clear column filter values
		$scope.columns.forEach(function(column){
			column.allValueList = [];
		});
	};
	// Function to reload rules list
	$scope.reloadRules = function() {
		$scope.info.rulesLoading = true;
		if(RulesService.getFilterState()){
			$scope.showColumnFilterPanel = Object.keys(RulesService.getFilterState()).length ? true : false;	
		}
		else{
			$scope.showColumnFilterPanel = false;
		}
		
		// $scope.resetColumnFilterPanel();
		RulesService.getAllRules($scope.rulesTypeSelected).then(function(response) {
			$scope.rulesList = $filter('filterMultiples')((response.data.Data), {
				status : [$scope.info.supportedStatus.Enabled, $scope.info.supportedStatus.Disabled, $scope.info.supportedStatus.Draft]
			});

			//add api template name to corresponding rule as we dont get it in rule list
			$scope.rulesList.forEach(function (rule) {
				if (rule.email_template_id > 0) {
					var ss = rule["subscribed_users"];
					rule["subscribed_users"] = ss.length ? (ss[ss.length-1] == "," ? ss.substring(0,ss.length-1): ss) : ss;
					rule["subscriberCount"] = rule.subscribed_users.length ? rule.subscribed_users.split(",").filter(Boolean).length : 0
					rule["subscriptionEmailList"] = rule.subscribed_users.length ? rule.subscribed_users.split(",").filter(Boolean) : [];
					if (rule.status == "ENABLED") {
						if (rule.subscription_enabled == false) {
							if (rule.subscriptionEmailList.includes($cookies.username)) {
								rule["subscribeIcon"] = false
								rule["mySubscriedRule"] = rule.subscriptionEmailList.includes($cookies.username) ? 'My Subscribed Rules' : 'Subscribable Rules';
							}else{
								//delete rule.subscribeIcon;
							}
							// rule["mySubscriedRule"] = rule.subscriptionEmailList.includes($cookies.username) ? 'My Subscribed Rules' : 'Subscribable Rules';
						} else if (rule.subscription_enabled == true) {
							rule["subscribeIcon"] = rule.subscriptionEmailList.includes($cookies.username) ? false : true;
							rule["mySubscriedRule"] = rule.subscriptionEmailList.includes($cookies.username) ? 'My Subscribed Rules' : 'Subscribable Rules';
						}

					}
				}
				if(rule.tags.length){
					rule.tags.forEach(function(tg){
						tg.label = tg.tag_name;
					})
				}
			})
			
			//check for state data  if not preesent process new data with new rule list
			if (!RulesService.getStateGroupData()) {
				$scope.groupedFilterData = RulesService.getgroupdata($scope.rulesList);
				if (!$scope.showAlertApiFeature) {
					$scope.groupedFilterData.forEach(function (item) {
						if (item.field == "api_template_name") {
							item.enabled = false;
						}
					})
				}
				$scope.groupedFilterData.forEach(function (groupedItem) {
					if (groupedItem.multiselect) {
						if (groupedItem.data.length) {
							groupedItem.enabled = true;
						}
					}
					groupedItem.expanded = false;	
				})
			}
			//else get the state maintained data with new rule list
			else {
				$scope.groupedFilterData = RulesService.getgroupdata($scope.rulesList);
				$scope.info = RulesService.getInfoData();
				if (!$scope.showAlertApiFeature) {
					$scope.groupedFilterData.forEach(function (item) {
						if (item.field == "api_template_name") {
							item.enabled = false;
						}
					})
				}

				//check if data field is empty for each multiselect filter object and disable it
				$scope.groupedFilterData.forEach(function (groupedItem) {
					if (groupedItem.multiselect) {
						if (!groupedItem.data.length) {
							delete $scope.info.filter[groupedItem.field];
							groupedItem.enabled = false;
							groupedItem.expanded = false;
							groupedItem.selected = false;
						}
						else {
							groupedItem.enabled = true;
						}

					}
					if (groupedItem['field'] == 'label_display' || groupedItem['field'] == 'description' ||
						groupedItem['field'] == 'author' || groupedItem['field'] == 'rule_name') {
						for (var key in $scope.info.filter) {
							if (key == [groupedItem['field']]) {
								$scope.info[groupedItem['field']] = $scope.info.filter[groupedItem['field']]
							}
						}
					}

				})
					//example scenario: if apitemplate filter is applied and the rule is edited and the template is replaced by another template the while returning
					//the filter object $scope.info.filter must be updated.
					var keys = Object.keys($scope.info.filter);
					$scope.groupedFilterData.forEach(function (dta) {
						if (dta.multiselect && keys.indexOf(dta.field) != -1 && dta.field != "status") {
							var fitdata = $scope.info.filter[dta.field];
							var gpdata =[];
							dta.data.forEach(function(it){
								gpdata.push(it.label);
						   });
							for (i = 0; i < fitdata.length; i++) {
								if (gpdata.indexOf(fitdata[i]) == -1) {
									fitdata.splice(i, 1);
								}
							}
							$scope.info.filter[dta.field] = fitdata;
							if(!fitdata.length){
								delete $scope.info.filter[dta.field];
							}
						}
					})
			}
			$scope.FilterRulesBasedOnUserRoleAndPermission();
			//$scope.clearAppliedFilters();
			$scope.info.page['current'] = 1;
			$scope.tableParams.reload();
			$scope.tableParams.page($scope.info.page['current']);
			if (!RulesService.getloadExplorerRules()) {
				$scope.info.rulesLoading = false;
			}
			$scope.info.rulesLoading = false;
			RulesService.setRulesList($scope.rulesList);
			$scope.setRulesLabelMap();
			$scope.setAllRulesMap();
			setTimeout(function(){ $scope.info.actionMessageFlag = false; }, 3000);                              
			$scope.trackUser($scope.rulesTypeSelected, 'View', {"View": $scope.rulesTypeSelected, "data": "none"});
		}, function(response) {
			$scope.rulesList = "";
			//$scope.clearAppliedFilters();
			$scope.info.page['current'] = 1;
			$scope.tableParams.reload();
			$scope.tableParams.page(1);
			if (!RulesService.getloadExplorerRules()) {
				$scope.info.rulesLoading = false;
			}
			$scope.info.rulesLoading = false;
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.rulesListMsg = {
					type : 'failure',
					msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
				}
			} else {
				$scope.info.rulesListMsg = {
					type : 'failure',
					msg : GlobalService.getVal('rulesMsgs')['rules_load_failed']
				}
			}
			console.error('Unable to load Rules List');
			handleSessionTimeout(response);
		});
	};

	// Function to add a new rule
	$scope.addNewRule = function() {
		RulesService.setRuleMode('new');
		$scope.$parent.changeCurrentPage('add_rule');
	};

	// Execute this block if landed from explorer/apps to rules
	if (RulesService.getloadExplorerRules()) {
		AppService.hidePanelLoading();
		$scope.addNewRule();
	}

	// Select/unselect select all checkbox based on rules selection
	$scope.checkRulesSelection = function (rule) {
		$scope.currentSelected = $scope.currentRuleList.filter(function (x, i) {
			return x.selected;
		}).length;

		$scope.showSelectNotify = $scope.currentSelected > 0 ? true : false
		if ($scope.CurrentPageList.filter(function (x, i) {
			return x.selected;
		}).length == $scope.info.page['count']) {
			$scope.info.selectAllCurrentPage = true;
		}
		else {
			$scope.info.selectAllCurrentPage = false;
		}
	};

	// Select/unselect all enabled rules on the page
	$scope.checkSelectAll = function() {

		for (var i = 0; i < $scope.currentRuleList.length; i++) {
			$scope.currentRuleList[i].selected = true;
		}
		if ($scope.CurrentPageList.filter(function (x, i) {
			return x.selected;
		}).length == $scope.info.page['count']) {
			$scope.info.selectAllCurrentPage = true;
		}
		else {
			$scope.info.selectAllCurrentPage = false;
		}
		$scope.currentSelected = $scope.currentRuleList.filter(function (x, i) {
			return x.selected;
		}).length;
		$scope.showSelectNotify = $scope.currentSelected > 0 ? true : false;
	};

	//function to select current page data
	$scope.selectcurrentpage = function (data){
		if (!!$scope.info.selectAllCurrentPage) {
			for (var i = 0; i < data.length; i++) {
				data[i].selected = true;
			}
		} else {
			for (var i = 0; i < data.length; i++) {
				delete data[i].selected;
			}

		}
		$scope.currentSelected = $scope.currentRuleList.filter(function (x, i) {
			return x.selected;
		}).length;
		$scope.showSelectNotify = $scope.currentSelected > 0 ? true : false

	}

	//function clear all selected
	$scope. clearselected = function(){
		for (var i = 0; i < $scope.currentRuleList.length; i++) {
			delete $scope.currentRuleList[i].selected;
		}
		if ($scope.CurrentPageList.filter(function (x, i) {
			return x.selected;
		}).length == $scope.info.page['count']) {
			$scope.info.selectAllCurrentPage = true;
		}
		else {
			$scope.info.selectAllCurrentPage = false;
		}
		$scope.showSelectNotify = false;
	}

	// Function to check if any rule is selected
	$scope.checkSelectedRules = function() {
		if (!!$scope.rulesList) {
			var selectedRules = $filter('filter')($scope.currentRuleList, {
				selected : true
			}) || [];
			if (selectedRules.length > 0) {
				return true;
			}
		}

		return false;
	};

	// Function to call test rule for a draft
	$scope.testRule = function(rule) {
		$scope.setPageListforTesting();
		var selectedRules = [];
		selectedRules.push(rule);
		RulesService.setTestRuleData(selectedRules);
		RulesTestWithLogvault.setRulesSelected(selectedRules);
		$scope.$parent.changeCurrentPage('test_rule_history');
	};

	// Function to go to test rule history
	$scope.goToTestRuleHistory = function() {
		$scope.setPageListforTesting();
		var selectedRules = [];
		RulesService.setTestRuleData(selectedRules);
		RulesTestWithLogvault.setRulesSelected(selectedRules);
		$scope.$parent.changeCurrentPage('test_rule_history');
	};

	// Function to go to test rule history
	$scope.goToManageEmailTemplatePage = function() {
		$scope.$parent.changeCurrentPage('manage_template');
	};

	// Function to go to test rule history
	$scope.goToManageAPITemplatePage = function() {
		$scope.info.pageLoading = true;
		$scope.$parent.changeCurrentPage('manage_API_template');
	};

	// Function to go to test rule history
	$scope.goToManageCategoryPage = function() {
		$scope.$parent.changeCurrentPage('add_category');
	};

	// Function to go to test rule
	$scope.goToTestRule = function() {

		if(!$scope.checkSelectedRules()){
			return;
		}
		var selectedRules = [], found = false, filterredRules = $scope.getFilterredRules($scope.rulesList);
		for (var i = 0; i < filterredRules.length; i++) {
			if (!!filterredRules[i].selected){
				if(filterredRules[i].status == $scope.info.supportedStatus.Enabled) {
					found = true;
					break;
				}
				// else if(filterredRules[i].myRule && filterredRules[i].status == $scope.info.supportedStatus.Draft){
				// 	found = true;
				// 	break;
				// }
			}
		}
		if (!found) {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['rule_select_all_error']
			});
			return;
		}

		for (var i = 0; i < filterredRules.length; i++) {
			if (!!filterredRules[i].selected){
				if(filterredRules[i].status == $scope.info.supportedStatus.Enabled) {
					selectedRules.push(filterredRules[i]);
				}
				// else if(filterredRules[i].myRule && filterredRules[i].status == $scope.info.supportedStatus.Draft){
				// 	selectedRules.push(filterredRules[i]);
				// }
			}
		};
		$scope.multipleRulesDeleteReq = selectedRules;
		$scope.msg = GlobalService.getVal('rulesMsgs')['rule_test_multiple'];
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/test_rule.html", $scope, false, 'static');

	};
	$scope.testRulesRequest = function() {
		$scope.setPageListforTesting();
		var selectedRules = [];
		for (var i = 0; i < $scope.rulesList.length; i++) {
			if (!!$scope.rulesList[i].selected && ($scope.rulesList[i].status == $scope.info.supportedStatus.Enabled)) {
				selectedRules.push($scope.rulesList[i]);
			}
		}
		if (selectedRules.length > 0) {
			RulesService.setTestRuleData(selectedRules);
			RulesTestWithLogvault.setRulesSelected(selectedRules);
			$scope.$parent.changeCurrentPage('test_rule_history');
		}
	}

	// Sets page list for Test Rule Page
	$scope.setPageListforTesting = function() {
		var pageList = GlobalService.getVal('rulesPages');
		pageList.test_rule_history = [{
			name : 'rules_list',
			label : 'Rules List'
		}, {
			name : 'test_rule_history',
			label : 'Test Rule History'
		}];
		GlobalService.setVal('rulesPages', pageList);
	};

	// Function to enable/disable rule
	$scope.enableDisableRule = function(rule, field) {
		//if(rule[field] == $scope.info.supportedStatus.Enabled) return;
		$scope.selectedRule = rule;
		$scope.selectedField = field;
		$scope.selectedRuleName = $scope.selectedRule['label_display'];
		$scope.msg = (rule[field] == $scope.info.supportedStatus.Enabled);
		$scope.confirmEnablingDisableRule();
		// $scope.msg = rule[field] == $scope.info.supportedStatus.Enabled ? "Are you sure you want to disable the rule <strong>" + rule.rule_name + "</strong>?" : "Are you sure you want to enable the rule <strong>" + rule.rule_name + "</strong>?";
		// $scope.modal = ModalService.openModal("partials/rules-and-alerts/enable_disable_rule.html", $scope, false, 'static');
	};	
	$scope.confirmEnablingDisableRule = function(){
		//open message box to ask for message befor enable it
		$scope.info.enableRuleComments = "";
		$scope.modal = ModalService.openModal('partials/rules-and-alerts/modal-enable-rule-message-box.html', $scope, "gb-modal-test-rule-enable-modal", 'static');
	}
	
	$scope.enableDisableStatusBtn = function(){
		return $scope.info.enableRuleComments.length >= $scope.info.enableRuleCommentsLimitMin;
	}
	// Function to confirm enable/disable rule
	$scope.enableDisableRuleAction = function() {
		if($scope.info.rulesLoading){
			return;
		}
		if(!$scope.info.enableRuleComments.length) return;
		var rule = $scope.selectedRule;
		var field = $scope.selectedField;
		$scope.modal.close()		
		$scope.info.rulesLoading = true;
		if (rule[field] == $scope.info.supportedStatus.Enabled) {
			RulesService.disableRule(rule.rule_id, $scope.info.enableRuleComments).then(function(response) {
				$scope.info.rulesListMsg = {
					type : 'success',
					msg : GlobalService.getVal('rulesMsgs')['rule_disable_success'][0] + rule.label_display + GlobalService.getVal('rulesMsgs')['rule_disable_success'][1]
				}
				//user tracking call
				$scope.trackUser('Rules List', 'disable', rule);

				//UserTrackingService.standard_user_tracking($scope.info.application, 'Rules List', 'disable', rule.label).then(function(response) {

				// }, handleSessionTimeout);
				$scope.reloadRules();
			}, function(response) {
				if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
					GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
					$scope.info.rulesListMsg = {
						type : 'failure',
						msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
					}
				} else {
					$scope.info.rulesListMsg = {
						type : 'failure',
						msg : GlobalService.getVal('rulesMsgs')['rule_disable_failed'][0] + rule.label_display + GlobalService.getVal('rulesMsgs')['rule_disable_failed'][1]
					}
				}

				console.error("Unable to disable rule " + rule.label);
				$scope.info.rulesLoading = false;
				handleSessionTimeout(response);
			});
		} else {
			RulesService.enableRule(rule.rule_id, $scope.info.enableRuleComments).then(function(response) {
				$scope.info.rulesListMsg = {
					type : 'success',
					msg : GlobalService.getVal('rulesMsgs')['rule_enable_success'][0] + rule.label_display + GlobalService.getVal('rulesMsgs')['rule_enable_success'][1]
				}
				//user tracking call
				$scope.trackUser('Rules List', 'enable', rule);
				// UserTrackingService.standard_user_tracking($scope.info.application, 'Rules List', 'enable', rule.label).then(function(response) {

				// }, handleSessionTimeout);
				$scope.reloadRules();
			}, function(response) {
				if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
					GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
					$scope.info.rulesListMsg = {
						type : 'failure',
						msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
					}
				} else {
					$scope.info.rulesListMsg = {
						type : 'failure',
						msg : GlobalService.getVal('rulesMsgs')['rule_enable_failed'][0] + rule.label_display + GlobalService.getVal('rulesMsgs')['rule_enable_failed'][1]
					}
				}

				console.error("Unable to enable rule " + rule.label);
				$scope.info.rulesLoading = false;
				handleSessionTimeout(response);
			});
		}
	};

	// Function to edit a rule
	$scope.editRule = function(rule) {
		if (rule[$scope.columns[$scope.columns.length - 1].field] == $scope.info.supportedStatus.Disabled) {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['edit_rule_disabled']
			});
			return;
		}
		rule['label'] = rule['label_display'];
		RulesService.setRuleMode('edit', rule);
		$scope.$parent.changeCurrentPage('add_rule');
	};

	// Function to delete a rule
	$scope.changeRuleOwnership = function(rule, newOwner) {
		$scope.currentRule = rule;
		$scope.currentOwner = newOwner;
		$scope.msg = "Are you sure you want to change ownership(edit/delete) of rule <strong>"+rule.label_display+ "</strong> to user <strong>"+newOwner+"</strong> ?";
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/change_rule_owner.html", $scope, false, 'static');
	};

	// Function to change ownership for multiple rules(nish)
	$scope.changeMultipleRuleOwnership = function (newOwner) {
		if (!$scope.checkSelectedRules()) {
			return;
		}

		if (!$scope.availableRulesOwnerList.length) {
			ModalService.alertBox({
				msg: GlobalService.getVal('rulesMsgs')['rules_owner_list_not_found']
			});
			return;
		}

		//check if rule has been selected or not return false otherwise
		$scope.currentLoggedUser = $cookies.username;
		var selectedRules = $filter('filter')($scope.rulesList, {
			selected: true
		}) || [];
		if (selectedRules.length > 0) {

			var selectedRules = [], found = false, filterredRules = $scope.getFilterredRules($scope.rulesList);
			//filter to show only the rules owned by logged in user
			for (var i = 0; i < filterredRules.length; i++) {
				if (!!filterredRules[i].selected) {
					if (filterredRules[i].myRule) {
						selectedRules.push(filterredRules[i]);
					}
					else if ($scope.amIAdmin) {
						selectedRules.push(filterredRules[i]);
					}
				}
			}
			$scope.multipleRuleOwnerChange = selectedRules;
			//selectedRules array will be empty if the user selects the rules not owned by him
			if(selectedRules.length < 1){
				ModalService.alertBox({
					msg: GlobalService.getVal('rulesMsgs')['owner_change_multiple_warn']
				});
				return;
			}
			
			$scope.currentOwner = newOwner;
			$scope.msg = GlobalService.getVal('rulesMsgs')['owner_change_multiple'];
			$scope.modal = ModalService.openModal("partials/rules-and-alerts/multiple_owner_change.html", $scope, false, 'static');
			
		}

	};

	$scope.setCurrentOwner = function(owner) {
		$scope.multipleRulesSelectedOwner = owner;
	  };

	//Function to make data for  this function changeMultipleRuleOwnershipRequest
	$scope.goToChangeMultipleRuleOwnership = function () {
		var selectedRules = [], ids = "", status = "", r_name = "";
		for (var i = 0; i < $scope.multipleRuleOwnerChange.length; i++) {
			if (!ids) ids = $scope.multipleRuleOwnerChange[i].rule_id;
			else ids = ids + "," + $scope.multipleRuleOwnerChange[i].rule_id;

			if (!status) status = $scope.multipleRuleOwnerChange[i].status;
			else status = status + "," + $scope.multipleRuleOwnerChange[i].status;

			if (!r_name) r_name = $scope.multipleRuleOwnerChange[i].rule_name;
			else r_name = r_name + "," + $scope.multipleRuleOwnerChange[i].rule_name;
		};
		$scope.changeMultipleRuleOwnershipRequest($scope.multipleRuleOwnerChange, ids, status);
	};

	$scope.changeMultipleRuleOwnershipRequest = function (selectedRules, m_ids, m_status) {
		$scope.modal.close();
		$scope.showColumnFilterPanel = false;
		$scope.info.rulesLoading = true;
		var param = {
			'rule_owner': $scope.multipleRulesSelectedOwner,
			'rule_id': m_ids,
			'rule_status':m_status
		}
		//get owner list
		RulesService.updateRuleOwnership(param).then(function (response) {
			var responseData = response.data.Data;
			$scope.trackUser('Rules List', 'MultipleOwnership change', param);
			$scope.reloadRules();
			$scope.multipleRulesSelectedOwner = null; //reset selected owner after th change process.
			// UserTrackingService.standard_user_tracking($scope.info.application, 'Rule List', 'Owner_change', details).then(function(response) {
			// }, handleSessionTimeout);
		}, function (response) {
			$scope.info.rulesLoading = false;
			$scope.info.rulesListMsg = {
				type: 'failure',
				msg: GlobalService.getVal('rulesMsgs')['update_rule_load_owners_failed']
			};
		});
	};
	$scope.emptySleectedOwner = function () {
		$scope.multipleRulesSelectedOwner = null;
	}

	// Function to delete a rule
	$scope.deleteRule = function(rule) {
		$scope.delRule = rule;
		$scope.msg = GlobalService.getVal('rulesMsgs')['rule_del_single'][0] + rule.label_display + GlobalService.getVal('rulesMsgs')['rule_del_single'][1];
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/delete_rule.html", $scope, false, 'static');
	};


	// Confirm the deletion of a rule
	$scope.deleteRuleRequest = function(selectedRules,m_ids,m_status,m_email_template_ids) {
		var rule = $scope.delRule;
		$scope.info.rulesLoading = true;
		var label = "", m_ids, m_status;
		if(!selectedRules){
			m_ids = rule.rule_id;
			label = rule.label;
			m_status = rule.status;
			m_email_template_ids = rule.email_template_id;
		};
		RulesService.deleteRule(m_ids, m_status,m_email_template_ids).then(function(response) {
			if(!selectedRules){
				$scope.deleteSubscriptionFilter(rule,false);
			}else{
				$scope.deleteSubscriptionFilter(m_ids.split(",").map(function(item) {
					return parseInt(item, 10);
				}),true);
			}
			$scope.reloadRules();
			var rulesLabelMap = RulesService.getRulesLabelMap();
			if(rule){
				delete rulesLabelMap[rule.label];
				//user tracking call
				$scope.trackUser('Rules List', 'delete', rule);
				// UserTrackingService.standard_user_tracking($scope.info.application, 'Rules List', 'delete', rule.label).then(function(response) {

				// }, handleSessionTimeout);
				$scope.info.rulesListMsg = {
					type : 'success',
					msg : GlobalService.getVal('rulesMsgs')['rule_delete_success'][0] + rule.label_display + GlobalService.getVal('rulesMsgs')['rule_delete_success'][1]
				}
			}else{
				selectedRules.map(function(item){
					delete rulesLabelMap[item.rule_name];
					//user tracking call
					$scope.trackUser('Rules List', 'delete', item);
					// UserTrackingService.standard_user_tracking($scope.info.application, 'Rules List', 'delete', item.label_display).then(function(response) {

					// }, handleSessionTimeout);
				});
				$scope.info.rulesListMsg = {
					type : 'success',
					msg : GlobalService.getVal('rulesMsgs')['rule_delete_multiple_success']
				}
			}
			RulesService.setRulesLabelMap(rulesLabelMap);
		}, function(response) {
			$scope.info.rulesLoading = false;
			if(rule){
				console.error('Unable to delete ' + rule.label);
			}else{
				selectedRules.map(function(item){	
					console.error('Unable to delete ' + item.label_display);
				});
			}

			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.rulesListMsg = {
					type : 'failure',
					msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
				}
			} else {
				$scope.info.rulesListMsg = {
					type : 'failure',
					msg : GlobalService.getVal('rulesMsgs')['rule_delete_multiple_failed']
				}
			}
			handleSessionTimeout(response);
		});
	};
	$scope.deleteMultipleRulesConfirm = function(){	
		if(!$scope.checkSelectedRules()){
			return;
		}
		var selectedRules = [], rule, found=false, filterredRules = $scope.getFilterredRules($scope.rulesList);
		for (var i = 0; i < filterredRules.length; i++) {
			rule = filterredRules[i];
			if (!!filterredRules[i].selected){
				//a rule creator can delete his rules
				// if(filterredRules[i].myRule){
				// 	found = true;
				// 	break;
				// }				
				// else if($scope.amIAdmin) {
				// 	found = true;
				// 	break;
				// }
				//for user have permission as rule_creator^M
				if(rule.rule_owner === $scope.myEmail){
					found = true;
					break;
				}	
			} 
		}
		if (!found) {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['rule_delete_select_all_error']
			});
			return;
		}
		for (var i = 0; i < filterredRules.length; i++) {
			rule = filterredRules[i];
			if (!!filterredRules[i].selected){
				// if(filterredRules[i].myRule){
				// 	selectedRules.push(filterredRules[i]);
				// }
				// else if($scope.amIAdmin) {
				// 	selectedRules.push(filterredRules[i]);
				// }
				
				if(rule.rule_owner === $scope.myEmail){
					selectedRules.push(filterredRules[i]);
				}	
			} 
		};
		$scope.multipleRulesDeleteReq = selectedRules;	
		$scope.msg = GlobalService.getVal('rulesMsgs')['rule_del_multiple'];
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/delete_multiple_rules.html", $scope, false, 'static');
	};
	$scope.goToDeleteRule = function(){
		var selectedRules = [], ids="", status="", r_name="", email_template_ids="";
		for (var i = 0; i < $scope.multipleRulesDeleteReq.length; i++) {
			if(!ids) ids = $scope.multipleRulesDeleteReq[i].rule_id;
			else ids = ids + "," + $scope.multipleRulesDeleteReq[i].rule_id;

			if(!status) status = $scope.multipleRulesDeleteReq[i].status;
			else status = status + "," + $scope.multipleRulesDeleteReq[i].status;

			if(!r_name) r_name = $scope.multipleRulesDeleteReq[i].rule_name;
			else r_name = r_name + "," + $scope.multipleRulesDeleteReq[i].rule_name;

			if(!email_template_ids) email_template_ids = $scope.multipleRulesDeleteReq[i].email_template_id;
                        else email_template_ids = email_template_ids + "," + $scope.multipleRulesDeleteReq[i].email_template_id;
		};
		$scope.deleteRuleRequest($scope.multipleRulesDeleteReq,ids,status,email_template_ids);
	};
	// Changes page size
	$scope.changePageSize = function() {
		$scope.info.page['count'] = parseInt($scope.info.page['count']);
		$scope.tableParams.count($scope.info.page['count']);
		$scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
		if ($scope.info.page['current'] > $scope.info.page['pages']) {
			$scope.info.page['current'] = $scope.info.page['pages'];
			$scope.tableParams.page($scope.info.page['current']);
		}
		RulesService.setPageState($scope.info.page['current']);
	};

	// Go to next page from current page if not on last page
	$scope.nextPage = function() {
		if ($scope.info.page['current'] < $scope.info.page['pages']) {
			$scope.info.page['current'] += 1;
			$scope.tableParams.page($scope.info.page['current']);
			RulesService.setPageState($scope.info.page['current']);
		}
	};

	// Go to previous page from current page if not on first page
	$scope.prevPage = function() {
		if ($scope.info.page['current'] > 1) {
			$scope.info.page['current'] -= 1;
			$scope.tableParams.page($scope.info.page['current']);
		}
		RulesService.setPageState($scope.info.page['current']);
	};

	// Go to first page from any page if not on first page
	$scope.firstPage = function() {
		if ($scope.info.page['current'] == 1)
			return;
		$scope.info.page['current'] = 1;
		$scope.tableParams.page($scope.info.page['current']);
		RulesService.setPageState($scope.info.page['current']);
	};

	// Go to last page from any page if not on last page
	$scope.lastPage = function() {
		if ($scope.info.page['current'] == $scope.info.page['pages'])
			return;
		$scope.info.page['current'] = $scope.info.page['pages'];
		$scope.tableParams.page($scope.info.page['current']);
		RulesService.setPageState($scope.info.page['current']);
	};
	// Update the filter object if some filter is applied using text box and update the page no. if required
	$scope.searchRule = function(field, clear) {
		if(clear){
			$scope.info[field] = "";
		}
		if ($scope.info[field] != "") {
			$scope.info.filter[field] = $scope.info[field];
			RulesService.setFilterState($scope.info.filter);
		} else {
			if (!!$scope.info.filter[field]) {
				delete $scope.info.filter[field];
				RulesService.setFilterState($scope.info.filter);
			}
		}
		RulesService.setStateGroupData($scope.groupedFilterData);
		$scope.resettofirst = true;
		$scope.tableParams.reload();
		// if ($scope.info.page['current'] > $scope.info.page['pages']) {
		// 	if ($scope.info.page['pages'] == 0) {undefined
		// 		$scope.info.page['current'] = 1;
		// 	} else {
		// 		$scope.info.page['current'] = $scope.info.page['pages'];
		// 	}
		// 	$scope.tableParams.page($scope.info.page['current']);		
		// }
	};
	$scope.showHideColumn = function(column,$event){
		column.selected=!column.selected;
		$event.stopPropagation();
	};
	// Update the filter object if some filter is applied by selecting checkbox from dropdown and update the page no. if required
	$scope.changeFilter = function(column, value, listvalue) {
		if ($scope.info[column.field][value]) {
			if (!$scope.info.filter[column.field]) {
				$scope.info.filter[column.field] = [];
			}
			$scope.info.filter[column.field].push(value);
			if (column.field != $scope.columns[$scope.columns.length - 1].field) {
				column.filterString = $scope.info.filter[column.field].join(', ');
			} else {
				column.filterString = '';
				for (var i = 0; i < $scope.info.filter[column.field].length; i++) {
					if (i == 0) {
						column.filterString += $scope.info.filter[column.field][i] == $scope.info.supportedStatus.Enabled ? 'Enabled' : ($scope.info.filter[column.field][i] == $scope.info.supportedStatus.Disabled ? 'Disabled' : 'Draft');
					} else {
						column.filterString += ', ' + ($scope.info.filter[column.field][i] == $scope.info.supportedStatus.Enabled ? 'Enabled' : ($scope.info.filter[column.field][i] == $scope.info.supportedStatus.Disabled ? 'Disabled' : 'Draft'));
					}
				}
			}
		} else {
			$scope.info.filter[column.field].splice($scope.info.filter[column.field].indexOf(value), 1);
			if ($scope.info.filter[column.field].length > 0) {
				if (column.field != $scope.columns[$scope.columns.length - 1].field) {
					column.filterString = $scope.info.filter[column.field].join(', ');
				} else {
					column.filterString = '';
					for (var i = 0; i < $scope.info.filter[column.field].length; i++) {
						if (i == 0) {
							column.filterString += $scope.info.filter[column.field][i] == $scope.info.supportedStatus.Enabled ? 'Enabled' : ($scope.info.filter[column.field][i] == $scope.info.supportedStatus.Disabled ? 'Disabled' : 'Draft');
						} else {
							column.filterString += ', ' + ($scope.info.filter[column.field][i] == $scope.info.supportedStatus.Enabled ? 'Enabled' : ($scope.info.filter[column.field][i] == $scope.info.supportedStatus.Disabled ? 'Disabled' : 'Draft'));
						}
					}
				}
			} else {
				column.filterString = "";
				delete $scope.info.filter[column.field];
			}
			
		}
		RulesService.setStateGroupData($scope.groupedFilterData);
		RulesService.setFilterState($scope.info.filter);
		RulesService.setPageState($scope.info.page['current']);
		$scope.showFilterCount();
		//user tracking call
		$scope.trackUser('Rules List', 'filter', $scope.info.filter);
		$scope.resettofirst = true;
		$scope.tableParams.reload();
		
		//$scope.info.page['current'] = 1;
		//$scope.tableParams.page($scope.info.page['current']);
		// if ($scope.info.page['current'] > $scope.info.page['pages']) {
		// 	if ($scope.info.page['pages'] == 0) {
		// 		$scope.info.page['current'] = 1;
		// 	} else {
		// 		$scope.info.page['current'] = $scope.info.page['pages'];
		// 	}
		// 	$scope.tableParams.page($scope.info.page['current']);
		// }
	};
	$scope.formatDateTime = function(dt){
		return moment( new Date(moment.utc(dt).format())).format('YYYY/MM/DD HH:MM:SS');
	}
	// Sort the column if clicked on the column header
	$scope.sortColumn = function(field) {
		if (!(document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "BUTTON")) {
			$scope.tableParams.sorting(field, $scope.tableParams.isSortBy(field, 'asc') ? 'desc' : 'asc');
			$scope.info.page['sortField'] = field + ($scope.tableParams.isSortBy(field, 'asc') ? 'asc' : 'desc');
		}
	};

	// Clear all the applied filters on the page and set the page no. to 1
	$scope.clearAppliedFilters = function () {
		for (var i in $scope.groupedFilterData) {
			delete $scope.groupedFilterData[i].filterString;
		}
		if (Object.keys($scope.info.filter).length != 0) {
			for (var i in $scope.groupedFilterData) {
				if ($scope.groupedFilterData[i]['field'] == 'label_display' || $scope.groupedFilterData[i]['field'] == 'description' || $scope.groupedFilterData[i]['field'] == 'author' || $scope.groupedFilterData[i]['field'] == 'rule_name') {
					$scope.info[$scope.groupedFilterData[i]['field']] = "";
				} else {
					$scope.info[$scope.groupedFilterData[i]['field']] = {};
					if ($scope.groupedFilterData[i].data && Array.isArray($scope.groupedFilterData[i].data)) {
						$scope.groupedFilterData[i].data.forEach(function (item) {
							item.selected = false;
						})
					}
				}
			}
			$scope.info.filter = {};
			RulesService.setFilterState(undefined);
			RulesService.setPageState(undefined);
			RulesService.setStateGroupData(undefined);
			$scope.tableParams.reload();

			$scope.info.page['current'] = 1;
			$scope.tableParams.page($scope.info.page['current']);
		}
		if ($scope.info.page['sortField'] != $scope.info.initialSortField + 'desc') {
			$scope.tableParams.sorting($scope.info.initialSortField, 'desc');
			$scope.info.page['sortField'] = $scope.info.initialSortField + 'desc';
		}
		RulesService.setStateGroupData(undefined);
		//RulesService.setFilterState(undefined);
	};

	// Check if any filter is applied or not
	$scope.checkAppliedFilters = function() {
		var filters = false;
		if (Object.keys($scope.info.filter).length != 0)
			filters = true;
		if (filters || $scope.info.page['sortField'] != $scope.info.initialSortField + 'desc') {
			return true;
		}
		return false;
	};

	// Function to render text in html format
	$scope.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};

	// Function to handle session timeout
	function handleSessionTimeout(response) {
		if (!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
			$scope.info.sessionTimedOut = true;
			ModalService.sessionTimeout();
		}
	};

	//Main Analytics control variable
	$scope.showAnalyicsModal = function(){
		$scope.showAnalyticsDashboards = true;
		$scope.modal = ModalService.openModal('partials/rules-and-alerts/dashboard.html', $scope, "gb-rules-dashboard-modal", 'static');
		//user tracking call
		$scope.trackUser('Main_Analytics', 'View', {View: "Main analytics", data: "none"});
	}
	$scope.hideAnalyticsModal = function(){
		$scope.showAnalyticsDashboards = false;
		$scope.modal.close();
	};
	$scope.showOwnersDropDown = function(){
		if(!$scope.availableRulesOwnerList.length){
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['rules_owner_list_not_found']
			});
		}
	};
	$scope.loadRulesOwnerList = function(){		
		//get owner list
		RulesService.getRulesOwenrList().then(function(response) {
			var responseData = response.data.Data;
			$scope.availableRulesOwnerList = responseData;
		}, function(response) {
			$scope.info.rulesListMsg = {
				type : 'failure',
				msg : GlobalService.getVal('rulesMsgs')['rules_load_owners_list_failed']
			};
			$scope.availableRulesOwnerList = [];
		});
	};	
	$scope.filterOwnerListByRule = function(owner,  filter){
		var list = [];
		if($scope.availableRulesOwnerList){
			for(var i=0;i<$scope.availableRulesOwnerList.length;i++){
				if($scope.availableRulesOwnerList[i].email != owner){
					if(filter){
						if($scope.availableRulesOwnerList[i].email.indexOf(filter) != -1){
							list.push($scope.availableRulesOwnerList[i]);
						}
					}else{
						list.push($scope.availableRulesOwnerList[i]);
					}
				}
			}
		}

		return list;
	}
	//load all owners details
	$scope.loadRulesOwnerList();
	$scope.updateRulesWithOwnerInformation = function(rule_id, owner){
		$scope.rulesList.forEach(function(rule){
			if(rule.rule_id === rule_id){
				rule.rule_owner = owner;
			}
		});
	};
	$scope.changeRuleOwnershipRequest = function(){
		$scope.modal.close();
		//$scope.showColumnFilterPanel = false;
		$scope.info.rulesLoading = true;
		var param = {
			'rule_owner': $scope.currentOwner,
			'rule_id'  : $scope.currentRule.rule_id,
			'rule_status' : $scope.currentRule.status
		}
		//get owner list
		RulesService.updateRuleOwnership(param).then(function(response) {
			var responseData = response.data.Data;
			$scope.trackUser('Ownership', 'change', param);
			$scope.reloadRules();
		}, function(response) {
			$scope.info.rulesLoading = false;
			$scope.info.rulesListMsg = {
				type : 'failure',
				msg : GlobalService.getVal('rulesMsgs')['update_rule_load_owners_failed']
			};
		});
	};
	$scope.FilterRulesBasedOnUserRoleAndPermission = function(){
		var list = $scope.rulesList.filter(function(rule){
			//for admin user return all rules
			if($scope.amIAdmin){
				rule.myRule = true;
				return true;
			}
			//filterred outother user's draft rule
			if((rule.status === $scope.info.supportedStatus['Draft']) && (rule.rule_owner !== $scope.myEmail)){
				rule.myRule = false;
				return false;
			}
			//for user have permission as rule_creator
			if(rule.rule_owner === $scope.myEmail){
				rule.myRule = true;
				return true;
			}
			//for non admin and not the owner of the rule
			rule.myRule = false;
			return true;
		});
		$scope.rulesList = list;
	}

	//RuleWise control variable
	$scope.showRuleWiseAnalyticsModal = function(ruleid){
		$scope.showRuleWiseAnalyticsDashboard = true;
		var rid = ruleid;
		RulesService.setSelectedRuleForAnalytics(rid);
		$scope.selectedRuleForRuleLabelAnalytics  = ruleid;
		$scope.modal = ModalService.openModal('partials/rules-and-alerts/dashboard-rule-level.html', $scope, "gb-rule-level-dashboard-modal", 'static');
		var details = JSON.stringify({rule_id: ruleid});
		//user tracking call
		$scope.trackUser('Rule_wise_Analytics', 'View', {rule_id: ruleid});
		// UserTrackingService.standard_user_tracking($scope.info.application, 'Rule_wise_Analytics', 'View', details).then(function(response) {

		// }, handleSessionTimeout);

	}
	$scope.hideRuleWiseAnalyticsModal = function(){
		$scope.showRuleWiseAnalyticsDashboard = false;
		$scope.modal.close();
	}	
	$scope.ruleDrillDetails = function (rule) {
		$scope.showViewDetailsDiv = false;
		$scope.currentRuleName=[];
		$scope.currentRule = [];
		$scope.currentRule.push(rule);
		$scope.currentRuleName = $scope.currentRule[0].rule_name;
		$scope.current_label_display = $scope.currentRule[0].label_display;
		//get changes list
		RulesService.getRuleDrillDetails($scope.currentRuleName).then(function (response) {
			var responseData = response.data.Data, version = 0;
			//process response and remove  object whose key is null
			responseData.map(function(item){
				version++;
				if(item.changes_map){
					var found = false;
					for(var i=0;i<item.changes_map.length;i++){
						for (var prop in item.changes_map[i]) {
							if(prop == null || prop == 'null'){
								found = true;
								break;
							}
							//modify it if state change during Edit rule
							if(prop == 'state'){
								if(item.changes_map[i][prop] && (item.changes_map[i][prop]['From'] == $scope.info.supportedStatus.Enabled ||item.changes_map[i][prop]['From'] == $scope.info.supportedStatus.Disabled)){
									if(item.changes_map[i][prop]['To'] == $scope.info.supportedStatus.Draft){
										found = true;
										break;
									}
								}
							}
						}
						if(found){
							break;
						}
					}
					if(found){
						item.changes_map.splice(i,1);
					}
					//check the changes and modify to LOGIC changes
					if(item.changes_map.length == 1){
						if(Object.keys(item.changes_map[0]) && Object.keys(item.changes_map[0])[0] == 'logic'){
							item.type_of_change = $scope.info.rulesHistoryTypesOfChanges.logic;
						}
					}
				}
				if(item.type_of_change != $scope.info.rulesHistoryTypesOfChanges.created && (item.type_of_change === $scope.info.rulesHistoryTypesOfChanges.state || item.changes_map.length == 0)){
					version--;
				}
				item.version = version;
				item.number_of_changes = item.changes_map.length;
				item.comments = item.comments == null || item.comments == 'null'?"":item.comments;
			});
			
			$scope.changeDetails = responseData;
			if($scope.changeDetails.length == 0){
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['emptyRuleHistoryAlertMsg']
				});
				return;	
			}
			$scope.modal = ModalService.openModal('partials/rules-and-alerts/rule-drill-details.html', $scope, "gb-rule-level-dashboard-modal", true, 'static');
			$scope.trackUser('Rule Change History', 'View', $scope.currentRule);
		}, function (response) {

		});
	}

	$scope.ruleHistoryExpandToggle= function(){
		$scope.info.ruleHistoryTableExpandAll = !$scope.info.ruleHistoryTableExpandAll;
		$scope.changeDetails.map(function(item){
			if(item.number_of_changes && item.number_of_changes > 0){
				if($scope.info.ruleHistoryTableExpandAll) item.showDetails = true;
				else item.showDetails = false;
			}
		})
	}

	$scope.drillViewDetails = function(obj){
		if(obj.showDetails){
			obj.showDetails = false;
			$scope.info.ruleHistoryTableExpandAll = false;
		}else{
			obj.showDetails = true;
		}
	}
	
	$scope.closeVidetailspopup = function(id){
		$scope.showViewDetailsDiv = false;
	}
	$scope.showHideOwnerList = function(rule){
		if($scope.amIAdmin){
			return true;
		}
		return rule.myRule;
	}	
	$scope.showHideActionItem = function(rule){
		if((rule.status === $scope.info.supportedStatus['Draft']) && (rule.rule_owner !== $scope.myEmail)){
			return false;
		}
		//for user have permission as rule_creator
		if(rule.rule_owner === $scope.myEmail){
			return true;
		}
		return false;
	}

	//Rule read only details view function
	$scope.ruleReadOnlyInfo = function (rule) {
		$scope.info.showSampleTemplate = false
		$scope.info.rulesLoading = true;
		$scope.info.ignoreText1 = "Subject"
		$scope.info.ignoreText2 = "Body"
		// Stores the list of templates
		RulesService.getTemplates().then(function (response) {
			$scope.info.templates = response.data.Data || [];
			if($scope.info.templates.length){
				 $scope.info.tempbody = $scope.info.templates.filter(function(tp){
					tp.template_id == rule.email_template_id;
				});

				$scope.info.templates.forEach(function(item){
					if(item.template_id == rule.email_template_id){
						$scope.info.showSampleTemplate = true
					rule.subject = item.subject;
					rule['body'] =  item.body ;
					}
				})
			}
			
	
			$scope.modal = ModalService.openModal("partials/rules-and-alerts/rule-read-only-info.html", $scope, "gb-read-only-details-modal", true,'static');
			$scope.info.rulesLoading = false;

		}, function (response) {
			$scope.info.showSampleTemplate = false;
			$scope.info.templates = [];
			console.error("Unable to load templates");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addRuleMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}
			handleSessionTimeout(response);
		});
			$scope.headersReadOnly = GlobalService.getVal('readOnlyHeaders');
			$scope.sampleTemplateHeaders = GlobalService.getVal('sampleTemplateHeaders');
			$scope.readOnlyDetails = rule;
			$scope.readOnlyDetails.action = $scope.readOnlyDetails.email_template_id > 0 ? "Persist and Email" : ($scope.readOnlyDetails.api_template_id > 0 ? "Persist and Call API": "Persist" )
	}

	//usertracking function
	$scope.trackUser = function(app_Page, operation, details){
		var details = JSON.stringify(details);
		UserTrackingService.standard_user_tracking($scope.info.application, app_Page, operation, details).then(function(response) {

		}, handleSessionTimeout);
	}

	//go to admin config function
	$scope.openApiAdminConfig = function () {
		$scope.$parent.changeCurrentPage('api_admin_config');

	}
	$scope.exportRules = function() {
		return $q.all([RulesService.getAllRules('supported'),RulesService.getAllRules('unsupported')]).then(function(rulelists){
			var supportedRuleList = rulelists[0].data.Data;
			var unsupportedRuleList = rulelists[1].data.Data;
			var csv = [];
			var columnsTitle = [];
			var columnsActual = [];
			var filename = "ruleList.csv";
			$scope.columnsToExport.forEach(function(column){
				if(column.enabled){
					columnsTitle.push(column.title.trim());
					columnsActual.push(column.field.trim());
				}
			});
			csv.push(columnsTitle.join(","));
			if(supportedRuleList && Array.isArray(supportedRuleList)){
				supportedRuleList.forEach(function(rule){
					var row = [];
					columnsActual.forEach(function(column){
						if(rule[column]){
							var str = rule[column].trim();
							str = str.replace(/,/g, '-');
							str = str.replace(/\./g, ' ');
							str = str.replace(/\./g, ' ');
							str = str.replace(/["']/g, "");
							str = str.replace(/[\r\n(\r\n)]/g," ");
							row.push(str);
						}else{
							row.push("");
						}
					});
					csv.push(row);
				});
			}
			if(unsupportedRuleList && Array.isArray(unsupportedRuleList)){
				unsupportedRuleList.forEach(function(rule){
					var row = [];
					columnsActual.forEach(function(column){
						if(rule[column]){
							var str = rule[column].trim();
							str = str.replace(/,/g, '-');
							str = str.replace(/\./g, ' ');
							str = str.replace(/\./g, ' ');
							str = str.replace(/["']/g, "");
							str = str.replace(/[\r\n(\r\n)]/g," ");
							row.push(str);
						}else{
							row.push("");
						}
					});
					csv.push(row);
				});
			}
			csv = csv.join("\n");
			UtilService.downloadCSV(csv, filename);
		});
	}
	//show hide alert api feature based on response from meta config api response
	RulesService.getAllConfig().then(function (response) {
		$scope.showAlertApiFeature = response.data.Data.config.api_template_feature;
		RulesService.setshowAlertApiFeature($scope.showAlertApiFeature);
		//call the api only if feature is enabled
		if ($scope.showAlertApiFeature) {
			RulesService.getAPITemplates().then(function (response) {
				RulesService.setApiTemplateList(response.data.Data);
			}, function (response) {

			});
		}
	}, function (response) {
	});

	//Call section api then with first column name get the global attributes for the same
	RulesService.getSectionsAPI().then(function (response) 
	{
		if(response.data.Data.length != 0){
		RulesService.getSectionColumns(response.data.Data[0].table_name).then(function (response)
		 {	
			var globAttrib = {};
				var lst = response.data.Data.map(function (obj) {
					if (obj[Object.keys(obj)[0]]["solr_facet"] == "G") {
						//globAttrib.push(obj[Object.keys(obj)[0]]["attribute_label"]);
						globAttrib[obj[Object.keys(obj)[0]]["attribute_label"]] = "#" + obj[Object.keys(obj)[0]]["column_name"];
					}
				})
				//var globAttrib = {};
				RulesService.setGlobalAttribArr(globAttrib);
			
		}, function(response) {
			return false;
			
		});
	}
	if(response.data.Data.length == 0){
		return;
	}
	}, function(response) {
		return false;
	});

	$scope.showFilterCount = function(){
		$scope.filterCount = Object.keys($scope.info.filter).length;
	};
	//time filter change for rule list
	$scope.ruleListTimeFilterChange= function(column, value){
		$scope.info[column.field] = {
			startTime : value.startTime,
			endTime : value.endTime
		};
		$scope.info.filter[column.field] = [];
		$scope.info.filter[column.field].push(value);
		$scope.trackUser('Rules List', 'filter', $scope.info.filter);

		$scope.tableParams.reload();
		$scope.info.page['current'] = 1;
		$scope.tableParams.page($scope.info.page['current']);
	}	
	$scope.selectDateFilterItem = function (column, value) {
		if($scope.info.filter[column.field]){
			if($scope.info.filter[column.field][0].label == value.label){
				return true;
			} 
			RulesService.setStateGroupData($scope.groupedFilterData);
		RulesService.setFilterState($scope.info.filter);
		RulesService.setPageState($scope.info.page['current']);
		}
		return false;
	}
	//check if the icon should be shown or not
	$scope.checkfilter = function(){
		var selectedRules = $filter('filter')($scope.currentRuleList, {
			selected : true
		}) || [];
		$scope.info.bulkTitle = $scope.info.filter["status"] ? ($scope.info.filter["status"].length == 1 ? "Select 2 or more rules to edit":"Apply Draft/Enabled/Disabled filter") : "Apply Draft/Enabled/Disabled filter";

		if($scope.info.filter["status"] && selectedRules.length > 1	){
			return $scope.info.filter["status"].length == 1 ? true : false; 
		}else{
			return false;
		}
		
	}

	//Bulk edit rule function to open modal
	$scope.bulkEditRules = function () {
		if (!$scope.checkfilter()) {
			return;
		}

		if (!$scope.availableRulesOwnerList.length) {
			ModalService.alertBox({
				msg: GlobalService.getVal('rulesMsgs')['rules_owner_list_not_found']
			});
			return;
		}

		//check if rule has been selected or not return false otherwise
		$scope.currentLoggedUser = $cookies.username;
		var selectedRules = [], found = false, filterredRules = $scope.currentRuleList;
		//filter to show only the rules owned by logged in user
		for (var i = 0; i < filterredRules.length; i++) {
			if (!!filterredRules[i].selected) {
				if (filterredRules[i].rule_owner == $scope.currentLoggedUser) {
					selectedRules.push(filterredRules[i]);
				}
			}
		}

		//selectedRules array will be empty if the user selects the rules not owned by him
		if (selectedRules.length < 1) {
			ModalService.alertBox({
				msg: GlobalService.getVal('rulesMsgs')['bulk_edit_multiple_warn']
			});
			return;
		}

		$scope.ownedrulesId = [];
		$scope.ownedrules = selectedRules.map(function (item) {
			$scope.ownedrulesId.push(item.rule_id);
			return item.rule_name;
		});
		$scope.showenable = $scope.info.filter.status[0] == "DISABLED" ? true : false;
		$scope.showdisable = $scope.info.filter.status[0] == "ENABLED" ? true : false;
		$scope.currentRulesStatus = $scope.info.filter.status[0]
		$scope.info.modelenable = false;
		$scope.info.modeldisable = false;

		//$scope.currentOwner = newOwner;
		$scope.msg = GlobalService.getVal('rulesMsgs')['owner_change_multiple'];
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/bulk_edit_rules.html", $scope, "gb-rules-bulk-edit-modal", true, 'static');
		$scope.bulkdata = {
			status: $scope.currentRulesStatus,
			author: "",
			description: "",
			category: "select",
			kb_link: "",
			priority: "select",
			severity: "select",
			max_alerts_display_ui: "",
			rule_owner: "select",
			comment: ""

		}
	}

	//change ststus function
	$scope.changestatus = function (type) {

		if (type == $scope.bulkdata.status) {
			$scope.bulkdata.comment = "";
			$scope.bulkdata.status = $scope.currentRulesStatus;
		}
		else {
			$scope.bulkdata.status = type;
		}

	}

	//function to submit bulkedit rules
	$scope.submitbulk = function () {
		//$scope.modal.close();
		if (validateme($scope.bulkdata)) {
			$scope.modal.close();
			$scope.bulkdata.rule_names = $scope.ownedrules;
			$scope.bulkdata.rule_ids = $scope.ownedrulesId;
			var val = Object.values($scope.bulkdata);
			for (var key in $scope.bulkdata) {
				if ($scope.bulkdata[key] == "select") {
					$scope.bulkdata[key] = "";
				}
			}
			$scope.info.rulesLoading = true;
			//call the api 
			RulesService.bulkUpdateRules($scope.bulkdata).then(function (response) {
				$scope.modal.close();
				$scope.info.actionMessage = "Updated "+$scope.bulkdata.rule_ids.length+" Rules.";
				$scope.info.actionMessageFlag = true;
				$scope.reloadRules();
			}, function (response) {
				$scope.info.rulesLoading = false;
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: "Unable to Bulk edit the rules. Please contact " + $scope.supportEmail
				};
			});

		}

		//Validate function
		function validateme(data) {

			//if enabled or disabled check for comments
			if (data.status && data.status != $scope.currentRulesStatus) {
				if (data.comment == "") {
					ModalService.alertBox({
						msg: "Please Enter a Comment"
					});
					return;
				}
			}

			//check for emptiness
			var count = 0;
			var val = Object.values(data);
			for (var i = 0; i < val.length; i++) {
				if (val[i] == "" || val[i] == "select" || val[i] == "ENABLED" || val[i] == "DISABLED" || val[i] == "DRAFT") {

				}
				else {
					count++;
				}
			}
			if (count == 0) {
				ModalService.alertBox({
					msg: "Nothing to edit",
				});
				return;
			}
			return true;

		}

	}

	$scope.showSubscriberList = function (rule) {
		$scope.info.subSearchText = "";
		$scope.subsort = true;
		$scope.currentname = rule.label_display;
		$scope.originalSubs = rule.subscriptionEmailList.slice();
		$scope.rulesubs = rule.subscriptionEmailList.sort();
		$scope.msg = "";
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/show_subscriber_list.html", $scope, 'gb-rule-list-subscribers', true, 'static');
	}

	$scope.sortSubscribers = function (type) {
		if (type == 'asc') {
			$scope.sortOrder = 'asc'
			$scope.subsort = true;
			$scope.rulesubs = $scope.rulesubs.sort();
		}
		else {
			$scope.subsort = false;
			$scope.sortOrder = 'desc'
			$scope.rulesubs = $scope.rulesubs.sort(function (a, b) {
				if (a > b)
					return -1;
				if (a < b)
					return 1;
				return 0;
			});
		}
	}


	//
	//
	//
	//

	//
	$scope.searchSubscribers = function () {
		if ($scope.info.subSearchText != "") {
			$scope.rulesubs = $scope.originalSubs.filter(function (item) {
				return item.indexOf($scope.info.subSearchText) > -1
			})
			if ($scope.rulesubs.length) {
				if ($scope.subsort) {
					$scope.sortSubscribers('asc')
				}
				else {
					$scope.sortSubscribers('desc')
				}
			}
		}

		else {
			$scope.rulesubs = $scope.originalSubs.slice();
			if ($scope.subsort) {
				$scope.sortSubscribers('asc')
			}
			else {
				$scope.sortSubscribers('desc')
			}

		}
	}
	$scope.resetSubSearch = function () {
		$scope.info.subSearchText = "";
		$scope.rulesubs = $scope.originalSubs.slice();
		if ($scope.subsort) {
			$scope.sortSubscribers('asc')
		}
		else {
			$scope.sortSubscribers('desc')
		}
	}


	$scope.subscribeFromUi = function (rule) {
		$scope.info.sysidLoading = false;
		$scope.info.toggleManageSubscription = true;
		$scope.info.initialToggleManageSubscription = true;
		$scope.singleSubscribeRule = rule;
		$scope.msg = GlobalService.getVal('rulesMsgs')['rule_subscribe_single'][0] + rule.label_display + GlobalService.getVal('rulesMsgs')['rule_subscribe_single'][1];
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/subscribe_rule.html", $scope, "gb-rule-single-subscribe-modal", false, 'static');
	}

	$scope.showManageSubscription = function (type) {
		$scope.info.sysidLoading = true;
		if (!$scope.info.toggleManageSubscription) {
			//$scope.modal.close()
			$scope.openSubscriptionModal($scope.singleSubscribeRule, type);
		} else {
			$scope.info.sysidLoading = false;
			//$scope.info.rulesLoading = false;
			// $scope.modal.close();
			// $scope.modal = ModalService.openModal("partials/rules-and-alerts/subscribe_rule.html", $scope, "gb-rule-single-subscribe-modal", false, 'static');
			// $scope.info.rulesLoading = false;
		}
	}

	$scope.subscribeFromUiConfirm = function () {
		
		if (!$scope.info.toggleManageSubscription) {
			$scope.info.sysidLoading = true;
		} 
		$scope.info.rulesLoading = true;
		$scope.info.rulesPageLoading = true;
		var addSubscriptionPayload = {
			"subscribers": [
				{
					"mps": $cookies.mps,
					"ruleId": $scope.singleSubscribeRule.rule_id,
					"emailId": $cookies.username
				}]
		}
		//call single subscribe api
		RulesService.singleSubscribeRule($scope.singleSubscribeRule.rule_id).then(function (response) {

			if (!$scope.info.toggleManageSubscription) {
				$scope.saveSubscriptionFilter();
			} 
				$scope.info.rulesListMsg = {
					type: 'success',
					msg: GlobalService.getVal('rulesMsgs')['rule_subscription_success']
				}
				$scope.info.rulesLoading = true;
				$scope.reloadRules();
				$scope.trackUser('Rules List', 'single unsubscribe', $scope.singleSubscribeRule);
			

		}, function (response) {
			$scope.info.rulesListMsg = {
				type: 'failure',
				msg: GlobalService.getVal('rulesMsgs')['rule_subscription_failure']
			}
			console.error("Unable subscribe from ui");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addRuleMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}
			$scope.info.rulesLoading = false;
			handleSessionTimeout(response);
		});
	}

	$scope.unsubscribeFromUi = function (rule) {
		$scope.singleUnsubscribeRule = rule;
		$scope.msg = GlobalService.getVal('rulesMsgs')['rule_unsubscribe_single'][0] + rule.label_display + GlobalService.getVal('rulesMsgs')['rule_unsubscribe_single'][1];
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/unsubscribe_rule.html", $scope, "gb-rule-single-unsubscribe-modal", false, 'static');
	};

	//call single unsubscribe api
	$scope.unsubscribeFromUiConfirm = function () {
		$scope.modal.close();
		$scope.info.rulesLoading = true;
		RulesService.singleUnsubscribeRule($scope.singleUnsubscribeRule.rule_id).then(function (response) {
			$scope.deleteSubscriptionFilter($scope.singleUnsubscribeRule);
			$scope.info.rulesListMsg = {
				type: 'success',
				msg: GlobalService.getVal('rulesMsgs')['rule_unsubscription_success']
			}
			
			$scope.reloadRules();
			$scope.trackUser('Rules List', 'single unsubscribe', $scope.singleUnsubscribeRule);
		}, function (response) {
			console.error("Unable to load templates");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addRuleMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}
			handleSessionTimeout(response);
		});
	}

	//function to show bulk subscribe icon
	$scope.showBulkSubscribe = function () {
		var count = 0;
		var selectedRules = $filter('filter')($scope.currentRuleList, {
			selected: true
		}) || [];
		var showIcon = false;
		if (selectedRules.length > 1) {
			selectedRules.forEach(function (rule) {
				if (rule['subscribeIcon']) {
					count++;
				}
			})
		}
		if (count > 1) {
			showIcon = true
		}
		return showIcon
	}

	//function to show bulk unsubscribe icon

	$scope.showBulkUnsubscribe = function () {
		var count = 0;
		var selectedRules = $filter('filter')($scope.currentRuleList, {
			selected: true
		}) || [];
		var showIcon = false;
		if (selectedRules.length > 1) {
			selectedRules.forEach(function (rule) {
				if (rule['subscribeIcon'] == false) {
					count++
				}
			})
		}
		if (count > 1) {
			showIcon = true
		}
		return showIcon
	}

	//bulk subscribe 

	$scope.openBulkSubscribe = function () {
	
		var selectedRules = $filter('filter')($scope.currentRuleList, {
			selected: true
		}) || [];
		$scope.rulesToSubscribe = selectedRules.filter(function (item) {

			if (item['subscribeIcon']) {
				return item;
			}
		}) || []
		if(!$scope.rulesToSubscribe.length){
				return;
		}
		$scope.msg = GlobalService.getVal('rulesMsgs')['bulk_subscribe_rules'];
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/bulk_subscribe.html", $scope, "gb-rules-bulk-edit-modal", true, 'static');
	}

	//bulk Unsubscribe 
	$scope.openBulkUnsubscribe = function () {
		var selectedRules = $filter('filter')($scope.currentRuleList, {
			selected: true
		}) || [];
		$scope.rulesToUnsubscribe = selectedRules.filter(function (item) {
			if (item['subscribeIcon'] == false) {
				return item;
			}
		}) || [];
		if(!$scope.rulesToUnsubscribe.length){
			return;
	}
		$scope.msg = GlobalService.getVal('rulesMsgs')['bulk_unsubscribe_rules'];
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/bulk_unsubscribe.html", $scope, "gb-rules-bulk-edit-modal", true, 'static');
	}

	$scope.bulkSubscribeConfirm = function () {
		$scope.info.rulesLoading = true;
		var postdata = {
			"rule_ids": $scope.rulesToSubscribe.map(function (rule) { return rule.rule_id }),
			"emailId": $cookies.username
		}
		RulesService.bulkSubscribeUnsubscribe(postdata, true).then(function (response) {
			
			$scope.modal.close();
			$scope.info.rulesListMsg = {
				type: 'success',
				msg: GlobalService.getVal('rulesMsgs')['rule_subscription_success']
			}

			$scope.reloadRules();
			$scope.trackUser('Rules List', 'bulk subscribe', postdata);
		},function (response) {
			console.error("Unable to save ");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}else{
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: "Unable to save data Please contact " + $scope.supportEmail
				};
			}
			handleSessionTimeout(response);
			$scope.info.rulesLoading = false;
			$scope.info.sysidLoading = false;

		});

	}

	$scope.bulkUnsubscribeConfirm = function () {
		var postdata = {
			"rule_ids": $scope.rulesToUnsubscribe.map(function (rule) { return rule.rule_id }),
			"emailId": $cookies.username
		}
		RulesService.bulkSubscribeUnsubscribe(postdata, false).then(function (response) {
			$scope.deleteSubscriptionFilter($scope.rulesToUnsubscribe.map(function (rule) { return rule.rule_id }), true);
			$scope.modal.close();
			$scope.info.rulesListMsg = {
				type: 'success',
				msg: GlobalService.getVal('rulesMsgs')['rule_unsubscription_success']
			}
			$scope.info.rulesLoading = true;
			$scope.reloadRules();
			$scope.trackUser('Rules List', 'bulk unsubscribe', postdata);
		},function (response) {
			console.error("Unable to save ");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}else{
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: "Unable to save data Please contact " + $scope.supportEmail
				};
			}
			handleSessionTimeout(response);
			$scope.info.rulesLoading = false;
			$scope.info.sysidLoading = false;

		});
	}

	//subscription paginationsysPageSize: number = 200;
	$scope.initializeSubscriptionConstants = function (rule) {
		$scope.info.selectedRuleForSubscription = rule;
		$scope.info.shouldCallLoadPages = true
		$scope.info.selectedSysIds = [];
		$scope.info.selectedSysIdsMaster = [];
		$scope.info.pages = [];
		$scope.info.sysPageSize = 200;
		$scope.info.rulesLoading = true;
		$scope.info.sysIdAttr = "sysid1";
		$scope.info.sysidSearchObj = { "search": {} };
		$scope.info.sysidPagination = {
			pageSiz: $scope.info.sysPageSize,
			startIndex: 0,
			endIndex: $scope.info.sysPageSize - 1,
			noOfPages: 0,
			currentPage: 1,
			paginationText: ''
		};
		$scope.info.searchsysIdAttributes = GlobalService.getVal('searchIdAttributes');
		$scope.info.searchIdAttributesUnsubscribed = GlobalService.getVal('searchIdAttributesUnsubscribed');
		$scope.info.lastSelectedRow = {
			rowIndex: 0
		};
		$scope.info.tempAddSysIdList = [];
		$scope.info.tempRemoveSysIdList = [];
		$scope.info.inSearchView = false;
		$scope.info.selectedSearchAttrList = [];
		$scope.info.availableSelectall = false;
		$scope.info.selectedSelectall = false;
		$scope.info.inSearchViewUnsubscribed = false;
		$scope.info.selectedSearchAttrListUnsubscribed = [];
		$scope.info.sysIdList = [];
	}



	//Manage subscription
	$scope.openSubscriptionModal = function (rule, type) {
		$scope.initializeSubscriptionConstants(rule);
		$q.all([RulesService.getSysidColList(), RulesService.getUnsubscribedSysids(rule.rule_id, $cookies.username)]).then(function (resultarr) {

			$scope.info.sysIdAttributeList = resultarr[0].data.Data.cols.map(function (e) { e.value = ''; return e });
			$scope.info.sysIdAttributeListUnsubscribed = angular.copy($scope.info.sysIdAttributeList)
			if (resultarr[1].data.Data.length) {
				if (resultarr[1].data.Data[0].excSysIds.length) {
					var manufacturer = GlobalService.getVal('manufacturer');
					var product = GlobalService.getVal('product');
					var schema = GlobalService.getVal('schema');
				
					var postdata =  [{
						mfr : manufacturer,
						prod: product,
						sch: schema,
						sysid_col_name: "sysid1",
						sysids: resultarr[1].data.Data[0].excSysIds
					  }]
					RulesService.getExcludedSysidDetails(postdata).then(function (response2) {
						$scope.info.selectedSysIds = response2.data.Data;
						$scope.info.selectedSysIds.map(function(item, index) {
							item.rowIndex = index;
						  })

					}, function (response) {
						console.error("Unable to load excluded SYSID details");
						if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
							GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
							$scope.info.rulesListMsg = {
								type: 'failure',
								msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
							};
						} else {
							$scope.info.rulesListMsg = {
								type: 'failure',
								msg: "Unable to load data Please contact " + $scope.supportEmail
							};
						}
						handleSessionTimeout(response);
						setTimeout(function () {
							$scope.modal.close();
							$scope.info.rulesListMsg = {
								type: 'failure',
								msg: "Unable to load data Please contact " + $scope.supportEmail
							};
						})
						
						$scope.info.rulesLoading = false;
						$scope.info.sysidLoading = false;
					});
				} else {
					$scope.info.selectedSysIds = [];
				}

				$scope.info.selectedSysIdsFlat = type == 'edit' ? resultarr[1].data.Data[0].excSysIds : [];
			} else {
				$scope.info.selectedSysIds = [];
				$scope.info.selectedSysIdsFlat = [];
			}
			//$scope.info.currentGroupname = (resultarr[1].data.Data[0] && resultarr[1].data.Data[0].group) || 'shubham_g3';
			//$scope.info.selectedSysIdsFlat = $scope.info.selectedSysIds.length ? $scope.info.selectedSysIds.map($scope.flattenSysid) : [];
			$scope.populateDefaultSearchList();
			$scope.populateDefaultSearchListUnsubscribed();
			$scope.getInitialSysidList(type, rule, $scope.opensubmodal);
		},function (response) {
			console.error("Unable to load ");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}else{
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: "Unable to load data Please contact " + $scope.supportEmail
				};
			}
			handleSessionTimeout(response);
			$scope.info.rulesLoading = false;
			$scope.info.sysidLoading = false;

		})
	}

	//function to open subscription modal
	$scope.opensubmodal = function (rule) {
		$scope.msg = GlobalService.getVal('rulesMsgs')['rule_unsubscribe_single'][0] + rule.rule_name + GlobalService.getVal('rulesMsgs')['rule_unsubscribe_single'][1];
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/manage_subscription.html", $scope, "gb-rule-manage-subscription-modal", false, 'static');
		$scope.info.rulesLoading = false;
	}

	//sort function for sysids
	$scope.sysidSortFunction = function compareIndexFound(a, b) {
		if (a.disabled) { return 1; }
		if (!a.disabled) { return -1; }
		return 0;
	}

	//get subscribed sysid list
	$scope.getInitialSysidList = function (type, rule, callback) {
		$scope.info.sysidPagination.startIndex = 0;
		$scope.info.sysidPagination.endIndex = 200;
		RulesService.getSysidList($scope.info.sysidPagination.startIndex, $scope.info.sysidPagination.endIndex, $scope.info.sysidSearchObj, $cookies.username).then(function (response) {
			$scope.info.totalSysidCount = parseInt(response.data.Count);
			$scope.info.currentGroupname = (response.data.Group) || '';

			if (type == 'edit' && $scope.info.selectedSysIdsFlat.length) {
				// var filterFunction = function (item) {
				// 	if ($scope.info.selectedSysIdsFlat.indexOf(item.sysid1) >= 0) return item;
				// }

				// $scope.info.selectedSysIds = response.data.Data.filter(filterFunction) || [];
				// $scope.info.selectedSysIds = $scope.info.selectedSysIds.map(function(item, index){
				// 	item.rowIndex = index;
				// 	return item;
				//   })

				if ($scope.info.selectedSysIdsFlat && $scope.info.selectedSysIdsFlat.length) {
					response.data.Data.map(function (obj, index) {
						obj.disabled = $scope.info.selectedSysIdsFlat.indexOf(obj[$scope.info.sysIdAttr]) > -1 ? true : false;
						if ($scope.info.selectedSysIdsFlat.indexOf(obj[$scope.info.sysIdAttr]) > -1) {
							var selectedObj = {};
							$scope.info.sysIdAttributeList.map(function (item) {
								selectedObj[item.colName] = obj[item.colName];
							})
							selectedObj.disabled = false;
							selectedObj.rowIndex = index;
							selectedObj.selected = false;
							$scope.info.selectedSysIds.push(selectedObj);
							$scope.info.selectedSysIds = _.uniqBy($scope.info.selectedSysIds, $scope.info.sysIdAttr);
						}
					});
					$scope.info.selectedSysIdsMaster = angular.copy($scope.info.selectedSysIds);
				}
			}
			$scope.info.sysIdList = response.data.Data.sort($scope.sysidSortFunction)
			$scope.info.sysIdList = $scope.info.sysIdList.map(function (obj, index) {
				obj.rowIndex = index;
				obj.selected = false;
				//obj.disabled = $scope.info.selectedSysIdsFlat.indexOf(obj[$scope.info.sysIdAttr]) > -1 ? true : false;
				return obj;
			});
			$scope.getPages();
			var endIndex = $scope.info.totalSysidCount <= $scope.info.sysidPagination.endIndex ? $scope.info.totalSysidCount : $scope.info.sysidPagination.endIndex + 1;
			$scope.info.sysidPagination.paginationText = 'Showing ' + ($scope.info.sysidPagination.startIndex + 1) + ' to ' + endIndex + ' of ' + $scope.info.totalSysidCount;
			type == 'edit' && callback(rule);
			if (type == 'add') {
				$scope.info.selectedSysIds = [];
				$scope.info.selectedSysIdsMaster = [];
				$scope.info.sysidLoading = false;
				$scope.info.rulesLoading = false;
			}
			$scope.info.shouldCallLoadPages = false
		},function (response) {
			console.error("Unable to load sysid list ");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}else{
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: "Unable to load data Please contact " + $scope.supportEmail
				};
			}
			handleSessionTimeout(response);
			$scope.info.rulesLoading = false;
			$scope.info.sysidLoading = false;
			$scope.info.sysIdList = []

		})
	}

	$scope.getSysId = function (selectedSysIds) {
		RulesService.getSysidList($scope.info.sysidPagination.startIndex, $scope.info.sysidPagination.endIndex, $scope.getSearchObj(), $cookies.username).then(function (response) {
			$scope.info.totalSysidCount = parseInt(response.data.Count);
			$scope.info.currentGroupname = response.data.Group || '';
			if (selectedSysIds && selectedSysIds.length) {
				response.data.Data.map(function (obj, index) {
					obj.disabled = selectedSysIds.indexOf(obj[$scope.info.sysIdAttr]) > -1 ? true : false;
					if (selectedSysIds.indexOf(obj[$scope.info.sysIdAttr]) > -1) {
						var selectedObj = {};
						$scope.info.sysIdAttributeList.map(function (item) {
							selectedObj[item.colName] = obj[item.colName];
						})
						selectedObj.disabled = false;
						selectedObj.rowIndex = index;
						selectedObj.selected = false;
						
						if($scope.info.inSearchViewUnsubscribed){
							$scope.info.selectedSysIdsMaster.push(selectedObj);
							$scope.info.selectedSysIds = _.uniqBy($scope.filterSeletedSysid(), $scope.info.sysIdAttr);
						}else{
							$scope.info.selectedSysIds.push(selectedObj);
							$scope.info.selectedSysIds = _.uniqBy($scope.info.selectedSysIds, $scope.info.sysIdAttr);
							$scope.info.selectedSysIdsMaster = angular.copy($scope.info.selectedSysIds);
						}
						
					}
				});
			}
			$scope.info.sysIdList = response.data.Data.sort($scope.sysidSortFunction);
			$scope.info.sysIdList = $scope.info.sysIdList.map(function (obj, index) {
				obj.rowIndex = index;
				obj.selected = false;
				//obj.disabled = $scope.info.selectedSysIdsFlat.indexOf(obj[$scope.info.sysIdAttr]) > -1 ? true : false;
				return obj;
			});
			// $scope.info.sysIdList = $scope.info.sysIdList.sort(function compareIndexFound(a, b) {
			// 	if (a.disabled) { return 1; }
			// 	if (!a.disabled) { return -1; }
			// 	return 0;
			// })


			$scope.info.shouldCallLoadPages && $scope.getPages();
			var endIndex = $scope.info.totalSysidCount <= $scope.info.sysidPagination.endIndex ? $scope.info.totalSysidCount : $scope.info.sysidPagination.endIndex + 1;
			$scope.info.sysidPagination.paginationText = 'Showing ' + ($scope.info.sysidPagination.startIndex + 1) + ' to ' + endIndex + ' of ' + $scope.info.totalSysidCount;
			$scope.info.sysidLoading = false;
			$scope.info.shouldCallLoadPages = false
			$scope.resetScrollTop("subscribed_sysid_list");

		},function (response) {
			console.error("Unable to load ");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}else{
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: "Unable to load data Please contact " + $scope.supportEmail
				};
			}
			handleSessionTimeout(response);
			$scope.info.rulesLoading = false;
			$scope.info.sysidLoading = false;
			$scope.info.sysIdList = []

		})
	}

	//map function to flatten sysid objects to array of sysid
	$scope.flattenSysid = function (item) {
		return item[$scope.info.sysIdAttr]
	}

	$scope.populateDefaultSearchList = function () {
		$scope.info.selectedSearchAttrList = [];
		var obj = {};
		$scope.info.sysIdAttributeList.map(function (item) {
			if (item.colName === $scope.info.sysIdAttr) {
				obj.selected = true;
				obj.colName = item.colName;
				obj.colLabel = item.colLabel;
				obj.value = '';
			}
		});
		$scope.info.selectedSearchAttrList.push(obj);
		$scope.info.sysIdAttributeList.map(function (item) {
			if (item.colName === $scope.info.sysIdAttr) {
				item.selected = true;
			}
		})

	}

	//unsubscribed sysid  client search
	$scope.populateDefaultSearchListUnsubscribed = function () {
		$scope.info.selectedSearchAttrListUnsubscribed = [];
		var obj = {};
		$scope.info.sysIdAttributeListUnsubscribed.map(function (item) {
			if (item.colName === $scope.info.sysIdAttr) {
				obj.selected = true;
				obj.colName = item.colName;
				obj.colLabel = item.colLabel;
				obj.value = '';
			}
		});
		$scope.info.selectedSearchAttrListUnsubscribed.push(obj);
		$scope.info.sysIdAttributeListUnsubscribed.map(function (item) {
			if (item.colName === $scope.info.sysIdAttr) {
				item.selected = true;
			}
		})

	}	



	//change search
	$scope.changeSearchView = function (header) {
		$scope.info.selectedSearchAttrList = [];
		var res = $scope.info.sysIdAttributeList.filter(function (item) {
			return item.selected;
		});
		$scope.info.selectedSearchAttrList = res;
		setTimeout(function () {
			if (!$scope.info.selectedSearchAttrList.length) {
				$scope.populateDefaultSearchList();
			}
		})
	}

	//change search Unsubscribe client search
	$scope.changeSearchViewUnsubscribed = function (header) {
		$scope.info.selectedSearchAttrListUnsubscribed = [];
		var res = $scope.info.sysIdAttributeListUnsubscribed.filter(function (item) {
			return item.selected;
		});
		$scope.info.selectedSearchAttrListUnsubscribed = res;
		setTimeout(function () {
			if (!$scope.info.selectedSearchAttrListUnsubscribed.length) {
				$scope.populateDefaultSearchListUnsubscribed();
			}
		})
	}


	//reset pagination
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
		$scope.info.sysidLoading = true;
		$scope.resetTempAddRemoveButtons();
		$scope.info.sysidPagination.currentPage = $scope.info.sysidPagination.currentPage + 1;
		var page = $scope.info.pages[$scope.info.sysidPagination.currentPage - 1];
		$scope.info.sysidPagination.startIndex = page.startIndex;
		$scope.info.sysidPagination.endIndex = page.endIndex;
		if($scope.info.inSearchViewUnsubscribed){
			var selectedSysIds = $scope.info.selectedSysIdsMaster.map(function (item) {
				return item[$scope.info.sysIdAttr]
			})
		}else{
			var selectedSysIds = $scope.info.selectedSysIds.map(function (item) {
				return item[$scope.info.sysIdAttr]
			})
		}
		
		$scope.getSysId(selectedSysIds);

	}

	$scope.loadPrevSet = function () {
		$scope.info.sysidLoading = true;
		$scope.resetTempAddRemoveButtons();
		$scope.info.sysidPagination.currentPage = $scope.info.sysidPagination.currentPage - 1;
		var page = $scope.info.pages[$scope.info.sysidPagination.currentPage - 1];
		$scope.info.sysidPagination.startIndex = page.startIndex;
		$scope.info.sysidPagination.endIndex = page.endIndex;
		if($scope.info.inSearchViewUnsubscribed){
			var selectedSysIds = $scope.info.selectedSysIdsMaster.map(function (item) {
				return item[$scope.info.sysIdAttr]
			})
		}else{
			var selectedSysIds = $scope.info.selectedSysIds.map(function (item) {
				return item[$scope.info.sysIdAttr]
			})
		}
		$scope.getSysId(selectedSysIds);

	}

	$scope.callsysid = function () {
		$scope.info.sysidLoading = true;
		$scope.info.shouldCallLoadPages = true;
		$scope.info.inSearchView = true;
		$scope.info.sysidPagination.startIndex = 0;
		$scope.info.sysidPagination.endIndex = 200;
		if($scope.info.inSearchViewUnsubscribed){
			var selectedSysIds = $scope.info.selectedSysIdsMaster.map(function (item) {
				return item[$scope.info.sysIdAttr]
			})
		}else{
			var selectedSysIds = $scope.info.selectedSysIds.map(function (item) {
				return item[$scope.info.sysIdAttr]
			})
		}
		$scope.getSysId(selectedSysIds);
	}

	$scope.resetTempAddRemoveButtons = function(){
		$scope.info.tempAddSysIdList = [];
		$scope.info.tempRemoveSysIdList = [];
	  }

	
	//function to get search object
	$scope.getSearchObj = function () {
		var searchobj = { "search": {} }
		$scope.info.selectedSearchAttrList.forEach(function (el) {

			if (el.value.length) {
				searchobj.search[el.colName] = el.value
			}

		})
		return searchobj
	}

	$scope.clearsysSearchText = function () {
		$scope.info.selectedSearchAttrList.forEach(function (el) {
			el.value = '';
		});
	}
	//clearsearch
	$scope.clearSearchText = function () {
		$scope.info.sysidLoading = true;
		$scope.info.inSearchView = false;
		$scope.clearsysSearchText();
		$scope.resetPagination();
		$scope.info.shouldCallLoadPages = true;
		$scope.info.sysIdAttributeList.forEach(function (item) {
			item.selected = false;
		});
		$scope.populateDefaultSearchList();
		// if ($scope.info.selectedSysIds.length) {
		// 	var selectedSysIds = $scope.info.selectedSysIds.map(function (item) {
		// 		return item[$scope.info.sysIdAttr];
		// 	})
		// }

		if($scope.info.inSearchViewUnsubscribed){
			var selectedSysIds = $scope.info.selectedSysIdsMaster.map(function (item) {
				return item[$scope.info.sysIdAttr]
			})
		}else{
			var selectedSysIds = $scope.info.selectedSysIds.map(function (item) {
				return item[$scope.info.sysIdAttr]
			})
		}
		$scope.getSysId(selectedSysIds);
	}



	//row click
	$scope.rowClick = function (event, currentElm, list) {
		if (event.ctrlKey) {
			$scope.toggleRow(currentElm);
		}

		if (event.button === 0) {
			if (!event.ctrlKey && !event.shiftKey) {
				$scope.clearAll(list);
				$scope.toggleRow(currentElm);
			}
			if (event.shiftKey) {
				$scope.selectRowsBetweenIndexes([$scope.info.lastSelectedRow.rowIndex, currentElm.rowIndex], list)
			}
		}

	}
	$scope.toggleRow = function (row) {
		row.selected = !row.selected;
		$scope.info.lastSelectedRow = row;
	}

	$scope.clearAll = function (list) {
		list.map(function (sysId) {
			sysId.selected = false;
		})
	}

	$scope.selectRowsBetweenIndexes = function (indexes, list) {
		indexes.sort(function (a, b) {
			return a - b;
		});


		for (var i = indexes[0]; i <= indexes[1]; i++) {
			list[i].selected = true;
		}

	}

	//button state
	$scope.addRmoveBtnState = function (state) {
		if (state === 'add') {
			$scope.info.tempAddSysIdList = $scope.info.sysIdList.filter(function (item) {
				return item.selected;
			});
		} else {
			$scope.info.tempRemoveSysIdList = $scope.info.selectedSysIds.filter(function (item) {
				return item.selected;
			});
		}

	}

	//Add SysId Method
	$scope.addSysIds = function () {
		$scope.info.sysidLoading = true;
		if ($scope.info.inSearchViewUnsubscribed) {
			$scope.info.selectedSysIdsMaster = $scope.info.selectedSysIdsMaster.concat($scope.info.tempAddSysIdList);
		}else{
			$scope.info.selectedSysIds = $scope.info.selectedSysIds.concat($scope.info.tempAddSysIdList);
		}
		
		$scope.info.sysIdList = $scope.info.sysIdList.sort($scope.sysidSortFunction)
		$scope.info.sysIdList.map(function (sysIdItem, index) {
			sysIdItem.rowIndex = index;
			if($scope.info.inSearchViewUnsubscribed){
				$scope.info.selectedSysIdsMaster.map(function (item, selectedSysidIndex) {
					if (sysIdItem[$scope.info.sysIdAttr] === item[$scope.info.sysIdAttr]) {
						item.rowIndex = selectedSysidIndex;
						sysIdItem.selected = false;
						sysIdItem.disabled = true;
					}
				})
			}else{
				$scope.info.selectedSysIds.map(function (item, selectedSysidIndex) {
					if (sysIdItem[$scope.info.sysIdAttr] === item[$scope.info.sysIdAttr]) {
						item.rowIndex = selectedSysidIndex;
						sysIdItem.selected = false;
						sysIdItem.disabled = true;
					}
				})
			}
		
		});
		if ($scope.info.inSearchViewUnsubscribed) {
			$scope.info.selectedSysIdsMaster = _.cloneDeep($scope.info.selectedSysIdsMaster);
			$scope.info.selectedSysIds = _.uniqBy($scope.filterSeletedSysid(), $scope.info.sysIdAttr);
		} else {
			$scope.info.selectedSysIds = _.cloneDeep($scope.info.selectedSysIds);
			$scope.info.selectedSysIdsMaster = angular.copy($scope.info.selectedSysIds);
		}
		$scope.info.tempAddSysIdList = [];
		if($scope.info.availableSelectall){
			$scope.info.availableSelectall = false;
		}
		$scope.info.sysidLoading = false;
	}



	//Remove SysId Method
	$scope.removeSysIds = function () {
		$scope.info.sysidLoading = true;
		$scope.info.sysIdsToRemove = [];
		$scope.info.sysIdsToRemove = $scope.info.sysIdsToRemove.concat($scope.info.tempRemoveSysIdList);
		$scope.info.sysIdsToRemove.forEach(function (item) {
			$scope.info.sysIdList.forEach(function (sys, index) {
				sys.rowIndex = index;
				if (sys[$scope.info.sysIdAttr] === item[$scope.info.sysIdAttr]) {
					sys.selected = false;
					sys.disabled = false;
				}
			})
		});
		$scope.info.sysIdsToRemove.map(function (item) {
			if($scope.info.inSearchViewUnsubscribed){
				$scope.removeItemFromList($scope.info.selectedSysIdsMaster, item);
			}else{
				$scope.removeItemFromList($scope.info.selectedSysIds, item);
			}
			
		});

		$scope.info.tempRemoveSysIdList = [];
		if($scope.info.selectedSelectall){
			$scope.info.selectedSelectall = false;
		}
		$scope.info.sysidLoading = false;


	}

	//remove from list function
	$scope.removeItemFromList = function (list, itemToRemove) {
		list.forEach(function (item, index) {
			if (item[$scope.info.sysIdAttr] === itemToRemove[$scope.info.sysIdAttr]) {
				list.splice(index, 1);
			}

		});
		list.map(function (listItem, index) {
			listItem.rowIndex = index;
		});

		if($scope.info.inSearchViewUnsubscribed){
			$scope.info.selectedSysIdsMaster = list
			$scope.info.selectedSysIds = $scope.filterSeletedSysid()
		}else{
			$scope.info.selectedSysIds = list;
			$scope.info.selectedSysIdsMaster = angular.copy($scope.info.selectedSysIds);
		}
		
		

	}

	//scroll top reset in sysid list
	$scope.resetScrollTop = function (selector) {
		$timeout(function () {
			$('#' + selector)[0].scrollTop = 0;
		})
	}

	//search button state
	$scope.searchDisbledButtonState = function () {
		var flag = true;
		$scope.info.selectedSearchAttrList.map(function (item) {
			if (item.value.length) {
				flag = false;
			}
		})
		return flag;
	}

	//search button state for unsunscribed devices
	$scope.searchDisbledButtonStateUnsubscribed = function () {
		var flag = true;
		$scope.info.selectedSearchAttrListUnsubscribed.map(function (item) {
			if (item.value.length) {
				flag = false;
			}
		})
		return flag;
	}


	$scope.searchDisbledButtonStateForCancel = function () {
		var flag = true;

		$scope.info.selectedSearchAttrList.map(function (item) {
			if (item.value.length || $scope.info.inSearchView ) {
				flag = false;
			}
		})
		return flag;
	}

	//CANCEL BUTTON STATE FOR UNSUBSCRIBED SEARCH
	$scope.searchDisbledButtonStateForCancelUnsubscribed = function () {
		var flag = true;

		$scope.info.selectedSearchAttrListUnsubscribed.map(function (item) {
			if (item.value.length || $scope.info.inSearchViewUnsubscribed ) {
				flag = false;
			}
		})
		return flag;
	}


	//Function add filter attributes
	$scope.saveSubscriptionFilter = function () {
		// if(type == 'add'){
		// 	if(!$scope.info.selectedSysIds.length){

		// 	}
		// }
		$scope.info.sysidLoading = true;
		
		var postdata = [{
			"ruleId": $scope.info.selectedRuleForSubscription.rule_id.toString(),
			"email": $cookies.username,
			"group": $scope.info.currentGroupname,
			"excSysIds": $scope.info.inSearchViewUnsubscribed? $scope.info.selectedSysIdsMaster.map(function (e) { return e[$scope.info.sysIdAttr] }) || [] : $scope.info.selectedSysIds.map(function (e) { return e[$scope.info.sysIdAttr] }) || []
		}];
		RulesService.saveFilterAttributes(postdata).then(function (response) {
			$scope.modal.close();
			$scope.info.sysidLoading = false;
			$scope.info.rulesListMsg = {
				type: 'success',
				msg: GlobalService.getVal('rulesMsgs')['filter_attributes_save']
			}
			$scope.info.rulesLoading = true;
			$scope.reloadRules();
			$scope.trackUser('Rules List', 'add-update filter attributes', postdata);
		}, function (response) {
			console.error("Unable to save filter attributes");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addRuleMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}else{
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: "Unable to save data Please contact " + $scope.supportEmail
				};
			}
			setTimeout(function () {
				$scope.modal.close();
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: "Unable to update subscription Please contact " + $scope.supportEmail
				};
			})
			handleSessionTimeout(response);
			$scope.info.rulesLoading = false;
			$scope.info.sysidLoading = false;
		});
	}

	$scope.deleteSubscriptionFilter = function (rule, bulk) {
		if(bulk){
			var postdata = {
				"ruleIds": rule,
				"mps": $cookies.mps,
				"email": $cookies.username
			};
		}else{
			var postdata = {
				"ruleIds": [rule.rule_id],
				"mps": $cookies.mps,
				"email": $cookies.username
			};
		}
		
		RulesService.deleteFilterAttributes(postdata).then(function (response) {
			// $scope.info.rulesListMsg = {
			// 	type: 'success',
			// 	msg: GlobalService.getVal('rulesMsgs')['rule_unsubscription_success: "Unsubscribed from rule successfully"']
			// }
			//$scope.info.rulesLoading = false;
			$scope.info.sysidLoading = false;

		}, function (response) {
			console.error("Unable to load templates");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}else{
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: "Unable to load data Please contact " + $scope.supportEmail
				};
			}
			handleSessionTimeout(response);
			$scope.info.rulesLoading = false;
			$scope.info.sysidLoading = false;
		});

	}

	//select all for available sysid
	$scope.selectAllSysid = function () {
		$scope.info.sysIdList.forEach(function (item) {
			if (!item.disabled && $scope.info.availableSelectall) {
				item.selected = true;
			}
			else if (!item.disabled && !$scope.info.availableSelectall) {
				item.selected = false;
			}
		})
		$scope.addRmoveBtnState('add');
	}

	//select all btn state for available devices
	$scope.selectallBtnState = function () {
		var flag = true;
		$scope.info.sysIdList.forEach(function (item) {
			if (!item.disabled) {
				flag = false;
			}
		})

		return flag;
	}

	//select all function for selected sysids
	$scope.selectAllSysidSelected = function () {
		$scope.info.selectedSysIds.forEach(function (item) {
			if ($scope.info.selectedSelectall) {
				item.selected = true;
			}
			else if (!$scope.info.selectedSelectall) {
				item.selected = false;
			}
		})
		$scope.addRmoveBtnState()
	}

	//select all btn state for available devices
	$scope.selectallBtnStateSelected = function () {
		var flag = true;
		if ($scope.info.selectedSysIds.length > 1) {
			flag = false;
		}

		return flag;
	}

	//get filter object for client search
	$scope.getFilterObj = function () {
		var searchobj = {  }
		$scope.info.selectedSearchAttrListUnsubscribed.forEach(function (el) {
			if (el.value.length) {
				searchobj[el.colName] = el.value
			}
		})
		return searchobj
	}

	$scope.filterSeletedSysid = function () {
		var filter = $scope.getFilterObj();
		if(!Object.keys(filter).length){
			return $scope.info.selectedSysIdsMaster;
		}else{
			return $scope.info.selectedSysIdsMaster.filter(function (item) {
				return Object.keys(filter).find(function (key) {
					return item[key] && item[key].toLowerCase().includes(filter[key].toLowerCase());
				});
			});
		}
		
	}

	//search unsubscribed sysids
	$scope.searchUnsubscribedSysid = function(){
		$scope.info.sysidLoading = true;
		$scope.info.inSearchViewUnsubscribed = true
		//$scope.info.selectedSysIds = $scope.filterSeletedSysid();
		$scope.info.selectedSysIds = _.uniqBy($scope.filterSeletedSysid(), $scope.info.sysIdAttr);
		$scope.info.sysidLoading = false;
	}

	//clearsearch Unsubscribed
	$scope.clearSearchTextUnsubscribed = function () {
		$scope.info.sysidLoading = true;
		$scope.info.inSearchViewUnsubscribed = false;
		$scope.info.selectedSearchAttrListUnsubscribed.forEach(function (el) {
			el.value = '';
			el.selected = false
		});
		$scope.populateDefaultSearchListUnsubscribed();
		$scope.info.selectedSysIds = _.uniqBy($scope.filterSeletedSysid(), $scope.info.sysIdAttr);
		$scope.info.sysidLoading = false;
		
	}

	//Rule Tagging Modal
	$scope.openTaggingModal = function () {
		$scope.selectedTagsCount = 0;
		$scope.bulktagsubscribebtnstate = true;

		//getPredefinedTagList
		RulesService.getPredefinedTagList().then(function (response) {
			$scope.info.tagList = response.data.Data.map(function (t) { t.selected = false; return t });

		}, function (response) {
			$scope.info.tagList = [];
			console.error("Unable to load templates");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addRuleMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}
			handleSessionTimeout(response);
		});
		var current_user = $cookies.username;

		if($scope.amIAdmin){
			var selectedRules = $filter('filter')($scope.currentRuleList, {
				selected: true,
				subscription_enabled: true,
			}) || [];
		}else{
			var selectedRules = $filter('filter')($scope.currentRuleList, {
				selected: true,
				subscription_enabled: true,
				rule_owner: current_user
			}) || [];
		}
		$scope.rulesForBulkTag = selectedRules;
		if (!selectedRules.length) {
			ModalService.alertBox({
				msg: GlobalService.getVal('rulesMsgs')['rule_delete_select_all_error']
			});
			return;
		}
		$scope.msg = GlobalService.getVal('rulesMsgs')['bulk_tag_associate'];
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/rule_tagging.html", $scope, "gb-rules-bulk-edit-modal", true, 'static');
	}


	
	$scope.bulkTagAssociate = function () {
		$scope.info.rulesLoading = true;
		$scope.modal.close();
		//filter out selected tags
		var tagFilterFunction = function (t) {
			return t.selected;
		}

		//map function to get the tag ids 
		var tagMapFunction = function (e) { 
			return e.tag_id 
		}

		//get the rule ids
		var ruleMapFunction = function (r) {
			return r.rule_id;
		}

		//get the tag ids
		var tag_ids = $scope.info.tagList.filter(tagFilterFunction).map(tagMapFunction);
		if (!tag_ids.length) {
			return;
		}

		//payload
		var tagPayload = {
			"associate": [{
				"tag_ids": tag_ids,
				"rule_ids": $scope.rulesForBulkTag.map(ruleMapFunction)
			}],
			"disassociate": [{}]
		}
		
		//call add tags api
		RulesService.associateDisassociateTag(tagPayload).then(function (response) {
			
			$scope.reloadRules();
			$scope.info.rulesListMsg = {
				type: 'success',
				msg: GlobalService.getVal('rulesMsgs')['bulk_tag_associate_success']
			};
		}, function (response) {
			console.error("Unable to add subscription");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}else{
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: 'failed to associate tag'
				};
			}
			handleSessionTimeout(response);
		});

		
	}
	$scope.updateTagSelectedCount = function(){
		$scope.selectedTagsCount = $scope.info.tagList.filter(function (t) {
			return t.selected;
		}).length
		if($scope.selectedTagsCount > 0){
			$scope.bulktagsubscribebtnstate = false;
		}
		else{
			$scope.bulktagsubscribebtnstate = true;
		}
	}

	$scope.removeTag = function (tag,rule) {
		var titleObj = { msg: "Remove Tag" };
		var msgObj = { msg: "Are you sure you want to disassociate <strong>" + tag['tag_name'] + "</strong> with <strong>" + rule["label_display"]+ "</strong>?" };
		var modalInstance = ModalService.confirmationBox(titleObj, msgObj, "Yes", "No");
		modalInstance.result.then(function (response) {
			$scope.info.rulesLoading = true;
			//payload
			var tagPayload = {
				"associate": [{}],
				"disassociate": [{
					"tag_ids": [tag.tag_id],
					"rule_ids": [rule.rule_id]
				}]
			}
			RulesService.associateDisassociateTag(tagPayload).then(function (response) {
				$scope.reloadRules();
				$scope.info.rulesListMsg = {
					type: 'success',
					msg: GlobalService.getVal('rulesMsgs')['remove_tag'][0]+ tag.tag_name + GlobalService.getVal('rulesMsgs')['remove_tag'][1]
				};
			}, function (response) {
				console.error("Unable to add subscription");
				if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
					GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
					$scope.info.rulesListMsg = {
						type: 'failure',
						msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
					};
				}else{
					$scope.info.rulesListMsg = {
						type: 'failure',
						msg: 'failed to remove tag'
					};
				}
				handleSessionTimeout(response);
			});

		}, function (response) {

		});
		
	}

	$scope.showTagSubscribe = function () {
		var count = 0;
		var selectedRules = $filter('filter')($scope.currentRuleList, {
			selected: true
		}) || [];
		var showIcon = false;
		if (selectedRules.length > 0) {
			selectedRules.forEach(function (rule) {
				if (rule['subscription_enabled'] == true) {
					count++
				}
			})
		}
		if (count > 0) {
			showIcon = true
		}
		return showIcon
	}
	
	$scope.checkHorizontalOverflow = function (ev) {
		if(ev){
			if( ev.currentTarget){
				var el = ev.currentTarget.parentElement
			
			return el.clientWidth < el.scrollWidth;
			}
		}
		
		
	}

	
	$scope.checkVerticalOverflow = function (el) {
		return el.clientHeight < el.scrollHeight;
	}
	}])

// Controller to handle modification of categories
.controller('AddCategoryCtrl', ['$scope', '$sce', '$timeout', 'RulesService', 'ModalService', 'GlobalService', 'UserTrackingService', 'AppService',
function($scope, $sce, $timeout, RulesService, ModalService, GlobalService, UserTrackingService, AppService) {

	// Object to store info about this controller
	$scope.info = {};

	// Stores application name which is used in user tracking
	$scope.info.application = GlobalService.getVal('navRules');

	// Defines whether categories are loading
	$scope.info.categoriesLoading = true;

	// Stores success messages
	$scope.info.successMsg = "";

	// Stores error messages
	$scope.info.errorMsg = "";

	// Stores whether session is timed out or not
	$scope.info.sessionTimedOut = false;

	// Function to clear all messages
	$scope.clearMessage = function() {
		if (!$scope.info.categoriesLoading) {
			$scope.info.successMsg = "";
			$scope.info.errorMsg = "";
		}
	};

	// Function to load the categories
	$scope.loadCategories = function() {
		// Stores the list of categories
		RulesService.getCategories().then(function(response) {
			$scope.info.categories = response.data.Data;
			$scope.info.categoriesLoading = false;
			$scope.info.rulesList = RulesService.getRulesList();
		}, function(response) {
			console.error("Unable to load Categories");
			$scope.info.categoriesLoading = false;
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				if ($scope.info.errorMsg == '') {
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['category_load_failed'];
				} else {
					$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['category_load_failed'];
				}
			}

			handleSessionTimeout(response);
		});
	};

	$scope.loadCategories();

	// Stores the temporary list of categories to be added
	$scope.info.newCategories = [];

	// Function to add the text box to add a new category
	$scope.addCategory = function() {
		var category = {
			category : '',
			category_description : ''
		};
		$scope.info.newCategories.push(category);
	};

	// Function to show text box on the existing category to edit it
	$scope.editCategory = function(category) {
		category.edit = true;
		category.initialCategory = category.category;
		category.initialDescription = category.category_description;
	};

	// Function to revert back the changes if done on any category before saving
	$scope.undoCategory = function(category) {
		category.category = category.initialCategory;
		category.category_description = category.initialDescription;
		delete category.initialCategory;
		delete category.initialDescription;
		delete category.edit;
	};

	// Function to delete an existing category
	$scope.deleteCategory = function(category) {
		for (var i = 0; i < $scope.info.rulesList.length; i++) {
			if (category.category_id == $scope.info.rulesList[i].category_id) {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['category_rule_associated']
				});
				return;
			}
		}
		if (!!category.edit) {
			$scope.undoCategory(category);
		}
		category.deleted = true;
	};

	// Function to undo a delete operation
	$scope.undoDeleteCategory = function(category) {
		delete category.deleted;
	};

	// Function to delete a newly added category which is not yet saved
	$scope.deleteNewCategory = function(index) {
		$scope.info.newCategories.splice(index, 1);
	};

	// Function to validate whether all categories are distinct by name
	$scope.validateCategories = function() {
		for (var i = 0; i < $scope.info.categories.length; i++) {
			if ($scope.info.categories[i].category == '') {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['category_blank_name']
				});
				return;
			}
			for (var j = i + 1; j < $scope.info.categories.length; j++) {
				if ($scope.info.categories[i].category == $scope.info.categories[j].category) {
					ModalService.alertBox({
						msg : GlobalService.getVal('rulesMsgs')['category_name_duplicate']
					});
					return;
				}
			}
			for (var j = 0; j < $scope.info.newCategories.length; j++) {
				if ($scope.info.categories[i].category == $scope.info.newCategories[j].category) {
					ModalService.alertBox({
						msg : GlobalService.getVal('rulesMsgs')['category_name_duplicate']
					});
					return;
				}
			}
		}
		for (var i = 0; i < $scope.info.newCategories.length; i++) {
			if ($scope.info.newCategories[i].category == '' && $scope.info.newCategories[i].category_description == '') {
				continue;
			}
			if ($scope.info.newCategories[i].category == '' && $scope.info.newCategories[i].category_description != '') {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['category_blank_name']
				});
				return;
			}
			for (var j = i + 1; j < $scope.info.newCategories.length; j++) {
				if ($scope.info.newCategories[i].category == $scope.info.newCategories[j].category) {
					ModalService.alertBox({
						msg : GlobalService.getVal('rulesMsgs')['category_name_duplicate']
					});
					return;
				}
			}
		}
		return true;
	};

	// Function to get the no. of operations to be done
	$scope.getOperationsCount = function() {
		var operationsCount = 0;
		for (var i in $scope.info.categories) {
			if (!!$scope.info.categories[i].deleted) {
				operationsCount++;
			} else if (!!$scope.info.categories[i].edit && ($scope.info.categories[i].category != $scope.info.categories[i].initialCategory || $scope.info.categories[i].category_description != $scope.info.categories[i].initialDescription)) {
				operationsCount++;
			}
		}
		for (var i in $scope.info.newCategories) {
			if ($scope.info.newCategories[i].category != '') {
				operationsCount++;
			}
		}
		return operationsCount;
	};

	// Function to save the changes done on Add Category page
	$scope.saveCategories = function() {
		// Validate whether all the categories are distinct by name
		if (!$scope.validateCategories()) {
			return;
		}

		// Get the number of operations to be done
		$scope.info.operationsCount = $scope.getOperationsCount();
		if ($scope.info.operationsCount == 0) {
			$scope.info.newCategories = [];
			return;
		}

		// Start the loader
		$scope.info.categoriesLoading = true;

		// Perform the operations
		$scope.info.doneOperations = 0;
		for (var i in $scope.info.categories) {
			// Delete the deleted categories
			if (!!$scope.info.categories[i].deleted) {
				$scope.callDeleteCategory($scope.info.categories[i]);
			}
			// Update the edited categories
			else if (!!$scope.info.categories[i].edit && ($scope.info.categories[i].category != $scope.info.categories[i].initialCategory || $scope.info.categories[i].category_description != $scope.info.categories[i].initialDescription)) {
				$scope.callEditCategory($scope.info.categories[i]);
			}
		}
		for (var i in $scope.info.newCategories) {
			// Add the new categories
			if ($scope.info.newCategories[i].category != '') {
				$scope.callAddCategory($scope.info.newCategories[i]);
			}
		}

		// Delete the local variable that stores the new categories
		$scope.info.newCategories = [];
	};

	// Function to call delete API for the category
	$scope.callDeleteCategory = function(category) {
		RulesService.deleteCategory(category.category_id).then(function(response) {
			UserTrackingService.standard_user_tracking($scope.info.application, 'Category', 'delete', category.category).then(function(response) {

			}, handleSessionTimeout);
			$scope.info.doneOperations++;
			if ($scope.info.doneOperations == $scope.info.operationsCount) {
				$scope.loadCategories();
			}
			if ($scope.info.successMsg == "") {
				$scope.info.successMsg = GlobalService.getVal('rulesMsgs')['category_delete_success'][0] + category.category + GlobalService.getVal('rulesMsgs')['category_delete_success'][1];
			} else {
				$scope.info.successMsg += "<br>" + GlobalService.getVal('rulesMsgs')['category_delete_success'][0] + category.category + GlobalService.getVal('rulesMsgs')['category_delete_success'][1];
			}
		}, function(response) {
			console.error('Unable to delete ' + category.category);
			$scope.info.doneOperations++;
			if ($scope.info.doneOperations == $scope.info.operationsCount) {
				$scope.loadCategories();
			}
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				if ($scope.info.errorMsg == "") {
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['category_delete_failed'][0] + category.category + GlobalService.getVal('rulesMsgs')['category_delete_failed'][1];
				} else {
					$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['category_delete_failed'][0] + category.category + GlobalService.getVal('rulesMsgs')['category_delete_failed'][1];
				}
			}
			handleSessionTimeout(response);
		});
	};

	// Function to call update API for the category
	$scope.callEditCategory = function(category) {
		RulesService.updateCategory(category.category_id, category.category.replace(/\'/g, "\'\'").replace(/^\s+|\s+$/g, ''), category.category_description.replace(/\'/g, "\'\'").replace(/^\s+|\s+$/g, '')).then(function(response) {
			if (category.category != category.initialCategory) {
				var details = {};
				details['old'] = category.initialCategory;
				details['new'] = category.category;
				details = JSON.stringify(details);
			} else {
				var details = category.category;
			}

			UserTrackingService.standard_user_tracking($scope.info.application, 'Category', 'edit', details).then(function(response) {

			}, handleSessionTimeout);

			$scope.info.doneOperations++;
			if ($scope.info.doneOperations == $scope.info.operationsCount) {
				$scope.loadCategories();
			}
			if (category.category != category.initialCategory) {
				if ($scope.info.successMsg == "") {
					$scope.info.successMsg = GlobalService.getVal('rulesMsgs')['category_edit_name_success'][0] + category.initialCategory + GlobalService.getVal('rulesMsgs')['category_edit_name_success'][1] + category.category + GlobalService.getVal('rulesMsgs')['category_edit_name_success'][2];
				} else {
					$scope.info.successMsg += "<br>" + GlobalService.getVal('rulesMsgs')['category_edit_name_success'][0] + category.initialCategory + GlobalService.getVal('rulesMsgs')['category_edit_name_success'][1] + category.category + GlobalService.getVal('rulesMsgs')['category_edit_name_success'][2];
				}
			} else {
				if ($scope.info.successMsg == "") {
					$scope.info.successMsg = GlobalService.getVal('rulesMsgs')['category_edit_success'][0] + category.initialCategory + GlobalService.getVal('rulesMsgs')['category_edit_success'][1];
				} else {
					$scope.info.successMsg += "<br>" + GlobalService.getVal('rulesMsgs')['category_edit_success'][0] + category.initialCategory + GlobalService.getVal('rulesMsgs')['category_edit_success'][1];
				}
			}

		}, function(response) {
			console.error('Unable to edit ' + category.initialCategory);
			$scope.info.doneOperations++;
			if ($scope.info.doneOperations == $scope.info.operationsCount) {
				$scope.loadCategories();
			}

			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				if (category.category != category.initialCategory) {
					if ($scope.info.errorMsg == "") {
						$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['category_edit_name_failed'][0] + category.initialCategory + GlobalService.getVal('rulesMsgs')['category_edit_name_failed'][1] + category.category + GlobalService.getVal('rulesMsgs')['category_edit_name_failed'][2];
					} else {
						$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['category_edit_name_failed'][0] + category.initialCategory + GlobalService.getVal('rulesMsgs')['category_edit_name_failed'][1] + category.category + GlobalService.getVal('rulesMsgs')['category_edit_name_failed'][2];
					}
				} else {
					if ($scope.info.errorMsg == "") {
						$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['category_edit_failed'][0] + category.initialCategory + GlobalService.getVal('rulesMsgs')['category_edit_failed'][1];
					} else {
						$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['category_edit_failed'][0] + category.initialCategory + GlobalService.getVal('rulesMsgs')['category_edit_failed'][1];
					}
				}
			}

			handleSessionTimeout(response);
		});
	};

	// Function to call the add API for the category
	$scope.callAddCategory = function(category) {
		RulesService.addCategory(category.category.replace(/\'/g, "\'\'").replace(/^\s+|\s+$/g, ''), category.category_description.replace(/\'/g, "\'\'").replace(/^\s+|\s+$/g, '')).then(function(response) {
			UserTrackingService.standard_user_tracking($scope.info.application, 'Category', 'add', category.category).then(function(response) {

			}, handleSessionTimeout);

			$scope.info.doneOperations++;
			if ($scope.info.doneOperations == $scope.info.operationsCount) {
				$scope.loadCategories();
			}

			if ($scope.info.successMsg == "") {
				$scope.info.successMsg = GlobalService.getVal('rulesMsgs')['category_add_success'][0] + category.category + GlobalService.getVal('rulesMsgs')['category_add_success'][1];
			} else {
				$scope.info.successMsg += "<br>" + GlobalService.getVal('rulesMsgs')['category_add_success'][0] + category.category + GlobalService.getVal('rulesMsgs')['category_add_success'][1];
			}
		}, function(response) {
			console.error('Unable to add ' + category.category);
			$scope.info.doneOperations++;
			if ($scope.info.doneOperations == $scope.info.operationsCount) {
				$scope.loadCategories();
			}

			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				if ($scope.info.errorMsg == "") {
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['category_add_failed'][0] + category.category + GlobalService.getVal('rulesMsgs')['category_add_failed'][1];
				} else {
					$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['category_add_failed'][0] + category.category + GlobalService.getVal('rulesMsgs')['category_add_failed'][1];
				}
			}

			handleSessionTimeout(response);
		});
	};

	// Function to go to add rule page
	$scope.goToAddRule = function() {
		$scope.$parent.changeCurrentPage('add_rule');
	};

	// Function to render text in html format
	$scope.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};

	// Function to handle session timeout
	function handleSessionTimeout(response) {
		if (!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
			$scope.info.sessionTimedOut = true;
			ModalService.sessionTimeout();
		}
	};
}])

// Controller to handle testing of rules
.controller('TestRuleCtrl', ['$scope', '$sce', '$filter', '$timeout', '$q', '$window', 'AppService', 'ModalService', 'RulesService', 'GlobalService', 'ErrorService', 'FileUploader', 'ngTableParams', 'UserTrackingService', 'metaDataService', '$document',
function($scope, $sce, $filter, $timeout, $q, $window, AppService, ModalService, RulesService, GlobalService, ErrorService, FileUploader, ngTableParams, UserTrackingService, metaDataService, $document) {

	// Stores the info of test rule page
	$scope.info = {};

	// Stores application name which is used for user tracking
	$scope.info.application = GlobalService.getVal('navRules');
	$scope.info.fileuploadDelay = GlobalService.getVal('fileuploadDelay');

	// Stores the success message
	$scope.info.successMsg = "";

	// Stores the error message
	$scope.info.errorMsg = "";

	// Stores whether session is timed out or not
	$scope.info.sessionTimedOut = false;
	// Stores the list of selected rules to be tested
	$scope.info.selectedRules = RulesService.getTestRuleData();

	// Stores the columns to be displayed on expanding a rule
	$scope.info.columns = $filter('filter')(GlobalService.getVal('testRuleColumns'), {
		enabled : true
	});

	// Stores the columns to be displayed on Test History page
	$scope.info.testRuleHistoryColumns = $filter('filter')(GlobalService.getVal('testRuleHistoryColumns'), {
		enabled : true
	});

	// Stores whether bundles are loading
	$scope.info.bundlesLoading = false;

	// Stores whether the selected rules are copying to staging infoserver
	$scope.info.rulesCopying = false;

	// Stores whether test results are loading
	$scope.info.testresultLoading = false;

	// Stores the list of bundles fetched from staging H2
	$scope.info.bundlesList = [];

	//Stores list of test results
	$scope.info.testResultsList = [];

	// Stores the value of maximum bundles shown on the test rule page
	$scope.info.maxBundlesCount = 20;

	// Stores the list of columns to be displayed on the test results grid
	$scope.info.testGridColumnsList = $filter('filter')(GlobalService.getVal('testGridColumns'), {
		enabled : true
	});

	// Stores the list of supported rule status
	$scope.info.supportedStatus = GlobalService.getVal('rulesSupportedStatus');

	// Stores whether the rule test succeeded or not
	$scope.ruleTestSucceeded = false;

	// Stores whether page is loading
	$scope.info.pageLoading = false;

	// Stores how many recursions done
	$scope.info.recursionDone = 0;

	// Stores comma separated rule IDs of inserted rules in staging H2
	$scope.info.insertedStageRules = "";

	// Stores the maximum limit of recursions allowed
	$scope.info.recursionLimit = 4;

	// Stores the status of each bundle_status code
	$scope.info.bundleStatus = GlobalService.getVal('bundleStatus');

	// Stores whether upload modal is opened
	$scope.info.uploadModalOpened = false;

	// Stores the load ID of the selected bundle
	$scope.info.selectedBundleLoadId = null;

	// Stores the bundle upload success message
	$scope.info.bundleUploadSuccessMsg = GlobalService.getVal("rulesMsgs")['test_rule_upload_log_success'];

	//To show status column when test is pressed
	$scope.showStatusColLoadIcon = false;

	//To show status column when test is pressed
	$scope.showStatusColDoneIcon = false;

	//To show status column when test is pressed
	$scope.showStatusColFailIcon = false;

	$scope.testButtonDisable = false;
	$scope.uploadBtnDisable = false;

	$scope.maxTriesToLcp = GlobalService.getVal('maxTriesToLcp');

	$scope.allBunldesUploaded = false;
	
	$scope.logBundlesFromLogvault = [];

	$scope.info.enableRuleComments = "";
	$scope.info.enableRuleCommentsLimitMin = GlobalService.getVal('ruleStatusChangeCommentMinLen');
	$scope.info.enableRuleCommentsLimitMax = GlobalService.getVal('ruleStatusChangeCommentMaxLen');
	
	$scope.tableHeadersForMultipleBundle =  GlobalService.getVal('thMultipleBundleFromLogvault');
	$scope.stagecall = 0;
	$scope.info.bundleListCallCount = 0;

	// Function to clear all messages
	$scope.clearMessage = function() {
		if (!$scope.info.pageLoading) {
			$scope.info.successMsg = "";
			$scope.info.errorMsg = "";
		}
	};
	// Changes page size
	$scope.changePageSize = function() {
		$scope.info.page['count'] = parseInt($scope.info.page['count']);
		$scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
		if ($scope.info.page['current'] > $scope.info.page['pages']) {
			$scope.info.page['current'] = $scope.info.page['pages'];
		}
		if (!!arguments.length) {
			$scope.populateRulesData();
		} else {
			$scope.populateDataPathData();
		}

	};

	// Switch to next page if current page is not last page
	$scope.nextPage = function() {
		if ($scope.info.page['current'] < $scope.info.page['pages']) {
			$scope.info.page['current'] += 1;
			if (!!arguments.length) {
				$scope.populateRulesData();
			} else {
				$scope.populateDataPathData();
			}
		}
	};

	// Switch to previous page if current page is not first page
	$scope.prevPage = function() {
		if ($scope.info.page['current'] > 1) {
			$scope.info.page['current'] -= 1;
			if (!!arguments.length) {
				$scope.populateRulesData();
			} else {
				$scope.populateDataPathData();
			}
		}
	};

	// Switch to first page if not on first page
	$scope.firstPage = function() {
		if ($scope.info.page['current'] == 1)
			return;
		$scope.info.page['current'] = 1;
		if (!!arguments.length) {
			$scope.populateRulesData();
		} else {
			$scope.populateDataPathData();
		}
	};

	// Switch to last page if not on last page
	$scope.lastPage = function() {
		if ($scope.info.page['current'] == $scope.info.page['pages'])
			return;
		$scope.info.page['current'] = $scope.info.page['pages'];
		if (!!arguments.length) {
			$scope.populateRulesData();
		} else {
			$scope.populateDataPathData();
		}
	};

	// Function to check if all rules are expanded
	$scope.checkAllExpanded = function() {
		for (var i in $scope.info.selectedRules) {
			if (!$scope.info.selectedRules[i].expanded) {
				$scope.info.allExpanded = false;
				return;
			}
		}
		$scope.info.allExpanded = true;
	};

	if ($scope.info.selectedRules.length == 1) {
		$scope.info.selectedRules[0].expanded = true;
		$scope.checkAllExpanded();
	}

	// Function to expand/collapse all the rules
	$scope.ruleExpandCollapse = function() {
		if ($scope.info.allExpanded) {
			for (var i in $scope.info.selectedRules) {
				$scope.info.selectedRules[i].expanded = false;
			}
			$scope.info.allExpanded = false;
		} else {
			for (var i in $scope.info.selectedRules) {
				$scope.info.selectedRules[i].expanded = true;
			}
			$scope.info.allExpanded = true;
		}
	};

	// Function to render text in html format
	$scope.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};

	// Function to open upload log modal box
	$scope.openUploadLogModal = function() {
		$scope.modal = ModalService.openModal('partials/rules-and-alerts/upload_log.html', $scope, false, 'static');
		$scope.info.uploadModalOpened = true;
	};

	// Function to open upload log modal box
	$scope.openLogvault = function() {
		//set selected rules to be tested
		var params = {
			app: 'logvault',
			source: 'test_rule'
		}
		$window.moveToApplication(params);
	};
	// Function to open Show datapath tunnel table modal box
	$scope.openDatapathModal = function() {
		$scope.modal = ModalService.openModal('partials/rules-and-alerts/datapath_modal.html', $scope, false, 'static');
	};

	// Function to show the test details(alerts) for individual labels
	$scope.showTestDetails = function(test) {
		$scope.datapathModalData = test.texts;
		$scope.datapathModalLabel = test.label;
		$scope.info.page = {
			"total" : 0,
			"current" : 1,
			"pages" : 0,
			"count" : 10,
			"displayMsg" : ""
		};

		$scope.populateDataPathData();
		$scope.openDatapathModal();
	};

	// Function to populate datapath modal data with alerts
	$scope.populateDataPathData = function() {
		var orderedData = $scope.datapathModalData;
		$scope.info.page['total'] = orderedData.length;
		$scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
		$scope.info.datapathDisplayData = orderedData.slice(($scope.info.page['current'] - 1) * $scope.info.page['count'], $scope.info.page['current'] * $scope.info.page['count']);
		if ($scope.info.page['current'] < $scope.info.page['pages']) {
			$scope.info.page['displayMsg'] = (($scope.info.page['current'] - 1) * $scope.info.page['count'] + 1) + ' - ' + (($scope.info.page['current'] - 1) * $scope.info.page['count'] + $scope.info.page['count']) + " of " + ($scope.info.page['total']);
		} else {
			$scope.info.page['displayMsg'] = (($scope.info.page['current'] - 1) * $scope.info.page['count'] + 1) + ' - ' + ($scope.info.page['total']) + ' of ' + ($scope.info.page['total']);
		}
	};

	// Function to populate rules data corresponding to a bundle
	$scope.populateRulesData = function() {
		//reset rule history expandable area
		$scope.info.bundleRules.map(function(item){
			item.expanded = false;
		});
		var orderedData = $scope.info.bundleRules;
		$scope.info.page['total'] = orderedData.length;
		$scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
		$scope.info.displayRules = orderedData.slice(($scope.info.page['current'] - 1) * $scope.info.page['count'], $scope.info.page['current'] * $scope.info.page['count']);
		if ($scope.info.page['current'] < $scope.info.page['pages']) {
			$scope.info.page['displayMsg'] = (($scope.info.page['current'] - 1) * $scope.info.page['count'] + 1) + ' - ' + (($scope.info.page['current'] - 1) * $scope.info.page['count'] + $scope.info.page['count']) + " of " + ($scope.info.page['total']);
		} else {
			$scope.info.page['displayMsg'] = (($scope.info.page['current'] - 1) * $scope.info.page['count'] + 1) + ' - ' + ($scope.info.page['total']) + ' of ' + ($scope.info.page['total']);
		}
	};

	// Function to open modal with rules data corresponding to a bundle
	$scope.openRulesDetails = function() {
		$scope.info.page = {
			"total" : 0,
			"current" : 1,
			"pages" : 0,
			"count" : 10,
			"displayMsg" : ""
		};
		$scope.modal = ModalService.openModal('partials/rules-and-alerts/rules_details.html', $scope, "gb-rules-test-history-modal", 'static');
		if (arguments.length == 0) {
			$scope.info.bundleRules = $scope.info.selectedRules;
			$scope.populateRulesData();
		} else {
			$scope.info.rulesLoading = true;
			var ruleIDs = arguments[0];
			RulesService.getStagingRulesData(ruleIDs).then(function(response) {
				$scope.info.bundleRules = response.data.Data;
				$scope.populateRulesData();
				$scope.info.rulesLoading = false;
				$scope.trackUser('Rule', 'Edit', $scope.info.displayRules);
			}, function(response) {
				$scope.modal.close();
				$scope.info.rulesLoading = false;
				handleSessionTimeout(response);
				if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
					GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				} else {
					$scope.info.errorMsg = GlobalService.getVal('info_server_down');
					GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[0]);

				}
			});
		}
	};

	// Function to get bundle signature based on bundle load ID
	$scope.getBundleId = function(bundle) {		
		$scope.info.bundlesList.map(function(item){
			if(item.load_id === bundle.load_id && item.seen_ts === bundle.seen_ts){
				if(item.expanded == true){
					item.expanded = false;					
				}
				else{					
					item.expanded = true;
				}
			}else{
				item.expanded = false;
			}
		});
		if(bundle.expanded === false) return;
		if (bundle && bundle.rule_id) {
			$scope.info.testresultLoading = true;
			$scope.info.selectedBundleLoadId = bundle.load_id;
			RulesService.getBundleId(bundle.load_id).then(function(response) {
				bundle.signature = response.data.Data;
				$scope.getStagingRulesforBundle(bundle);
			}, function(response) {
				$scope.info.testresultLoading = false;
				bundle.expanded = false;
				handleSessionTimeout(response);
				if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
					GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
				} else {
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['test_rule_failed'];
				}
			});
		}
	};

	// Function to get staging rules data which were tested with a bundle
	$scope.getStagingRulesforBundle = function(bundle) {
		RulesService.getStagingRulesData(bundle.rule_id).then(function(response) {
			var rulesDetails = response.data.Data || [];
			$scope.viewTestResults(bundle, rulesDetails);
		}, function(response) {
			$scope.info.testresultLoading = false;
			bundle.expanded = false;
			handleSessionTimeout(response);
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['test_rule_failed'];
			}
		});
	};

	var manufacturer = GlobalService.getVal('manufacturer');
	var product = GlobalService.getVal('product');
	var schema = GlobalService.getVal('schema');

	// Function to view test results for the bundle
	$scope.viewTestResults = function(bundle, rulesDetails) {
		if (bundle && bundle.signature && bundle.rule_id) {
			var bundleSignature = bundle.signature;
			var cols = "";
			for (var i = 0; i < $scope.info.testGridColumnsList.length; i++) {
				cols += $scope.info.testGridColumnsList[i].field + ", ";
			}
			cols += "display_msg";
			var keyspace = RulesService.getStagingKeyspace();
			var alertsTableName = GlobalService.getVal('alerts_by_bundle_table');
			var ruleIDs = bundle.rule_id;
			var selectQuery = "SELECT " + cols + " FROM " + keyspace + "_" + alertsTableName + " where mfr='" + manufacturer + "' AND prod='" + product + "' AND sch='" + schema + "' AND ec='" + manufacturer + "' AND bundle_id='" + bundleSignature + "' AND rule_id IN (" + ruleIDs + ")";

			if ($scope.info.testResultsPending) {
				$scope.deferred.resolve();
			}

			$scope.deferred = $q.defer();
			$scope.info.testResultsPending = true;
			RulesService.getTestResults(selectQuery, $scope.deferred).then(function(response) {
				$scope.info.testResultsPending = false;
				$scope.info.testresultLoading = false;
				$scope.info.testResultsList = [];

				var foundRuleIds = {};

				if (!!response.data.length) {
					for (var i = 0; i < response.data.length; i++) {
						foundRuleIds[response.data[i].rule_id] = true;
						var labelFound = false;
						for (var j = 0; j < $scope.info.testResultsList.length; j++) {
							if ($scope.info.testResultsList[j].label == response.data[i].label) {
								var msgMap = {
									id : ($scope.info.testResultsList[j].length + 1),
									msg : response.data[i].display_msg
								};
								$scope.info.testResultsList[j].texts.push(msgMap);
								labelFound = true;
								break;
							}
						}
						if (!labelFound) {
							var testEntry = {};
							for (var j = 0; j < $scope.info.testGridColumnsList.length; j++) {
								testEntry[$scope.info.testGridColumnsList[j].field] = response.data[i][$scope.info.testGridColumnsList[j].field];
							}
							testEntry.texts = [];
							var msgMap = {
								id : 1,
								msg : response.data[i].display_msg
							};
							testEntry.texts.push(msgMap);
							$scope.info.testResultsList.push(testEntry);
						}
					}
				}

				for (var i = 0; i < rulesDetails.length; i++) {
					var found = ($filter('filter')($scope.info.testResultsList, {
						rule_id : rulesDetails[i].rule_id
					}, true) || []).length ? true : false;
					if (!found) {
						var testEntry = {};
						for (var j = 0; j < $scope.info.testGridColumnsList.length; j++) {
							testEntry[$scope.info.testGridColumnsList[j].field] = rulesDetails[i][$scope.info.testGridColumnsList[j].rules_field];
						}
						testEntry.texts = [];
						$scope.info.testResultsList.push(testEntry);
					}
				}

				if (/\d+/.test(bundle.prod_rule_id)) {
					var prodRules = RulesService.getRulesList();
					var ruleFoundInProd = ($filter('filter')(prodRules, {
						rule_id : parseInt(bundle.prod_rule_id)
					}, true) || [])[0].status == "DRAFT" ? true : false;

					if (ruleFoundInProd && !bundle.rule_modified && !!response.data.length) {
						$scope.info.prodEnableRuleId = parseInt(bundle.prod_rule_id);
						$scope.info.prodEnableRuleLabel = rulesDetails[0].label_display;
						$scope.info.prodEnableRuleName = rulesDetails[0].rule_name;
						$scope.info.ruleTestSucceeded = true;
					} else {
						$scope.info.ruleTestSucceeded = false;
					}
				} else {
					$scope.info.ruleTestSucceeded = false;
				}

				var rulesLabels = [];
				var module = ""
				for (var i = 0; i < $scope.info.testResultsList.length; i++) {
					rulesLabels.push($scope.info.testResultsList[i].label);
				}
				module = "Test Rule History";
				UserTrackingService.standard_user_tracking($scope.info.application, module, 'View Results', rulesLabels.join(",")).then(function(response) {

				}, handleSessionTimeout);
			}, function(response) {
				$scope.info.testResultsPending = false;
				if (response.status != 0) {
					$scope.info.testresultLoading = false;
				}
				$scope.info.testResultsList = "";
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['test_rule_failed'];
				if (!$scope.info.sessionTimedOut && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
					$scope.info.sessionTimedOut = true;
					ModalService.sessionTimeout();
				}
			});
		}else{			
			$scope.info.testresultLoading = false;
			bundle.expanded = false;
		}
	};
	$scope.enableDisableStatusBtn = function(){
		return $scope.info.enableRuleComments.length >= $scope.info.enableRuleCommentsLimitMin;
	}
	$scope.confirmEnablingRule = function(){
		//open message box to ask for message befor enable it
		$scope.msg = false;
		$scope.selectedRuleName = $scope.info.prodEnableRuleLabel;
		$scope.info.enableRuleComments = "";
		$scope.modal = ModalService.openModal('partials/rules-and-alerts/modal-enable-rule-message-box.html', $scope, "gb-modal-test-rule-enable-modal", 'static');
	}
	// Function to enable a tested rule
	$scope.enableDisableRuleAction = function() {
		if(!$scope.info.enableRuleComments.length) return;
		$scope.modal.close();
		$scope.info.pageLoading = true;
		RulesService.enableRule($scope.info.prodEnableRuleId, $scope.info.enableRuleComments).then(function(response) {
			$scope.info.enableRuleComments = "";
			if (RulesService.getRuleMode() && RulesService.getRuleMode()['mode'] == 'edit' && RulesService.getRuleMode()['data'] && RulesService.getRuleMode()['data']['rule_id'] == $scope.info.prodEnableRuleId) {
				var data = RulesService.getRuleMode()['data'];
				data['rule_id'] = response.data.Data.rule_id;
				data['rule_name'] = response.data.Data.rule_name;
				data['alert_id'] = response.data.Data.alert_id;
				data['status'] = $scope.info.supportedStatus.Enabled;
				data['action_id'] = response.data.Data.action_id;
				RulesService.setRuleMode('edit', data);
			}
			$scope.info.successMsg = GlobalService.getVal('rulesMsgs')['rule_enable_success'][0] + $scope.info.prodEnableRuleName + GlobalService.getVal('rulesMsgs')['rule_enable_success'][1];
			UserTrackingService.standard_user_tracking($scope.info.application, 'Test Rule History', 'enable', $scope.info.prodEnableRuleLabel).then(function(response) {

			}, handleSessionTimeout);
			RulesService.getAllRules(RulesService.getRuleType()).then(function(response) {
				RulesService.setRulesList($filter('filterMultiples')($filter('removeDup')(response.data.Data), {
					status : [$scope.info.supportedStatus.Enabled, $scope.info.supportedStatus.Disabled, $scope.info.supportedStatus.Draft]
				}));
				$scope.info.pageLoading = false;
				$scope.info.ruleTestSucceeded = false;
			}, handleSessionTimeout);

			// RulesService.enableStageRule($scope.info.prodEnableRuleId).then(function(response) {
			// 	$scope.info.successMsg = GlobalService.getVal('rulesMsgs')['rule_enable_success'][0] + $scope.info.prodEnableRuleName + GlobalService.getVal('rulesMsgs')['rule_enable_success'][1];
			// }, function(response) {
			// 	$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['rule_enable_failed'][0] + $scope.info.prodEnableRuleName + GlobalService.getVal('rulesMsgs')['rule_enable_failed'][1];
			// });
		}, function(response) {
			$scope.info.pageLoading = false;
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['rule_enable_failed'][0] + $scope.info.prodEnableRuleName + GlobalService.getVal('rulesMsgs')['rule_enable_failed'][1];
			}
			handleSessionTimeout(response);
		});
	};

	// Function to load the list of bundles from staging H2
	$scope.loadAllStageBundles = function (bundle) {
			RulesService.checkLCPStatus().then(function (response) {
				if (response.data.Status == "Success") {
					RulesService.getStageBundles().then(function (response) {
						if (response.data.Data.length == $scope.info.initialBundleListLength) {
							if ($scope.info.bundleListCallCount <= 10) {
								$scope.info.bundleListCallCount++;
								$timeout(function () {
									$scope.loadAllStageBundles();
								}, 3000);
							}
							else {
								$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['bundle_load_failed'];
							}
						} else {
							$scope.info.initialBundleListLength = response.data.Data.length;
							$scope.bundlepoll();
						}
					}, function (response) {
						$scope.info.bundlesLoading = false;
						$scope.info.bundlesList = [];
						if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
							GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
							$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
						} else {
							$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['bundle_load_failed'];
						}
						handleSessionTimeout(response);
					});
				}
			}, function (response) {
				$scope.info.bundlesLoading = false;
				$scope.info.bundlesList = [];
				handleSessionTimeout(response);
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[2]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['lcp_down_msg'];
			});
		
	};

	$scope.bundlepoll = function(){
		if(!!$scope.info.firstLoad){
			$scope.info.bundlesLoading = true;	
		}
		RulesService.checkLCPStatus().then(function(response) {
			if (response.data.Status == "Success") {
				RulesService.getStageBundles().then(function(response) {

					if(!!$scope.info.firstLoad){
						$scope.info.bundlesLoading = true;
						$scope.info.initialBundleListLength = response.data.Data.length;	
					}
					
					if (!!$scope.info.deleteTemporaryBundle) {
						$scope.info.temporaryBundleData = [];
						delete $scope.info.deleteTemporaryBundle;
					}
					var tmpList = $filter('filter')(response.data.Data, {
						supported: true
					}) || [];
					//check if its is expanded
					$scope.info.bundlesList.map(function (item) {
						if (item.expanded) {
							tmpList.map(function (tmpItem) {
								if (item.load_id === tmpItem.load_id && item.seen_ts === tmpItem.seen_ts) {
									tmpItem.expanded = true;
								}
							});
						}
					});
					$scope.info.bundlesList = tmpList;
					//var utcCurrentTime = metaDataService.getTodayDate();
					//var sixHours = moment(currentTime).subtract(1, 'minutes');
					var thresholdHours = GlobalService.getVal(thresholdHours);
					var sixHours = new Date(new Date().setHours(new Date().getHours() - thresholdHours)).getTime() / 1000 | 0;
					//check if bundle seenid  < current time - 6hours && state == 0(waiting in queue) then change the state to 4(failled)
					for (var i = 0; i < $scope.info.bundlesList.length; i++) {
						if ($scope.info.bundlesList[i].bundle_state == 0 && moment($scope.info.bundlesList[i].seen_ts).unix() < sixHours) {
							$scope.info.bundlesList[i].bundle_state = 4;

						}
					}

					var found = false;
					for (var i = 0; i < $scope.info.bundlesList.length; i++) {
						if ($scope.info.bundleStatus[$scope.info.bundlesList[i].bundle_state] == 'Processing' || $scope.info.bundleStatus[$scope.info.bundlesList[i].bundle_state] == 'Parsing') {
							found = true;
							break;
						}
					}
					if (found) {
						$timeout(function () {
							$scope.bundlepoll();
						}, 5000);

					}
					$scope.info.bundlesLoading = false;
					$scope.info.firstLoad = false;
					$scope.trackUser('Test History', 'view', $scope.info.bundlesList);
				}, function(response) {
					$scope.info.bundlesLoading = false;
					$scope.info.bundlesList = [];
					if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
						GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
						$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
					} else {
						$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['bundle_load_failed'];
					}
					handleSessionTimeout(response);
				});
				
			} else {
				$scope.info.bundlesLoading = false;
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[2]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['lcp_down_msg'];
			}

		}, function(response) {
			$scope.info.bundlesLoading = false;
			$scope.info.bundlesList = [];
			handleSessionTimeout(response);
			GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[2]);
			$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['lcp_down_msg'];
		});
	}

	// Show "Upload log" link if you came to this page with rule(s) to be tested
	if ($scope.info.selectedRules.length) {
		$scope.info.temporaryBundleData = [{
			rules : $scope.info.selectedRules,
			upload_log : true
		}];
	}

	$scope.info.firstLoad = true;
	$scope.bundlepoll();

	// Function to insert selected rules to staging H2
	$scope.insertSelectedRules = function() {		
		if(!$scope.validateUploadform()){
			return false;
		}
		ErrorService.clearErrors('fileupload');
		var bundleName =  $scope.info.uploader.queue[0].file.name;
		// validate bundle name
		// it should be a sinlge word, should be a space in name
		if(bundleName.indexOf(' ') != -1){
			ErrorService.setError('fileupload', GlobalService.getVal('rulesMsgs')['test_rule_bundle_upload_name_error']);
			return false;
		}
		if ($scope.info.uploader.queue.length == 0) {
			return;
		}
		$scope.info.rulesCopying = true;
		$scope.info.temporaryBundleData = [{
			bundle_name : $scope.info.uploader.queue[0].file.name,
			waiting : true
		}];
		$scope.insertRules(false);
	};

	// Function to insert selected prod rules into staging before testing them
	$scope.insertRules = function(forLogBundles) {
		if(forLogBundles){
			$scope.testButtonDisable = true;
			$scope.uploadBtnDisable = true;
		}
		
		ErrorService.clearErrors('fileupload');
		if(forLogBundles){			
			for (var i = 0; i < $scope.logBundlesFromLogvault.length; i++) {
				tmp = $scope.logBundlesFromLogvault[i];
				tmp["status"] = "loading";			
			}
		}
		RulesService.insertRuleStaging($scope.getInsertRuleData()).then(function(response) {
			if (response.status == 200) {
				if(!forLogBundles){					
					$scope.info.temporaryBundleData = [{
						bundle_name : $scope.info.uploader.queue[0].file.name,
						uploading : true
					}];
				}
				RulesService.setStagingRules(true);
				$scope.info.insertedStageRules = "";
				for (var i = 0; i < response.data.Data.length; i++) {
					$scope.info.insertedStageRules += "," + response.data.Data[i].rule_id;
				}
				$scope.info.insertedStageRules = $scope.info.insertedStageRules.substring(1);
				$scope.info.bunldeSignatureCount = response.data.Data[0].count;
				if(forLogBundles){
					$scope.info.checkUploadToLCPCount = 0;
					$scope.testRulesWithLogvaultBundle();
				}else{
					$scope.info.rulesCopying = true;
					setTimeout(function(){$scope.beginUpload();},$scope.info.fileuploadDelay);
				}				
				
			} else {
				ErrorService.setError('fileupload', GlobalService.getVal('rulesMsgs')['test_rule_copy_error']);
				if(!forLogBundles){		
					$scope.info.temporaryBundleData = [];
				}
			}
			if(forLogBundles){
				$scope.trackUser('Test Rules', 'Upload from logvalult', $scope.logBundlesFromLogvault);
			}else{
				$scope.trackUser('Test Rules', 'Upload from local Machine', {"bundle name": $scope.info.uploader.queue[0].file.name});
			}
			
			//$scope.info.rulesCopying = false;
		}, function(response) {
			//$scope.modal.close();
			$scope.testButtonDisable = false;
			$scope.uploadBtnDisable = false;
			$scope.info.temporaryBundleData = [];
			$scope.info.rulesCopying = false;
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				ErrorService.setError('fileupload', GlobalService.getVal('rulesMsgs')['h2_down_msg']);
			} else {
				ErrorService.setError('fileupload', GlobalService.getVal('rulesMsgs')['test_rule_copy_error']);
			}
			for (var i = 0; i < $scope.logBundlesFromLogvault.length; i++) {
				tmp = $scope.logBundlesFromLogvault[i];
				delete tmp["status"];		
			}

			handleSessionTimeout(response);
		});
	};

	// Function to check file upload to LCP status
	$scope.checkfileUploadToLCPStatus = function(fileEpoch) {
		if ($scope.info.checkUploadToLCPCount < 10) {
			RulesService.checkfileUploadToLCPStatus(fileEpoch).then(function(response) {
				$scope.info.checkUploadToLCPCount++;
				if (response.data.Status == "Success") {
					$scope.insertBundleRuleAssociation(fileEpoch);
				} else {
					$timeout(function() {
						$scope.checkfileUploadToLCPStatus(fileEpoch);
					}, 5000);
				}
			}, function(response) {
				RulesService.setLogMoving(false);
				$scope.info.temporaryBundleData = [];
				handleSessionTimeout(response);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['log_processing_failed'];
			});
		} else {
			RulesService.setLogMoving(false);
			$scope.info.temporaryBundleData = [];
			$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['log_processing_failed'];
		}
	};

	// Inserts rule association with a bundle into bundle_rule CF
	$scope.insertBundleRuleAssociation = function(fileEpoch) {
		var data = {
			rule_id : $scope.info.insertedStageRules,
			//count : $scope.info.bunldeSignatureCount,
			bundle_name: $scope.info.stageUploadBundleName,
			bundle_epoch: fileEpoch,
			supported : true,
			prod_rule_id : ($scope.info.selectedRules.length == 1 && $scope.info.selectedRules[0].status == $scope.info.supportedStatus.Draft) ? $scope.info.selectedRules[0].rule_id : "",
			rule_modified : false
		};
		RulesService.checkLCPStatus().then(function(response) {
			if (response.data.Status == "Success") {
				RulesService.insertBundleRuleAssociation(data).then(function(response) {
					response.data.Data = (response.data.Data == "") ? 0 : response.data.Data;
					if (response.data.Data == "false") {
						$timeout(function() {
							$scope.insertBundleRuleAssociation(fileEpoch);
						}, 3000);
					} else {
						RulesService.setLogMoving(false);
						RulesService.setLastLogUploadTime(Math.floor(Date.now()));
						$scope.info.deleteTemporaryBundle = true;
						var found = false;
						for (var i = 0; i < $scope.info.bundlesList.length; i++) {
							if ($scope.info.bundleStatus[$scope.info.bundlesList[i].bundle_state] == 'Processing' || $scope.info.bundleStatus[$scope.info.bundlesList[i].bundle_state] == 'Parsing') {
								found = true;
								break;
							}
						}
						if (!found) {
							$scope.loadAllStageBundles(false);
						}
					}
				}, function(response) {
					RulesService.setLogMoving(false);
					$scope.info.temporaryBundleData = [];
					if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
						GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
						$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
					} else {
						$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['log_processing_failed'];
					}
					handleSessionTimeout(response);
				});
			} else {
				RulesService.setLogMoving(false);
				$scope.info.temporaryBundleData = [];
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[2]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['lcp_down_msg'];
			}
		}, function(response) {
			RulesService.setLogMoving(false);
			$scope.info.temporaryBundleData = [];
			handleSessionTimeout(response);
			$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['log_processing_failed'];
		});

	};

	// Function to get insert rule data
	$scope.getInsertRuleData = function() {
		var ruleIDs = [];
		var categoryIDs = [];
		var notifierIDs = [];
		var templateIDs = [];
		for (var i = 0; i < $scope.info.selectedRules.length; i++) {
			ruleIDs.push($scope.info.selectedRules[i].rule_id);
			notifierIDs.push($scope.info.selectedRules[i].alert_id);

			var categoryFound = false;
			for (var j = 0; j < categoryIDs.length; j++) {
				if (parseInt(categoryIDs[j]) == parseInt($scope.info.selectedRules[i].category_id)) {
					categoryFound = true;
					break;
				}
			}
			if (!categoryFound) {
				categoryIDs.push($scope.info.selectedRules[i].category_id);
			}

			var templateFound = false;
			for (var j = 0; j < templateIDs.length; j++) {
				if (parseInt(templateIDs[j]) == parseInt($scope.info.selectedRules[i].email_template_id)) {
					templateFound = true;
					break;
				}
			}
			if (!templateFound && !!$scope.info.selectedRules[i].email_template_id) {
				templateIDs.push($scope.info.selectedRules[i].email_template_id);
			}
		}

		var data = {
			rule_id : ruleIDs.join(","),
			alert_id : notifierIDs.join(","),
			category_id : categoryIDs.join(",")
		};

		if (templateIDs.length > 0) {
			data['template_id'] = templateIDs.join(",");
		}

		return data;
	};

	$scope.closeDataPathModal = function() {
		$scope.modal.close();
	}
	//
	// Code for bundle upload start
	//

	$scope.uploadForm = {};

	

	// Get config and file upload config
	RulesService.getAllConfig().then(function(response) {
		if (AppService.isGbStudioApp()) {
			response.data.Data['config'] = !!response.data.Data['default_config'] ? response.data.Data['default_config'] : response.data.Data['config'];
			response.data.Data['file_upload_config'] = !!response.data.Data['default_file_upload_config'] ? response.data.Data['default_file_upload_config'] : response.data.Data['file_upload_config'];
		}
		$scope.info.pageLoading = false;
		$scope.info.showMandatoryLabel = false;
		$scope.info.mandatoryLabel = GlobalService.getVal('fileupload_mandatory_label');
		$scope.info.uploadData = response.data.Data.file_upload_config.json_form ? JSON.parse(response.data.Data.file_upload_config.json_form) : response.data.Data.file_upload_config.json_form;
		//initialize uploadForm
		for (i in $scope.info.uploadData) {
			if (!!$scope.info.uploadData[i]['required']) {
				$scope.uploadForm[$scope.info.uploadData[i]['name']] = {};
				$scope.uploadForm[$scope.info.uploadData[i]['name']].nodeVal = "";
			}
			if($scope.info.uploadData[i]['mandatory']){
				$scope.info.showMandatoryLabel = true;
			}
		}
		$scope.info.uploadDataMaxSize = parseInt(response.data.Data.file_upload_config.max_upload_size);
		for (var i = 0; i < $scope.info.uploader.filters.length; i++) {
			if ($scope.info.uploader.filters[i].name == 'extensionFilter') {
				$scope.info.uploader.filters[i] = {
					name : 'extensionFilter',
					fn : function(item) {
						var match = false,
						    i,
						    extList = response.data.Data.file_upload_config.allowed_extension.split(', ');
						for (i in extList) {
							if (item.name.endsWith(extList[i])) {
								match = true;
							}
						}

						return match;
					}
				};
			}
		}

	}, function(response) {
		$scope.info.pageLoading = false;
		handleSessionTimeout(response);
	});

	// Gets the values from the globals based on the given key.
	$scope.getValue = function(key) {
		return GlobalService.getVal(key);
	};

	// Returns all the file upload errors
	$scope.getUploadErrors = function() {
		return ErrorService.getErrors('fileupload');
	};

	// Uploader object for file upload.
	$scope.info.uploader = new FileUploader({
		url : RulesService.getStagingDomain() + '/fileupload/uploadfile/' + manufacturer + '/' + product + '/' + schema + '?stage=true',
		queueLimit : GlobalService.getVal('test_log_upload_limit'),
		filters : [{
			name : 'extensionFilter',
			fn : function(item) {
				var match = false,
				    i,
				    extList = GlobalService.getVal('file_upld_suprtd_extns').split(', ');
				for (i in extList) {
					if (item.name.endsWith(extList[i])) {
						match = true;
					}
				}

				return match;
			}
		}],

		// Execute after adding a file to upload
		onAfterAddingFile : function(item) {
			$scope.checkSizeLimit();
		},

		// Execute if adding a file to form failed
		onWhenAddingFileFailed : function(item, filter, options) {
			if (filter.name == 'queueLimit') {
				ErrorService.setError('fileupload', GlobalService.getVal('test_log_upload_limit_exceeded'));
			} else {
				ErrorService.setError('fileupload', GlobalService.getVal('file_upld_unsupported'));
			}
		},

		// Execute if an error occured while uploading
		onErrorItem : function(item, response, status, headers) {
			if (!$scope.info.sessionTimedOut && response && response.hasOwnProperty('Msg') && response.Msg.match(/timeout/)) {
				if (!!$scope.modal) {
					$scope.modal.close();
				}
				$scope.info.sessionTimedOut = true;
				ModalService.sessionTimeout();
				return;
			}
		},

		// Execute if file was uploaded successfully
		onSuccessItem : function(item, response, status, headers) {
			var fileEpoch = response.Data.split(":")[0];
			
			$scope.info.temporaryBundleData = [{
				bundle_name : $scope.info.uploader.queue[0].file.name,
				processing : true
			}];
			RulesService.setLogMoving(true);
			$scope.info.checkUploadToLCPCount = 0;
			$scope.info.stageUploadBundleName = response.Data.split(":")[1];
			$scope.checkfileUploadToLCPStatus(fileEpoch);
		},

		// Execute before the upload of file starts
		onBeforeUploadItem : function(item) {
			var t_obj;
			angular.forEach($scope.uploadForm, function(value, key) {
				t_obj = {};
				t_obj[key] = value.nodeVal;
				item.formData.push(t_obj);
			});
			$scope.info.uploadDone = false;
		},

		// Execute when all the added files got completed
		onCompleteAll : function() {
			var i,
			    success = false,
			    failure = false,
			    cancel = false,
			    details;
			details = {};
			for (i in $scope.uploadForm)
			if ($scope.uploadForm.hasOwnProperty(i)) {
				details[i] = $scope.uploadForm[i]['nodeVal'];
			}
			details['files'] = [];
			for (i in $scope.info.uploader.queue) {
				if ($scope.info.uploader.queue[i].isSuccess) {
					success = true;
					details['files'].push($scope.info.uploader.queue[i]['file']['name']);
				} else if ($scope.info.uploader.queue[i].isCancel) {
					cancel = true;
					$scope.info.bundlesList = [];
				} else {
					failure = true;
					$scope.info.bundlesList = [];
				}
			}
			$scope.checkSizeLimit();
			if ((success && cancel && failure) || (success && cancel && !failure)) {
				ErrorService.setError('fileupload', GlobalService.getVal('file_upld_partial'));
			} else if (!success && cancel && !failure) {
				ErrorService.setError('fileupload', GlobalService.getVal('file_upld_cancel'));
			} else if (success && !cancel && !failure) {
				$scope.info.uploadDone = false;
				$scope.info.uploader.clearQueue();
				ErrorService.clearErrors('fileupload');
				$scope.modal.close();
			} else if ((!success && !cancel && failure) || (!success && cancel && failure) || (success && !cancel && failure)) {
				ErrorService.setError('fileupload', GlobalService.getVal('file_upld_fail'));
			} else {

			}			
			$scope.info.uploader.queue.length = 0;
			$scope.info.disableUpload = false;
		}
	});

	// Checks the file size limit
	$scope.checkSizeLimit = function() {
		var i,
		    sum = 0;
		for (i in $scope.info.uploader.queue) {
			sum += $scope.info.uploader.queue[i].file.size;
		}
		ErrorService.clearErrors('fileupload');
		if (sum > $scope.info.uploadDataMaxSize) {
			ErrorService.setError('fileupload', GlobalService.getVal('file_upld_maxsize') + '<span title="' + $scope.info.uploadDataMaxSize + ' B">' + $filter('fileSize')($scope.info.uploadDataMaxSize) + '</span>');
		}
	};
	//validate upload form
	 $scope.validateUploadform = function(){
		var valid = true;
		for (i in $scope.info.uploadData) {
			if (!!$scope.info.uploadData[i]['required']) {
				if (!!$scope.info.uploadData[i]['mandatory']){
				if ($scope.uploadForm[$scope.info.uploadData[i]['name']].nodeVal == "") {
					$scope.uploadForm[$scope.info.uploadData[i]['name']].error = true;
					$scope.info.disableUpload = false;
					$scope.info.bundlesList = [];
					valid = false;
				} else {
					$scope.uploadForm[$scope.info.uploadData[i]['name']].error = false;
				}
			}	
			}
		}
		return valid;
	}
	// Starts the upload
	$scope.beginUpload = function() {

		var i,
		    details,
		    j,
		    upload = true;

		$scope.checkSizeLimit();
		$scope.info.rulesCopying = false;
		/* for (i in $scope.info.uploadData) {
			if (!!$scope.info.uploadData[i]['required']) {
				if ($scope.uploadForm[$scope.info.uploadData[i]['name']].nodeVal == "") {
					$scope.uploadForm[$scope.info.uploadData[i]['name']].error = true;
					$scope.info.disableUpload = false;
					$scope.info.bundlesList = [];
					upload = false;
				} else {
					$scope.uploadForm[$scope.info.uploadData[i]['name']].error = false;
				}
			}
		} */

		$scope.uploadForm.stage = {
			error : false,
			nodeVal : true
		};
		if (ErrorService.getErrors('fileupload').length == 0) {
			$scope.info.disableUpload = true;
			$scope.info.uploader.uploadAll();
		}
	};

	// Clears the upload queue
	$scope.removeAll = function() {
		$scope.info.uploadDone = false;
		$scope.info.uploader.clearQueue();
		ErrorService.clearErrors('fileupload');
		$scope.hideUploadModal();
		$scope.openUploadLogModal();
	};

	// Removes the file from the queue.
	$scope.removeFile = function(item) {
		$scope.info.uploadDone = false;
		$scope.info.uploader.clearQueue();
		ErrorService.clearErrors('fileupload');
		$scope.hideUploadModal();
		$scope.openUploadLogModal();
	};

	// Cancels upload of all the files.
	$scope.cancelAll = function() {
		var i;
		for (i in $scope.info.uploader.queue) {
			$scope.info.uploader.queue[i].cancel();
		}
		$scope.info.uploader.cancelAll();
		$scope.info.disableUpload = false;
	};

	// Hides the modal for the file upload.
	$scope.hideUploadModal = function() {
		$scope.modal.close();
		$scope.info.uploadModalOpened = false;
	};

	// Function to close the upload modal
	$scope.closeUploadModal = function() {
		if ($scope.info.uploader.isUploading) {
			$scope.msg = GlobalService.getVal('abort_upld');
			$scope.modal1 = ModalService.openModal("partials/abort_upload.html", $scope, false, 'static');
			$scope.fadeUploadModal = true;
		} else {
			$scope.info.uploader.clearQueue();
			for (var i in $scope.uploadForm)
			if ($scope.uploadForm.hasOwnProperty(i)) {
				$scope.uploadForm[i].nodeVal = "";
				$scope.uploadForm[i].error = false;
			}
			ErrorService.clearErrors('fileupload');
			$scope.modal.close();
			$scope.info.uploadModalOpened = false;
			$scope.fadeUploadModal = false;
			$scope.info.rulesCopying = false;
			$scope.info.uploadDone = false;
		}
	};

	// Function to abort upload
	$scope.abortUpload = function() {
		if ($scope.info.uploader.isUploading) {
			$scope.cancelAll();
		}
		$scope.info.uploader.clearQueue();
		for (var i in $scope.uploadForm)
		if ($scope.uploadForm.hasOwnProperty(i)) {
			$scope.uploadForm[i].nodeVal = "";
			$scope.uploadForm[i].error = false;
		}
		ErrorService.clearErrors('fileupload');
		$scope.modal.close();
		$scope.info.uploadModalOpened = false;
		$scope.fadeUploadModal = false;
		$scope.info.rulesCopying = false;
		$scope.info.uploadDone = false;
	};

	// Function to hide abort modal
	$scope.hideAbortUpload = function() {
		$scope.modal1.close();
		$scope.fadeUploadModal = false;
	};

	// Function to handle session timeout
	function handleSessionTimeout(response) {
		if (!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
			$scope.info.sessionTimedOut = true;
			ModalService.sessionTimeout();
		}
	};
	$scope.selectedRulesPagination = (function(){
		var records = $scope.info.selectedRules,total = $scope.info.selectedRules.length,
		current = 1, pageSize = 10,displayMsg = "", orderedData;

		return{	
			currentPageSize : 10,
			getTotalPages : function(){
				var maxPages = Math.ceil(total/pageSize);
				return maxPages;
			},
			getCurrentPage : function(){
				return current;
			},
			getDisplayMsg : function(){
				var endIndex = (current* pageSize);
				if(records.length < endIndex){
					endIndex = records.length;
				}
				displayMsg = ((current - 1)* pageSize + 1) +" - " + endIndex + " of " + total;
				return displayMsg;

			},
			setPageSize: function(num){
				currentPageSize = num;
				pageSize = num;
			},
			setTotal : function(recs){
				total = recs.length;
			},
			next : function(){
				var maxPages = Math.ceil(total/pageSize);
				current++;
				if(current >= maxPages){
					current = maxPages;
				}

			},
			prev : function(){
				current--;
				if(current <=0){
					current = 1;
				}

			},
			first : function(){
				current = 1;

			},
			last : function(){
				current = Math.ceil(total/pageSize);
			},
			getData : function(){
				orderedData = records.slice((current - 1) * pageSize,current * pageSize);
				if(!orderedData) return [];
				return orderedData;
			}
		}
	})();
	

	//
	// Code for bundle upload ends
	//
	$scope.emptyLogvaultBundle = function () {
		if($scope.modal){
			$scope.modal.close();
			//fix for bootstrap internal modal bug
			//modal backdrops remains in the background for 5 seconds causing unclickable screen
			angular.element($document[0].getElementsByClassName('modal-backdrop')).remove();
			ErrorService.clearErrors('fileupload');
		}		
		$scope.logBundlesFromLogvault = [];
		$scope.testButtonDisable = false;
		$scope.uploadBtnDisable = false;
	};

	$scope.$on('bundleListFromLogVault', function(event, page) {
		$scope.logBundlesFromLogvault = RulesService.getLogBundle($scope.bundleList);
		for (var i = 0; i < $scope.logBundlesFromLogvault.length; i++) {
			var tmp = $scope.logBundlesFromLogvault[i];
			tmp["status"] = "";
		}
		if($scope.logBundlesFromLogvault.length > 0){
			$scope.modal = ModalService.openModal("partials/rules-and-alerts/bundles_from_logvault.html", $scope, false, 'static', true);
		}
	});

	//
	$scope.$watch('logBundlesFromLogvault', function (newVal, oldVal) {
		var found = false;
		for(var i=0;i<newVal.length;i++){
			if(newVal[i]['status']){
				if(newVal[i]['status'] == 'loading'){
					found = true;
					break;
				}
			}else{
				found = false;
				break;
			}
		};
		if(!found){
			$scope.allBunldesUploaded  = true;
			$scope.testButtonDisable = false;

		}else{
			$scope.allBunldesUploaded  = false;
		}
	}, true);

	$scope.testRulesWithLogvaultBundle = function () {
		$scope.testButtonDisable = true;
		var bundles = [], tmp;
		for (var i = 0; i < $scope.logBundlesFromLogvault.length; i++) {
			tmp = $scope.logBundlesFromLogvault[i];
			bundles.push({ "bundle_name": tmp['obs_url'], "bundle_id": tmp['bundle_id'], "obs_date": tmp['obs_date'], "status":"loading" });			
		}
		var param = {
			"download": {
				"bundles": bundles
			}
		}
		RulesService.sendRulesWithLogvaultBundle(param).then(function (response) {
			var result = response.data.Data;
			var resLen = result.length;
			for (var i = 0; i < resLen; i++) {
				var bundle = result[i];
				var bundleName = bundle['bundle_name'].split(":")[1];
				var epoc = bundle['bundle_name'].split(":")[0]; 
				for (var j = 0; j < $scope.logBundlesFromLogvault.length; j++) {
					var tmp = $scope.logBundlesFromLogvault[j];
					if( (tmp.obs_date.replace("T","_").replace(/:/g,"_").replace("Z","_")+tmp["obs_url"]) == bundleName){
						tmp['bundle_name'] =  bundleName;
						bundle = tmp;
						break;
					}					
				}
				//initialize countter for mulitple api call
				bundle.count = 0;
				bundle.status = "loading";
				bundle.insertCount = 0				
				//call api from here
				$scope.checkMultiplefileUploadToLCPStatus(bundle, epoc, $scope.insertMultipleBundleRuleAssociation);				
			}
		}, function (response) {
			$scope.info.pageLoading = false;
			handleSessionTimeout(response);
		});
	}

	// Function to check file upload to LCP status for multiple bundles
	$scope.checkMultiplefileUploadToLCPStatus = function (bundle, fileEpoch, callback) {
		if (bundle.count < 7) {
			
			RulesService.checkfileUploadToLCPStatus(fileEpoch).then(function (response) {
				bundle.count++;
				//response.data.Status ="failure"
				if (response.data.Status == "Success") {
					//bundle.status = "success"
					callback(bundle, fileEpoch);
				} else {
					$timeout(function () {
						$scope.checkMultiplefileUploadToLCPStatus(bundle, fileEpoch, callback);
					}, 5000);
				}
			}, function (response) {

				handleSessionTimeout(response);
				bundle.status = "failed";
				$scope.testButtonDisable = false;
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['log_processing_failed'];
			});
		} else {
			$scope.testButtonDisable = false;
			bundle.status = "failed";
			ErrorService.setError('fileupload', GlobalService.getVal('rulesMsgs')['log_processing_failed']);
			$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['log_processing_failed'];
		}
	};

	// Inserts rule association with a bundle into bundle_rule CF
	$scope.insertMultipleBundleRuleAssociation = function (bundle, fileEpoch) {
		var data = {
			rule_id: $scope.info.insertedStageRules,
			//count : $scope.info.bunldeSignatureCount,
			bundle_name: bundle['bundle_name'],
			bundle_epoch: fileEpoch,
			supported: true,
			prod_rule_id: ($scope.info.selectedRules.length == 1 && $scope.info.selectedRules[0].status == $scope.info.supportedStatus.Draft) ? $scope.info.selectedRules[0].rule_id : "",
			rule_modified: false
		};
		
		RulesService.checkLCPStatus().then(function (response) {
			if (response.data.Status == "Success" && bundle.insertCount < 8) {
				RulesService.insertBundleRuleAssociation(data).then(function (response) {
					bundle.insertCount++;
					response.data.Data = (response.data.Data == "") ? 0 : response.data.Data;
					//response.data.Data ="false"
					if (response.data.Data == "false") {
						$timeout(function () {
							$scope.insertMultipleBundleRuleAssociation(bundle, fileEpoch);
						}, 3000);
					} else {
						bundle.status = "success";
					}
						$scope.loadAllStageBundles(bundle);
				}, function (response) {

					if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
						GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
						$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
					} else {
						ErrorService.setError('fileupload', GlobalService.getVal('rulesMsgs')['log_processing_failed']);
						$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['log_processing_failed'];
					}
					bundle.status = "failed";
					$scope.uploadfailed(bundle);
					$scope.testButtonDisable = false;
					handleSessionTimeout(response);
				}.bind(this));
			} 
			
			else {
				$scope.testButtonDisable = false;
				bundle.status = "failed";
				ErrorService.setError('fileupload', GlobalService.getVal('rulesMsgs')['log_processing_failed']);
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[2]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['lcp_down_msg'];
			}
		}, function (response) {
			handleSessionTimeout(response);
			ErrorService.setError('fileupload', GlobalService.getVal('rulesMsgs')['log_processing_failed']);
			$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['log_processing_failed'];
		});

	};

	$scope.uploadfailed = function(bundle){
		for (var i = 0; i < $scope.logBundlesFromLogvault.length; i++) {
			if($scope.logBundlesFromLogvault[i]['obs_url'].split(":") == bundle['bundle_name'] ){
				$scope.logBundlesFromLogvault[i]['status'] = 'failed';
			}
						
		}
	}

	//usertracking function
	$scope.trackUser = function (app_Page, operation, details) {
		var details = JSON.stringify(details);
		UserTrackingService.standard_user_tracking($scope.info.application, app_Page, operation, details).then(function (response) {

		}, handleSessionTimeout);
	}

}])

// Controller to handle adding or editing of rules
.controller('AddRuleCtrl', ['$scope', '$sce', '$timeout', '$window', 'ModalService', 'RulesService', '$filter', 'GlobalService', 'UserTrackingService', 'AppService', 'ExplorerService', 'metaDataService', 'RulesTestWithLogvault', 'UtilService','$cookies',
function($scope, $sce, $timeout, $window, ModalService, RulesService, $filter, GlobalService, UserTrackingService, AppService, ExplorerService, metaDataService, RulesTestWithLogvault, UtilService, $cookies) {
	// Object to store all information of Add Rule page
	$scope.info = {};
	$scope.info.clinsightFlag = GlobalService.getVal('clinsightFlag') || false;
	
	$scope.info.ruleType = RulesService.getRuleType();

	$scope.info.unsupportedrule = $scope.info.ruleType == 'unsupported' ? true:false;

	// Stores application name which is used for user tracking
	$scope.info.application = GlobalService.getVal('navRules');

	// Stores the model of last focused element
	$scope.info.lastElementFocused = null;

	// Stores the list of max limits
	$scope.info.maxLimits = GlobalService.getVal('rulesMaxLimits');

	//Stores all the contextual help for add rule
	$scope.info.addRuleContextHelp = GlobalService.getVal('addRulesHelpLinks');
	// $scope.showContent = false;

	$scope.showContent = {
		label: false,
		description: false
	}

	// Stores whether session is timed out or not
	$scope.info.sessionTimedOut = false;
	$scope.addRuleAttrSearch = "";
	$scope.NoAttrSearch = false;
	$scope.ifSearched = false;
	$scope.attributeSearchMinStrLen = GlobalService.getVal("minAttrSearch");

	// Stores what to show in tooltips
	$scope.info.tooltips = GlobalService.getVal('addRuleTooltips');

	// Stores the list of scopes
	$scope.info.scopes = GlobalService.getVal('rulesScopes');

	// Stores the data types of columns
	$scope.info.columnDataTypes = GlobalService.getVal('columnDataTypes');

	// Stores the list of converted attributes
	$scope.info.convertedAttributes = [];
	$scope.info.maxAlertInputLimit = GlobalService.getVal('maxAlertInputLimit');

	$scope.info.ruleCurrentVersion = 0;
	
	// Defines whether section data is loading
	$scope.info.sectionsLoading = true;

	// Defines whether categories is loading
	$scope.info.categoriesLoading = true;

	// Stores the no. of attributes/sections to load on page load
	$scope.info.attributeLimit = 50;

	// Stores the section column label map
	$scope.sectionsColumnLabelMap = {};

	// Stores the list of categories
	$scope.info.categories = [];

	// Stores the list of severities
	$scope.info.severities = [];

	// Stores the list of priorities
	$scope.info.priorities = [];

	// Stores the message to be displayed on top
	$scope.info.addRuleMsg = {};

	// Specifies whether rule is added
	$scope.info.ruleAdded = false;

	// Stores the data of the rule to be tested
	$scope.info.testRuleData = null;

	// Stores the section column details used in logic field
	$scope.info.sectionsColumnLabeListOfLogic = [];


	// Stores the list of operators which should be shown on UI
	$scope.info.operators = $filter('filter')(GlobalService.getVal('rulesOperators'), {
		enabled : true
	});

	// Stores the list of functions which should be shown on UI
	$scope.info.functions = $filter('filter')(GlobalService.getVal('rulesFunctions'), {
		enabled : true
	});

	// Stores the list of functions which should be shown on UI
	$scope.info.aggregateFunctions = $filter('filter')(GlobalService.getVal('rulesAggregateFunction'), {
		enabled : true
	});

	// Stores the list of supported rule status
	$scope.info.supportedStatus = GlobalService.getVal('rulesSupportedStatus');

	$scope.info.selectedTagsCount=0;

	$scope.info.tagList = []
	$scope.processAPItemplateForAddRule = function(data){
		$scope.info.apiTemplates = data;
	}
	$scope.processAPItemplateForEditRule = function(data){
		//process it based on rule's API template ID
		$scope.info.apiTemplates  = data;
		
	}

	$scope.updateTagSelectedCount = function(){
		$scope.info.selectedTagsCount = $scope.info.tagList.filter(function (t) {
			return t.selected;
		}).length
	}
	// Stores the list of API  templates
	$scope.fetchAPITemplate = function(callMeBack){		
		RulesService.getAPITemplates().then(function(response) {
			callMeBack(response.data.Data);	
		}, function(response) {
			$scope.info.apiTemplates = [];
			console.error("Unable to load templates");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addRuleMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}
			handleSessionTimeout(response);
		});
	}

	//store api alert feature true false flag
	$scope.showAlertApiFeature = RulesService.getshowAlertApiFeature();
	//$scope.info.emailList = ["nishanth.prabhu@glassbeam.com","nitin.kulkarni@glassbeam.com","anish.kumar@glassbeam.com","ritesh.dhobal@glassbeam.com","priyanka.roy@glassbeam.com","support@@glassbeam.com"]
	

	$scope.info.emailText = "";
	

	RulesService.getNonSsoUsers().then(function (response) {
		var addUser = function(result, item){
			result.push(item.email);
			return result;
		}
		$scope.info.emailList = response.data.Data.reduce(addUser, []) || [];
		
	}, function (response) {
		$scope.info.emailList = [];
		console.error("Unable to load templates");
		if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
			GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
			$scope.info.addRuleMsg = {
				type: 'failure',
				msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
			};
		}
		handleSessionTimeout(response);
	});

	//getPredefinedTagList
	$scope.fetchtaglist = function () {
		RulesService.getPredefinedTagList().then(function (response) {
			$scope.info.tagList = [];
			$scope.info.tagList = response.data.Data.map(function (t) { t.selected = false; return t }) || [];
			if (RulesService.getRuleMode() && RulesService.getRuleMode()['mode'] == 'edit' && RulesService.getRuleMode()['data']['tags'].length) {
				if ($scope.info.subscription_enabled) {
					$scope.info.tagList.forEach(function (i) {
						RulesService.getRuleMode()['data']['tags'].forEach(function (j) {
							if (i.tag_id == j.tag_id) {
								i.selected = true
							}
						})
					})
					$scope.updateTagSelectedCount();
				}

			}
		}, function (response) {
			$scope.info.tagList = [];
			console.error("Unable to load templates");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addRuleMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}
			handleSessionTimeout(response);
		});
	}

	

	// Function to populate data for edit rule
	$scope.populateEditRule = function() {
		$scope.info.tags = [];
		var editedRuleData =  RulesService.getRuleMode()['data'];
		$scope.info.pageLabel = "Edit Rule - " + editedRuleData['label_display'];
		$scope.info.ruleName = editedRuleData['rule_name'];
		$scope.info.initialLabel = editedRuleData['label'];
		$scope.info.initialScope = editedRuleData['scope'];
		$scope.info.initialMaxLimit = editedRuleData['max_limit'];
		$scope.info.initialSubscription_enabled = editedRuleData['subscription_enabled'] ;
		$scope.info.initialSubscriptionEmailList = editedRuleData['subscriptionEmailList'] ? editedRuleData['subscriptionEmailList'].slice(): [];
		if(parseInt(editedRuleData['email_template_id']) > 0){
			$scope.info.initialAction = 'mail';
		}
		else if(parseInt(editedRuleData['api_template_id']) > 0){
			$scope.info.initialAction = 'api';
		}
		else{
			$scope.info.initialAction = 'none';
		}
		$scope.info.initialLogic = editedRuleData['logic_display'];
		$scope.info.initialText = editedRuleData['text_display'];
		$scope.info.alertID = parseInt(editedRuleData['alert_id']);
		$scope.info.status = editedRuleData['status'];
		$scope.info.subscriberCount = editedRuleData['subscriberCount'];
		// set action, justification, recomendation
		$scope.info.initialApiTemplateId = editedRuleData['api_template_id'];
		$scope.info.initialEmailTemplateId = editedRuleData['email_template_id'];
		$scope.info.initialJustification = editedRuleData['alert_justification_display'];
		$scope.info.initialRecommendation = editedRuleData['recommendation_display'];
		$scope.info.initialtagList = editedRuleData['subscription_enabled'] ? (editedRuleData['tags'].length ? editedRuleData['tags'].reduce(function(acc,cur){ acc.push(cur.tag_id); return acc},[]) :[]) : []
		
		 
		if (RulesService.getRuleMode() && !!RulesService.getRuleMode()['modifiedData']) {
			$scope.info.label = RulesService.getRuleMode()['modifiedData']['label'];
			$scope.info.description = RulesService.getRuleMode()['modifiedData']['description'];
			$scope.info.category = parseInt(RulesService.getRuleMode()['modifiedData']['category_id']);
			$scope.info.author = RulesService.getRuleMode()['modifiedData']['author'];
			$scope.info.severity = parseInt(RulesService.getRuleMode()['modifiedData']['severity_id']);
			$scope.info.priority = parseInt(RulesService.getRuleMode()['modifiedData']['priority_id']);
			$scope.info.action = RulesService.getRuleMode()['modifiedData']['action'];
			$scope.info.emailTemplate = (RulesService.getRuleMode()['modifiedData']['email_template_id'] != 'select' && !!RulesService.getRuleMode()['modifiedData']['email_template_id']) ? parseInt(RulesService.getRuleMode()['modifiedData']['email_template_id']) : 'select';
			$scope.info.apiTemplate = (RulesService.getRuleMode()['modifiedData']['api_template_id'] != 'select' && !!RulesService.getRuleMode()['modifiedData']['api_template_id']) ? parseInt(RulesService.getRuleMode()['modifiedData']['api_template_id']) : 'select';
			$scope.info.kbLink = RulesService.getRuleMode()['modifiedData']['kb_link'];
			$scope.info.recommendation = RulesService.getRuleMode()['modifiedData']['recommendation_display'];
			$scope.info.alert_justification = RulesService.getRuleMode()['modifiedData']['alert_justification_display'];
			$scope.info.logic = RulesService.getRuleMode()['modifiedData']['logic_display'];
			$scope.info.text = RulesService.getRuleMode()['modifiedData']['text_display'];
			$scope.info.scope = RulesService.getRuleMode()['modifiedData']['scope'];
			$scope.info.maxLimit = RulesService.getRuleMode()['modifiedData']['max_limit'];
			$scope.info.maxLimitDisplay = parseInt(RulesService.getRuleMode()['modifiedData']['max_alerts_display_ui']?RulesService.getRuleMode()['modifiedData']['max_alerts_display_ui']:1);
			$scope.info.createdBy = RulesService.getRuleMode()['modifiedData']['created_by'];
			$scope.info.createdTs = RulesService.getRuleMode()['modifiedData']['created_ts'];
			$scope.info.action_id = RulesService.getRuleMode()['modifiedData']['action_id'];
			if($scope.showAlertApiFeature){
				$scope.fetchAPITemplate($scope.processAPItemplateForAddRule);
			}
			$scope.info.subscription_enabled = RulesService.getRuleMode()['modifiedData']['subscription_enabled'];
			$scope.info.subscriptionEmailList = RulesService.getRuleMode()['modifiedData']['subscriptionEmailList'];
			$scope.info.tagList = 	RulesService.getRuleMode()['modifiedData']['tagList'];
			$scope.updateTagSelectedCount();


			
			
		} else {
			$scope.info.label = editedRuleData['label'];
			$scope.info.description = editedRuleData['description'];
			$scope.info.category = parseInt(editedRuleData['category_id']);
			$scope.info.author = editedRuleData['author'];
			$scope.info.severity = parseInt(editedRuleData['severity_id']);
			$scope.info.priority = parseInt(editedRuleData['priority_id']);
			$scope.info.apiTemplate = 'select';
			$scope.info.emailTemplate = 'select';
			if(parseInt(RulesService.getRuleMode()['data']['email_template_id']) > 0){
				$scope.info.action =  'mail';
				$scope.info.emailTemplate = parseInt(RulesService.getRuleMode()['data']['email_template_id']) == 0 ? 'select' : parseInt(RulesService.getRuleMode()['data']['email_template_id']);
				$scope.info.subscription_enabled = editedRuleData['subscription_enabled'] ;
				
			}
			else if(parseInt(RulesService.getRuleMode()['data']['api_template_id']) > 0){
				$scope.info.action =  'api';
				$scope.info.apiTemplate = parseInt(RulesService.getRuleMode()['data']['api_template_id']);
			}
			else{
				$scope.info.action =  'none';
			}
			$scope.info.kbLink = editedRuleData['kb_link'];
			$scope.info.recommendation = editedRuleData['recommendation_display'];
			$scope.info.alert_justification = editedRuleData['alert_justification_display'];
			$scope.info.logic = editedRuleData['logic_display'];
			$scope.info.text = editedRuleData['text_display'];
			$scope.info.scope = editedRuleData['scope'];
			$scope.info.maxLimit = editedRuleData['max_limit'];
			$scope.info.maxLimitDisplay = parseInt(editedRuleData['max_alerts_display_ui']?editedRuleData['max_alerts_display_ui']:1);
			$scope.info.createdBy = editedRuleData['created_by'];
			$scope.info.createdTs = editedRuleData['created_ts'];
			if($scope.showAlertApiFeature){
				$scope.fetchAPITemplate($scope.processAPItemplateForEditRule);
			}
			$scope.setSavedMode();
			$scope.info.action_id = parseInt(RulesService.getRuleMode()['data']['action_id']);
			$scope.info.subscription_enabled = editedRuleData['subscription_enabled'] ;
			$scope.info.subscriptionEmailList = editedRuleData['subscriptionEmailList'] || [];
			if(editedRuleData['tags'] && $scope.info.clinsightFlag){
				$scope.fetchtaglist();
				
			}else{

			}
		}
	};

	// Function to populate data for add rule
	$scope.populateAddRule = function() {
		$scope.info.tags = [];
		$scope.info.pageLabel = "Add New Rule";
		$scope.info.initialLabel = null;
		$scope.info.initialScope = null;
		$scope.info.initialMaxLimit = null;
		$scope.info.initialAction = null;
		$scope.info.initialLogic = null;
		$scope.info.initialText = null;
		$scope.info.initialMaxLimitDisplay = 1;
		
		if (RulesService.getRuleMode() && !!RulesService.getRuleMode()['modifiedData']) {
			$scope.info.label = RulesService.getRuleMode()['modifiedData']['label'];
			$scope.info.description = RulesService.getRuleMode()['modifiedData']['description'];
			$scope.info.category = RulesService.getRuleMode()['modifiedData']['category_id'] != 'select' ? parseInt(RulesService.getRuleMode()['modifiedData']['category_id']) : RulesService.getRuleMode()['modifiedData']['category_id'];
			$scope.info.author = RulesService.getRuleMode()['modifiedData']['author'];
			$scope.info.severity = RulesService.getRuleMode()['modifiedData']['severity_id'] != 'select' ? parseInt(RulesService.getRuleMode()['modifiedData']['severity_id']) : RulesService.getRuleMode()['modifiedData']['severity_id'];
			$scope.info.priority = RulesService.getRuleMode()['modifiedData']['priority_id'] != 'select' ? parseInt(RulesService.getRuleMode()['modifiedData']['priority_id']) : RulesService.getRuleMode()['modifiedData']['priority_id'];
			$scope.info.action = RulesService.getRuleMode()['modifiedData']['action'];
			$scope.info.emailTemplate = (RulesService.getRuleMode()['modifiedData']['email_template_id'] != 'select' && !!RulesService.getRuleMode()['modifiedData']['email_template_id']) ? parseInt(RulesService.getRuleMode()['modifiedData']['email_template_id']) : 'select';
			$scope.info.apiTemplate = (RulesService.getRuleMode()['modifiedData']['api_template_id'] != 'select' && !!RulesService.getRuleMode()['modifiedData']['api_template_id']) ? parseInt(RulesService.getRuleMode()['modifiedData']['api_template_id']) : 'select';
			$scope.info.maxLimitDisplay = parseInt(RulesService.getRuleMode()['modifiedData']['maxLimitDisplay']?RulesService.getRuleMode()['modifiedData']['maxLimitDisplay']:0);
			$scope.info.kbLink = RulesService.getRuleMode()['modifiedData']['kb_link'];
			$scope.info.recommendation = RulesService.getRuleMode()['modifiedData']['recommendation_display'];
			$scope.info.alert_justification = RulesService.getRuleMode()['modifiedData']['alert_justification_display'];
			$scope.info.logic = RulesService.getRuleMode()['modifiedData']['logic_display'];
			delete $scope.info.initialLogic;
			$scope.info.text = RulesService.getRuleMode()['modifiedData']['text_display'];
			delete $scope.info.initialText;
			$scope.info.scope = RulesService.getRuleMode()['modifiedData']['scope'];
			$scope.info.maxLimit = RulesService.getRuleMode()['modifiedData']['max_limit'];
			$scope.info.maxLimitDisplay = parseInt(RulesService.getRuleMode()['modifiedData']['max_alerts_display_ui']?RulesService.getRuleMode()['modifiedData']['max_alerts_display_ui']:1);
			if($scope.showAlertApiFeature){
				$scope.fetchAPITemplate($scope.processAPItemplateForAddRule);
			}	
			$scope.info.subscription_enabled = RulesService.getRuleMode()['modifiedData']['subscription_enabled'];
			$scope.info.subscriptionEmailList = RulesService.getRuleMode()['modifiedData']['subscriptionEmailList'];
			$scope.info.tagList = 	RulesService.getRuleMode()['modifiedData']['tagList'];
			$scope.updateTagSelectedCount();
		} else {
			$scope.info.label = "";
			$scope.info.description = "";
			$scope.info.category = "select";
			$scope.info.author = "";
			$scope.info.severity = "select";
			$scope.info.priority = "select";
			$scope.info.action = 'none';
			$scope.info.emailTemplate = 'select';
			$scope.info.apiTemplate = 'select';
			$scope.info.kbLink = "";
			$scope.info.recommendation = "";
			$scope.info.alert_justification = "";
			$scope.info.maxLimitDisplay = 1;
			if (RulesService.getloadExplorerRules()) {
				$scope.info.logic = ExplorerService.getRuleText();
				RulesService.disableExplorerRules();
				$scope.setUnsavedMode();
				loadExplorerSection = true;
			} else {
				$scope.info.logic = "";
				$scope.setSavedMode();
			}
			delete $scope.info.initialLogic;
			$scope.info.text = "";
			delete $scope.info.initialText;
			$scope.info.scope = $scope.info.scopes[0];
			$scope.info.maxLimit = $scope.info.maxLimits[0];
			$scope.setSavedMode();	
			if($scope.showAlertApiFeature){		
				$scope.fetchAPITemplate($scope.processAPItemplateForAddRule);
			}
			$scope.info.subscription_enabled = false;
			$scope.info.subscriptionEmailList = [];
			$scope.info.clinsightFlag && $scope.fetchtaglist();
		}
	};

	// Function to get section data in case of edit rule
	$scope.getSectionData = function(tables) {
		var tableNames = tables.split(/\s*\,\s*/g);
		$scope.info.sectionsLoaded = 0;
		for (var i = 0; i < tableNames.length; i++) {
			var section = $filter('filter')($scope.info.attributes, {table_name: tableNames[i]}, true)[0];
			if (!section.hasData) {
				$scope.info.sectionsLoading = true;
				$scope.getSectionColumns(section, tableNames.length);
			} else {
				$scope.info.sectionsLoaded++;
				if ($scope.info.sectionsLoaded == tableNames.length) {
					$scope.info.sectionsLoading = false;
				}
			}
		}
	};

	//Get sections based on searched attributes
	$scope.checkSearchText = function() {
		if($scope.addRuleAttrSearch.length<$scope.attributeSearchMinStrLen){
			return true;
		}else {
			return false;
		}
	};
	$scope.clearSearchText = function() {
		$scope.addRuleAttrSearch = "";
		$scope.addRuleAttrSearchChange();
	};
	$scope.addRuleAttrSearchChange = function() {
		if($scope.addRuleAttrSearch.length<$scope.attributeSearchMinStrLen){
			$scope.info.attributes = [];
			$scope.info.attributes = angular.copy(RulesService.getAttributes());
			$scope.NoAttrSearch = false;
			$scope.ifSearched = false;
		}
	};
	$scope.searchAttr = function() {
		if($scope.addRuleAttrSearch.length<$scope.attributeSearchMinStrLen){
			return;
		}
		var specialChar = /[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/;
		if(specialChar.test($scope.addRuleAttrSearch)){
			ModalService.alertBox({msg: GlobalService.getVal("attrSearchSpecialCharecterMsg")});
			return;
		}
		var attr = $scope.addRuleAttrSearch;
		$scope.info.sectionsLoading = true;
		//$scope.info.attributes = [];
		$scope.info.attributes = angular.copy(RulesService.getAttributes());
		RulesService.getSectionsFromAttrAPI(attr).then(function(response) {			
			for(i=0;i<$scope.info.attributes.length;i++){
				$scope.info.attributes[i].foundAttr = [];
				$scope.info.attributes[i].expanded = false;
			}
			var data = response.data.Data;
			for(var key in data){
				for(j=0;j<$scope.info.attributes.length;j++){
					if(key == $scope.info.attributes[j].namespace_actual){
						$scope.info.attributes[j].foundAttr = data[key];
						$scope.info.attributes[j].columns = [];
						$scope.info.attributes[j].hasData = true;
						for(var attributeDataLen=0;attributeDataLen<data[key].length;data[key]++){
							var column = {}, attributeDataObj = data[key][attributeDataLen];
							column.column_name = attributeDataObj['column_name'];
							column.attribute_label = attributeDataObj['label'];
							column.solr_facet = attributeDataObj['namespace_actual'];
							column.type = attributeDataObj['dataType'];
							$scope.info.attributes[j].columns.push(column);
						}
					}
				}
			}
			for(i=0;i<$scope.info.attributes.length;i++){
				if($scope.info.attributes[i].foundAttr.length == 0){
					$scope.info.attributes.splice(i,1);
					i--;
				}
			}
			$scope.ifSearched = true;
			if($scope.info.attributes.length==0){
				$scope.NoAttrSearch = true;
			}else {
				$scope.NoAttrSearch = false;
			}
			$scope.info.sectionsLoading = false;			
			
			$scope.setSectionsColumnLabelMap();
			UserTrackingService.standard_user_tracking($scope.info.application, 'Rule', 'Attribute Search', $scope.addRuleAttrSearch).then(function(response) {}, handleSessionTimeout);
		}, function(response) {
			$scope.info.attributes = [];
			handleSessionTimeout(response);
		});
	};

	// Function to get section columns without expanding
	$scope.getSectionColumns = function(section, total_sections) {
		section.loading = true;
		RulesService.getSectionColumns(section.table_name).then(function(response) {
			section.loading = false;
			$scope.info.sectionsLoaded++;
			if ($scope.info.sectionsLoaded == total_sections) {
				$scope.info.sectionsLoading = false;
			}
			section.columns = [];
			for (var i = 0; i < response.data.Data.length; i++) {
				var column = {};
				column.column_name = Object.keys(response.data.Data[i])[0];
				column.attribute_label = response.data.Data[i][column.column_name].attribute_label;
				column.solr_facet = response.data.Data[i][column.column_name].solr_facet;
				column.type = response.data.Data[i][column.column_name].type;
				column.size = response.data.Data[i][column.column_name].size;
				section.columns.push(column);
				if (column.solr_facet == "G") {
					section.hasGlobal = true;
				} else {
					section.hasLocal = true;
				}
			}
			section.hasData = true;
			//do not update setvice, if its from inline filter
			if(!$scope.addRuleAttrSearch){
				RulesService.setAttributes($scope.info.attributes);
			}
			$scope.setSectionsColumnLabelMap();
		}, function(response) {
			$scope.info.sectionsLoaded++;
			section.loading = false;
			if ($scope.info.sectionsLoaded == total_sections) {
				$scope.info.sectionsLoading = false;
			}
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addRuleMsg = {
					type : 'failure',
					msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}
			handleSessionTimeout(response);
		});
	};

	// Function to set rule in saved mode
	$scope.setSavedMode = function() {
		RulesService.setRuleSavedStatus(false);
	};

	// Function to set rule in unsaved mode
	$scope.setUnsavedMode = function() {
		RulesService.setRuleSavedStatus(true);
	};

	// Function to check if action is changed
	$scope.actionChanged = function() {
		if ($scope.info.action == 'mail' && !!RulesService.getRuleSavedStatus()) {
			return;
		}
		$scope.setUnsavedMode();
	};

	$scope.actionChange = function(){
		if($scope.info.action != 'mail' && $scope.info.selectedTagsCount > 0){
			ModalService.alertBox({
				msg : 'Selected tags will be disassociated and auto subscription will be disabled.'
			});
		}
		
	}

	// Function to go to the Add Category page
	$scope.goToAddCategory = function() {
		$scope.modifyRuleData();
		$scope.$parent.changeCurrentPage('add_category');
	};

	// Function to go to the Manage Templates page
	$scope.goToManageTemplates = function() {
		$scope.modifyRuleData();
		$scope.$parent.changeCurrentPage('manage_template');
	};

	//Manage api template
	$scope.goToManageAPITemplates = function() {
		var sectionAttrbiutePair = RulesService.getSectionsAndAttributePair($scope.info.logic);
		if(sectionAttrbiutePair){
			RulesService.setSectionsColumnLabelForManageAPI(sectionAttrbiutePair);
		}
		$scope.modifyRuleData();
		$scope.$parent.changeCurrentPage('manage_API_template');

	};


	// Function to save modify rule data in service//
	$scope.modifyRuleData = function() {
		var modifiedData = {
			label : $scope.info.label,
			description : $scope.info.description,
			category_id : $scope.info.category,
			author : $scope.info.author,
			severity_id : $scope.info.severity,
			priority_id : $scope.info.priority,
			email_template_id : $scope.info.action == 'mail' ? $scope.info.emailTemplate : '',
			action : $scope.info.action,
			kb_link : $scope.info.kbLink,
			recommendation_display : $scope.info.recommendation,
			alert_justification_display : $scope.info.alert_justification,
			logic_display : $scope.info.logic,
			text_display : $scope.info.text,
			scope : $scope.info.scope,
			max_limit : $scope.info.maxLimit,
			max_alerts_display_ui : $scope.info.maxLimitDisplay,
			created_by : $scope.info.createdBy,
			created_ts : $scope.info.createdTs,
			api_template_id : $scope.info.apiTemplate,
			action_id : $scope.info.action_id,
			subscription_enabled : $scope.info.subscription_enabled,
			subscriptionEmailList : $scope.info.subscriptionEmailList,
			tagList : $scope.info.tagList
		};
		RulesService.modifyRuleData(modifiedData);
	};

	var loadExplorerSection = false;

	//Form field initialization
	if (RulesService.getRuleMode() && RulesService.getRuleMode()['mode'] == 'edit') {
		$scope.populateEditRule();
	} else {
		$scope.populateAddRule();
	}

	// Execute this when landed from explorer/apps to rules
	$scope.$on("loadExplorerRulesEvent", function(event, args) {
		loadExplorerSection = true;
		$scope.populateAddRule();
		RulesService.disableExplorerRules();
		if (RulesService.getAttributesLoaded()) {
			$scope.info.attributes = RulesService.getAttributes();
			var section = $filter('filter')($scope.info.attributes, {name: ExplorerService.getRuleSection()}, true)[0];

			$timeout(function() {
				section.expanded = true;
				var container = document.getElementById('treeContainer');
				var rowToScrollTo = document.getElementById('section-' + section.table_name);
				container.scrollTop = rowToScrollTo.offsetTop;
				$scope.expandSection(section);
				section.highlighted = true;
				$timeout(function() {
					section.highlighted = false;
				}, 5000);
			}, 50);

			loadExplorerSection = false;
		}
	});

	// Function to clear all messages
	$scope.clearMessage = function() {
		if (!$scope.info.categoriesLoading) {
			$scope.info.addRuleMsg = {};
		}
	};

	// Function to insert/edit link in the recommendation field
	$scope.insertEditLink = function() {
		var selection = $window.getSelection();
		if (selection.anchorNode == null) {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_select_recommendation_text']
			});
			return;
		}
		var recommendationText = selection.anchorNode.parentNode.offsetParent.innerText;
		if (!/^[a-z0-9\s\n]+$/i.test(recommendationText)) {
			ModalService.alertBox({
				msg : 'Only alphanumeric characters allowed for recommendation text'
			});
			return;
		}
		var parentElementClass = selection.anchorNode.parentNode.offsetParent.className;
		if (parentElementClass.indexOf("gb-rules-recommendation") != -1) {
			if ((selection.extentOffset != selection.baseOffset) || (selection.anchorOffset != selection.focusOffset)) {
				var wholeText = selection.anchorNode.wholeText;
				var focusNodeTag = selection.focusNode.parentElement.tagName;
				if (selection.hasOwnProperty('extentOffset') && selection.hasOwnProperty('baseOffset')) {
					var startPos = selection.extentOffset > selection.baseOffset ? selection.baseOffset : selection.extentOffset;
					var endPos = selection.extentOffset > selection.baseOffset ? selection.extentOffset : selection.baseOffset;
				} else {
					var startPos = selection.anchorOffset > selection.focusOffset ? selection.focusOffset : selection.anchorOffset;
					var endPos = selection.anchorOffset > selection.focusOffset ? selection.anchorOffset : selection.focusOffset;
				}
				var text = wholeText.substring(startPos, endPos);
				if (selection.anchorNode.parentElement.tagName == "A") {
					// For editing link
					$scope.info.pageTitle = "Edit Link";
					$scope.info.pageHeading = "Edit link for <strong>" + selection.anchorNode.parentElement.textContent + "</strong>";
					$scope.info.pageLink = selection.anchorNode.parentElement.title;
					$scope.info.htmlElement = selection.anchorNode.parentElement;
					$scope.modal = ModalService.openModal("partials/rules-and-alerts/insert_edit_link.html", $scope, false, 'static');
				} else {
					if (focusNodeTag == "A") {
						ModalService.alertBox({
							msg : 'Something wrong in selection'
						});
						return;
					}
					// For adding link
					$scope.info.pageTitle = "Insert Link";
					$scope.info.pageHeading = "Insert link for <strong>" + text + "</strong>";
					$scope.info.innerHtml = selection.anchorNode.parentElement.innerHTML;
					$scope.info.startPos = startPos;
					$scope.info.endPos = endPos;
					$scope.info.wholeText = wholeText;
					$scope.info.htmlElement = selection.anchorNode.parentElement;
					$scope.info.selectedText = text;
					$scope.info.pageLink = "http://";
					$scope.modal = ModalService.openModal("partials/rules-and-alerts/insert_edit_link.html", $scope, false, 'static');
				}
			} else if (/firefox/i.test($window.navigator.userAgent) && selection.anchorNode.previousElementSibling.tagName == "A") {
				$scope.info.pageTitle = "Edit Link";
				$scope.info.pageHeading = "Edit link for <strong>" + selection.anchorNode.previousElementSibling.textContent + "</strong>";
				$scope.info.pageLink = selection.anchorNode.previousElementSibling.title;
				$scope.info.htmlElement = selection.anchorNode.previousElementSibling;
				$scope.modal = ModalService.openModal("partials/rules-and-alerts/insert_edit_link.html", $scope, false, 'static');
			} else {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['add_rule_select_recommendation_text']
				});
				return;
			}
		} else {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_select_recommendation_text']
			});
			return;
		}
	};

	// Function to check if a link entered by user for recommendation field is valid or not
	$scope.checkLink = function(mode) {
		if (/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test($scope.info.pageLink)) {
			$scope.modal.close();
			if (mode == 'insert') {
				$scope.insertLinkConfirm();
			} else {
				$scope.editLinkConfirm();
			}
		} else {
			$scope.msg = "Please enter a valid link";
			$scope.modal1 = ModalService.openModal('partials/alert_box_extra.html', $scope, false, 'static');
			$scope.info.fadeModal = true;
			return;
		}
	};

	// Function to confirm inserting recommendation link
	$scope.insertLinkConfirm = function() {
		var innerHtml = $scope.info.innerHtml;
		var wholeTextPos = innerHtml.indexOf($scope.info.wholeText);
		$scope.info.htmlElement.innerHTML = innerHtml.substring(0, ($scope.info.startPos + wholeTextPos)) + "<a title='" + $scope.info.pageLink + "' dest='" + $scope.info.pageLink + "' onclick='window.open(this.title, \"_blank\");'>" + $scope.info.selectedText + "</a>" + innerHtml.substr($scope.info.endPos + wholeTextPos);
		$scope.setUnsavedMode();
	};

	// Function to confirm editing recommendation link
	$scope.editLinkConfirm = function() {
		$scope.info.htmlElement.dest = $scope.info.pageLink;
		$scope.info.htmlElement.title = $scope.info.pageLink;
		$scope.setUnsavedMode();
	};

	// Function to set the sections column label map for converting logic and text part
	$scope.setSectionsColumnLabelMap = function() {
		var attributesWithData = $filter('filter')($scope.info.attributes, {
			hasData : true
		});
		for (var i in attributesWithData) {
			if (!!attributesWithData[i].label && !!attributesWithData[i].table_name) {
				for (var j in attributesWithData[i].columns) {
					if (!!attributesWithData[i].columns[j].attribute_label) {
						var tmpKey = [attributesWithData[i].label, '.', attributesWithData[i].columns[j].attribute_label].join('');
						var tmpVal = [[attributesWithData[i].table_name, '.', attributesWithData[i].columns[j].column_name].join(''), attributesWithData[i].columns[j].column_name, attributesWithData[i].columns[j].type, ["(", attributesWithData[i].table_name, GlobalService.getVal('rulesSecColDelimiter'), attributesWithData[i].columns[j].column_name, GlobalService.getVal('rulesSecColDelimiter'), attributesWithData[i].columns[j].type, ")"].join(''), attributesWithData[i].table_name, attributesWithData[i].columns[j].solr_facet];
						$scope.sectionsColumnLabelMap[tmpKey] = tmpVal;
					}
				}
			}
		}
		//set section column map in a service, so that we can use it for validation
		RulesService.setSectionsColumnLabelMap($scope.sectionsColumnLabelMap);
	};

	$scope.$watch('info.categoriesLoading', function() {
		if ($scope.info.categoriesLoading == false) {
			if (!!$scope.info.attributes) {
				if (loadExplorerSection) {
					var section = $filter('filter')($scope.info.attributes, {name: ExplorerService.getRuleSection()}, true)[0];
					$timeout(function() {
						section.expanded = true;
						$scope.expandSection(section);
						section.highlighted = true;
						$timeout(function() {
							section.highlighted = false;
						}, 5000);
						var container = document.getElementById('treeContainer');
						var rowToScrollTo = document.getElementById('section-' + section.table_name);
						container.scrollTop = rowToScrollTo.offsetTop;
					}, 50);
					if ($scope.info.sectionsLoading == false) {
						loadExplorerSection = false;
					}
				}
			}

		}
	});

	// Stores the list of attributes/sections
	if (!RulesService.getAttributesLoaded()) {
		// This block is for getting sections data for first time
		RulesService.getSectionsAPI().then(function(response) {
			$scope.info.attributes = response.data.Data;
			if (loadExplorerSection) {
				var section = $filter('filter')($scope.info.attributes, {name: ExplorerService.getRuleSection()}, true)[0];
				$timeout(function() {
					section.expanded = true;
					$scope.expandSection(section);
					section.highlighted = true;
					$timeout(function() {
						section.highlighted = false;
					}, 5000);
					var container = document.getElementById('treeContainer');
					var rowToScrollTo = document.getElementById('section-' + section.table_name);
					container.scrollTop = rowToScrollTo.offsetTop;
				}, 50);
				if ($scope.info.categoriesLoading == false) {
					loadExplorerSection = false;
				}
			}
			$scope.info.sectionsLoading = false;
			RulesService.setAttributes($scope.info.attributes);
			RulesService.setAttributesLoaded(true);
			$scope.setSectionsColumnLabelMap();
			if (RulesService.getRuleMode() && RulesService.getRuleMode()['mode'] == 'edit' && !!RulesService.getRuleMode()['data']['colt']) {
				$scope.getSectionData(RulesService.getRuleMode()['data']['colt']);
			}
		}, function(response) {
			$scope.info.sectionsLoading = false;
			$scope.info.attributes = [];
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addRuleMsg = {
					type : 'failure',
					msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}
			handleSessionTimeout(response);
		});
	}

	// Stores the list of categories
	RulesService.getCategories().then(function(response) {
		$scope.info.categories = response.data.Data;
		if (RulesService.getAttributesLoaded()) {
			// Load sections data if already fetched
			$scope.info.attributes = RulesService.getAttributes();
			$scope.info.sectionsLoading = false;
			$scope.setSectionsColumnLabelMap();
			if (RulesService.getRuleMode() && RulesService.getRuleMode()['mode'] == 'edit' && !!RulesService.getRuleMode()['data']['colt']) {
				$scope.getSectionData(RulesService.getRuleMode()['data']['colt']);
			}
		}
		$scope.info.categoriesLoading = false;
	}, function(response) {
		$scope.info.categories = [];
		if (RulesService.getAttributesLoaded()) {
			// Load sections data if already fetched
			$scope.info.attributes = RulesService.getAttributes();
			$scope.info.sectionsLoading = false;
			$scope.setSectionsColumnLabelMap();
			if (RulesService.getRuleMode() && RulesService.getRuleMode()['mode'] == 'edit' && !!RulesService.getRuleMode()['data']['colt']) {
				$scope.getSectionData(RulesService.getRuleMode()['data']['colt']);
			}
		}
		$scope.info.categoriesLoading = false;
		if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
			GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
			$scope.info.addRuleMsg = {
				type : 'failure',
				msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
			};
		}
		console.error("Unable to load categories");
		handleSessionTimeout(response);
	});

	//get rule version	
	$scope.getRulesVersion = function(){
		if(($scope.info.pageLabel != "Add New Rule") && RulesService.getRuleMode()['data']['label_display']){		
			//get changes list
			RulesService.getRuleDrillDetails(RulesService.getRuleMode()['data']['rule_name']).then(function (response) {
				var responseData = response.data.Data;
				//filter history type_of_change != "State change"
				responseDataFiltered = responseData.filter(function(item){
					if(item.type_of_change != "Created"  && (item.type_of_change === "State change" || item.changes_map.length == 0)){
						return false;
					}
					return true;
				})
				$scope.info.ruleCurrentVersion = responseDataFiltered.length;		
			}, function (response) {
				$scope.info.ruleCurrentVersion = 0;
			});
		}
	}
	$scope.getRulesVersion();

	// Stores the list of templates
	RulesService.getTemplates().then(function(response) {
		$scope.info.templates = response.data.Data;
	}, function(response) {	
		$scope.info.templates = [];
		console.error("Unable to load templates");
		if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
			GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
			$scope.info.addRuleMsg = {
				type : 'failure',
				msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
			};
		}
		handleSessionTimeout(response);
	});

	// Stores the list of severities
	if (!Array.isArray(RulesService.getSeveritiesList())) {
		// Get from API if not loaded
		RulesService.getSeverities().then(function(response) {
			$scope.info.severities = response.data.Data;
			RulesService.setSeveritiesList($scope.info.severities);
		}, function(response) {
			$scope.info.severities = [];
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addRuleMsg = {
					type : 'failure',
					msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}
			handleSessionTimeout(response);
		});
	} else {
		// Get stored value if loaded
		$scope.info.severities = RulesService.getSeveritiesList();
	}

	// Stores the list of priorities
	if (!Array.isArray(RulesService.getPrioritiesList())) {
		// Get from API if not loaded
		RulesService.getPriorities().then(function(response) {
			$scope.info.priorities = response.data.Data;
			RulesService.setPrioritiesList($scope.info.priorities);
		}, function(response) {
			$scope.info.priorities = [];
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addRuleMsg = {
					type : 'failure',
					msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}
			handleSessionTimeout(response);
		});
	} else {
		// Get stored value if loaded
		$scope.info.priorities = RulesService.getPrioritiesList();
	}

	$scope.loadURL = function(){
		angular.element('.tooltip-html').load('./../../help/Addviews.html');
	}

	// Function to be called after submitting a rule
	$scope.submitRule = function(scope) {
		if(RulesService.getRuleType() != 'supported'){		 	
			if (!$scope.validateUnsupportedElements()) {
				return;
			}
			$scope.editUnsupportedRule();
			return false;
		} 
		// Check if each necessary element has some value
	        if(scope == "parent")	
			if (!$scope.validateElements()) {
				return false;
			}
		if(RulesService.getRuleType() == 'supported'){
			//check logic containt lowercase COUNT or REGEX ...
			var stashUmatch = $scope.info.logic.search(/(count\()|(count \()|(regex\()|(regex \()|(upper\()|(upper \()|(lower\()|(lower \()|(converttoint\()|(converttoint \()|(converttostring\()|(converttostring\()/g);
			if(stashUmatch != -1) {
				msg = GlobalService.getRulesLogicAlerts('rule_logic_error_UpperCaseCountRegexName');
				displayLogicAlert(msg, stashUmatch, stashUmatch + 5);
				return;
			}
		}
		// Check for the mapping of section-column pairs used in Logic
		var logicPairs = $scope.validateLogicMap();
		if (!Array.isArray(logicPairs))
			return;

		$scope.info.sectionsColumnLabeListOfLogic = logicPairs;

		// Check for the mapping of section-column pairs used in Label
		var labelPairs = $scope.deepValidation($scope.info.label,'rule_label_invalid_attr','rule_label_local_attr');
		if (!Array.isArray(labelPairs))
			return;

		//check the section column pair is also present in logic or not
		var listDiff = UtilService.compareFirstWithSecondList($scope.info.sectionsColumnLabeListOfLogic, labelPairs);
		

		// Check for the mapping of section-column pairs used in Text
		var textPairs = $scope.deepValidation($scope.info.text,'rule_text_invalid_attr','rule_text_local_attr');
		if (!Array.isArray(textPairs))
			return;
		
		//check the section column pair is also present in logic or not
		listDiff = listDiff.concat(UtilService.compareFirstWithSecondList($scope.info.sectionsColumnLabeListOfLogic, textPairs));
		
		// Check for the mapping of section-column pairs used in Text
		var apiTemplatePairs = $scope.validateAPITemplateMap();
		if (!Array.isArray(apiTemplatePairs))
			return;

			
		// Check for the mapping of section-column pairs used in Alert Justification
		var justificationPairs = $scope.deepValidation($scope.info.alert_justification,'rule_justification_invalid_attr', 'rule_justification_local_attr');
		if (!Array.isArray(justificationPairs))
			return;
			
		//check the section column pair is also present in logic or not
		listDiff = listDiff.concat(UtilService.compareFirstWithSecondList($scope.info.sectionsColumnLabeListOfLogic, justificationPairs));
		
		// Check for the mapping of section-column pairs used in Recommendation
		var recommendationPairs = $scope.deepValidation($scope.info.recommendation,'rule_recommendation_invalid_attr', 'rule_recommendation_local_attr');
		if (!Array.isArray(recommendationPairs))
			return;
			
		//check the section column pair is also present in logic or not
		listDiff = listDiff.concat(UtilService.compareFirstWithSecondList($scope.info.sectionsColumnLabeListOfLogic, recommendationPairs));

		// Check for the grammar of logic
		var logicGrammar = $scope.validateLogicGrammar();
		if (!logicGrammar) {
			// Refresh the section column label map here
			for (var i = 0; i < $scope.info.convertedAttributes.length; i++) {
				$scope.changeColumnType($scope.info.convertedAttributes[i].value, $scope.info.convertedAttributes[i].type);
			}

			$scope.info.convertedAttributes = [];
			return;
		}

		// Set unique section-column-type pairs
		$scope.createColumnType(logicPairs, textPairs, labelPairs, justificationPairs, recommendationPairs);

		// Check if multiple tables are used in rule
		if (!$scope.checkMultipleTable()) {
			return;
		}

		var logicToConvert = angular.copy($scope.info.logic);
		var counter = 1;

		$scope.info.convertedRegexes = [];

		// Converts REGEX functions used in rule logic
		angular.forEach($scope.info.regexMatches, function(match) {
			var flagCounter = "flag" + counter;
			logicToConvert = logicToConvert.replace(match.actualLogic, flagCounter);

			var regex = new RegExp("CONVERTTOINT\\\(\\\s*" + flagCounter + "\\\s*\\\)\\\s*(\\\<|\\\>|\\\=|\\\>\\\=|\\\<\\\=)\\\s*\\\d+(\\\.\\\d+)?");

			if (regex.test(logicToConvert)) {
				var regMatch = logicToConvert.match(regex)[0];
				var condition = regMatch.match(/(\<|\>|\=|\>\=|\<\=)\s*\d+(\.\d+)?$/)[0].replace(/(^|\s)(\d+)(\s|$|\))/g, "$1$2L$3").replace(/(^|\s)(\d+\.\d+)(\s|$)/g, "$1$2D$3");

				logicToConvert = logicToConvert.replace(regMatch, flagCounter);
				match.returnType = "Long";
				match.condition = condition;
			} else {
				match.returnType = "String";
			}
			match.flagVariable = flagCounter;
			match.extractVariable = "extract" + counter;
			match.regexVariable = "reg" + counter;

			counter++;
			delete match.actualLogic;
			$scope.info.convertedRegexes.push(match);
		});
		// Converts COUNT functions used in rule logic
		logicToConvert = $scope.convertAggregateFunction(logicToConvert);
		//
		// Convert the logic to scala
		$scope.info.convertedLogic = $scope.convertScalaCondition(logicToConvert);
		
		// Set the value of hidden logic
		$scope.setHiddenLogic(logicPairs);

		// Set the value of hidden text
		$scope.setHiddenText(textPairs);

		// Set the value of hidden label
		$scope.setHiddenLabel(labelPairs);

		// Set the value of hidden Justification
		$scope.setHiddenJustification(justificationPairs);

		// Set the value of hidden Recommendation
		$scope.setHiddenRecommendation(recommendationPairs);
		
		$scope.info.ruletype = RulesService.getRuleType();
		
		//check the section column pair is also present in logic or not
		if(listDiff.length > 0){
			UtilService.showModal(listDiff.join(',') + GlobalService.getVal('ruleValidationSameSectionAsLogic'));
			return;
		}

		// Call add/edit API accordingly
		$scope.addEditRule();
	};
	$scope.convertAggregateFunction = function(logicToConvert){
		$scope.info.convertedCounts = [];
		$scope.info.convertedAggregates = {};

		$scope.info.aggregateFunctions.map(function(aggrFunc){
			var funcName = aggrFunc.label;
			var countStringToSearch = funcName+"(";
			$scope.info.countMatches = getCountMatches(logicToConvert, countStringToSearch);
			var counter = 1;
			/**
			 * The below line generates regex for each aggregate function in the loop
			 * An example
			 * COUNT( LOWER({EvtApplication.Hospital Name}) LIKE '%hamilton medical center%' )  ==> "LOWER({EvtApplication.Hospital Name}) LIKE '%hamilton medical center%'"
			 * Actual regex = /^COUNT\S*\(\s*|\s*\)\s*$/gi
			 * The output from regex ie whatever is inside count function is sent to convert to scala syntax
			 */
			var funcRegEx = new RegExp("^"+funcName+"\\s*\\(\\s*|\\s*\\)\\s*$", "gi");//var funcRegEx = new RegExp("^"+funcName+"\(|\)$", "gi");

			angular.forEach($scope.info.countMatches, function(match) {
				var countCounter = funcName.toLocaleLowerCase() + counter;
				if(!$scope.info.convertedAggregates[funcName]){
					$scope.info.convertedAggregates[funcName] = [];
				}
				logicToConvert = logicToConvert.replace(match, countCounter);
				var exprInMatch = match.replace(funcRegEx, "").replace(/^\s+|\s+$/g, "");
				// like sumVariable : sum1
				var functionVariableName = funcName.toLocaleLowerCase()+"Variable";
				var eachAggrigateFunctionDetails = {
					"expression" : $scope.convertScalaCondition(exprInMatch).replace(/\'/g, "\"").replace(/^\s+|\s+$/g, '').replace(/[\"]+/g, "\"")
				};
				eachAggrigateFunctionDetails[functionVariableName] = countCounter;
				//if fun is AVG then add two more variables
				if(funcName === 'AVG'){
					eachAggrigateFunctionDetails["avgSumVariable"] = "avgSum" + counter;
					eachAggrigateFunctionDetails["avgTotalCountVariable"] = "avgCount" + counter;
				}

				$scope.info.convertedAggregates[funcName].push(eachAggrigateFunctionDetails);
				counter++;
			});
		});
		return logicToConvert;
	}
	$scope.processAggregateFunctionForPayload = function(){
		var result = {};
		if($scope.info.convertedAggregates){
			var funcNames = Object.keys($scope.info.convertedAggregates);
			funcNames.map(function(func){
				var functionNameInLowerCase = func.toLowerCase();
				//make first character name capital letter
				var firstCharacterInUpperCase = functionNameInLowerCase[0].toUpperCase() + functionNameInLowerCase.substr(1) + "s";
				var convertedFunctionListKey = "converted"+ firstCharacterInUpperCase;
				if(!result[convertedFunctionListKey]) {
					result[convertedFunctionListKey] = [];
				}
				result[convertedFunctionListKey] = $scope.info.convertedAggregates[func];
			});
		}
		return result;
	}
	$scope.getOperatorType = function(oprt){
		var functionType = "";
		$scope.info.operators.map(function(aggrFunc){
			if(aggrFunc.label === oprt){
				functionType = aggrFunc.subtype;
			}
		});
		return functionType;
	}
	$scope.isAggregateFunction = function(func){
		var found = false;
		$scope.info.aggregateFunctions.map(function(aggrFunc){
			if(aggrFunc.label != 'COUNT' && aggrFunc.label === func){
				found = true;
			}
		});
		return found;
	}
	// Function to render text in html format
	$scope.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};

	// Function to call test rule for a draft
	$scope.testRule = function() {
		$scope.modifyRuleData();
		$scope.setPageListforTesting();
		var selectedRules = [];
		selectedRules.push($scope.info.testRuleData);
		RulesService.setTestRuleData(selectedRules);
		RulesTestWithLogvault.setRulesSelected(selectedRules);
		$scope.$parent.changeCurrentPage('test_rule_history');
	};

	// Sets page list for Test Rule Page
	$scope.setPageListforTesting = function() {
		var pageList = GlobalService.getVal('rulesPages');
		pageList.test_rule_history = [{
			name : 'rules_list',
			label : 'Rules List'
		}, {
			name : 'add_rule',
			label : 'Add/Edit Rule'
		}, {
			name : 'test_rule_history',
			label : 'Test Rule History'
		}];
		GlobalService.setVal('rulesPages', pageList);
	};

	// Function to add new rule
	$scope.addNewRule = function() {
		RulesService.setRuleMode('new');
		$scope.info.ruleAdded = false;
		$scope.info.addRuleMsg = {};
		$scope.populateAddRule();
	};

	// Function to check if multiple tables are present and scope selected is not 'Table'
	$scope.checkMultipleTable = function() {
		if ($scope.info.tables.length > 1) {
			if ($scope.info.scope == 'Table') {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['add_rule_multiple_tables_unsupported']
				});
				return;
			}
		}
		return true;
	};
	//edit for unsupported rules
	$scope.editUnsupportedRule = function () {
		// Check for the mapping of section-column pairs used in Label
		var labelPairs = $scope.deepValidation($scope.info.label, 'rule_label_invalid_attr', 'rule_label_local_attr');
		if (!Array.isArray(labelPairs))
			return;

		// // Check for the mapping of section-column pairs used in Label
		// var labelPairs = $scope.validateLabelMap();
		// if (!Array.isArray(labelPairs))
		// 	return;

		// Check for the mapping of section-column pairs used in Alert Justification
		var justificationPairs = $scope.deepValidation($scope.info.alert_justification, 'rule_justification_invalid_attr', 'rule_justification_local_attr');
		if (!Array.isArray(justificationPairs))
			return;

		// Check for the mapping of section-column pairs used in Recommendation
		var recommendationPairs = $scope.deepValidation($scope.info.recommendation, 'rule_recommendation_invalid_attr', 'rule_recommendation_local_attr');
		if (!Array.isArray(recommendationPairs))
			return;

		// Set the value of hidden label
		$scope.setHiddenLabel(labelPairs);

		// Set the value of hidden Justification
		$scope.setHiddenJustification(justificationPairs);

		// Set the value of hidden Recommendation
		$scope.setHiddenRecommendation(recommendationPairs);
		$scope.info.ruletype = RulesService.getRuleType();

		$scope.info.categoriesLoading = true;
		$scope.unsdataobj = {};
		if($scope.info.action == 'api' && $scope.info.apiTemplate && ($scope.info.apiTemplate != 'select')){
			unsdataobj = {
				"update.apiTemplateId": $scope.info.apiTemplate
			}
		}else{
			unsdataobj = {
				"update.apiTemplateId": 0
			}
		}
		var data = {
				label_actual : $scope.info.hiddenLabel.replace(/^\s+|\s+$/g, ''),
				recommendation: !$scope.info.hiddenRecommendation ? "": $scope.info.hiddenRecommendation.replace(/^\s+|\s+$/g, ''),
				alert_justification : !$scope.info.hiddenJustification ? "": $scope.info.hiddenJustification.replace(/^\s+|\s+$/g, ''),
				"update.label_display" : $scope.info.label.replace(/^\s+|\s+$/g, ''),
				description : $scope.info.description.replace(/^\s+|\s+$/g, ''),
				category_id : $scope.info.category,
				severity : $scope.info.severity,
				priority : $scope.info.priority,
				kb_link : $scope.info.kbLink.replace(/^\s+|\s+$/g, ''),
				"update.alert_id" : $scope.info.alertID,
				logic_actual : '',
				logic_display : '',
				
				logic_condition : '',
				
				email_template_id : $scope.info.action == 'mail' ? $scope.info.emailTemplate : 0,
				text_actual : '',
				text_display : '',
				recommendation_display : !$scope.info.recommendation ? "" : $scope.info.recommendation.replace(/^\s+|\s+$/g, ''),
				alert_justification_display : !$scope.info.alert_justification ? "" : $scope.info.alert_justification.replace(/^\s+|\s+$/g, ''),
				scope : $scope.info.scope,
				
				column_type : '',
				
				table_name : '',
				
				author : $scope.info.author.replace(/^\s+|\s+$/g, ''),
				"update.set_as_draft" : 0,
				"update.draft" : 0,
				"update.max_limit" : $scope.info.maxLimit,
				"update.max_alerts_display_ui" : $scope.info.maxLimitDisplay,
				"update.modify" : 0,
				"update.created_by" : $scope.info.createdBy,
				"update.created_ts" : $scope.info.createdTs.slice(0, 10) + "T" + $scope.info.createdTs.slice(10 + Math.abs(1)) + "Z",
				
				"update.convertedRegex" : '',
				"update.convertedCounts" : '',

				"update.rule_name" : $scope.info.ruleName,
				"update.action_id": $scope.info.action_id,
				"update.allow_subscription" : $scope.info.subscription_enabled
			};
			data = Object.assign(data, unsdataobj)

			// if(data['update.set_as_draft'] != 1){
			// 	if(data['update.label_display'] != $scope.info.initialLabel ||  data['alert_justification_display'] != $scope.info.initialJustification || data['recommendation_display'] != $scope.info.initialRecommendation || data['email_template_id'] != $scope.info.initialEmailTemplateId || data['update.apiTemplateId'] != $scope.info.initialApiTemplateId || data['scope'] != $scope.info.initialScope){
			// 		data['update.set_as_draft'] = 1;
			// 		//set current rule status as DRAFT
			// 		$scope.info.status = $scope.info.supportedStatus.Draft;
			// 	}
			// }
			// if(($scope.info.initialEmailTemplateId == -1 && data['email_template_id'] == 0) ||($scope.info.initialEmailTemplateId == -1 && data['email_template_id'] > 0))
			// {
			// 	data['update.apiTemplateId'] = $scope.info.initialApiTemplateId;
			// }

		RulesService.editRule(RulesService.getRuleMode()['data']['rule_id'], data, $scope.info.ruletype).then(function(response) {
			var ruleName = response.data.Data.rule_name;
			var addedEditedRule = response.data.Data;
			var taagApiCall = function(tagIds, reset){
				$scope.tagFilterFunction = function(t){ 
					return t.selected;
				}
				var tagPayload = {
					"associate": [{
						"tag_ids": tagIds.associate,
						"rule_ids": [response.data.Data.rule_id]
					}],
					"disassociate": [{
						"tag_ids": tagIds.disassociate,
						"rule_ids": [response.data.Data.rule_id]
					}]
				}
				if(!tagPayload.associate[0].tag_ids.length){
					tagPayload.associate[0] = {}
				}
				else if(!tagPayload.disassociate[0].tag_ids.length){
					tagPayload.disassociate[0] = {}
				}
				//Tag association payload
				// $scope.resetSelectedTags();
				RulesService.associateDisassociateTag(tagPayload).then(function (response) {
					if(reset){
						$scope.resetSelectedTags();
					}
				}, function (response) {
					console.error("Unable to add tags");
					if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
						GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
						$scope.info.addRuleMsg = {
							type: 'failure',
							msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
						};
					}
					handleSessionTimeout(response);
				});
			}

			var assocdisassoctag = function(){
				if(($scope.info.initialSubscription_enabled == true &&  $scope.info.subscription_enabled == false) && $scope.info.initialtagList.length >0){
					//call assoc/disassociate api
					var ids = {
						"associate": [],
						"disassociate": $scope.info.initialtagList
					}
					taagApiCall(ids,true);
				}
				else if(($scope.info.initialSubscription_enabled == true && $scope.info.subscription_enabled) && ($scope.info.initialtagList.length >0 || $scope.info.selectedTagsCount>0) ){
					//call assoc/disassociate api
					var ids = {
						"associate": $scope.info.tagList.filter($scope.tagFilterFunction).map(function(t){ return t.tag_id}),
						"disassociate": $scope.info.tagList.filter(function(t){return $scope.info.initialtagList.includes(t.tag_id) && !t.selected}).map(function(t){ return t.tag_id})
					}
					taagApiCall(ids);
				}
				else if(($scope.info.initialSubscription_enabled == false && $scope.info.subscription_enabled) && $scope.info.selectedTagsCount > 0){
					//cal Tag disassociation api here
					var ids = {
						"associate": $scope.info.tagList.filter($scope.tagFilterFunction).map(function(t){ return t.tag_id}),
						"disassociate": []
					}
					taagApiCall(ids);
				}
			}
			//call add subscription api (persist ==> persist and email)
			if (($scope.info.initialAction == 'none' || $scope.info.initialAction == 'api') && $scope.info.action == 'mail') {
				if($scope.info.subscriptionEmailList.length > 0){
					$scope.info.subscriptionEmailList
				var addSubscriptionPayload = {
					"subscribers": $scope.info.subscriptionEmailList.map(function (e) {
						return {
							mps: $cookies.mps,
							rule_id: response.data.Data.rule_id,
							email: e,
							subscription_enabled: $scope.info.subscription_enabled
						}
					})
				}


				RulesService.subscribeRule(addSubscriptionPayload).then(function (response) {
					assocdisassoctag()
				}, function (response) {
					console.error("Unable to add subscription");
					if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
						GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
						$scope.info.addRuleMsg = {
							type: 'failure',
							msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
						};
					}
					handleSessionTimeout(response);
				});
				}else{
					assocdisassoctag();
				}
				
			}
			//call update subscription api (persist and email  ==> persist and email)
			else if ($scope.info.initialAction == 'mail' && $scope.info.action == 'mail') {
				//Call update subscription api
				//take diff of email
				var diff = $scope.differenceOf2Arrays($scope.info.initialSubscriptionEmailList, $scope.info.subscriptionEmailList);
				var updateSubscriptionPayload = {
					"mps": $cookies.mps,
					"ruleId": response.data.Data.rule_id,
					"addEmailId": diff.added,
					"removeEmailId": diff.removed,
					"enabled": $scope.info.subscription_enabled
				}
				RulesService.updateSubscription(updateSubscriptionPayload).then(function (response) {
					if(diff.removed.length){
						var removedEmails = diff.removed.split(",").filter(function(e){
							if($scope.info.emailList.indexOf(e) >= 0) return e;
							}) || []
							if(removedEmails.length){
								$scope.deleteSubscriptionFilterBulk(addedEditedRule, removedEmails);
							}
						
					}
					assocdisassoctag();
				}, function (response) {
					console.error("Unable to update subscription");
					if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
						GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
						$scope.info.addRuleMsg = {
							type: 'failure',
							msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
						};
					}
					handleSessionTimeout(response);
				});
			}
			//call remove subscription api (persist and email  ==> persist or persist and call api)
			else if ($scope.info.initialAction == 'mail' && ($scope.info.action == 'none' || $scope.info.action == 'api')) {
				$scope.info.subscription_enabled = false;
				//call remove subscription api
				var removeSubscriptionPayload = {
					"removeSubscribers" : [
						{
						 "mps": $cookies.mps,
						 "ruleId": response.data.Data.rule_id
						}]
				}

				//call remove subscription api that removes subscription data for a rule
				RulesService.unsubscribeRule(removeSubscriptionPayload).then(function (response) {
					$scope.info.rulesListMsg = {
						type: 'success',
						msg: GlobalService.getVal('rulesMsgs')['rule_unsubscription_success']
					}
					assocdisassoctag();
				}, function (response) {
					console.error("Unable to remove subscription");
					if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
						GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
						$scope.info.addRuleMsg = {
							type: 'failure',
							msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
						};
					}
					handleSessionTimeout(response);
				});
				$scope.deleteSubscriptionFilter(addedEditedRule);
			}
			// if (data["update.modify"] == 1) {
			// 	RulesService.editStageRule(RulesService.getRuleMode()['data']['rule_id']).then(function(response) {
			// 		$scope.info.addRuleMsg = {
			// 			type : 'success',
			// 			msg : ($scope.info.status == $scope.info.supportedStatus.Draft || $scope.info.logic.replace(/^\s+|\s+$/g, '') != $scope.info.initialLogic || $scope.info.text.replace(/^\s+|\s+$/g, '') != $scope.info.initialText || $scope.info.initialMaxLimit != $scope.info.maxLimit) ? (GlobalService.getVal('rulesMsgs')['edit_rule_draft_success'][0] + ruleName + GlobalService.getVal('rulesMsgs')['edit_rule_draft_success'][1]) : (GlobalService.getVal('rulesMsgs')['edit_rule_enabled_success'][0] + ruleName + GlobalService.getVal('rulesMsgs')['edit_rule_enabled_success'][1])
			// 		};
			// 	}, function(response) {
			// 		$scope.info.addRuleMsg = {
			// 			type : 'failure',
			// 			msg : GlobalService.getVal('rulesMsgs')['add_rule_fail']
			// 		};
			// 	});
			// } else {
				$scope.info.addRuleMsg = {
					type : 'success',
					msg : ($scope.info.status == $scope.info.supportedStatus.Draft || $scope.info.logic.replace(/^\s+|\s+$/g, '') != $scope.info.initialLogic || $scope.info.text.replace(/^\s+|\s+$/g, '') != $scope.info.initialText || $scope.info.initialMaxLimit != $scope.info.maxLimit) ? (GlobalService.getVal('rulesMsgs')['edit_rule_draft_success'][0] + $scope.info.label + GlobalService.getVal('rulesMsgs')['edit_rule_draft_success'][1]) : (GlobalService.getVal('rulesMsgs')['edit_rule_enabled_success'][0] + $scope.info.label + GlobalService.getVal('rulesMsgs')['edit_rule_enabled_success'][1])
				};
			//}

			$scope.info.categoriesLoading = false;

			$scope.info.ruleAdded = true;
			$scope.info.ruleAddedAsDraft = ($scope.info.status == $scope.info.supportedStatus.Draft || $scope.info.logic.replace(/^\s+|\s+$/g, '') != $scope.info.initialLogic || $scope.info.text.replace(/^\s+|\s+$/g, '') != $scope.info.initialText || $scope.info.initialMaxLimit != $scope.info.maxLimit) ? true : false;

			var newData = {
				rule_id : response.data.Data.rule_id,
				rule_name : response.data.Data.rule_name,
				alert_id : response.data.Data.alert_id,
				label : $scope.info.label,
				description : $scope.info.description,
				category_id : $scope.info.category,
				category : ($filter('filter')($scope.info.categories, {category_id: $scope.info.category}))[0].category,
				severity_id : $scope.info.severity,
				severity : ($filter('filter')($scope.info.severities, {severity_id: $scope.info.severity}))[0].severity,
				priority_id : $scope.info.priority,
				priority : ($filter('filter')($scope.info.priorities, {priority_id: $scope.info.priority}))[0].priority,
				kb_link : $scope.info.kbLink,
				logic_display : $scope.info.logic,
				email_template_id : $scope.info.action == 'mail' ? $scope.info.emailTemplate :  0,
				text_display : $scope.info.text,
				recommendation_display : $scope.info.recommendation,
				alert_justification_display : $scope.info.alert_justification,
				scope : $scope.info.scope,
				author : $scope.info.author,
				status : ($scope.info.status == $scope.info.supportedStatus.Draft || $scope.info.logic.replace(/^\s+|\s+$/g, '') != $scope.info.initialLogic || $scope.info.text.replace(/^\s+|\s+$/g, '') != $scope.info.initialText || $scope.info.initialMaxLimit != $scope.info.maxLimit) ? $scope.info.supportedStatus.Draft : $scope.info.supportedStatus.Enabled,
				max_limit : $scope.info.maxLimit,
				max_alerts_display_ui : $scope.info.maxLimitDisplay,
				created_by: $scope.info.createdBy,
				created_ts: $scope.info.createdTs,
				action_id: response.data.Data.action_id,
				api_template_id: response.data.Data.api_template_id,
				subscription_enabled: $scope.info.subscription_enabled,
			 	subscriptionEmailList: $scope.info.subscriptionEmailList,
				tags: $scope.info.tags.reduce(function(acc,cur){ if(cur.selected){acc.push(cur)}; return acc},[])
			};

			$scope.info.testRuleData = newData;

			if ($scope.info.initialLabel != $scope.info.label) {
				var rulesLabelMap = RulesService.getRulesLabelMap();
				delete rulesLabelMap[$scope.info.initialLabel];
				rulesLabelMap[$scope.info.label.replace(/^\s+|\s+$/g, '')] = true;
				RulesService.setRulesLabelMap(rulesLabelMap);
			}

			var curRuleId = response.data.Data.rule_id;

			// Reload rules list
			RulesService.getAllRules($scope.info.ruletype).then(function(response) {
			    
				RulesService.setRulesList($filter('filterMultiples')($filter('removeDup')(response.data.Data), {
					status : [$scope.info.supportedStatus.Enabled, $scope.info.supportedStatus.Disabled, $scope.info.supportedStatus.Draft]
				}));
				var curRule = $filter('filter')($filter('removeDup')(response.data.Data), {
					rule_id : curRuleId
				}) || [];
				if(curRule[0]){
					$scope.info.createdBy = curRule[0].created_by;
					$scope.info.createdTs = curRule[0].created_ts;
					newData.subscriptionEmailList = curRule[0].subscribed_users.length ? curRule[0].subscribed_users.split(",").filter(Boolean) : [];
				}
				RulesService.setRuleMode('edit', newData);
			$scope.populateEditRule();
			}, handleSessionTimeout);

			if ($scope.info.initialLabel != $scope.info.label.replace(/^\s+|\s+$/g, '')) {
				var details = {};
				details['old'] = $scope.info.initialLabel;
				details['new'] = $scope.info.label.replace(/^\s+|\s+$/g, '');
				details = JSON.stringify(details);
			} else {
				var details = $scope.info.initialLabel;
			}

			UserTrackingService.standard_user_tracking($scope.info.application, 'Rule', 'edit', details).then(function(response) {

			}, handleSessionTimeout);

			
		}, function(response) {
			$scope.info.categoriesLoading = false;
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addRuleMsg = {
					type : 'failure',
					msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			} else {
				$scope.info.addRuleMsg = {
					type : 'failure',
					msg : GlobalService.getVal('rulesMsgs')['add_rule_fail']
				};
			}

			$scope.info.testRuleData = null;

			$scope.info.ruleAdded = false;
			console.error('Unable to edit rule');
			handleSessionTimeout(response);
		});
	}

	//creates data and replaces attributes
	$scope.checkDraft = function (regex) {
		
		var data = [
			{
				name: 'label',
				old: $scope.info.initialLabel,
				new: $scope.info.label
			},
			{
				name: 'recommendation',
				old: $scope.info.initialRecommendation,
				new: $scope.info.recommendation
			},
			{
				name: 'alert_justification',
				old: $scope.info.initialJustification,
				new: $scope.info.alert_justification
			},
			{
				name: 'text',
				old: $scope.info.initialText,
				new: $scope.info.text
			}
		];
		data.forEach(function (item) {
			item.oldarr = item.old.match(regex) ? item.old.match(regex) : item.old
			item.newarr = item.new.match(regex) ? item.new.match(regex) : item.new
		})
		return $scope.isdraft(angular.copy(data), regex);
	}

	//returns if rule should go o draft or not. //objective of this function is to return true or false
	$scope.isdraft = function(data, regex) {
		var draftvalue = false;
		var replacefn = function (e) {
			return e.replace(/[\{\}']+/g, '')
		}
		data.forEach(function (item) {
			if (Array.isArray(item.oldarr) && Array.isArray(item.newarr)) {
				//compare old and new array
				if ((item.newarr.length > item.oldarr.length) || item.newarr.length < item.oldarr.length) {
					draftvalue = true;
				}
				var oldValue = item.oldarr.map(replacefn)
				var newValue = item.newarr.map(replacefn)
				for (var i = 0; i < oldValue.length; i++) {
					if (newValue.indexOf(oldValue[i]) == -1) {
						draftvalue = true;
					}
				}
			}
			if (!Array.isArray(item.oldarr) && Array.isArray(item.newarr)) {
				//goes to draft
				draftvalue = true;
			}

			if (Array.isArray(item.oldarr) && !item.new.match(regex)) {
				//goes to draft
				draftvalue = true;
			}

		})
		if ($scope.info.logic.replace(/^\s+|\s+$/g, '') != $scope.info.initialLogic || $scope.info.scope != $scope.info.initialScope) {
			draftvalue = true;
		}
		return draftvalue;
	}
	// Function to call the add or edit rule API
	$scope.addEditRule = function() {
		$scope.info.categoriesLoading = true, data = {};
		if($scope.info.action == 'api'&& $scope.info.apiTemplate && ($scope.info.apiTemplate != 'select')){
			data = {
				"update.apiTemplateId": $scope.info.apiTemplate
			}
		}else{
			data = {
				"update.apiTemplateId": 0
			}
		}
		if (RulesService.getRuleMode() && RulesService.getRuleMode()['mode'] == 'edit') {
			var dataObj = {
				label_actual : $scope.info.hiddenLabel.replace(/^\s+|\s+$/g, ''),
				recommendation: !$scope.info.hiddenRecommendation ? "":$scope.info.hiddenRecommendation.replace(/^\s+|\s+$/g, ''),
				alert_justification : !$scope.info.hiddenJustification ? "": $scope.info.hiddenJustification.replace(/^\s+|\s+$/g, ''),
				"update.label_display" : $scope.info.label.replace(/^\s+|\s+$/g, ''),
				description : $scope.info.description.replace(/^\s+|\s+$/g, ''),
				category_id : $scope.info.category,
				severity : $scope.info.severity,
				priority : $scope.info.priority,
				kb_link : $scope.info.kbLink.replace(/^\s+|\s+$/g, ''),
				"update.alert_id" : $scope.info.alertID,
				logic_actual : $scope.info.hiddenLogic.replace(/^\s+|\s+$/g, ''),
				logic_display : $scope.info.logic.replace(/^\s+|\s+$/g, ''),
				
				logic_condition : $scope.info.convertedLogic.replace(/\'/g, "\"").replace(/^\s+|\s+$/g, '').replace(/[\"]+/g, "\""),
				
				email_template_id : $scope.info.action == 'mail' ? $scope.info.emailTemplate :  0,
				text_actual : $scope.info.hiddenText.replace(/^\s+|\s+$/g, ''),
				text_display : $scope.info.text.replace(/^\s+|\s+$/g, ''),
				recommendation_display : !$scope.info.recommendation? "" : $scope.info.recommendation.replace(/^\s+|\s+$/g, ''),
				alert_justification_display : !$scope.info.alert_justification ? "" : $scope.info.alert_justification.replace(/^\s+|\s+$/g, ''),
				scope : $scope.info.scope,
				
				column_type : $scope.info.secColTypePairs.join(','),
				
				table_name : $scope.info.tables.join(','),
				
				author : $scope.info.author.replace(/^\s+|\s+$/g, ''),
				
				"update.set_as_draft" : ($scope.info.status == $scope.info.supportedStatus.Draft || $scope.info.logic.replace(/^\s+|\s+$/g, '') != $scope.info.initialLogic || $scope.info.text.replace(/^\s+|\s+$/g, '') != $scope.info.initialText || $scope.info.initialMaxLimit != $scope.info.maxLimit ) ? 1 : 0,
				"update.draft" : ($scope.info.status == $scope.info.supportedStatus.Draft) ? 1 : 0,
				"update.max_limit" : $scope.info.maxLimit,
				"update.max_alerts_display_ui" : $scope.info.maxLimitDisplay,
				
				"update.modify" : ($scope.info.status == $scope.info.supportedStatus.Draft && RulesService.getRuleSavedStatus()) ? 1 : 0,
				"update.created_by" : $scope.info.createdBy,
				"update.created_ts" : $scope.info.createdTs.slice(0, 10) + "T" + $scope.info.createdTs.slice(10 + Math.abs(1)) + "Z",
				
				"update.convertedRegex" : $scope.info.convertedRegexes,
				"update.convertedCounts" : $scope.info.convertedCounts,
				"update.rule_name" : $scope.info.ruleName,
				"update.action_id": $scope.info.action_id,
				"update.convertedAggregates" :  $scope.processAggregateFunctionForPayload(),
				"update.allow_subscription" : $scope.info.subscription_enabled

				
			};
			//
			data = Object.assign(data, dataObj);
			//check "label", "Action", "Justification", "Recomendation" 
			//then make "update.set_as_draft" as 0 or 1
			// if(data['update.set_as_draft'] != 1){
			// 	if(data['update.label_display'] != $scope.info.initialLabel ||  data['alert_justification_display'] != $scope.info.initialJustification || data['recommendation_display'] != $scope.info.initialRecommendation || data['scope'] != $scope.info.initialScope){
			// 		data['update.set_as_draft'] = 1;
			// 		//set current rule status as DRAFT
			// 		$scope.info.status = $scope.info.supportedStatus.Draft;
			// 	}
			// }

			if ($scope.info.status == $scope.info.supportedStatus.Enabled || $scope.info.status == $scope.info.supportedStatus.Disabled ){
				var regex = new RegExp("{([^}]*)}", "g")
				if ($scope.checkDraft(regex)) {
					data['update.set_as_draft'] = 1
					$scope.info.status = $scope.info.supportedStatus.Draft;
				}
				else {
					data['update.set_as_draft'] = 0
				}
			}
			

			
			// //send old api id
			// if($scope.info.initialApiTemplateId > 0 && data['email_template_id'] >= 0){
			// 	data['update.apiTemplateId'] = $scope.info.initialApiTemplateId;
			// }


			// if($scope.info.initialApiTemplateId > 0 && data['email_template_id'] > 0 || $scope.info.initialApiTemplateId > 0 && data['email_template_id'] == 0 )
			// if(($scope.info.initialEmailTemplateId == -1 && data['email_template_id'] == 0) ||($scope.info.initialEmailTemplateId == -1 && data['email_template_id'] > 0))
			// {
			// 	data['update.apiTemplateId'] = $scope.info.initialApiTemplateId;
			// }
			if(($scope.info.initialSubscription_enabled == true &&  $scope.info.subscription_enabled == false) && $scope.info.initialtagList.length >0){
				//call assoc/disassociate api
				$scope.info.tags = [];
			}
			else if(($scope.info.initialSubscription_enabled == true && $scope.info.subscription_enabled) && ($scope.info.initialtagList.length >0 || $scope.info.selectedTagsCount > 0) ){
				//call assoc/disassociate api
				$scope.info.tags = $scope.info.tagList.filter($scope.tagFilterFunction);
			}
			else if(($scope.info.initialSubscription_enabled == false && $scope.info.subscription_enabled) && $scope.info.selectedTagsCount > 0){
				//cal Tag disassociation api here
				
				$scope.info.tags = $scope.info.tagList.filter($scope.tagFilterFunction);
			} 
			RulesService.editRule(RulesService.getRuleMode()['data']['rule_id'], data, $scope.info.ruletype).then(function (response) {
				var ruleName = response.data.Data.rule_name;
				var addedEditedRule = response.data.Data;
				var taagApiCall = function(tagIds, reset){
					if(reset){
						$scope.resetSelectedTags();
					}
					var tagPayload = {
						"associate": [{
							"tag_ids": tagIds.associate,
							"rule_ids": [response.data.Data.rule_id]
						}],
						"disassociate": [{
							"tag_ids": tagIds.disassociate,
							"rule_ids": [response.data.Data.rule_id]
						}]
					}
					if(!tagPayload.associate[0].tag_ids.length){
						tagPayload.associate[0] = {}
					}
					else if(!tagPayload.disassociate[0].tag_ids.length){
						tagPayload.disassociate[0] = {}
					}
					//Tag association payload
					RulesService.associateDisassociateTag(tagPayload).then(function (response) {
						
					}, function (response) {
						console.error("Unable to add tags");
						if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
							GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
							$scope.info.addRuleMsg = {
								type: 'failure',
								msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
							};
						}
						handleSessionTimeout(response);
					});
				}

				var assocdisassoctag = function(){
					if(($scope.info.initialSubscription_enabled == true &&  $scope.info.subscription_enabled == false) && $scope.info.initialtagList.length > 0){
						//call assoc/disassociate api
						var ids = {
							"associate": [],
							"disassociate": $scope.info.initialtagList
						}
						taagApiCall(ids,true);
					}
					else if(($scope.info.initialSubscription_enabled == true && $scope.info.subscription_enabled) && ($scope.info.initialtagList.length >0 || $scope.info.selectedTagsCount > 0) ){
						//call assoc/disassociate api
						var ids = {
							"associate": $scope.info.tagList.filter($scope.tagFilterFunction).map(function(t){ return t.tag_id}),
							"disassociate": $scope.info.tagList.filter(function(t){return $scope.info.initialtagList.includes(t.tag_id) && !t.selected}).map(function(t){ return t.tag_id})
						}
						taagApiCall(ids);
					}
					else if(($scope.info.initialSubscription_enabled == false && $scope.info.subscription_enabled) && $scope.info.selectedTagsCount > 0){
						//cal Tag disassociation api here
						var ids = {
							"associate": $scope.info.tagList.filter($scope.tagFilterFunction).map(function(t){ return t.tag_id}),
							"disassociate": []
						}
						taagApiCall(ids);
					}
				}

				//call add subscription api (persist ==> persist and email)
				if (($scope.info.initialAction == 'none' || $scope.info.initialAction == 'api') && $scope.info.action == 'mail') {
					if ($scope.info.subscriptionEmailList.length > 0) {
						$scope.info.subscriptionEmailList
						var addSubscriptionPayload = {
							"subscribers": $scope.info.subscriptionEmailList.map(function (e) {
								return {
									mps: $cookies.mps,
									rule_id: response.data.Data.rule_id,
									email: e,
									subscription_enabled: $scope.info.subscription_enabled
								}
							})
						}


						RulesService.subscribeRule(addSubscriptionPayload).then(function (response) {
							assocdisassoctag()
						}, function (response) {
							console.error("Unable to add subscription");
							if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
								GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
								$scope.info.addRuleMsg = {
									type: 'failure',
									msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
								};
							}
							handleSessionTimeout(response);
						});
					}else{
						assocdisassoctag();
					}
				}
				//call update subscription api (persist and email  ==> persist and email)
				else if ($scope.info.initialAction == 'mail' && $scope.info.action == 'mail') {
					//Call update subscription api
					//take diff of email
					var diff = $scope.differenceOf2Arrays($scope.info.initialSubscriptionEmailList, $scope.info.subscriptionEmailList);
					
					var updateSubscriptionPayload = {
						"mps": $cookies.mps,
						"ruleId": response.data.Data.rule_id,
						"addEmailId": diff.added,
						"removeEmailId": diff.removed,
						"enabled": $scope.info.subscription_enabled
					}
					RulesService.updateSubscription(updateSubscriptionPayload).then(function (response) {
						if(diff.removed.length){
							var removedEmails = diff.removed.split(",").filter(function(e){
								if($scope.info.emailList.indexOf(e) >= 0) return e;
								}) || []
								if(removedEmails.length){
									$scope.deleteSubscriptionFilterBulk(addedEditedRule, removedEmails);
								}
							
						}
						assocdisassoctag();
					}, function (response) {
						console.error("Unable to update subscription");
						if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
							GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
							$scope.info.addRuleMsg = {
								type: 'failure',
								msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
							};
						}
						handleSessionTimeout(response);
					});
				}
				//call remove subscription api (persist and email  ==> persist or persist and call api)
				else if ($scope.info.initialAction == 'mail' && ($scope.info.action == 'none' || $scope.info.action == 'api')) {
					$scope.info.subscription_enabled = false;
					//call remove subscription api
					var removeSubscriptionPayload = {
						"removeSubscribers" : [
							{
							 "mps": $cookies.mps,
							 "ruleId": response.data.Data.rule_id
							}]
					}

					//call remove subscription api that removes subscription data for a rule
					RulesService.unsubscribeRule(removeSubscriptionPayload).then(function (response) {
						assocdisassoctag();
						$scope.info.rulesListMsg = {
							type: 'success',
							msg: GlobalService.getVal('rulesMsgs')['rule_unsubscription_success']
						}
					}, function (response) {
						console.error("Unable to remove subscription");
						if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
							GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
							$scope.info.addRuleMsg = {
								type: 'failure',
								msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
							};
						}
						handleSessionTimeout(response);
					});
					$scope.deleteSubscriptionFilter(addedEditedRule);
				}
				

				$scope.info.addRuleMsg = {
					type: 'success',
					msg: (data['update.set_as_draft'] == 1) ? (GlobalService.getVal('rulesMsgs')['edit_rule_draft_success'][0] + $scope.info.label + GlobalService.getVal('rulesMsgs')['edit_rule_draft_success'][1]) : (GlobalService.getVal('rulesMsgs')['edit_rule_enabled_success'][0] + $scope.info.label + GlobalService.getVal('rulesMsgs')['edit_rule_enabled_success'][1])
				};

				$scope.info.ruleAddedAsDraft = (data['update.set_as_draft'] == 1) ? true : false;
				var curStatus = (data['update.set_as_draft'] == 1) ? $scope.info.supportedStatus.Draft : $scope.info.status;
				//var curStatus =($scope.info.status == $scope.info.supportedStatus.Draft || $scope.info.logic.replace(/^\s+|\s+$/g, '') != $scope.info.initialLogic || $scope.info.text.replace(/^\s+|\s+$/g, '') != $scope.info.initialText || $scope.info.initialMaxLimit != $scope.info.maxLimit) ? $scope.info.supportedStatus.Draft : $scope.info.supportedStatus.Enabled;
				var newData = $scope.makeRuleObjectAfterAddEdit(response, curStatus); 
				$scope.info.testRuleData = newData;

				if ($scope.info.initialLabel != $scope.info.label) {
					var rulesLabelMap = RulesService.getRulesLabelMap();
					delete rulesLabelMap[$scope.info.initialLabel];
					rulesLabelMap[$scope.info.label.replace(/^\s+|\s+$/g, '')] = true;
					RulesService.setRulesLabelMap(rulesLabelMap);
				}

				var curRuleId = response.data.Data.rule_id;

				//update rule version
				$scope.getRulesVersion();

				// Reload rules list
				$scope.fetchRuleListAfterAddEdit(newData, curRuleId);
				//changes require for user tracker
				if ($scope.info.initialLabel != $scope.info.label.replace(/^\s+|\s+$/g, '')) {
					var details = {};
					details['old'] = $scope.info.initialLabel;
					details['new'] = $scope.info.label.replace(/^\s+|\s+$/g, '');
					//details = JSON.stringify(details);
				} else {
					var details = $scope.info.initialLabel;
				}
				$scope.trackUser('Rule', 'Edit', details);
				// UserTrackingService.standard_user_tracking($scope.info.application, 'Rule', 'edit', details).then(function(response) {

				// }, handleSessionTimeout);
			}, function(response) {
				$scope.addEditFailureHandler(response, 'Edit');
			});
		}
		//The data here is prepared for Adding new Rule
		 else {
			dataObj = {
				label_actual : $scope.info.hiddenLabel.replace(/^\s+|\s+$/g, ''),
				"update.label_display" : $scope.info.label.replace(/^\s+|\s+$/g, ''),
				description : $scope.info.description.replace(/^\s+|\s+$/g, ''),
				category_id : $scope.info.category,
				severity : $scope.info.severity,
				priority : $scope.info.priority,
				kb_link : $scope.info.kbLink.replace(/^\s+|\s+$/g, ''),
				logic_actual : $scope.info.hiddenLogic.replace(/^\s+|\s+$/g, ''),
				logic_display : $scope.info.logic.replace(/^\s+|\s+$/g, ''),
				logic_condition : $scope.info.convertedLogic.replace(/\'/g, "\"").replace(/^\s+|\s+$/g, '').replace(/[\"]+/g, "\""),
				email_template_id : $scope.info.action == 'mail' ? $scope.info.emailTemplate :  0,
				text_actual : $scope.info.hiddenText.replace(/^\s+|\s+$/g, ''),
				text_display : $scope.info.text.replace(/^\s+|\s+$/g, ''),
				recommendation_display : $scope.info.recommendation.replace(/^\s+|\s+$/g, ''),
				alert_justification_display : $scope.info.alert_justification.replace(/^\s+|\s+$/g, ''),
				scope : $scope.info.scope,
				column_type : $scope.info.secColTypePairs.join(','),
				table_name : $scope.info.tables.join(','),
				author : $scope.info.author.replace(/^\s+|\s+$/g, ''),
				"update.max_limit" : $scope.info.maxLimit,
				"update.max_alerts_display_ui" : $scope.info.maxLimitDisplay,
				"update.convertedRegex" : $scope.info.convertedRegexes,
				"update.convertedCounts" : $scope.info.convertedCounts,
				recommendation: $scope.info.hiddenRecommendation.replace(/^\s+|\s+$/g, ''),
				alert_justification : $scope.info.hiddenJustification.replace(/^\s+|\s+$/g, ''),
				"update.convertedAggregates" :  $scope.processAggregateFunctionForPayload(),
				"update.allow_subscription" : $scope.info.subscription_enabled
			};
			//
			data = Object.assign(data, dataObj);
			RulesService.addRule(data).then(function(response) {	
				
				//Call add subscription api(in phase 2 add  "filter_attributes" to payload as its optional fron infoserver now)
				if ($scope.info.action == 'mail') {
					var addSubscriptionPayload = {
						"subscribers": [
							{
								"mps": $cookies.mps,
								"rule_id": response.data.Data.rule_id,
								"email": $scope.info.subscriptionEmailList.length ? $scope.info.subscriptionEmailList.join() : "",
								"subscription_enabled": $scope.info.subscription_enabled,
							}]
					}
					$scope.info.tags = $scope.info.tagList.filter($scope.tagFilterFunction);

					RulesService.subscribeRule(addSubscriptionPayload).then(function (response) {

					}, function (response) {
						console.error("Unable to load templates");
						if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
							GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
							$scope.info.addRuleMsg = {
								type: 'failure',
								msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
							};
						}
						handleSessionTimeout(response);
					});

					
					//add tag association
					if ($scope.info.selectedTagsCount > 0 && $scope.info.subscription_enabled) {
						RulesService.associateDisassociateTag($scope.getAddUpdateTagPayload(response.data.Data.rule_id)).then(function (response) {

						}, function (response) {
							console.error("Unable to add tags");
							if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
								GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
								$scope.info.addRuleMsg = {
									type: 'failure',
									msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
								};
							}
							handleSessionTimeout(response);
						});
					}
					
				}
				
				$scope.info.addRuleMsg = {
					type : 'success',
					msg : GlobalService.getVal('rulesMsgs')['add_rule_success'][0] + $scope.info.label + GlobalService.getVal('rulesMsgs')['add_rule_success'][1]
				};				
				$scope.info.ruleAddedAsDraft = true;
				var newData = $scope.makeRuleObjectAfterAddEdit(response, $scope.info.supportedStatus.Draft);
				$scope.info.testRuleData = newData;
				var rulesLabelMap = RulesService.getRulesLabelMap();
				rulesLabelMap[$scope.info.label] = true;
				RulesService.setRulesLabelMap(rulesLabelMap);

				var curRuleId = response.data.Data.rule_id;

				//update rule version
				$scope.getRulesVersion();

				// Reload rules list
				$scope.fetchRuleListAfterAddEdit(newData,curRuleId);

				$scope.trackUser('Rule', 'ADD', {"rule_name": response.data.Data.rule_name});

				// UserTrackingService.standard_user_tracking($scope.info.application, 'Rule', 'add', $scope.info.label.replace(/^\s+|\s+$/g, '')).then(function(response) {

				// }, handleSessionTimeout);


			}, function(response) {
				$scope.addEditFailureHandler(response, 'Add');
			});
		}
	};
	$scope.addEditFailureHandler = function(response, type){
		$scope.info.categoriesLoading = false;
		if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
			GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
			$scope.info.addRuleMsg = {
				type : 'failure',
				msg : GlobalService.getVal('rulesMsgs')['h2_down_msg']
			};
		} else {
			$scope.info.addRuleMsg = {
				type : 'failure',
				msg : GlobalService.getVal('rulesMsgs')['add_rule_fail']
			};
		}

		$scope.info.testRuleData = null;
		$scope.info.ruleAdded = false;
		console.error('Unable to '+type+' rule');
		handleSessionTimeout(response);
	}
	$scope.makeRuleObjectAfterAddEdit = function(response, newStatus){
		var data = {
			rule_id : response.data.Data.rule_id,
			rule_name : response.data.Data.rule_name,
			alert_id : response.data.Data.alert_id,
			label_display : $scope.info.label,
			label: $scope.info.label,
			description : $scope.info.description,
			category_id : $scope.info.category,
			category : ($filter('filter')($scope.info.categories, {category_id: $scope.info.category}))[0].category,
			severity_id : $scope.info.severity,
			severity : ($filter('filter')($scope.info.severities, {severity_id: $scope.info.severity}))[0].severity,
			priority_id : $scope.info.priority,
			priority : ($filter('filter')($scope.info.priorities, {priority_id: $scope.info.priority}))[0].priority,
			kb_link : $scope.info.kbLink,
			logic_display : $scope.info.logic,
			//email_template_id : $scope.info.action == 'none' ? 0 : $scope.info.emailTemplate.toString(),
			email_template_id : $scope.info.action == 'mail' ? $scope.info.emailTemplate : 0,
			text_display : $scope.info.text,
			recommendation_display : $scope.info.recommendation,
			alert_justification_display : $scope.info.alert_justification,
			scope : $scope.info.scope,
			author : $scope.info.author,
			status : newStatus,
			max_limit : $scope.info.maxLimit,
			max_alerts_display_ui : $scope.info.maxLimitDisplay,
			created_by: $scope.info.createdBy,
			created_ts: $scope.info.createdTs,
			action_id: response.data.Data.action_id,
			api_template_id: response.data.Data.api_template_id,
			subscription_enabled: $scope.info.subscription_enabled,
			subscriptionEmailList : $scope.info.subscriptionEmailList,
			tagList : $scope.info.tagList,
			tags: $scope.info.tags.reduce(function(acc,cur){ if(cur.selected){acc.push(cur)}; return acc},[])

		};
		if($scope.info.action == 'mail'){
			data.subscription_enabled = $scope.info.subscription_enabled,
			data.subscriptionEmailList = $scope.info.subscriptionEmailList
		}

		return angular.copy(data);
	};
	$scope.fetchRuleListAfterAddEdit = function(newData, curRuleId){

		RulesService.getAllRules($scope.info.ruletype).then(function(response) {
			$scope.info.categoriesLoading = false;
			$scope.info.ruleAdded = true;
			RulesService.setRulesList($filter('filterMultiples')((response.data.Data), {
				status : [$scope.info.supportedStatus.Enabled, $scope.info.supportedStatus.Disabled, $scope.info.supportedStatus.Draft]
			}));
			var curRule = $filter('filter')((response.data.Data), {
				rule_id : curRuleId
			}) || [];
			if(curRule[0]){
				$scope.info.createdBy = curRule[0].created_by;
				$scope.info.createdTs = curRule[0].created_ts;
			}
			newData.created_by = $scope.info.createdBy;
			newData.created_ts = $scope.info.createdTs;
			newData.colt = curRule[0].colt;
			newData.recommendation = curRule[0].recommendation;
			newData.modified_by = curRule[0].modified_by;
			newData.modified_ts = curRule[0].modified_ts;	
			newData.alert_id = curRule[0].alert_id;			
			$scope.info.testRuleData.alert_id = curRule[0].alert_id;
			newData.subscriptionEmailList = curRule[0].subscribed_users.length ? curRule[0].subscribed_users.split(",").filter(Boolean) : [];
			newData.action_id = curRule[0].action_id;
			RulesService.setRuleMode('edit', newData);
			$scope.populateEditRule();
		}, handleSessionTimeout);
	}
	// Function to create unique section-column-type pairs
	$scope.createColumnType = function(logicPairs, textPairs, labelPairs, justificationPairs, recommendationPairs) {
		$scope.info.secColTypePairs = [];
		$scope.info.tables = [];
		for(var i=0;i<arguments.length;i++){
			$scope.getUniqueTalbeAndColumnName(arguments[i]);
		}
	};
	$scope.getUniqueTalbeAndColumnName = function(list){		
		for (var i = 0; i < list.length; i++) {
			var pairFound = false;
			var tableFound = false;
			for (var j = 0; j < $scope.info.secColTypePairs.length; j++) {
				if ($scope.sectionsColumnLabelMap[list[i]][3] == $scope.info.secColTypePairs[j]) {
					pairFound = true;
					break;
				}
			}
			for (var j = 0; j < $scope.info.tables.length; j++) {
				if ($scope.sectionsColumnLabelMap[list[i]][4] == $scope.info.tables[j]) {
					tableFound = true;
					break;
				}
			}
			if (!pairFound) {
				$scope.info.secColTypePairs.push($scope.sectionsColumnLabelMap[list[i]][3]);
			}
			if (!tableFound) {
				$scope.info.tables.push($scope.sectionsColumnLabelMap[list[i]][4]);
			}
		}
	}

	// Function to check if necessary elements have some value
	$scope.validateElements = function() {
		if (/^\s*$/.test($scope.info.label)) {
			ModalService.alertBox({
				msg : 'Label' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']
			});
			return;
		}
		var rulesLabelMap = RulesService.getRulesLabelMap();
		var emailTemplate;
		var apiTemplate;

		if($scope.info.emailTemplate == "select")
			emailTemplate = 0;
		else
			emailTemplate = $scope.info.emailTemplate;
		if($scope.info.apiTemplate == "select")	
			apiTemplate = 0;
		else
			apiTemplate = $scope.info.apiTemplate;

		//// show confirm dialog box if the rule will be saved as draft 
		var draftregex = new RegExp("{([^}]*)}", "g")
		if(RulesService.getRuleMode()['mode'] == "edit"){
			if ($scope.info.status != $scope.info.supportedStatus.Draft && $scope.checkDraft(draftregex)) {
				$scope.msg = GlobalService.getVal('rulesMsgs')['save_rule_enable_to_draft'];
				$scope.modal = ModalService.openModal("partials/rules-and-alerts/enable_draft_rule.html", $scope, false, 'static');
				return;
	
			}
		}
		
		if (!!$scope.info.initialLabel) {
			if ($scope.info.label != $scope.info.initialLabel && rulesLabelMap.hasOwnProperty($scope.info.label)) {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['add_rule_duplicate_label']
				});
				return;
			}
		} else {
			if (rulesLabelMap.hasOwnProperty($scope.info.label)) {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['add_rule_duplicate_label']
				});
				return;
			}
		}
		if ($scope.info.category == "select") {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'category'
			});
			return;
		}
		if (/^\s*$/.test($scope.info.author)) {
			ModalService.alertBox({
				msg : 'Author' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']
			});
			return;
		}
		if ($scope.info.severity == "select") {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'severity'
			});
			return;
		}
		if ($scope.info.priority == "select") {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'priority'
			});
			return;
		}
		if ($scope.info.scope == "select") {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'scope'
			});
			return;
		}
		if ($scope.info.action == 'mail' && $scope.info.emailTemplate == 'select') {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'template'
			});
			return;
		}
		if ($scope.info.action == 'api' && $scope.info.apiTemplate == 'select') {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'template'
			});
			return;
		}
		if (!$scope.info.maxLimitDisplay || /^\s*$/.test($scope.info.maxLimitDisplay)) {
			ModalService.alertBox({
					msg : 'Max. Alerts(View) ' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']
			});
			return;
		}
		if (/^\s*$/.test($scope.info.logic)) {
			ModalService.alertBox({
				msg : 'Logic' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']
			});
			return;
		}
		if (/^\s*$/.test($scope.info.text)) {
			ModalService.alertBox({
				msg : 'Text' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']
			});
			return;
		}
		return true;
	};// Function to check if necessary elements have some value
	$scope.validateUnsupportedElements = function() {
		if (/^\s*$/.test($scope.info.label)) {
			ModalService.alertBox({
				msg : 'Label' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']
			});
			return;
		}
		var rulesLabelMap = RulesService.getRulesLabelMap();
		if (!!$scope.info.initialLabel) {
			if ($scope.info.label != $scope.info.initialLabel && rulesLabelMap.hasOwnProperty($scope.info.label)) {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['add_rule_duplicate_label']
				});
				return;
			}
		} else {
			if (rulesLabelMap.hasOwnProperty($scope.info.label)) {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['add_rule_duplicate_label']
				});
				return;
			}
		}
		if ($scope.info.category == "select") {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'category'
			});
			return;
		}
		if (/^\s*$/.test($scope.info.author)) {
			ModalService.alertBox({
				msg : 'Author' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']
			});
			return;
		}
		if ($scope.info.severity == "select") {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'severity'
			});
			return;
		}
		if ($scope.info.priority == "select") {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'priority'
			});
			return;
		}
		if ($scope.info.scope == "select") {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'scope'
			});
			return;
		}
		if ($scope.info.action == 'mail' && $scope.info.emailTemplate == 'select') {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'template'
			});
			return;
		}
		if ($scope.info.action == 'api' && $scope.info.apiTemplate == 'select') {
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'template'
			});
			return;
		}
		if (!$scope.info.maxLimitDisplay || /^\s*$/.test($scope.info.maxLimitDisplay)) {
                ModalService.alertBox({
                        msg : 'Max. Alerts(View) ' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']
                });
                return;
        }

		return true;
	};


	// Function to convert logic to scala if condition
	$scope.convertScalaCondition = function(stmt) {
		//parse operators
		//Read Left operand
		var regExp = /\{([^}]+)\}/g;
		var stmt_tmp = stmt;
		var matches = stmt_tmp.match(regExp) || [];
		for (var i = 0; i < matches.length; i++) {
			var str = matches[i];
			var operand = str.substring(1, str.length - 1);
			var operandMin = $scope.sectionsColumnLabelMap[operand][0];
			if ($scope.sectionsColumnLabelMap[operand][2] == $scope.info.columnDataTypes['Integer'] || $scope.sectionsColumnLabelMap[operand][2] == $scope.info.columnDataTypes['Long']) {
				operandMin += '.toLong';
			} else if ($scope.sectionsColumnLabelMap[operand][2] == $scope.info.columnDataTypes['Float']) {
				operandMin += '.toFloat';
			} else if ($scope.sectionsColumnLabelMap[operand][2] == $scope.info.columnDataTypes['Double']) {
				operandMin += '.toDouble';
			}
			stmt = stmt.replace('{' + operand + '}', operandMin);
		}

		var stringsInLogicRegex = /\'%(.*?)%\'|\'%(.*?)[^%]\'|\'[^%](.*?)%\'|\"(.*?)\"/g;

		var count = 1;
		var stringsMap = {};

		var stringsMatched = stmt.match(stringsInLogicRegex);
		if (!!stringsMatched && !!stringsMatched.length) {
			for (var i = 0; i < stringsMatched.length; i++) {
				var stringToReplace = '';
				var originalString = '';
				if (/\'%(.*?)%\'/.test(stringsMatched[i])) {
					stringToReplace = '\'%string' + count + '%\'';
					originalString = stringsMatched[i].replace(/^\'%|%\'$/g, '');
				} else if (/\'%(.*?)[^%]\'/.test(stringsMatched[i])) {
					stringToReplace = '\'%string' + count + '\'';
					originalString = stringsMatched[i].replace(/^\'%|\'$/g, '');
				} else if (/\'[^%](.*?)%\'/.test(stringsMatched[i])) {
					stringToReplace = '\'string' + count + '%\'';
					originalString = stringsMatched[i].replace(/^\'|%\'$/g, '');
				} else {
					stringToReplace = '\"string' + count + '\"';
					originalString = stringsMatched[i].replace(/^\"|\"$/g, '');
				}
				stmt = stmt.replace(stringsMatched[i], stringToReplace);
				stringsMap["string" + count] = originalString;
				count++;
			}
		}

		var scalaCondtion = $scope.parseLogicToScalaCondtion(stmt,stringsMap);

		// Ashwin - added to change numerator type as double in case of division
		scalaCondtion = scalaCondtion.replace(/\.toLong([^\.toLong|\/]*)\//g, ".toDouble$1/");

		// Ashwin - added to append L to all integers and D to all real numbers in logic
		scalaCondtion = scalaCondtion.replace(/(^|\s)(\d+)(\s|$|\))/g, "$1$2L$3").replace(/(^|\s)(\d+\.\d+)(\s|$)/g, "$1$2D$3");

		angular.forEach(stringsMap, function(value, key) {
			scalaCondtion = scalaCondtion.replace(key, value);
		});

		return scalaCondtion;

	};

	// Function to check the count of opening and closing brackets is same
	$scope.checkParentheses = function(logic) {
		var openBracketCount = logic.replace(/\(/g, "").length;
		var closeBracketCount = logic.replace(/\)/g, "").length;
		if (openBracketCount != closeBracketCount) {
			ModalService.alertBox({
				msg : GlobalService.getRulesLogicAlerts('rule_logic_error')
			});
			return;
		}
		return true;
	};

	var tempAttrs = {};
	var regexExprs = {};
	var countExprs = {};
	var tempStrings = {};

	// Function to replace all tokens with temporary placeholders(strings/attributes/numbers/regex functions/count functions)
	function getReplacedLogic() {
		var tempLogic = angular.copy($scope.info.logic);
		tempAttrs = {};
		tempStrings = {};
		tempNumbers = {};
		regexExprs = {};
		countExprs = {};

		// Replacing strings with temporary placeholders
		var strMatch = tempLogic.match(/'%((?:\\.|[^'\\])*)'|'((?:\\.|[^'\\])*)%'|'%((?:\\.|[^'\\])*)%'|"((?:\\.|[^"\\])*)"/g);
		var strCount = 1;
		angular.forEach(strMatch, function(match) {
			var strName = match;
			var tempName = "string_" + strCount;
			tempLogic = tempLogic.replace(match, "[" + tempName + "]");

			tempStrings[tempName] = strName;
			strCount++;
		});

		// Replacing attributes with temporary placeholders
		var attrMatch = tempLogic.match(/\{[^\{|^}]*\}/g);
		var attrCount = 1;
		angular.forEach(attrMatch, function(match) {
			var attrName = match.replace(/\{|\}/g, "");
			var tempName = "attr_" + attrCount;
			tempLogic = tempLogic.replace(match, "{" + tempName + "}");
			tempAttrs[tempName] = attrName;
			attrCount++;
		});

		// Replacing numbers with temporary placeholders
		var numMatches = tempLogic.replace(/{[^}]+}/g, "").replace(/\[[^\]]+\]/g, "").match(/\s\d+(\.\d+)?/g);
		var numCount = 1;
		angular.forEach(numMatches, function(match) {
			var tempName = "number_" + numCount;
			var startSpaces = (match.match(/^\s+/) || [""])[0];
			var endSpaces = (match.match(/\s+$/) || [""])[0];
			tempLogic = tempLogic.replace(match, startSpaces + "{" + tempName + "}" + endSpaces);

			$scope.sectionsColumnLabelMap[match.replace(/^\s+|\s+$/g, "")] = [tempName, "", $scope.info.columnDataTypes['Long']];

			tempNumbers[tempName] = match.replace(/^\s+|\s+$/g, "");
			tempAttrs[tempName] = match.replace(/^\s+|\s+$/g, "");
			numCount++;
		});

		// Replacing regular expressions with temporary placeholders
		var regexMatches = tempLogic.match(/REGEX\([^\)]+\)/g);
		var regexCount = 1;

		var regexError = false;
		$scope.info.regexMatches = [];
		angular.forEach(regexMatches, function(match) {
			if (!regexError) {
				var attrInRegex = validateRegexFunc(match);
				if (!attrInRegex) {
					regexError = true;
				} else {
					var regexActual = getOriginal(match);
					var tempName = "regex_" + regexCount;
					tempLogic = tempLogic.replace(match, "{" + tempName + "}");

					$scope.sectionsColumnLabelMap[regexActual] = $scope.sectionsColumnLabelMap[attrInRegex];

					regexExprs[tempName] = regexActual;
					tempAttrs[tempName] = regexActual;
					regexCount++;
				}
			}
		});

		if (!!regexError) {
			return;
		}
		
		var countCount = 1;
		var countError = false;
		$scope.info.aggregateFunctions.map(function(aggrFunc){
			var funcName = aggrFunc.label;
			var countStringToSearch = funcName + "(";
			countMatches = getCountMatches(tempLogic, countStringToSearch);
			countCount = 1;
			// Replacing count functions with temporary placeholders
			// var countStringToSearch = "COUNT(";
			// var countMatches = getCountMatches(tempLogic, countStringToSearch);
			angular.forEach(countMatches, function (match) {
				if (!countError) {
					var exprInCount = match.substring(countStringToSearch.length, match.length - 1);
					var lengthCovered = getOriginal(tempLogic).indexOf(getOriginal(match)) + countStringToSearch.length;
					if (funcName == "COUNT" && !validateExpressions(exprInCount, lengthCovered)) {
						countError = true;
						return;
					} else {
						if (!checkCountAttrs(match)) {
							countError = true;
							var msg = GlobalService.getRulesLogicAlerts('rule_logic_multiple_sections_in_count');
							var oririnalExpr = getOriginal(match);
							var startIndex = $scope.info.logic.indexOf(oririnalExpr);
							var stopIndex = startIndex + oririnalExpr.length;
							displayLogicAlert(msg, startIndex, stopIndex);
							return;
						} else {
							var exprActual = getOriginal(match);
							var functionCounter = funcName.toLocaleLowerCase() + "_" + countCount;
							var tempName = functionCounter;
							tempLogic = tempLogic.replace(match, "{" + tempName + "}");

							$scope.sectionsColumnLabelMap[exprActual] = [tempName, "", $scope.info.columnDataTypes['Long']];

							countExprs[tempName] = exprActual;
							tempAttrs[tempName] = exprActual;
							countCount++;
						}
					}
				}
			});
		})

		if (!!countError) {
			return;
		}
		return tempLogic;
	}

	// Function to check if all attributes inside a count function belongs to same table
	function checkCountAttrs(expr) {
		var curlyBraceMatches = expr.match(/{[^}]+}/g) || [];
		var attrMatches = [];
		angular.forEach(curlyBraceMatches, function(match) {
			if(!match.startsWith("{number")) {
				attrMatches.push(match);
			}
		});
		var tableInExpr = null;
		var error = false;
		angular.forEach(attrMatches, function(match) {
			if (!error) {
				var attr = tempAttrs[match.replace(/\{|\}/g, "")];
				var table = $scope.sectionsColumnLabelMap[attr][4];
				if (!tableInExpr) {
					tableInExpr = table;
				} else {
					if (tableInExpr != table) {
						error = true;
					}
				}
			}
		});

		if (!!error) {
			//use different validation if TIMEDIFF used
			// var timediffFunction = expr.match(/TIMEDIFF[(](.)*[)]/g) || [];
			// if(timediffFunction == 0) return;
			return;
		}
		return true;
	}

	// Function to get COUNT function expressions in rule
	function getCountMatches(logic, countStringToSearch) {
		var matches = [];

		var countIndices = getIndicesOf(countStringToSearch, logic);

		angular.forEach(countIndices, function(index) {
			var startIndex = index;
			var endIndex;
			var openingBrackets = 1;
			var closingBrackets = 0;
			var endFound = false;
			for (var i = startIndex + countStringToSearch.length; i < logic.length; i++) {
				if (logic[i] == "(") {
					openingBrackets++;
				}
				if (logic[i] == ")") {
					closingBrackets++;
					if (closingBrackets == openingBrackets) {
						endIndex = i + 1;
						endFound = true;
						break;
					}
				}
			}
			if (!!endFound) {
				matches.push(logic.substring(startIndex, endIndex));
			}
		});
		return matches;
	}

	// Function to get a list of indices of a substring within a string
	function getIndicesOf(searchStr, str, caseSensitive) {
		var searchStrLen = searchStr.length;
		if (searchStrLen == 0) {
			return [];
		}
		var startIndex = 0,
		    index,
		    indices = [];
		if (!caseSensitive) {
			str = str.toLowerCase();
			searchStr = searchStr.toLowerCase();
		}
		while (( index = str.indexOf(searchStr, startIndex)) > -1) {
			indices.push(index);
			startIndex = index + searchStrLen;
		}
		return indices;
	}

	// Function to validate REGEX functions used in rule
	//
	// Validations:
	//   i. Check whether format of REGEX function is valid
	//   ii. Check if attribute inside REGEX function is string
	//   iii. Check if space is not present inside Regular Expression
	//   iv. Check if there is a capture inside Regular Expression
	//   v. Check if there is only one capture inside Regular Expression
	//   vi. Check if Regular Expression is valid

	function validateRegexFunc(regex) {
		if (!/REGEX\(\s*\{attr_\d+\}\s*,\s*\[string_\d+\]\s*\)/.test(regex)) {
			// Display msg - Invalid syntax with correct regex syntax
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_regex_params');
			var oririnalRegex = getOriginal(regex);
			var startIndex = $scope.info.logic.indexOf(oririnalRegex);
			var stopIndex = startIndex + oririnalRegex.length;
			displayLogicAlert(msg, startIndex, stopIndex);
			return;
		}

		var attrInsideRegexFunc = tempAttrs[regex.match(/attr_\d+/)[0]];

		if ($scope.sectionsColumnLabelMap[attrInsideRegexFunc][2] != $scope.info.columnDataTypes['String']) {
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_regex_attribute', attrInsideRegexFunc);
			var oririnalRegex = getOriginal(regex);
			var startIndex = $scope.info.logic.indexOf(oririnalRegex) + oririnalRegex.indexOf(attrInsideRegexFunc);
			var stopIndex = startIndex + attrInsideRegexFunc.length;
			displayLogicAlert(msg, startIndex, stopIndex);
			return;
		}

		var regexString = tempStrings[regex.match(/string_\d+/)[0]].replace(/^\"|\"$/g, '');

		if (/\s/.test(regexString)) {
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_regex_space_found');
			var oririnalRegex = getOriginal(regex);
			var startIndex = $scope.info.logic.indexOf(oririnalRegex) + oririnalRegex.indexOf(regexString);
			var stopIndex = startIndex + regexString.length + 2;
			displayLogicAlert(msg, startIndex, stopIndex);
			return;
		}

		try {
			var reg = new RegExp(regexString);
			//regex should not match all
			if(regexString == "()"){
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_regex_pattern', regexString);
				var oririnalRegex = getOriginal(regex);
				var startIndex = $scope.info.logic.indexOf(oririnalRegex) + oririnalRegex.indexOf(regexString);
				var stopIndex = startIndex + regexString.length + 2;
				displayLogicAlert(msg, startIndex, stopIndex);
				return;
			}
			//regex value should not have '/'
			/*if(regexString.indexOf('/') != -1){
				var backSlashIndex = regexString.indexOf('/');
				//check it it have '/' followed by '\'
				if(regexString.charAt(backSlashIndex - 1) != "\\"){
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_regex_pattern', regexString);
					var oririnalRegex = getOriginal(regex);
					var startIndex = $scope.info.logic.indexOf(oririnalRegex) + oririnalRegex.indexOf(regexString);
					var stopIndex = startIndex + regexString.length + 2;
					displayLogicAlert(msg, startIndex, stopIndex);
					return;
				}
			}*/
			var captureMatchesInRegex = regexString.match(/\(((?:\\.|\||[^(\(\\)|(\)\\)])*)\)/g);
			if (!captureMatchesInRegex) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_regex_no_capture', regexString);
				var oririnalRegex = getOriginal(regex);
				var startIndex = $scope.info.logic.indexOf(oririnalRegex) + oririnalRegex.indexOf(regexString);
				var stopIndex = startIndex + regexString.length + 2;
				displayLogicAlert(msg, startIndex, stopIndex);
				return;
			}
			if (captureMatchesInRegex.length > 1) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_regex_multiple_captures', regexString);
				var oririnalRegex = getOriginal(regex);
				var startIndex = $scope.info.logic.indexOf(oririnalRegex) + oririnalRegex.indexOf(regexString);
				var stopIndex = startIndex + regexString.length + 2;
				displayLogicAlert(msg, startIndex, stopIndex);
				return;
			}
		} catch(e) {
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_regex_pattern', regexString);
			var oririnalRegex = getOriginal(regex);
			var startIndex = $scope.info.logic.indexOf(oririnalRegex) + oririnalRegex.indexOf(regexString);
			var stopIndex = startIndex + regexString.length + 2;
			displayLogicAlert(msg, startIndex, stopIndex);
			return;
		}

		var regexData = {
			actualLogic : getOriginal(regex),
			attr : $scope.sectionsColumnLabelMap[attrInsideRegexFunc][0],
			table : $scope.sectionsColumnLabelMap[attrInsideRegexFunc][4],
			pattern : regexString
		};

		$scope.info.regexMatches.push(regexData);

		return attrInsideRegexFunc;
	}

	// Function to return actual length of a statement without any placeholders
	function getStatementLength(statement) {
		var tempStat = getOriginal(statement);

		return tempStat.length;
	}

	// Function to return actual statement replacing all the placeholders
	function getOriginal(statement) {
		var tempStat = angular.copy(statement);

		if (!!statement) {
			var attrsMatch = statement.match(/\{[^(\{|\})]+\}/g);

			angular.forEach(attrsMatch, function(match) {
				if (tempAttrs.hasOwnProperty(match.replace(/^\{|\}$/g, ""))) {
					tempStat = tempStat.replace(match, (match.indexOf("regex_") == -1 && match.indexOf("count_") == -1 && match.indexOf("number_") == -1 ? "{" : "") + tempAttrs[match.replace(/^\{|\}$/g, "")] + (match.indexOf("regex_") == -1 && match.indexOf("count_") == -1 && match.indexOf("number_") == -1 ? "}" : ""));
				}
			});

			var strsMatch = statement.match(/\[[^(\[|\])]+\]/g);

			angular.forEach(strsMatch, function(match) {
				if (tempStrings.hasOwnProperty(match.replace(/^\[|\]$/g, ""))) {
					tempStat = tempStat.replace(match, tempStrings[match.replace(/^\[|\]$/g, "")]);
				}
			});
		}

		return tempStat;
	}

	// Function to display logic alert and highlight a substring after closing the alert
	function displayLogicAlert(msg, startIndex, stopIndex) {
		var modalInstance = ModalService.alertBox({
			msg : msg
		});
		modalInstance.result.then(function(response) {
			if (response == "ok") {
				highlightLogic(startIndex, stopIndex);
			}
		}, function(response) {
			if (response == "backdrop click") {
				highlightLogic(startIndex, stopIndex);
			}
		});
	}

	// Function to highlight part of logic after closing alert
	function highlightLogic(startIndex, stopIndex) {
		var input = document.getElementById("inputLogic");
		input.focus();
		input.setSelectionRange(startIndex, stopIndex);
		angular.element(input).addClass("logic-select");
		$timeout(function() {
			input.setSelectionRange(0, 0);
			angular.element(input).removeClass("logic-select");
			input.blur();
		}, 3000);
	}

	// Function to validate whether the logic entered is grammatically correct
	$scope.validateLogicGrammar = function() {
		var logic = getReplacedLogic();
		if (!logic) {
			return;
		}
		//check for nested Aggrigate functions
		if(/(COUNT|MAX|MIN|SUM|AVG)\s*\(\s*(COUNT|MAX|MIN|SUM|AVG)[^\)]+\)/gm.test($scope.info.logic)){
			ModalService.alertBox({
				msg : GlobalService.getVal('rulesLogicAlerts')['rule_logic_nexted_aggregate_function']
			});
			return;
		}
		//if TIMEDIFF then scope should be file
		if (/TIMEDIFF/.test($scope.info.logic)) {
			if ($scope.info.scope != "File") {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesLogicAlerts')['rule_logic_file_scope_for_TIMEDIFF']
				});
				return;
			}
		}
		//if COUNT then scope should be file or bundle
		if (/COUNT/.test($scope.info.logic)) {
			if ($scope.info.scope != "File" && $scope.info.scope != "Bundle") {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesLogicAlerts')['rule_logic_count_in_table']
				});
				return;
			}
		}
		//if COUNT then scope should be file or bundle
		if (/SUM/.test($scope.info.logic) || /AVG/.test($scope.info.logic) || /MIN/.test($scope.info.logic) || /MAX/.test($scope.info.logic)) {
			if ($scope.info.scope != "File" && $scope.info.scope != "Bundle") {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesLogicAlerts')['rule_logic_aggregations_in_table']
				});
				return;
			}
		}

		if ($scope.info.scope != "Table") {
			if (!(/SUM/.test($scope.info.logic) || /AVG/.test($scope.info.logic) || /MIN/.test($scope.info.logic) || /MAX/.test($scope.info.logic) || /COUNT/.test($scope.info.logic)) ){
			//if (/regex_\d+/.test(logic) || /attr_\d+/.test(logic)) {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesLogicAlerts')['rule_logic_file_bundle_in_count']
				});
				return;
			}
		} else {
			if (/count_\d+/.test(logic)) {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesLogicAlerts')['rule_logic_count_in_table']
				});
				return;
			}
		}
		// all expression should be wrape with an aggregate function
		if ($scope.info.scope != "Table") {
			var regExCondition = /\s+AND\s*|\s*OR\s*/;
			var logicEachItem = logic.split(regExCondition);
			var gbregexAggregationfunction = /^\s*{\s*(count|sum|min|max|avg)_\d+}\s*/;
			for(var i=0;i<logicEachItem.length;i++){
				if(!gbregexAggregationfunction.test(logicEachItem[i])){
					ModalService.alertBox({
						msg : GlobalService.getVal('rulesLogicAlerts')['rule_logic_file_bundle_in_count']
					});
					return;
				}
			}
		}
		//validate REGEX
		//check if REGEX is direct compare to any arithmetic/comparator operator
		var gbObject = $scope.checkRegexWithOperator($scope.info.logic);
		if(gbObject.result){
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_regex_assignment_operator');
			displayLogicAlert(msg, gbObject.index, (gbObject.index + 5));
			return;
		}

		// Check the syntax of parentheses used
		if (!$scope.checkParentheses(logic)) {
			return;
		}

		var lengthCovered = 0;

		if (!validateExpressions(logic, lengthCovered)) {
			return;
		}
		return true;
	};
	
	// Function to validate each expressions
	function validateExpressions(logic, lengthCovered) {
		// Split statements separated by AND or OR
		var logicalSplitStr = '';
		for (var i in $scope.info.operators) {
			if ($scope.info.operators[i].subtype == 'logical') {
				if (logicalSplitStr.length == 0) {
					logicalSplitStr += '\\s+' + $scope.info.operators[i].label + '\\s+';
				} else {
					logicalSplitStr += '|\\s+' + $scope.info.operators[i].label + '\\s+';
				}
			}
		}
		var logicalSplitRegex = new RegExp(logicalSplitStr);
		var logicalOperators = logic.match(new RegExp(logicalSplitStr, "g"));
		var individualStatements = logic.split(logicalSplitRegex);
		var funcStr = '';
		// Loop through individual statements
		for (var s = 0; s < individualStatements.length; s++) {
			var statementLength = getStatementLength(individualStatements[s]);
			individualStatements[s] = ' ' + individualStatements[s] + ' ';
			for (var j in $scope.info.functions) {
				if (j == 0) {
					funcStr += $scope.info.functions[j].label;
				} else {
					funcStr += "|" + $scope.info.functions[j].label;
				}
			}

			// Check if functions used is valid or not
			if (!$scope.checkFunctions(individualStatements[s])) {
				return;
			}
			
			// Remove any function or brackets in the string for validation
			var funcRegex = new RegExp(funcStr, 'g');
			var funcName = individualStatements[s].split("(")[0].replace(/^\s+|\s+$/g, '');
			individualStatements[s] = individualStatements[s].replace(funcRegex, '');
			individualStatements[s] = $scope.removeBrackets(individualStatements[s]);
			var startPos = null,
			    endPos = null;
			
			// Check if regex is used properly
			if (/\{regex_\d+\}/.test(individualStatements[s]) && ($scope.sectionsColumnLabelMap[tempAttrs[individualStatements[s].match(/regex_\d+/)[0]]][2] != $scope.info.columnDataTypes['String'] && /^\s*\{regex_\d+\}\s*$/.test(individualStatements[s]))) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_error');
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				return;
			}
			
			// Check if only regex variable is present in the statement. If yes, continue
			if (/^\s*\{regex_\d+\}\s*$/.test(individualStatements[s])) {
				continue;
			}

			// Check if a statement starts with an attribute
			if (!/^\s*\{/.test(individualStatements[s])) {
				var msg;
				if (s == 0) {
					msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_start');
				} else {
					msg = GlobalService.getRulesLogicAlerts('rule_logic_logical_right');
				}
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				return;
			}

			// Check for each operator on the right side of the first attribute
			var rightOperatorMatches = individualStatements[s].match(/\}\s*[^\s|^\{]*\s*[\{|\d|\[]?/);
			var rightOperator = rightOperatorMatches[0];
			rightOperator = rightOperator.replace(/^\}|[\{|\d|\[]$/g, "").replace(/^\s+|\s+$/g, '');

			// check for TIMEDIFF for operator "}, {" or "},{"
			if(funcName == "TIMEDIFF"){
				if (rightOperator == ',') {
					rightOperator = "";
					continue;
				}
			}
			if (rightOperator == 'IS') {
				rightOperatorMatches = individualStatements[s].match(/\}\s*.*/);
				rightOperator = rightOperatorMatches[0];
				rightOperator = rightOperator.replace(/^\}|\[\w+\]|\d+(\.\d+)?|\{\w+\}/g, "").replace(/^\s+|\s+$/g, '');
			}
			if (rightOperator == 'NOT') {
				rightOperatorMatches = individualStatements[s].match(/\}\s*.*/);
				rightOperator = rightOperatorMatches[0];
				rightOperator = rightOperator.replace(/^\}|\[\w+\]|\d+(\.\d+)?|\{\w+\}/g, "").replace(/^\s+|\s+$/g, '');
			}
			if($scope.isNestedAggregate(funcName)){
				return;
			}
			// Check if any attribute is repeated in a statement
			if (!$scope.checkRepeatedAttributes(individualStatements[s], lengthCovered, statementLength)) {
				return;
			}
			rightOperator = getOriginal(rightOperator);
			if (/^\s*$/.test(rightOperator)) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_operator_right');
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				return;
			}
			var rightOperatorFound = false;
			var operatorSpaceRequired = false;
			for (var j in $scope.info.operators) {
				if ($scope.info.operators[j].label == rightOperator) {
					rightOperatorFound = true;
					break;
				} else if (rightOperator.indexOf($scope.info.operators[j].label) != -1) {
					operatorSpaceRequired = true;
					break;
				}
			}

			if (operatorSpaceRequired) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_operator', rightOperator) + ". " + GlobalService.getRulesLogicAlerts('rule_logic_operator_space_needed');
				var startPos = lengthCovered + $scope.info.logic.substr(lengthCovered, statementLength).indexOf(getOriginal(rightOperator));
				displayLogicAlert(msg, startPos, startPos + getOriginal(rightOperator).length);
				return;
			}

			if (!rightOperatorFound) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_operator', rightOperator);
				var startPos = lengthCovered + $scope.info.logic.substr(lengthCovered, statementLength).indexOf(getOriginal(rightOperatorMatches[0]));
				displayLogicAlert(msg, startPos, startPos + getOriginal(rightOperatorMatches[0]).length);
				return;
			}

			// Check for arithmetic or comparison or inline function operator between operands
			var operatorBetweenOperands = individualStatements[s].match(/[\}|\]]\s*[^(\}|\{|\[|\])]*\s*[\{|\[]/g) || [];

			if (!!operatorBetweenOperands.length) {
				for (var i = 0; i < operatorBetweenOperands.length; i++) {
					operatorBetweenOperands[i] = operatorBetweenOperands[i].substring(1, operatorBetweenOperands[i].length - 1);
					if (/^\d+(\.\d+)?$/.test(operatorBetweenOperands[i])) {
						continue;
					}
					var operator = operatorBetweenOperands[i];
					var operatorFound = false;
					var partialOperatorFound = false;
					var tempOperator = operator.replace(/^\s*|\s*$/g, '');
					var operatorNotAllowed = false;
					for (var j = 0; j < $scope.info.operators.length; j++) {
						if ($scope.info.operators[j].label == tempOperator && ($scope.info.operators[j].subtype == 'arithmetic' || $scope.info.operators[j].subtype == 'comparison' || $scope.info.operators[j].subtype == 'equal comparison' || $scope.info.operators[j].subtype == 'inline function')) {
							operatorFound = true;
							break;
						} else if ($scope.info.operators[j].label == tempOperator) {
							operatorNotAllowed = true;
							break;
						}
					}
					if (operatorNotAllowed) {
						var msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_between_attr', tempOperator);
						var startPos = lengthCovered + $scope.info.logic.substr(lengthCovered, statementLength).indexOf(getOriginal(tempOperator));
						displayLogicAlert(msg, startPos, startPos + getOriginal(tempOperator).length);
						return;
					}
					if (operatorFound && (!/^\s+/.test(operator) || !/\s+$/.test(operator))) {
						var msg = GlobalService.getRulesLogicAlerts('rule_logic_operator_without_spaces', tempOperator) + ". " + GlobalService.getRulesLogicAlerts('rule_logic_operator_space_needed');
						var startPos = lengthCovered + $scope.info.logic.substr(lengthCovered, statementLength).indexOf(getOriginal(tempOperator));
						displayLogicAlert(msg, startPos, startPos + getOriginal(tempOperator).length);
						return;
					}
					if (!operatorFound) {
						if (!tempOperator.length) {
							var msg = GlobalService.getRulesLogicAlerts('rule_logic_no_operator');
							var startPos = lengthCovered;
							var endPos = startPos + statementLength;
							displayLogicAlert(msg, startPos, endPos);
							return;
						} else {
							var msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_operator_between', tempOperator);
							var startPos = lengthCovered + $scope.info.logic.substr(lengthCovered, statementLength).indexOf(getOriginal(tempOperator));
							displayLogicAlert(msg, startPos, startPos + getOriginal(tempOperator).length);
							return;
						}
					}
				}
			}
			// Check for left and right operands of comparison operator
			var comparisonOperatorCount = 0;
			for (var j in $scope.info.operators) {
				if (individualStatements[s].indexOf(' ' + $scope.info.operators[j].label + ' ') != -1 && $scope.info.operators[j].subtype == 'comparison') {
					if (comparisonOperatorCount >= 1 || individualStatements[s].indexOf(' ' + $scope.info.operators[j].label + ' ') != individualStatements[s].lastIndexOf(' ' + $scope.info.operators[j].label + ' ')) {
						var msg = GlobalService.getRulesLogicAlerts('rule_logic_cmp_operator_exceeded');
						displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
						return;
					}
					if (!$scope.checkComparisonOperators(individualStatements[s], $scope.info.operators[j].label, individualStatements[s].indexOf($scope.info.operators[j].label), lengthCovered, statementLength, funcName)) {
						return;
					}
					comparisonOperatorCount++;
				} else if (individualStatements[s].indexOf(' ' + $scope.info.operators[j].label + ' ') != -1 && $scope.info.operators[j].subtype == 'equal comparison') {
					if (comparisonOperatorCount >= 1 || individualStatements[s].indexOf(' ' + $scope.info.operators[j].label + ' ') != individualStatements[s].lastIndexOf(' ' + $scope.info.operators[j].label + ' ')) {
						var msg = GlobalService.getRulesLogicAlerts('rule_logic_cmp_operator_exceeded');
						displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
						return;
					}
					if (!$scope.checkEqualComparisonOperators(individualStatements[s], $scope.info.operators[j].label, individualStatements[s].indexOf($scope.info.operators[j].label), lengthCovered, statementLength, funcName)) {
						return;
					}
					comparisonOperatorCount++;
				}
			}

			// Check for left and right operands of inline function
			for (var j in $scope.info.operators) {
				if (individualStatements[s].indexOf(' ' + $scope.info.operators[j].label + ' ') != -1 && $scope.info.operators[j].subtype == 'inline function') {
					if (!$scope.checkInlineFunction(individualStatements[s], $scope.info.operators[j].label, individualStatements[s].indexOf($scope.info.operators[j].label), lengthCovered, statementLength, funcName)) {
						return;
					}
					break;
				}
			}

			// Check for left and right operands of is null function
			for (var j in $scope.info.operators) {
				if (individualStatements[s].indexOf(' ' + $scope.info.operators[j].label + ' ') != -1 && $scope.info.operators[j].subtype == 'equal null') {
					if (!$scope.checkEqualNullFunction(individualStatements[s], $scope.info.operators[j].label, individualStatements[s].indexOf($scope.info.operators[j].label), lengthCovered, statementLength, funcName)) {
						return;
					}
					break;
				}
			}

			//Check for the left and right side operands of an arithmetic operator and the operator after right operand
			var insideAttribute = false;
			var insideString = false;
			for (var i = 0; i < individualStatements[s].length; i++) {
				if (individualStatements[s][i] == '{') {
					insideAttribute = true;
					continue;
				} else if (individualStatements[s][i] == '}') {
					insideAttribute = false;
					continue;
				}
				if (individualStatements[s][i] == "\'" || individualStatements[s][i] == "\"") {
					insideString = !insideString;
				}
				if (!insideAttribute && !insideString) {
					for (var k = 0; k < $scope.info.operators.length; k++) {
						if ($scope.info.operators[k].label == individualStatements[s][i] && $scope.info.operators[k].subtype == 'arithmetic') {
							if (!$scope.checkArithmeticOperators(individualStatements[s], $scope.info.operators[k].label, i, lengthCovered, statementLength)) {
								return;
							}
						}
					}
				}

			}

			var necessaryOperatorFound = false;
			for (var i = 0; i < $scope.info.operators.length; i++) {
				if ($scope.info.operators[i].subtype != 'arithmetic') {
					if (individualStatements[s].indexOf($scope.info.operators[i].label) > -1) {
						necessaryOperatorFound = true;
					}
				}
			}

			if (!necessaryOperatorFound) {
				if($scope.isAggregateFunction(funcName) && $scope.getOperatorType(rightOperator) != 'comparison'){
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_aggregate_condition');
					displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				}else{
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_no_condition');
					displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				}
				return;
			}

			// Refresh the section column label map here
			for (var i = 0; i < $scope.info.convertedAttributes.length; i++) {
				$scope.changeColumnType($scope.info.convertedAttributes[i].value, $scope.info.convertedAttributes[i].type);
			}

			$scope.info.convertedAttributes = [];
			lengthCovered += statementLength + (s < individualStatements.length - 1 ? logicalOperators[s].length : 0);
		}
		return true;
	}

	var checkForBracketClosing = function(statement, funcName){
		var regexStr = funcName.label +'[^}]\\s*{\\w+}\\s*\\)';
		var matchString = statement.match(new RegExp(regexStr,'g'));
		if(matchString){
			return true;
		}
		return false;
	}

	$scope.isNestedAggregate = function(funcName){
		//check for nested aggregate function; should not allow
		if($scope.isAggregateFunction(funcName) || funcName == 'COUNT'){
			var functionDeclaration = $scope.info.logic.match(/(MIN|MAX|AVG|SUM|COUNT)\s*.*?\(([^)]*)\)/g);
			if(functionDeclaration.length && functionDeclaration.length > 0){
				for(var fdCount=0;fdCount < functionDeclaration.length; fdCount++){
					var aggfuncArg = functionDeclaration[fdCount].match(/\(.*(MIN|MAX|AVG|SUM|COUNT).*\)/g);
					if(aggfuncArg){
						var msg = GlobalService.getRulesLogicAlerts('rule_logic_nexted_aggregate_function');
						var si =  $scope.info.logic.indexOf(functionDeclaration[fdCount]);
						var ei = si + aggfuncArg[0].length;
						displayLogicAlert(msg,si, ei );
						return true;
					}
				}
			}
		}
		return false;
	}
	$scope.checkRegexWithOperator = function(logic) {
		var startIndex = logic.search(/REGEX/gi), str, startIndex, endIndex, res;
		while(startIndex != -1) {
			str = $scope.parseToken(logic, startIndex, '(', ')');
			endIndex = startIndex + str.length;
			startIndex = logic.indexOf('REGEX', startIndex + "REGEX".length);
			//check after REGEX sentence if '=' is available or not
			if(endIndex <= logic.length) {
				// fetch next 10 character after REXEX sentence
				res = logic.substr(endIndex, 10);
				res = res.trim();
				if(res.indexOf("=") == 0){
					return {'result': true, 'index': endIndex};
				}
			}
		}
		return {'result': false, 'index': 0};
	};
	// Function to check if logic contains repeated attributes in a statement
	$scope.checkRepeatedAttributes = function(statement, lengthCovered, statementLength) {
		var matchString = statement.match(/\{([^}]+)\}/g);
		if (!matchString) {
			return true;
		}
		var foundAttrs = {};
		for (var i = 0; i < matchString.length; i++) {
			var attrToCheck = tempAttrs[matchString[i].replace(/\{|\}/g, '')];
			if (foundAttrs.hasOwnProperty(attrToCheck)) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_repeated_attribute', attrToCheck);
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength + 1);
				return;
			} else {
				foundAttrs[attrToCheck] = true;
			}
		}
		return true;
	};

	// Function to check if a function used in logic is valid or not
	//
	// Validations:
	//   i. Check if there is something inside a function
	//   ii. Check if there is just an attribute inside a function
	//   iii. Check if there is a need of typecasting in case of conversion functions(CONERTTOINT and CONVERTTOSTRING)
	//   iv. Check if function used is supported or not
	
	$scope.checkFunctions = function(statement) {
		$scope.info.convertedAttributes = [];
		for(var i=0 ; i<$scope.info.functions.length; i++){
			if(statement.includes($scope.info.functions[i].label)){
				if(!checkForBracketClosing(statement, $scope.info.functions[i])){
					//error
					msg = GlobalService.getRulesLogicAlerts('rule_logic_error');
					var tempStr = getOriginal(statement).replace(/^\s+|\s+$/g, "");
					var startPos = $scope.info.logic.indexOf(tempStr);
					var endPos = startPos + tempStr.length;
					displayLogicAlert(msg, startPos, endPos);
					return;
				}
			}
		}
		var regex = /\s*[^\s]+\(\s*\{?[^\}]*\}?\s*\)/g;
		var regExForTIMEDIFF = /\s*[^\s]+\(\s*\{?[^\}]*\}?\s*[,]\s*\{?[^\}]*\}?\s*\)/g;
		var matchString = "";
		var aggregateRegExStm = /(sum|min|max|avg)_\d/gm;
		var aggregateRegExCountStm = /(count)_\d/gm;
		if(statement.indexOf('TIMEDIFF') != -1){
			matchString = statement.match(regExForTIMEDIFF);
			//if(!matchString){
				var timediffFunctionWithParam = /\s*TIMEDIFF\s*[(]\s*{regex_\d}\s*,\s*{regex_\d}\s*[)]\s*/;
				var timediffFunctionReturnedAndComparatorOperator = /\s*TIMEDIFF\s*[(]\s*{regex_\d}\s*,\s*{regex_\d}\s*[)]\s*(>|>=|<|<=|<>|=)\s*/;
				var timediffFunctionReturnedAndComparatorOperatorWithNumber = /\s*TIMEDIFF\s*[(]\s*{regex_\d}\s*,\s*{regex_\d}\s*[)]\s*(>|>=|<|<=|<>|=)\s*{number_\d}\s*/;
				var msg = "";
				//check TIMEDIFF syntax TIMEDIFF(RegEx_1, RegEx_2)
				if(!timediffFunctionWithParam.test(statement)){
					msg = GlobalService.getRulesLogicAlerts('rule_logic_file_scope_for_TIMEDIFF_parameter_error', funcName);
				}
				//check TIMEDIFF syntax TIMEDIFF(RegEx_1, RegEx_2) {comparision operator} 
				else if(!timediffFunctionReturnedAndComparatorOperator.test(statement)){
					msg = GlobalService.getRulesLogicAlerts('rule_logic_file_scope_for_TIMEDIFF_returned_value_should_compare_using_comparision_operator', funcName);
				}
				//check TIMEDIFF syntax TIMEDIFF(RegEx_1, RegEx_2) {comparision operator} number_1
				else if(!timediffFunctionReturnedAndComparatorOperatorWithNumber.test(statement)){
					msg = GlobalService.getRulesLogicAlerts('rule_logic_file_scope_for_TIMEDIFF_returned_value_should_compare_wiht_number', funcName);
				}
				if(msg){
					var startPos = $scope.info.logic.indexOf('TIMEDIFF');
					var endPos = startPos + statement.length;
					displayLogicAlert(msg, startPos, endPos);
					return;
				}
				return true;
			//}
		}else{
			matchString = statement.match(regex);
		}
		if (matchString) {
			var keys = Object.keys(tempAttrs);
			for ( i = 0; i < matchString.length; i++) {
				var stringFound = false;
				for (var j = 0; j < keys.length; j++) {
					if (keys[j].indexOf(matchString[i]) > -1) {
						stringFound = true;
						break;
					}
				}
				if (stringFound) {
					continue;
				}
				if ((matchString[i].match(/\{/g) || []).length != (matchString[i].match(/\}/g) || []).length) {
					continue;
				}
				if ((matchString[i].match(/\(/g) || []).length != (matchString[i].match(/\)/g) || []).length) {
					continue;
				}
				var funcName = matchString[i].split("(")[0].replace(/^\s+|\s+$/g, '');
				var attributeInFunction = matchString[i].substring(matchString[i].indexOf('(') + 1, matchString[i].lastIndexOf(')'));
				if (/^\s*$/.test(attributeInFunction)) {
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_function_without_params');
					var startPos = $scope.info.logic.indexOf(matchString[i]);
					var endPos = startPos + matchString[i].length;
					displayLogicAlert(msg, startPos, endPos);
					return;
				}
				if (!/^\s*\{[^\}]+\}\s*$/.test(attributeInFunction)) {
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_function_without_attr');
					var tempStr = getOriginal(matchString[i]);
					var startPos = $scope.info.logic.indexOf(tempStr);
					var endPos = startPos + tempStr.length;
					displayLogicAlert(msg, startPos, endPos);
					return;
				}
				var functionFound = false;
				for (var j in $scope.info.functions) {
					if ($scope.info.functions[j].label == funcName) {
						functionFound = true;
						var attributeMatched = tempAttrs[matchString[i].split(/\{|\}/)[1]];
						if(funcName != 'CONVERTTOINT' && funcName != 'TIMEDIFF' && matchString[i].indexOf('regex_') != -1) {
							var msg = GlobalService.getRulesLogicAlerts('rule_logic_regex_func_invalid', funcName);
							var tempStr = getOriginal(matchString[i]).replace(/^\s+|\s+$/g, "");
							var startPos = $scope.info.logic.indexOf(tempStr);
							var endPos = startPos + tempStr.length;
							displayLogicAlert(msg, startPos, endPos);
							return;
						}
						if (funcName == 'CONVERTTOINT') {
							if ($scope.sectionsColumnLabelMap[attributeMatched][2] == $scope.info.columnDataTypes['String']) {
								$scope.info.convertedAttributes.push({
									value : attributeMatched,
									type : $scope.sectionsColumnLabelMap[attributeMatched][2]
								});
								$scope.changeColumnType(attributeMatched, $scope.info.columnDataTypes['Integer']);
							} else {
								var msg = GlobalService.getRulesLogicAlerts('rule_logic_no_typecasting', attributeMatched);
								var tempStr = getOriginal(matchString[i]).replace(/^\s+|\s+$/g, "");
								var startPos = $scope.info.logic.indexOf(tempStr);
								var endPos = startPos + tempStr.length;
								displayLogicAlert(msg, startPos, endPos);
								return;
							}
						} else if (funcName == 'CONVERTTOSTRING') {
							if ($scope.sectionsColumnLabelMap[attributeMatched][2] != $scope.info.columnDataTypes['String']) {
								$scope.info.convertedAttributes.push({
									value : attributeMatched,
									type : $scope.sectionsColumnLabelMap[attributeMatched][2]
								});
								$scope.changeColumnType(attributeMatched, $scope.info.columnDataTypes['String']);
							} else {
								var msg = GlobalService.getRulesLogicAlerts('rule_logic_no_typecasting', attributeMatched);
								var tempStr = getOriginal(matchString[i]).replace(/^\s+|\s+$/g, "");
								var startPos = $scope.info.logic.indexOf(tempStr);
								var endPos = startPos + tempStr.length;
								displayLogicAlert(msg, startPos, endPos);
								return;
							}
						} else if (funcName == 'VERSION') {	
						}else if (funcName == 'TIMEDIFF') {
						}
						break;
					}
				}
				if (!functionFound) {
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_function', funcName);
					var tempStr = getOriginal(matchString[i]).replace(/^\s+|\s+$/g, "");
					var startPos = $scope.info.logic.indexOf(tempStr);
					var endPos = startPos + tempStr.length;
					displayLogicAlert(msg, startPos, endPos);
					return;
				}
			}
		}
		//validate SUM. MIN, MAX and AVG
		// it should have attribute of type integer
		// it should have only one attribute {...}
		var matchAggregateFunction = statement.match(aggregateRegExStm);
		if(matchAggregateFunction && matchAggregateFunction.length){
			var keys = Object.keys(tempAttrs);
			var encriptedFunctionName = matchAggregateFunction[0].replace(/{|}/gm, "");
			var actualAggregateFunctionStr = tempAttrs[encriptedFunctionName];
			if(/{\s*([^}]+?)\s*}.*{\s*([^}]+?)\s*}/gm.test(actualAggregateFunctionStr)){				
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_aggregate_function', actualAggregateFunctionStr);
				var startPos = $scope.info.logic.indexOf(actualAggregateFunctionStr);
				var endPos = startPos + actualAggregateFunctionStr.length;
				displayLogicAlert(msg, startPos, endPos);
				return;
			}
			// Check if aggregate function have valid expression or not
			if(/(SUM|MIN|MAX|AVG)\s*\(\s*{\s*.+\s*}\s*\)/g.test(actualAggregateFunctionStr)){
				var currentAttrname = actualAggregateFunctionStr.match(/{\s*.+\s*}/gm);
				if(currentAttrname && currentAttrname[0]){
					currentAttrname = currentAttrname[0].replace(/\s*{\s*|\s*}\s*/g,"");
					if($scope.sectionsColumnLabelMap[currentAttrname] && $scope.sectionsColumnLabelMap[currentAttrname][2] == $scope.info.columnDataTypes['String']){
						var msg = GlobalService.getRulesLogicAlerts('rule_logic_aggregate_not_numeric_attr', actualAggregateFunctionStr);
						var startPos = $scope.info.logic.indexOf(actualAggregateFunctionStr);
						var endPos = startPos + actualAggregateFunctionStr.length;
						displayLogicAlert(msg, startPos, endPos);
						return;
					}else if(!$scope.sectionsColumnLabelMap[currentAttrname]){
						return false;
					}
				}
			}else{
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_aggregate_function', actualAggregateFunctionStr);
				var startPos = $scope.info.logic.indexOf(actualAggregateFunctionStr);
				var endPos = startPos + actualAggregateFunctionStr.length;
				displayLogicAlert(msg, startPos, endPos);
				return;
			}
		}
		//CHECK FOR nested COUNT FUNCTION 
		
		var matchAggregateFunction = statement.match(aggregateRegExCountStm);		
		if(matchAggregateFunction && matchAggregateFunction.length){
			var encriptedFunctionName = matchAggregateFunction[0].replace(/{|}/gm, "");
			var actualAggregateFunctionStr = tempAttrs[encriptedFunctionName];
			var countStartIndex = actualAggregateFunctionStr.indexOf("(");
			var countEndIndex = $scope.findClosingBracketMatchIndex(actualAggregateFunctionStr, countStartIndex);
			var bodyOfCount = actualAggregateFunctionStr.substring(countStartIndex, countEndIndex);
			// check if it have nested count or any other aggregate function
			if(/\s+COUNT|MIN|MAX|AVG|SUM\s*\(/gm.test(bodyOfCount)){
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_nexted_aggregate_function');
				var startPos = countStartIndex;
				var endPos = startPos + bodyOfCount.length;
				displayLogicAlert(msg, startPos, endPos);
				return;
			}
		}
		return true;
	};
	$scope.findClosingBracketMatchIndex = function(str, pos) {
		if (str[pos] != '(') {
		  throw new Error("No '(' at index " + pos);
		}
		var depth = 1;
		for (var i = pos + 1; i < str.length; i++) {
		  switch (str[i]) {
		  case '(':
			depth++;
			break;
		  case ')':
			if (--depth == 0) {
			  return i;
			}
			break;
		  }
		}
		return -1;    // No matching closing parenthesis
	  }
	// Function to change the data type of a column
	$scope.changeColumnType = function(attribute, type) {
		$scope.sectionsColumnLabelMap[attribute][2] = type;
	};

	// Function to remove brackets from statement
	$scope.removeBrackets = function(statement) {
		var i = 0,
		    startPos = null,
		    endPos = null,
		    insideAttribute = false;
		while (i < statement.length) {
			if (statement[i] == '{') {
				insideAttribute = true;
				i++;
				continue;
			}
			if (statement[i] == '}') {
				insideAttribute = false;
				i++;
				continue;
			}
			if (insideAttribute) {
				i++;
				continue;
			}
			if (statement[i] == '(' || statement[i] == ')') {
				statement = statement.slice(0, i) + statement.slice(i + 1);
				i--;
			}
			i++;
		}
		return statement;
	};

	// Function to validate inline functions in rule(LIKE and NOT LIKE)
	//
	// Validations:
	//   i. Test if left operand is an attribute
	//   ii. Test if there is something after the inline function
	//   iii. Test if left attribute is of string type
	//   iv. Test if right operand of inline function is a pattern string

	$scope.checkInlineFunction = function(statement, operator, operatorPosition, lengthCovered, statementLength, funcName) {
		if(funcName == 'VERSION'){
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_version_invalid_operation', operator);
			displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
			return;
		}
		var leftOperand = statement.substring(0, operatorPosition - 1).replace(/^\s+|\s+$/g, '');
		if (!/^\{[^\}]+\}$/.test(leftOperand)) {
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_left_attribute', operator);
			displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
			return;
		}
		var rightOperand = statement.substr(operatorPosition + operator.length).replace(/^\s+|\s+$/g, '');
		if (/^\s*$/.test(rightOperand)) {
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_right_value_required', operator);
			displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
			return;
		}
		leftOperand = getOriginal(leftOperand).replace(/\s+$/g, '').replace(/^\{|\}$/g, '');
		rightOperand = getOriginal(rightOperand).replace(/\s+$/g, '').replace(/^\{|\}$/g, '');		
		if ($scope.sectionsColumnLabelMap[leftOperand][2] == $scope.info.columnDataTypes['String']) {
			if (!/^\'\%[^\'|\%]*\%\'$|^\'[^\'|\%]*\%\'$|^\'\%[^\'|\%]*\'$/.test(rightOperand)) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_right_pattern_required', operator);
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				return;
			}
		} else {
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_string_operator', operator);
			displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
			return;
		}
		return true;
	};

	$scope.checkEqualNullFunction = function(statement, operator, operatorPosition, lengthCovered, statementLength,funcName) {
		var leftOperand = statement.substring(0, operatorPosition - 1).replace(/^\s+|\s+$/g, '');		
		leftOperand = getOriginal(leftOperand).replace(/\s+$/g, '').replace(/^\{|\}$/g, '');
		if(funcName == 'VERSION'){
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_version_invalid_operation', operator);
			displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
			return;
		}		
		if ($scope.sectionsColumnLabelMap[leftOperand][2] != $scope.info.columnDataTypes['String']) {		
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_string_operator', operator);
			displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
			return;
		}
		return true;
	};
	// Function to check if left and right operands of an arithmetic operator(+, -, *, /) are numeric
	$scope.checkArithmeticOperators = function(statement, operator, operatorPosition, lengthCovered, statementLength) {
		var leftStatement = statement.substring(0, operatorPosition);
		var rightStatement = statement.substr(operatorPosition + operator.length);
		var leftOpAttribute = false,
		    rightOpAttribute = false;
		if (/\{[^\}]+\}\s*$/.test(leftStatement)) {
			var leftOperand = tempAttrs[leftStatement.match(/\{[^\}]+\}\s*$/)[0].replace(/\s+$/g, '').replace(/^\{|\}$/g, '')];
			leftOpAttribute = true;
		} else {
			var leftOperand = leftStatement.match(/[^\s]+\s*$/) ? leftStatement.match(/[^\s]+\s*$/)[0].replace(/\s+$/g, '') : '';
			leftOpAttribute = false;
		}
		if (/^\s*\{[^\}]+\}/.test(rightStatement)) {
			var rightOperand = tempAttrs[rightStatement.match(/^\s*\{[^\}]+\}/)[0].replace(/^\s+/g, '').replace(/^\{|\}$/g, '')];
			rightOpAttribute = true;
		} else {
			var rightOperand = rightStatement.match(/^\s*[^\s]+/) ? rightStatement.match(/^\s*[^\s]+/)[0].replace(/^\s+/g, '') : '';
			rightOpAttribute = false;
		}

		leftOperand = getOriginal(leftOperand);
		rightOperand = getOriginal(rightOperand);

		if (operator == '/' && /^0(\.0+)?$/.test(rightOperand)) {
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_division_zero');
			displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
			return;
		}
		if (leftOpAttribute) {
			if ($scope.sectionsColumnLabelMap[leftOperand][2] == $scope.info.columnDataTypes['String']) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_numeric_attr', leftOperand);
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				return;
			}
		} else {
			if (!/^\d+(\.\d+)?$/.test(leftOperand)) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_number', leftOperand);
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				return;
			}
		}
		if (rightOpAttribute) {
			if ($scope.sectionsColumnLabelMap[rightOperand][2] == $scope.info.columnDataTypes['String']) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_numeric_attr', rightOperand);
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				return;
			}
		} else {
			if (/^\s*$/.test(rightOperand)) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_right_value_required', operator);
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				return;
			}
			if (!/^\d+(\.\d+)?$/.test(rightOperand)) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_number', rightOperand);
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				return;
			}
		}
		return true;
	};

	// Check the left and right operands of an equal comparison operator(= and <>) if both are string or number
	$scope.checkEqualComparisonOperators = function(statement, operator, operatorPosition, lengthCovered, statementLength,funcName) {
		var leftStatement = statement.substring(0, operatorPosition);
		var rightStatement = statement.substr(operatorPosition + operator.length);
		var leftStatementNumberMatches = leftStatement.replace(/\{[^\}]+\}/g, '{}').replace(/\[[^\]]+\]/g, '[]').match(/\s+\d+(\.\d+)?\s+/g);
		var rightStatementNumberMatches = rightStatement.replace(/\{[^\}]+\}/g, '{}').replace(/\[[^\]]+\]/g, '[]').match(/\s+\d+(\.\d+)?\s+/g);
		if ((leftStatementNumberMatches && leftStatementNumberMatches.length > 1) || (rightStatementNumberMatches && rightStatementNumberMatches.length > 1)) {
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_numrals_exceeded');
			displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
			return;
		}
		var leftOpAttribute = false,
		    rightOpAttribute = false;
		if (/\{[^\}]+\}\s*$/.test(leftStatement)) {
			var leftOperand = tempAttrs[leftStatement.match(/\{[^\}]+\}\s*$/)[0].replace(/\s+$/g, '').replace(/^\{|\}$/g, '')];
			leftOpAttribute = true;
		} else {
			var leftOperand = leftStatement.match(/[^\s]+\s*$/) ? leftStatement.match(/[^\s]+\s*$/)[0].replace(/\s+$/g, '') : '';
			leftOpAttribute = false;
		}
		if (/^\s*\{[^\}]+\}/.test(rightStatement)) {
			var rightOperand = tempAttrs[rightStatement.match(/^\s*\{[^\}]+\}/)[0].replace(/^\s+/g, '').replace(/^\{|\}$/g, '')];
			rightOpAttribute = true;
		} else {
			var rightOperand = rightStatement.match(/^\s*[^\s]+/) ? rightStatement.match(/^\s*[^\s]+/)[0].replace(/^\s+/g, '') : '';
			rightOpAttribute = false;
		}

		leftOperand = getOriginal(leftOperand);
		rightOperand = getOriginal(rightOperand);
		var versioinRegEx = new RegExp(/^'%[0-9.]+%'$/);

		if (leftOpAttribute) {
			if(funcName && funcName == 'VERSION'){
				if ($scope.sectionsColumnLabelMap[leftOperand][2] != $scope.info.columnDataTypes['String']) {
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_string_attr', leftOperand);
					displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
					return;
				}
				if (!versioinRegEx.test(rightOperand)) {
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_version_string', operator);
					displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
					return;
				}

			}else if ($scope.sectionsColumnLabelMap[leftOperand][2] == $scope.info.columnDataTypes['String']) {
				if (rightOpAttribute) {
					if ($scope.sectionsColumnLabelMap[rightOperand][2] != $scope.info.columnDataTypes['String']) {
						var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_string_attr', leftOperand);
						displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
						return;
					}
				} else {
					if (!/^\"[^\"]*\"$/.test(rightOperand)) {
						var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_string', rightOperand);
						displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
						return;
					}
				}
			} else {
				if (rightOpAttribute) {
					if ($scope.sectionsColumnLabelMap[rightOperand][2] == $scope.info.columnDataTypes['String']) {
						var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_numeric_attr', rightOperand);
						displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
						return;
					}
				} else {
					if (!/^\d+(\.\d+)?$/.test(rightOperand)) {
						var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_number', rightOperand);
						displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
						return;
					}
				}
			}
		} else {
			if (!/^\d+(\.\d+)?$/.test(leftOperand)) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_number', leftOperand);
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				return;
			}
			if (rightOpAttribute) {
				if ($scope.sectionsColumnLabelMap[rightOperand][2] == $scope.info.columnDataTypes['String']) {
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_numeric_attr', rightOperand);
					displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
					return;
				}
			} else {
				if (!/^\d+(\.\d+)?$/.test(rightOperand)) {
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_string', rightOperand);
					displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
					return;
				}
			}
		}
		return true;
	};

	// Function to check the left and right hand operands of a comparison operator(<, >, <=, >=)
	$scope.checkComparisonOperators = function(statement, operator, operatorPosition, lengthCovered, statementLength, funcName) {
		var leftStatement = statement.substring(0, operatorPosition);
		var rightStatement = statement.substr(operatorPosition + operator.length);
		var leftStatementNumberMatches = leftStatement.replace(/\{[^\}]+\}/g, '{}').replace(/\[[^\]]+\]/g, '[]').match(/\s+\d+(\.\d+)?\s+/g);
		var rightStatementNumberMatches = rightStatement.replace(/\{[^\}]+\}/g, '{}').replace(/\[[^\]]+\]/g, '[]').match(/\s+\d+(\.\d+)?\s+/g);
		if ((leftStatementNumberMatches && leftStatementNumberMatches.length > 1) || (rightStatementNumberMatches && rightStatementNumberMatches.length > 1)) {
			var msg = GlobalService.getRulesLogicAlerts('rule_logic_numrals_exceeded');
			displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
			return;
		}
		var leftOpAttribute = false,
		    rightOpAttribute = false;
		if (/\{[^\}]+\}\s*$/.test(leftStatement)) {
			var leftOperand = tempAttrs[leftStatement.match(/\{[^\}]+\}\s*$/)[0].replace(/\s+$/g, '').replace(/^\{|\}$/g, '')];
			leftOpAttribute = true;
		} else {
			var leftOperand = leftStatement.match(/[^\s]+\s*$/) ? leftStatement.match(/[^\s]+\s*$/)[0].replace(/\s+$/g, '') : '';
			leftOpAttribute = false;
		}
		if (/^\s*\{[^\}]+\}/.test(rightStatement)) {
			var rightOperand = tempAttrs[rightStatement.match(/^\s*\{[^\}]+\}/)[0].replace(/^\s+/g, '').replace(/^\{|\}$/g, '')];
			rightOpAttribute = true;
		} else {
			var rightOperand = rightStatement.match(/^\s*[^\s]+/) ? rightStatement.match(/^\s*[^\s]+/)[0].replace(/^\s+/g, '') : '';
			rightOpAttribute = false;
		}

		leftOperand = getOriginal(leftOperand);
		rightOperand = getOriginal(rightOperand);
		var versioinRegEx = new RegExp(/^'%[0-9.]+%'$/);
		if (leftOpAttribute) {
			if(funcName && funcName == 'VERSION' ){
				if ($scope.sectionsColumnLabelMap[leftOperand][2] != $scope.info.columnDataTypes['String']) {
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_string_attr', leftOperand);
					displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
					return;
				}
			}else if ($scope.sectionsColumnLabelMap[leftOperand][2] == $scope.info.columnDataTypes['String']) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_numeric_attr', leftOperand);
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				return;
			}
		} else {
			if (!versioinRegEx.test(leftOperand)) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_number', leftOperand);
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				return;
			}
		}
		if (rightOpAttribute) {
			if(funcName && funcName == 'VERSION' ){	
				if (!versioinRegEx.test(rightOperand)) {
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_version_string', operator);
					displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
					return;
				}

			}else if ($scope.sectionsColumnLabelMap[rightOperand][2] == $scope.info.columnDataTypes['String']) {
				var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_numeric_attr', rightOperand);
				displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
				return;
			}
		} else {
			if(funcName && funcName == 'VERSION'){	
				if (!versioinRegEx.test(rightOperand)) {
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_version_string', operator);
					displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
					return;
				}

			}else{
				if (/^\s*$/.test(rightOperand)) {
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_right_value_required', operator);
					displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
					return;
				}
				if (!/^\d+(\.\d+)?$/.test(rightOperand)) {
					var msg = GlobalService.getRulesLogicAlerts('rule_logic_not_number', rightOperand);
					displayLogicAlert(msg, lengthCovered, lengthCovered + statementLength);
					return;
				}
			}
		}
		return true;
	};

	// Function to check whether each section-column pair entered in Label is valid or not
	$scope.deepValidation = function(str,rule_label_invalid_attr,rule_label_local_attr) {		
		var secColPairs = [],
			jsonAsString = "";
		jsonAsString = angular.copy(str);
		//if empty return empty array
		//allow empty value
		if(jsonAsString == "" || jsonAsString == null){
			return [];
		}
		//if it is not empty and have some string
		if(jsonAsString.length && jsonAsString.length > 0){
			//fetch substring within '{' and '}'
			var justificationRegExMatchList = $scope.getJSONFromSting(jsonAsString);
			if(justificationRegExMatchList){
				//check if it is JSON or not
				try{
					justificationRegExMatchList = justificationRegExMatchList.replace(/,\s+/gm, ",");
					JSON.parse(justificationRegExMatchList);
					var justificationJSONString = $scope.getJSONFromSting(jsonAsString);
					secColPairs = $scope.getSectionColumnsPairFromString(justificationJSONString,rule_label_invalid_attr, rule_label_local_attr);
					return secColPairs;
				}catch(e){
					// if it has no JSON like string but have {section.att} like string
					// check for validation for section:attribute pair
					var secColPairs = $scope.getSectionAttributeLabelMap(jsonAsString,rule_label_invalid_attr, rule_label_local_attr);
					if(!Array.isArray(secColPairs)){
						return;
					}
				}
			}else{
				//there no character within '{' and '}' then
				// return empty list
				return []
			}
		}
		return secColPairs;
	};

	// Function to check whether each section-column pair entered in Logic is valid or not
	$scope.validateLogicMap = function(){
		var secColPairs = [],
		    startPos = null,
		    endPos = null,
		    msg = '';

		if (!$scope.info.logic.length)
			return secColPairs;

		for (var i = 0; i < $scope.info.logic.length; i++) {
			// Check if {{ or }} exists in string
			if (($scope.info.logic[i] == '{' && startPos) || ($scope.info.logic[i] == '}' && !startPos) || (i == $scope.info.logic.length - 1 && startPos && $scope.info.logic[i] != '}') || (i == $scope.info.logic.length - 1 && $scope.info.logic[i] == '{')) {
				msg = GlobalService.getRulesLogicAlerts('rule_logic_error');
				displayLogicAlert(msg, startPos, i + 1);
				return;
			}
			if ($scope.info.logic[i] == '{') {
				startPos = i + 1;
			}
			if ($scope.info.logic[i] == '}' && startPos) {
				endPos = i;
				var tmpString = $scope.info.logic.substring(startPos, endPos);
				if (!$scope.sectionsColumnLabelMap.hasOwnProperty(tmpString)) {
					//check if it is a part of REGEX i.e REGEX(...\d{2}..)
					if($scope.isPartOfRegex(startPos)){
						msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_regex_len_attr', tmpString);
					}else if($scope.isPartOfLikeoperator(startPos)){
						msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_like_curly_brace', tmpString);
					}else{
						msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_attr', tmpString);
					}		
					if(msg){
						displayLogicAlert(msg, startPos, endPos);
						return;
					}
				}
				secColPairs.push(tmpString);
				startPos = null;
			}
		}
		return secColPairs;
	};
	//get REGEX start index and end index
	$scope.isBracePartOfLikeoperator = function(curlyBraceIndex) {
		var logic = $scope.info.logic, regexToken="", searchEndIndex=0;
		var searchIndex = logic.indexOf('LIKE');
		if( searchIndex== -1) {
			return false;
		};
		while(searchIndex >= 0){
			//get complete like operator 
			regexToken = $scope.parseToken(logic,searchIndex, '(', ')');
			searchEndIndex = regexToken.length + searchIndex;
			//check if curlyBraceIndex is within LIKE statment or not
			if((curlyBraceIndex > searchIndex) && (curlyBraceIndex < searchEndIndex)){
				return true;
			}
			searchIndex = logic.indexOf('LIKE', searchEndIndex);
			if( searchIndex== -1) {
				return false;
			};
		};
		return false;
	};
	$scope.isPartOfLikeoperator = function(curlyBraceIndex) {
		var logic = $scope.info.logic, regexToken="", searchEndIndex=0;
		var searchIndex = logic.indexOf('LIKE');
		if( searchIndex== -1) {
			return false;
		};
		while(searchIndex >= 0){
			//get complete like operator 
			regexToken = $scope.parseToken(logic,searchIndex, '{', '}');
			searchEndIndex = regexToken.length + searchIndex;
			//check if curlyBraceIndex is within LIKE statment or not
			if((curlyBraceIndex > searchIndex) && (curlyBraceIndex < searchEndIndex)){
				return true;
			}
			searchIndex = logic.indexOf('LIKE', searchEndIndex);
			if( searchIndex== -1) {
				return false;
			};
		};
		return false;
	};
	//get REGEX start index and end index
	$scope.isPartOfRegex = function(curlyBraceIndex) {
		var logic = $scope.info.logic, regexToken="", searchEndIndex=0;
		var searchIndex = logic.indexOf('REGEX');
		if( searchIndex== -1) {
			return false;
		};
		while(searchIndex >= 0){
			//get complete regex 
			regexToken = $scope.parseToken(logic,searchIndex, '(', ')');
			var secondParam = regexToken.match(/".*"/gm);
			secondParamLen = 0;
			if(secondParam && secondParam[0]){
				secondParam = secondParam[0];
				searchIndex = logic.indexOf(secondParam);
				secondParamLen = secondParam.length;
				searchEndIndex = secondParamLen + searchIndex;
				//check if curlyBraceIndex is within REGEX statment or not
				if((curlyBraceIndex > searchIndex) && (curlyBraceIndex < searchEndIndex)){
					return true;
				}
				searchIndex = logic.indexOf('REGEX', searchEndIndex);
				if( searchIndex== -1) {
					return false;
				};
			}
		}
		return false;
	};
	$scope.parseToken = function(msg, startIndex,targetStartChar,targetEndChar) {
		var len = msg.length, curlyBrace=0, sIndex=0, endIndex=0;
		//search sould start from first brace
		sIndex = msg.indexOf('(', startIndex);
		for(var index=sIndex;index<len;index++) {
			switch (msg[index]){
				case targetStartChar:
					curlyBrace++;
					break;
				case targetEndChar:
					curlyBrace--;
					break;
			}
			if(curlyBrace == 0){
				endIndex = index;
				break;
			}
		}
		var res = msg.substring(startIndex, (endIndex+1));
		return res;
	};
	
	$scope.validateAPITemplateMap =  function() {
		var secColPairs = [],
		    startPos = null,
		    endPos = null;
		for (var i = 0; i < $scope.info.text.length; i++) {
			// Check if {{ or }} exists in string
			if (($scope.info.text[i] == '{' && startPos) || ($scope.info.text[i] == '}' && !startPos) || (i == $scope.info.text.length - 1 && startPos && $scope.info.text[i] != '}') || (i == $scope.info.text.length - 1 && $scope.info.text[i] == '{')) {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['rule_text_error']
				});
				return;
			}
			if ($scope.info.text[i] == '{') {
				startPos = i + 1;
			}
			if ($scope.info.text[i] == '}' && startPos) {
				endPos = i;
				var tmpString = $scope.info.text.substring(startPos, endPos);
				if (!$scope.sectionsColumnLabelMap.hasOwnProperty(tmpString)) {
					ModalService.alertBox({
						msg : GlobalService.getVal('rulesMsgs')['rule_text_invalid_attr'][0] + tmpString + GlobalService.getVal('rulesMsgs')['rule_text_invalid_attr'][1]
					});
					return;
				}
				// if ($scope.info.scope != 'Table' && $scope.sectionsColumnLabelMap[tmpString][5] != 'G') {
				// 	ModalService.alertBox({
				// 		msg : GlobalService.getVal('rulesMsgs')['rule_text_local_attr'][0] + tmpString + GlobalService.getVal('rulesMsgs')['rule_text_local_attr'][1]
				// 	});
				// 	return;
				// }
				secColPairs.push(tmpString);
				startPos = null;
			}
		}
		return secColPairs;
	};
	// Function to set the value of hidden logic
	$scope.setHiddenLogic = function(logicPairs) {
		$scope.info.logic = $scope.info.logic.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
		$scope.info.hiddenLogic = $scope.info.logic;
		for (var i in logicPairs) {
			var tempStr = logicPairs[i];
			var tempReplaceStr = $scope.sectionsColumnLabelMap[logicPairs[i]][0];
			$scope.info.hiddenLogic = $scope.info.hiddenLogic.replace(tempStr, tempReplaceStr);
		}
		var wildCardCharacters = GlobalService.getVal('rulesLogicAlerts')['rule_logic_wildCardCharacters']
		for(var i=0;i<wildCardCharacters.length;i++){			
			var targetIndex = $scope.info.hiddenLogic.indexOf(('\\'+wildCardCharacters[i]));
			while( targetIndex != -1){
				var regexStmtEndIndex = $scope.isSlashXPartOfRegex($scope.info.hiddenLogic,targetIndex);
				if( regexStmtEndIndex == 0){
					$scope.info.hiddenLogic = $scope.replaceAt($scope.info.hiddenLogic, targetIndex, ('\\\\'+wildCardCharacters[i]));
				}
				targetIndex = $scope.info.hiddenLogic.indexOf(('\\'+wildCardCharacters[i]), targetIndex + 4);
			}
		}
	};
	$scope.isSlashXPartOfRegex = function(text, targetIndex){
    	var matched,res,str,stashUmatch,endIndex,startIndex=0;
		text = angular.copy(text);
		text = text.toLowerCase();
    	res = text.indexOf('regex',startIndex);
    	startIndex = res;
    	if(res != -1){
	    	str = $scope.parseToken(text, startIndex, '(', ')');
	    	endIndex = startIndex + str.length;
	    	if(targetIndex > startIndex && targetIndex < endIndex){
	    		return endIndex;
	    	}
    	};
    	return 0;
	};
	$scope.replaceAt = function(text, index, replacement) {
	    return text.substr(0, index) + replacement+ text.substr(index + replacement.length);
	}
	// Function to set the value of hidden text
	$scope.setHiddenText = function(textPairs) {
		$scope.info.hiddenText = $scope.info.text;
		for (var i in textPairs) {
			var tempStr = textPairs[i];
			var tempReplaceStr = "rule." + $scope.sectionsColumnLabelMap[textPairs[i]][0];
			$scope.info.hiddenText = $scope.info.hiddenText.replace(tempStr, tempReplaceStr);
		}
	};

	// Function to set the value of hidden label
	$scope.setHiddenLabel = function(labelPairs) {
		$scope.info.hiddenLabel = $scope.info.label;
		for (var i in labelPairs) {
			var tempStr = labelPairs[i];
			var tempReplaceStr = "rule." + $scope.sectionsColumnLabelMap[labelPairs[i]][0];
			$scope.info.hiddenLabel = $scope.info.hiddenLabel.replace(tempStr, tempReplaceStr);
		}
	};
	// Function to set the value of hidden Justification
	$scope.setHiddenJustification = function(justificationPairs) {
		$scope.info.hiddenJustification = $scope.info.alert_justification;
		for (var i in justificationPairs) {
			var tempStr = justificationPairs[i];
			var tempParsedVal = $scope.sectionsColumnLabelMap[justificationPairs[i]];
			if(tempParsedVal && tempParsedVal[0]){				
				var tempReplaceStr = "rule." + tempParsedVal[0];
				$scope.info.hiddenJustification = $scope.info.hiddenJustification.replace(tempStr, tempReplaceStr);
			}
		}
	};

	// Function to set the value of hidden Reommendation
	$scope.setHiddenRecommendation = function(recommendationPairs) {
		$scope.info.hiddenRecommendation = $scope.info.recommendation;
		for (var i in recommendationPairs) {
			var tempStr = recommendationPairs[i];
			var tempReplaceStr = "rule." + $scope.sectionsColumnLabelMap[recommendationPairs[i]][0];
			$scope.info.hiddenRecommendation = $scope.info.hiddenRecommendation.replace(tempStr, tempReplaceStr);
		}
	};

	
	// Function to expand/collapse a section
	$scope.expandSection = function(section) {
		if(section.foundAttr && section.foundAttr.length > 0){
			if (!!section.expanded) {
				$scope.getSectionColumns(section);
			}
			return;
		}
		if (!!section.expanded && !section.hasOwnProperty('hasData')) {
			$scope.getSectionColumns(section);
		}
	};

	// Function to update the lastElementFocused variable on change of element focus
	$scope.focusElement = function(element) {
		$scope.info.lastElementFocused = element;
	};

	// Function to handle double click on attributes/operators/columns
	$scope.addLogicText = function(data) {
		if ($scope.info.lastElementFocused == 'logic') {
			$scope.onDropLogic(data);
		} else if ($scope.info.lastElementFocused == 'text') {
			$scope.onDropText(data);
		} else if ($scope.info.lastElementFocused == 'label') {
			$scope.onDropLabel(data);
		}
		else if ($scope.info.lastElementFocused == 'alert_justification') {
			$scope.onDropJustification(data);
		}
		else if ($scope.info.lastElementFocused == 'recommendation') {
			$scope.onDropRecommendation(data);
		} else {
			ModalService.alertBox({
				msg : 'Place the cursor  on Label, Recommendation, Justification, Logic or Text'
			});
			return;
		}
	};

	// Function to call when some value is dropped on logic box
	$scope.onDropLogic = function(data, evt) {
		var position = angular.element(document.getElementById('inputLogic')).prop("selectionStart"),
		    newPos;
		if (data[1].type == 'operator' || data[1].type == 'function') {
			$scope.info.logic = [$scope.info.logic.substring(0, position), data[1].text, $scope.info.logic.substring(position)].join('');
			newPos = position + data[1].positionInc;
		} else {
			$scope.info.logic = [$scope.info.logic.substring(0, position), " {", data[0], ".", data[1].label, "} ", $scope.info.logic.substring(position)].join('');
			newPos = position + data[0].length + data[1].label.length + 5;
		}
		document.getElementById('inputLogic').focus();
		document.getElementById('inputLogic').setSelectionRange(newPos, newPos);
	};

	// Function to call when some value is dropped on text box
	$scope.onDropText = function(data, evt) {
		var position = angular.element(document.getElementById('inputText')).prop("selectionStart"),
		    newPos;
		if (data[1].type == 'operator') {
			ModalService.alertBox({
				msg : 'Relational & Logical operators not valid for Text'
			});
			return;
		} else if (data[1].type == 'function') {
			$scope.info.text = [$scope.info.text.slice(0, position), data[1].text, $scope.info.text.slice(position)].join('');
			newPos = position + data[1].positionInc;
		} else {
			$scope.info.text = [$scope.info.text.slice(0, position), " {", data[0], ".", data[1].label, "} ", $scope.info.text.slice(position)].join('');
			newPos = position + data[0].length + data[1].label.length + 5;
		}
		document.getElementById('inputText').focus();
		document.getElementById('inputText').setSelectionRange(newPos, newPos);
	};

	// Function to call when some value is dropped on text box
	$scope.onDropLabel = function(data, evt) {
		var position = angular.element(document.getElementById('inputLabel')).prop("selectionStart"),
		    newPos;
		if (data[1].type == 'operator') {
			ModalService.alertBox({
				msg : 'Relational & Logical operators not valid for Label'
			});
			return;
		} else if (data[1].type == 'function') {
			$scope.info.label = [$scope.info.label.slice(0, position), data[1].text, $scope.info.label.slice(position)].join('');
			newPos = position + data[1].positionInc;
		} else {
			$scope.info.label = [$scope.info.label.slice(0, position), " {", data[0], ".", data[1].label, "} ", $scope.info.label.slice(position)].join('');
			newPos = position + data[0].length + data[1].label.length + 5;
		}
		document.getElementById('inputLabel').focus();
		document.getElementById('inputLabel').setSelectionRange(newPos, newPos);
	};
	
	// Function to call when some value is dropped on Justification box
	$scope.onDropJustification = function(data, evt) {
		var position = angular.element(document.getElementById('inputJustification')).prop("selectionStart"),
		    newPos;
		if (data[1].type == 'operator') {
			ModalService.alertBox({
				msg : 'Relational & Logical operators not valid for Label'
			});
			return;
		} else if (data[1].type == 'function') {
			$scope.info.alert_justification = [$scope.info.alert_justification.slice(0, position), data[1].text, $scope.info.alert_justification.slice(position)].join('');
			newPos = position + data[1].positionInc;
		} else {
			$scope.info.alert_justification = [$scope.info.alert_justification.slice(0, position), " {", data[0], ".", data[1].label, "} ", $scope.info.alert_justification.slice(position)].join('');
			newPos = position + data[0].length + data[1].label.length + 5;
		}
		document.getElementById('inputJustification').focus();
		document.getElementById('inputJustification').setSelectionRange(newPos, newPos);
	};

	

	$scope.onDropRecommendation = function(data, evt) {
		var position = angular.element(document.getElementById('inputRecommendation')).prop("selectionStart"),
		    newPos;
		if (data[1].type == 'operator') {
			ModalService.alertBox({
				msg : 'Relational & Logical operators not valid here'
			});
			return;
		} else if (data[1].type == 'function') {
			$scope.info.recommendation = [$scope.info.recommendation.slice(0, position), data[1].text, $scope.info.recommendation.slice(position)].join('');
			newPos = position + data[1].positionInc;
		} else {
			$scope.info.recommendation = [$scope.info.recommendation.slice(0, position), " {", data[0], ".", data[1].label, "} ", $scope.info.recommendation.slice(position)].join('');
			newPos = position + data[0].length + data[1].label.length + 5;
		}
		document.getElementById('inputRecommendation').focus();
		document.getElementById('inputRecommendation').setSelectionRange(newPos, newPos);
	};

	/*
	 * ------------ START ---------------- LOGIC PARSER TO SCALA-----
	 */

	$scope.getComparisionOperatorForScala = function(oprt) {
		var comparisonOperators = $filter('filterMultiples')($scope.info.operators, {
			subtype : ['comparison', 'equal comparison']
		});
		for (var i in comparisonOperators) {
			if (comparisonOperators[i] && (comparisonOperators[i].label).trim() == oprt.trim()) {
				return comparisonOperators[i].scalaOperator;
			}
		}
	};

	$scope.getInlineFunctionForScala = function(oprt) {
		var inlineFunctions = $filter('filter')($scope.info.operators, {
			subtype : 'inline function'
		});
		for (var i in inlineFunctions) {
			if (inlineFunctions[i] && (inlineFunctions[i].label).trim() == oprt.trim()) {
				return inlineFunctions[i].scalaOperator;
			}
		}
	};

	$scope.getEqualNullOperatorForScala = function(oprt) {
		var equalNullOperators = $filter('filter')($scope.info.operators, {
			subtype : 'equal null'
		});
		for (var i in equalNullOperators) {
			if (equalNullOperators[i] && (equalNullOperators[i].label).trim() == oprt.trim()) {
				return equalNullOperators[i].scalaOperator;
			}
		}
	};

	$scope.getFunctionForScala = function(oprt) {
		for (var i in $scope.info.functions) {
			if ($scope.info.functions[i] && ($scope.info.functions[i].label).trim() == oprt.trim()) {
				return $scope.info.functions[i].scalaOperator;
			}
		}
	};

	$scope.getConnectorForScala = function(oprt) {
		var logicalConnectorOperators = $filter('filter')($scope.info.operators, {
			subtype : 'logical'
		});
		for (var i in logicalConnectorOperators) {
			if (logicalConnectorOperators[i] && (logicalConnectorOperators[i].label).trim() == oprt.trim()) {
				return logicalConnectorOperators[i].scalaOperator;
			}
		}
	};

	// Parse statement by logical oprator i.e AND, OR...
	$scope.parseLogicToScalaCondtion = function(stmt,stringsMap) {
		// ---------------Split statements separated connector operator i.e AND , OR ... -------------- //
		var logicalConnectorOperators = $filter('filter')($scope.info.operators, {
			subtype : 'logical'
		});
		var logicalConnectorOperatorSplitStr = '';
		for (var i in logicalConnectorOperators) {
			if (logicalConnectorOperators[i]) {
				if (logicalConnectorOperatorSplitStr.length == 0) {
					logicalConnectorOperatorSplitStr += '\\s+' + logicalConnectorOperators[i].label + '\\s+';
				} else {
					logicalConnectorOperatorSplitStr += '|\\s+' + logicalConnectorOperators[i].label + '\\s+';
				}
			}
		}
		var logicalConnectorOperatorSplitRegex = new RegExp(logicalConnectorOperatorSplitStr);

		// Check if connector operator available
		if (logicalConnectorOperatorSplitRegex.test(stmt)) {
			//Read the operator
			var operatorArr = logicalConnectorOperatorSplitRegex.exec(stmt);
			if (operatorArr && operatorArr.length > 0) {
				var scalaOperator = $scope.getConnectorForScala(operatorArr[0]);
			}
			//Read Operands
			var individualOperands = stmt.split(operatorArr[0]);
			if (individualOperands.length >= 2) {
				var tempScalaLogic = "";
				for (var lc = 0; lc < individualOperands.length; lc++) {
					if (lc == 0) {
						tempScalaLogic = $scope.parseLogicToScalaCondtion_translateLastStatement(individualOperands[lc],stringsMap);
					} else {
						tempScalaLogic = tempScalaLogic + " " + scalaOperator + " " + $scope.parseLogicToScalaCondtion(individualOperands[lc], stringsMap);
					}
				}
				return tempScalaLogic;
			}
			/*if (individualOperands.length == 2) {
			 return ($scope.parseLogicToScalaCondtion_translateLastStatement(individualOperands[0]) + " " + scalaOperator + " " + $scope.parseLogicToScalaCondtion(individualOperands[1]));
			 } else if (individualOperands.length == 3) {
			 return ($scope.parseLogicToScalaCondtion_translateLastStatement(individualOperands[0]) + " " + scalaOperator + " " + $scope.parseLogicToScalaCondtion(individualOperands[1]) + " " + scalaOperator + " " + $scope.parseLogicToScalaCondtion(individualOperands[2]));
			 } else if (individualOperands.length == 4) {
			 return ($scope.parseLogicToScalaCondtion_translateLastStatement(individualOperands[0]) + " " + scalaOperator + " " + $scope.parseLogicToScalaCondtion(individualOperands[1]) + " " + scalaOperator + " " + $scope.parseLogicToScalaCondtion(individualOperands[2]) + " " + scalaOperator + " " + $scope.parseLogicToScalaCondtion(individualOperands[3]));
			 } else if (individualOperands.length == 5) {
			 return ($scope.parseLogicToScalaCondtion_translateLastStatement(individualOperands[0]) + " " + scalaOperator + " " + $scope.parseLogicToScalaCondtion(individualOperands[1]) + " " + scalaOperator + " " + $scope.parseLogicToScalaCondtion(individualOperands[2]) + " " + scalaOperator + " " + $scope.parseLogicToScalaCondtion(individualOperands[3]) + " " + scalaOperator + " " + $scope.parseLogicToScalaCondtion(individualOperands[4]));
			 }*/
		} else {
			return $scope.parseLogicToScalaCondtion_translateLastStatement(stmt, stringsMap);
		}

	};

	// Do operation on the simplest form i.e op1 > op2
	$scope.parseLogicToScalaCondtion_translateLastStatement = function(stmt, stringsMap) {
		var comparisonOperators = $filter('filterMultiples')($scope.info.operators, {
			subtype : ['comparison', 'equal comparison']
		});
		// ---------------Split statements separated comparision operator i.e >. >= ... -------------- //
		var logicalSplitStr = '';
		for (var i in comparisonOperators) {
			if (comparisonOperators[i]) {
				if (logicalSplitStr.length == 0) {
					logicalSplitStr += '\\s+' + comparisonOperators[i].label + '\\s+';
				} else {
					logicalSplitStr += '|\\s+' + comparisonOperators[i].label + '\\s+';
				}
			}
		}

		//--------------------------Regular expression for inline functions i.e like()----------------//
		var inlineFunctions = $filter('filter')($scope.info.operators, {
			subtype : 'inline function'
		});
		var inlinefunctionSplitStr = '';
		for (var i in inlineFunctions) {
			if (inlineFunctions[i]) {
				if (inlinefunctionSplitStr.length == 0) {
					inlinefunctionSplitStr += '\\s*' + inlineFunctions[i].label + '\\s*';
				} else {
					inlinefunctionSplitStr += '|\\s*' + inlineFunctions[i].label + '\\s*';
				}
			}
		}

		//--------------------------Regular expression for functions i.e UPPER(), LOWER()...----------------//
		var functionSplitStr = '';
		for (var i in $scope.info.functions) {
			if ($scope.info.functions[i]) {
				if (functionSplitStr.length == 0) {
					functionSplitStr += '\\s*' + $scope.info.functions[i].label + '\\s*';
				} else {
					functionSplitStr += '|\\s*' + $scope.info.functions[i].label + '\\s*';
				}
			}
		}

		//--------------------------Regular expression for aggregate functions i.e AVG(), SUM()...----------------//
		var aggregatefunctionSplitStr = '';
		for (var i in $scope.info.aggregateFunctions) {
			if ($scope.info.aggregateFunctions[i]) {
				if (aggregatefunctionSplitStr.length == 0) {
					aggregatefunctionSplitStr += '\\s*' + $scope.info.aggregateFunctions[i].label + '\\s*';
				} else {
					aggregatefunctionSplitStr += '|\\s*' + $scope.info.aggregateFunctions[i].label + '\\s*';
				}
			}
		}
		//--------------------------Regular expression for checking null i.e IS NULL, IS NOT NULL...----------------//
		var eqNullOperators = $filter('filter')($scope.info.operators, {
			subtype : 'equal null'
		});
		var eqNullSplitStr = '';
		for (var i in eqNullOperators) {
			if (eqNullOperators[i]) {
				if (eqNullSplitStr.length == 0) {
					eqNullSplitStr += '\\s*' + eqNullOperators[i].label + '\\s*';
				} else {
					eqNullSplitStr += '|\\s*' + eqNullOperators[i].label + '\\s*';
				}
			}
		}

		var logicalSplitRegex = new RegExp(logicalSplitStr);
		var inlineFunctionalSplitRegex = new RegExp(inlinefunctionSplitStr);
		var functionalSplitRegex = new RegExp(functionSplitStr);
		var aggregatefunctionalSplitRegex = new RegExp(aggregatefunctionSplitStr);
		var eqNullSplitRegex = new RegExp(eqNullSplitStr);

		// Check if comparison operator available
		if (logicalSplitRegex.test(stmt)) {
			//Read the operator
			var operatorArr = logicalSplitRegex.exec(stmt);
			if (operatorArr && operatorArr.length > 0) {
				var scalaOperator = $scope.getComparisionOperatorForScala(operatorArr[0]);
			}
			//Read Operands
			var individualOperands = stmt.split(logicalSplitRegex);
			//Join Operands with scala operator
			individualOperands[1] = individualOperands[1].replace(/\"/g, "\"\"\"");
			stmt = individualOperands[0] + " " + scalaOperator + " " + individualOperands[1];
		}

		// Check if function is there in inlne function i.e LIKE
		if (inlineFunctionalSplitRegex.test(stmt)) {
			// Read the operator
			var operatorArr = inlineFunctionalSplitRegex.exec(stmt);
			if (operatorArr && operatorArr.length > 0) {
				var scalaOperator = $scope.getInlineFunctionForScala(operatorArr[0]);
			}
			// Read Operands
			var individualOperands = stmt.split(inlineFunctionalSplitRegex);
			if (/\'%(.*?)[^%]\'/.test(individualOperands[1])) {
				scalaOperator = 'endsWith';
			} else if (/\'[^%](.*?)%\'/.test(individualOperands[1])) {
				scalaOperator = 'startsWith';
			}
			// removining "%" from LIKE statement
			individualOperands[1] = individualOperands[1].replace(/\'%|%\'|\'/g, "\"\"\"");
			// Join Operands with scala operator
			stmt = individualOperands[0].trim() + "." + scalaOperator + "(" + individualOperands[1] + ")";

			if (operatorArr[0].indexOf(' NOT ') > -1) {
				stmt = stmt.replace(/\w/, "!$&");
			}
		}

		// Check if function is there in function i.e UPPER....
		if (functionalSplitRegex.test(stmt)) {
			// Read the operator
			var operatorArr = functionalSplitRegex.exec(stmt);
			if (operatorArr && operatorArr.length > 0) {
				var scalaOperator = $scope.getFunctionForScala(operatorArr[0]);
			}

			// Read Operands
			var individualOperands = stmt.split(functionalSplitRegex);
			stmt = "";
			for (var i = 0; i < individualOperands.length; i++) {
				if (individualOperands[i]) {
					if (operatorArr[0] == 'CONVERTTOSTRING') {
						stmt += individualOperands[i].replace(/(\.to[\w]+\s*)?\)/, (")." + scalaOperator));
					} else if(operatorArr[0] == 'VERSION'){
						var versionStms = individualOperands[i].replace(/\)/, (")"));
						//convert version function to scala code
						stmt += processVersionFunction(versionStms, stringsMap);
					}else if(operatorArr[0] != 'COUNT' && aggregatefunctionalSplitRegex.test(operatorArr[0])){
						stmt += individualOperands[i].replace(/\)|\(/g, ("" ));
					}else if(operatorArr[0] == 'COUNT'){
						stmt += individualOperands[i];
					}else{
						stmt += individualOperands[i].replace(/\)/, (")." + scalaOperator));
					}
					if (i == individualOperands.length - 1) {
						stmt = stmt.replace(/\s*\(\*s/, "");
						stmt = stmt.replace(/\s*\)\*s/, "");
					}
				}
			}
		}

		// Check if equal null operator is there i.e IS NULL, IS NOT NULL
		if (eqNullSplitRegex.test(stmt)) {
			var operatorArr = eqNullSplitRegex.exec(stmt);

			if (operatorArr && operatorArr.length > 0) {
				var scalaOperator = $scope.getEqualNullOperatorForScala(operatorArr[0]);
			}

			//Read Operands
			var individualOperands = stmt.split(eqNullSplitRegex);
			//Join Operands with scala operator
			stmt = individualOperands[0] + scalaOperator + (!!individualOperands[1] ? individualOperands[1] : "");

			if (operatorArr[0].indexOf(' NOT ') > -1) {
				stmt = stmt.replace(/\w/, "!$&").replace(/^\s+/, '');
			}
		}

		return stmt;
	};
	
	$scope.resetValues = function(){
        	$scope.info.emailTemplate = "select";
                $scope.info.apiTemplate = "select";
	}
	var processVersionFunction = function(versionStms, stringsMap){
		var len = $scope.info.operators.length, operands = [],stmt="", versionList = [], selectedOperator;
		for(var i=0;i<len;i++){
			//check if the operator is there
			if(versionStms.indexOf($scope.info.operators[i].scalaOperator) != -1){
				operands = versionStms.split($scope.info.operators[i].scalaOperator);
				selectedOperator = $scope.info.operators[i].scalaOperator;
				break;
			}
		}
		if (operands) {
			stmt = operands[0];
			stmt = stmt.replace(/\s*\(\s*/, "");
			stmt = stmt.replace(/\s*\)\s*/, "");
			operands[0] = stmt;
			versionList = stringsMap[operands[1].replace(/\s*/g, "").replace(/^'%/g, "").replace(/%'$/g, "")];
			versionList = versionList.split(".");
			stmt = "";
			var versionLength = versionList.length;
			function generateEqualsCondition(operand, versions){
				var str = ""
				for (var i = 0; i < versionLength; i++) {
					if (str === "") {
						str = "(";
					} else {
						str += " && ";
					}
					str += operand + '.split("\\\\.")(' + i + ').toInt ' + " == " + parseInt(versions[i], 10);
					if(i == versionLength-1){
						var bracketslen = (str.match(/\(/gm) || []).length;
						var closedbracketslen = (str.match(/\)/gm) || []).length;
						bracketslen = bracketslen - closedbracketslen;
						for (var j = 0; j < bracketslen; j++) {
							str += ")";
						}
					}
				}
				return str;
			}
			if (versionLength) {
				if (selectedOperator === "!=") {
					stmt = "(!"+generateEqualsCondition(operands[0], versionList)+")";
				} else if (selectedOperator === "==") {
					stmt = generateEqualsCondition(operands[0], versionList);
				} else {
					var offsetVersionList = versionList;
					var addEqualsIfApplicable = false;
					if (selectedOperator === ">=") {
						addEqualsIfApplicable = true;
						selectedOperator = ">";
					} else if (selectedOperator === "<=") {
						addEqualsIfApplicable = true;
						selectedOperator = "<";
					}
					for (var i = 0; i < versionLength; i++) {
						if (stmt === "") {
							stmt = "(";
						}
						if (i < versionLength - 1) {
							stmt += operands[0] + '.split("\\\\.")(' + i + ').toInt ' + selectedOperator + " " + parseInt(offsetVersionList[i], 10) + " || " + "(" +
								operands[0] + '.split("\\\\.")(' + i + ').toInt  == ' + parseInt(offsetVersionList[i], 10) + " && (";
						} else {
							var bracketslen = (stmt.match(/\(/gm) || []).length;
							var closedbracketslen = (stmt.match(/\)/gm) || []).length;
							bracketslen = bracketslen - closedbracketslen;
							var addBracketIfApplicable = "";
							for (var j = 0; j < bracketslen; j++) {
								addBracketIfApplicable += ")";
							}
							stmt += operands[0] + '.split("\\\\.")(' + i + ').toInt ' + selectedOperator + " " + parseInt(offsetVersionList[i], 10) + addBracketIfApplicable;
							if(addEqualsIfApplicable){
								stmt = "("+generateEqualsCondition(operands[0], versionList) + " || " + stmt + ")";
							}
						}
					}
				}
			}
		}
		return stmt;
	}

	/*
	 * ----------------END--------- LOGIC PARSER ----------------------
	 */
	$scope.getJSONFromSting = function(str){
		if(!str) return "";
		var justificationRegEx = new RegExp(/{[\s\S]*}/gm);
		var justificationRegExMatchList = str.match(justificationRegEx);
		if(justificationRegExMatchList && justificationRegExMatchList.length > 0){
			return justificationRegExMatchList[0];
		}
		return "";
	}
	$scope.getSectionColumnsPairFromString = function(jsonAsString, invalid_attr_msg, local_attr_msg){
		var secColPairs = [],
		    startPos = null,
			endPos = null,
			allKeys = [], currentValue = "", tmpVal = "";
		//convert string to JSON
		var jsonObject = {};
		try{
			jsonObject = JSON.parse(jsonAsString);
		}catch(e){
			jsonObject = {};
		}
		//read value from JSON object and check for section-attribute pair
		//read all kyes
		allKeys = Object.keys(jsonObject);
		for(var k=0;k<allKeys.length;k++){
			currentValue = jsonObject[allKeys[k]];
			tmpVal = $scope.getSectionAttributeLabelMap(currentValue, invalid_attr_msg, local_attr_msg);
			if(tmpVal === false){
				return;
			}
			secColPairs = secColPairs.concat(tmpVal);
		}

		return secColPairs;
	}
	$scope.getSectionAttributeLabelMap = function(currentValue, invalid_attr_msg, local_attr_msg){
		var secColPairs = [],
		startPos = null,
		endPos = null;
		
		for (var i = 0; i < currentValue.length; i++) {
			// Check if {{ or }} exists in string
			if ((currentValue[i] == '{' && startPos) || (currentValue[i] == '}' && !startPos) || (i == currentValue.length - 1 && startPos && currentValue[i] != '}') || (i == currentValue.length - 1 && currentValue[i] == '{')) {
				ModalService.alertBox({
					msg : GlobalService.getVal('rulesMsgs')['rule_justification_error']
				});
				return false;
			}
			if (currentValue[i] == '{') {
				startPos = i + 1;
			}
			if (currentValue[i] == '}' && startPos) {
				endPos = i;
				var tmpString = currentValue.substring(startPos, endPos);
				if (!$scope.sectionsColumnLabelMap.hasOwnProperty(tmpString)) {
					ModalService.alertBox({
						msg : GlobalService.getVal('rulesMsgs')[invalid_attr_msg][0] + tmpString + GlobalService.getVal('rulesMsgs')[invalid_attr_msg][1]
					});
					return false;
				}
				if ($scope.info.scope != 'Table' && $scope.sectionsColumnLabelMap[tmpString][5] != 'G') {
					ModalService.alertBox({
						msg : GlobalService.getVal('rulesMsgs')[local_attr_msg][0] + tmpString + GlobalService.getVal('rulesMsgs')[local_attr_msg][1]
					});
					return false;
				}
				secColPairs.push(tmpString);
				startPos = null;
			}
		}
		return secColPairs;
	}
	function handleSessionTimeout(response) {
		if (!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
			$scope.info.sessionTimedOut = true;
			ModalService.sessionTimeout();
		}
	};

	//usertracking function
	$scope.trackUser = function (app_Page, operation, details) {
		var details = JSON.stringify(details);
		UserTrackingService.standard_user_tracking($scope.info.application, app_Page, operation, details).then(function (response) {

		}, handleSessionTimeout);
	}




	$scope.differenceOf2Arrays = function (array1, array2) {
		var removed = [];
		var added = [];

		if (!array1.length && array2.length) {
			return { "removed": "", "added": array2.join() };
		}

		if (!array2.length && array1.length) {
			return { "removed": array1.join(), "added": "" };
		}

		for (var i in array1) {
			if (array2.indexOf(array1[i]) === -1) removed.push(array1[i]);
		}

		for (i in array2) {
			if (array1.indexOf(array2[i]) === -1) added.push(array2[i]);
		}
		return { "removed": removed.length ? removed.join() : "", "added": added.length ? added.join() : "" };
	}


	$scope.info.autocomplete = function (searchEle, arr) {
		var currentFocus;
		searchEle.addEventListener("input", function (e) {
			var divCreate,
				b,
				i,
				fieldVal = this.value;
			closeAllLists();
			if (!fieldVal) {
				return false;
			}
			currentFocus = -1;
			divCreate = document.createElement("DIV");
			divCreate.setAttribute("id", this.id + "autocomplete-list");
			divCreate.setAttribute("class", "autocomplete-items");
			this.parentNode.appendChild(divCreate);
			for (i = 0; i < arr.length; i++) {
				if (arr[i].substr(0, fieldVal.length).toUpperCase() == fieldVal.toUpperCase()) {
					b = document.createElement("DIV");
					b.innerHTML = "<strong>" + arr[i].substr(0, fieldVal.length) + "</strong>";
					b.innerHTML += arr[i].substr(fieldVal.length);
					b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
					b.addEventListener("click", function (e) {
						searchEle.value = "";
						addToList(this.getElementsByTagName("input")[0].value)
						closeAllLists();
					});
					divCreate.appendChild(b);
				}
			}
		});

		searchEle.addEventListener("keydown", function (e) {
			var autocompleteList = document.getElementById(this.id + "autocomplete-list");
			if (autocompleteList)
				autocompleteList = autocompleteList.getElementsByTagName("div");
			if (e.keyCode == 40) {
				currentFocus++;
				addActive(autocompleteList);
			}
			else if (e.keyCode == 38) {
				//up
				currentFocus--;
				addActive(autocompleteList);
			}
			else if (e.keyCode == 13) {
				e.preventDefault();
				if (currentFocus > -1) {
					if (autocompleteList) autocompleteList[currentFocus].click();
				}
			}
		});

		function addActive(autocompleteList) {
			if (!autocompleteList) return false;
			removeActive(autocompleteList);
			if (currentFocus >= autocompleteList.length) currentFocus = 0;
			if (currentFocus < 0) currentFocus = autocompleteList.length - 1;
			autocompleteList[currentFocus].classList.add("autocomplete-active");
		}

		function removeActive(autocompleteList) {
			for (var i = 0; i < autocompleteList.length; i++) {
				autocompleteList[i].classList.remove("autocomplete-active");
			}
		}

		function closeAllLists(elmnt) {
			var autocompleteList = document.getElementsByClassName(
				"autocomplete-items"
			);
			for (var i = 0; i < autocompleteList.length; i++) {
				if (elmnt != autocompleteList[i] && elmnt != searchEle) {
					autocompleteList[i].parentNode.removeChild(autocompleteList[i]);
				}
			}
		}

		document.addEventListener("click", function (e) {
			closeAllLists(e.target);
		});

		function addToList(email) {
			if (!$scope.info.subscriptionEmailList.includes(email)) {
				$scope.info.subscriptionEmailList.unshift(email)
				$scope.info.subscriberObj.unshift({
					'label': email,
					'selected': false
				})
				$scope.loadSubscribers();
			}
		}

	}

	$scope.openAddSubscribers = function () {
		$scope.info.subBulkRemoveBtn = false;
		$scope.info.emailText = "";
		$scope.info.searchEmailText = ""
		$scope.info.subloading = true;
		$scope.msg = "";
		$scope.info.subscriberObj = $scope.info.subscriptionEmailList.reduce(function (acc, cur) {
			acc.push({
				'label': cur,
				'selected': false
			})
			return acc;
		}, []) || []
		$scope.loadSubscribers();
		$scope.originalSub = $scope.info.subscriberObj.slice();
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/add_rule_subscribers.html", $scope, 'gb-add-edit-subscribers', true, 'static');
		setTimeout(function () { $scope.info.autocomplete(document.getElementById("searchField"), $scope.info.emailList); }, 2000);
		$scope.info.subloading = false;
	}

	$scope.loadSubscribers = function () {
		if ($scope.info.searchEmailText) {
			$scope.info.showSubList = $scope.info.subscriberObj.filter(function (item) {
				return item.label.indexOf($scope.info.searchEmailText) > -1
			})
		}
		else {
			$scope.info.showSubList = $scope.info.subscriberObj;
		}
	}

	

	$scope.checkemail = function (event) {
		if (event.keyCode == 13 || event.keyCode == 32) {
			$scope.info.re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if ($scope.info.re.test($scope.info.emailText)) {
				if (!$scope.info.subscriptionEmailList.includes($scope.info.emailText)) {
					$scope.info.subscriptionEmailList.unshift($scope.info.emailText)
					$scope.info.subscriberObj.unshift({
						'label': $scope.info.emailText,
						'selected': false
					})
					$scope.info.emailText = "";
					$scope.loadSubscribers();
				}
			}
		}
	}
	$scope.removeFromSubscriptionList = function (email) {
		$scope.info.subloading = true;
		$scope.info.subscriptionEmailList = $scope.info.subscriptionEmailList.filter(function (item) {
			return item != email.label;
		})
		$scope.info.subscriberObj = $scope.info.subscriberObj.filter(function (item) {
			return item.label != email.label;
		})
		$scope.loadSubscribers();
		$scope.info.subloading = false;
	}


	$scope.getSelectedSubs = function(){
		var found = false
		for(var i=0;i<$scope.info.subscriberObj.length;i++){
			if($scope.info.subscriberObj[i].selected){
				found = true;
				break;
			}
		}
		return found;
	}

	$scope.showBulkRemoveBtn = function(){
		
		$scope.info.subBulkRemoveBtn =	$scope.getSelectedSubs();
	}
	$scope.bulkRemoveSubscriers = function () {
		$scope.info.subloading = true;
		$scope.info.subscriptionEmailList = $scope.info.subscriberObj.reduce(function (acc, cur) {
			if(cur.selected == false){
				acc.push(cur.label)
			}
			return acc;
		},[])
		$scope.info.subscriberObj = $scope.info.subscriberObj.filter(function (item) {
			return item.selected == false
		})
		$scope.loadSubscribers();
		$scope.showBulkRemoveBtn();
		$scope.info.subloading = false;
	}

	$scope.addSubscribersbtn = function () {
		$scope.info.subloading = true;
		$scope.info.re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if ($scope.info.re.test($scope.info.emailText)) {
			if (!$scope.info.subscriptionEmailList.includes($scope.info.emailText)) {
				$scope.info.subscriptionEmailList.unshift($scope.info.emailText)
				$scope.info.subscriberObj.unshift({
					'label': $scope.info.emailText,
					'selected': false
				})
				$scope.info.emailText = "";
				$scope.loadSubscribers();
			}
		}
		$scope.info.subloading = false;
	}

	$scope.deleteSubscriptionFilterBulk = function (rule, removedEmails) {
		var postdata = {
			"ruleId": rule.rule_id,
			"mps": $cookies.mps,
			"emailIds": removedEmails
		};
		RulesService.deleteFilterAttributesMultiple(postdata).then(function (response) {
			// $scope.info.rulesListMsg = {
			// 	type: 'success',
			// 	msg: GlobalService.getVal('rulesMsgs')['rule_unsubscription_success: "Unsubscribed from rule successfully"']
			// }
		}, function (response) {
			console.error("Unable to load templates");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}else{
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: "Unable to load data Please contact " + $scope.supportEmail
				};
			}
			handleSessionTimeout(response);
			$scope.info.rulesLoading = false;
			$scope.info.sysidLoading = false;
		});

	}

	$scope.deleteSubscriptionFilter = function (rule, bulk) {
		if(bulk){
			var postdata = {
				"ruleIds": rule,
				"mps": $cookies.mps
			};
		}else{
			var postdata = {
				"ruleIds": [rule.rule_id],
				"mps": $cookies.mps
			};
		}
		
		RulesService.deleteFilterAttributes(postdata).then(function (response) {
			// $scope.info.rulesListMsg = {
			// 	type: 'success',
			// 	msg: GlobalService.getVal('rulesMsgs')['rule_unsubscription_success: "Unsubscribed from rule successfully"']
			// }

		}, function (response) {
			console.error("Unable to load templates");
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			}else{
				$scope.info.rulesListMsg = {
					type: 'failure',
					msg: "Unable to load data Please contact " + $scope.supportEmail
				};
			}
			handleSessionTimeout(response);
			$scope.info.rulesLoading = false;
			$scope.info.sysidLoading = false;
		});

	}


	$scope.tagFilterFunction = function (t) {
		return t.selected;
	}
	$scope.getAddUpdateTagPayload = function(rule_id){

		//payload
		return {
			"associate": [{
				"tag_ids": $scope.info.tagList.filter($scope.tagFilterFunction).map(function(t){return t.tag_id}),
				"rule_ids": [rule_id]
			}],
			"disassociate": [{}]
		}
	} 

	$scope.checktagselectedstatus = function(){
		if(!$scope.info.subscription_enabled && $scope.info.selectedTagsCount>0){
			ModalService.alertBox({
				msg : 'Selected tags will be disassociated if auto-subscription is turned off.'
			});
		}
	}

	$scope.resetSelectedTags = function(){
		$scope.info.tagList.forEach(function(tag){
			tag.selected = false;
		});
		$scope.updateTagSelectedCount();
	}


}])

// Controller to handle adding and editing of templates
.controller('AnalyticsCtrl', ['$scope', '$sce', '$timeout', '$filter', 'ModalService', 'RulesService', 'GlobalService', 'UserTrackingService', 'AppService', '$rootScope',
function($scope, $sce, $timeout, $filter, ModalService, RulesService, GlobalService, UserTrackingService, AppService, $rootScope) {
	// Object to store all information about Add/Edit Template page
	$scope.info = {};
	// Stores application name which is used for user tracking
	$scope.info.application = GlobalService.getVal('navRules');
	// Defines whether the page is loading
	$scope.info.pageLoading = false;

	//Used for analytuics graph
	$scope.analytics = {};
	$scope.analytics.status = [];
	$scope.analytics.priorities = [];
	$scope.analytics.severities = [];
	$scope.analytics.creatorVsCategory = [];
	$scope.timefilter = GlobalService.getVal('alertTimeFilter');
	$scope.customTimeMsg = GlobalService.getVal('analyticsCustomTimeMsg');

	$scope.selectedTimeFilter = $scope.timefilter[0];
	$scope.maxToDate = moment.utc().format();
	$scope.minFromDate = moment().subtract(30,'day').utc().format();
	RulesService.setSelectedTimeFilter($scope.selectedTimeFilter);
	var startTime, endTime;
	// Stores whether session is timed out or not
	$scope.info.sessionTimedOut = false;
	//$scope.selectedTimeFilter
	// $scope.$watch('selectedTimeFilter', function() {
    //     $scope.minFromDate = moment($scope.selectedTimeFilter.endTime).subtract(30,'day').utc().format();
    // }, true);
	var manufacturer = GlobalService.getVal('manufacturer');
	var product = GlobalService.getVal('product');
	var schema = GlobalService.getVal('schema');
	// Function to render text in html format
	$scope.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};

	// Function to handle session timeout
	function handleSessionTimeout(response) {
		if (!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
			$scope.info.sessionTimedOut = true;
			ModalService.sessionTimeout();
		}
	};

	$scope.makeAnalyticsData = function(rules){
		// rules.forEach(function(rule){
		// 	//for status
		// 	if($scope.analytics.status.length == 0){
		// 		$scope.analytics.status.push({name:rule.status,count:1,details:[rule]});
		// 	}else{
		// 		$scope.analyticsUpdateStatus(rule);
		// 	}
		// 	//for priority
		// 	if($scope.analytics.priorities.length == 0){
		// 		$scope.analytics.priorities.push({name:rule.priority,count:1,details:[rule]});
		// 	}else{
		// 		$scope.analyticsUpdatePriorities(rule);
		// 	}
		// 	//for severity
		// 	if($scope.analytics.severities.length == 0){
		// 		$scope.analytics.severities.push({name:rule.severity,count:1,details:[rule]});
		// 	}else{
		// 		$scope.analyticsUpdateSeverities(rule);
		// 	}
		// 	//for creater vr category head map
		// 	//formate data for heat map {x: "creator", y: "categgory", value: no}
		// 	if(rule.created_by && (rule.created_by && rule.created_by.trim())){
		// 		if($scope.analytics.creatorVsCategory.length == 0){
		// 			$scope.analytics.creatorVsCategory.push({'x':rule.created_by, 'y': rule.category, 'value': 1});
		// 		}else{
		// 			$scope.analyticsUpdateCreatorVsCategory(rule);
		// 		}
		// 	}
		// 	// if($scope.analytics.severities.length == 0){
		// 	// 	$scope.analytics.severities.push({name:rule.severity,count:1,details:[rule]});
		// 	// }else{
		// 	// 	$scope.analyticsUpdateAlertsTriggeredBySeverity(rule);
		// 	// }
		// });
		//$scope.processCreatorVsCategoryData();
		//RulesService.setAnalyticsData($scope.analytics);

		RulesService.setAnalyticsLoaderWait(false);

		RulesService.newAnalyticsApi().then(function(response) {
			$scope.analytics = response.data.Data;
			RulesService.setAnalyticsData($scope.analytics);
			//set to true
			RulesService.setAnalyticsLoaderWait(true);
		});
	};

	$scope.processCreatorVsCategoryData = function(){
		var allCategory = {}, allData = [], allUsers = [];
		$scope.analytics.creatorVsCategory.map(function(item){
			if(!allCategory[item.y]) {
				allCategory[item.y] = [];
			}
			allCategory[item.y].push(item.x);
			if(allUsers.indexOf(item.x) == -1){
				allUsers.push(item.x);
			}
		});
		var categories = Object.keys(allCategory)
		for(var i=0;i<categories.length;i++){
			var tmpUserList = allCategory[categories[i]];
			for(var j=0;j<allUsers.length;j++){
				var user = allUsers[j];
				if(tmpUserList.indexOf(user) == -1){
					$scope.analytics.creatorVsCategory.push({'x':user, 'y': categories[i], 'value': 0})
				}
			}
		}		
	};
	$scope.analyticsUpdateSeverities = function(rule){
		var cRule,newStatusElm, isFound=false;
		for(var i=0;i<$scope.analytics.severities.length;i++){
			cRule = $scope.analytics.severities[i];
			if(cRule.name == rule.severity){
				cRule.count++;
				cRule.details.push(rule);
				isFound = true;
				break;
			}
		}
		if(!isFound){
			newStatusElm = {};
			newStatusElm.name = rule.severity;
			newStatusElm.count = 1;
			newStatusElm.details = [rule];
			$scope.analytics.severities.push(angular.copy(newStatusElm));
		}
	};

	$scope.analyticsUpdatePriorities = function(rule){
		var cRule,newStatusElm, isFound=false;
		for(var i=0;i<$scope.analytics.priorities.length;i++){
			cRule = $scope.analytics.priorities[i];
			if(cRule.name == rule.priority){
				cRule.count++;
				cRule.details.push(rule);
				isFound = true;
				break;
			}
		}
		if(!isFound){
			newStatusElm = {};
			newStatusElm.name = rule.priority;
			newStatusElm.count = 1;
			newStatusElm.details = [rule];
			$scope.analytics.priorities.push(angular.copy(newStatusElm));
		}
	};
	
	$scope.analyticsUpdateStatus = function(rule){
		var cRule,newStatusElm, isFound=false;
		for(var i=0;i<$scope.analytics.status.length;i++){
			cRule = $scope.analytics.status[i];
			if(cRule.name == rule.status){
				cRule.count++;
				cRule.details.push(rule);
				isFound = true;
				break;
			}
		}
		if(!isFound){
			newStatusElm = {};
			newStatusElm.name = rule.status;
			newStatusElm.count = 1;
			newStatusElm.details = [rule];
			$scope.analytics.status.push(angular.copy(newStatusElm));
		}
	};
	$scope.analyticsUpdateCreatorVsCategory = function(rule){
		var cRule, isFound=false;
		for(var i=0;i<$scope.analytics.creatorVsCategory.length;i++){
			cRule = $scope.analytics.creatorVsCategory[i];
			if(cRule.x == rule.created_by && (cRule.y == rule.category)){
				cRule.value++;
				isFound = true;
				break;
			}
		}
		if(!isFound){
			$scope.analytics.creatorVsCategory.push({'x':rule.created_by, 'y': rule.category, 'value': 1});
		}
	};
	
	$scope.analyticsUpdateAlertsTriggeredBySeverity = function(rule){
		var cRule,newStatusElm, isFound=false;
		for(var i=0;i<$scope.analytics.severities.length;i++){
			cRule = $scope.analytics.severities[i];
			if(cRule.name == rule.severity){
				cRule.count++;
				cRule.details.push(rule);
				isFound = true;
				break;
			}
		}
		if(!isFound){
			newStatusElm = {};
			newStatusElm.name = rule.severity;
			newStatusElm.count = 1;
			newStatusElm.details = [rule];
			$scope.analytics.severities.push(angular.copy(newStatusElm));
		}
	};
	
	var rules = RulesService.getRulesList();
	if(rules){
		$scope.makeAnalyticsData(rules);
	};
	$scope.alertsGraphTimeFilterChange = function(item){
		$scope.selectedTimeFilter = item;
		RulesService.setSelectedTimeFilter($scope.selectedTimeFilter);
		if(item.label != 'Custom filter'){
			$scope.applyTimeFilter();
		}
		$scope.trackUser('Alert Analtics', 'TimeFilter change',{'Timefilter': item});
	}
	$scope.applyTimeFilter = function(){
		$scope.trackUser('Alert Analtics', 'TimeFilter change',{'Timefilter': $scope.selectedTimeFilter});
		$rootScope.$broadcast('analytics-timefilter-changes', $scope.selectedTimeFilter);
	}
		//usertracking function
		$scope.trackUser = function(app_Page, operation, details){
			var details = JSON.stringify(details);
			UserTrackingService.standard_user_tracking($scope.info.application, app_Page, operation, details).then(function(response) {
	
			}, handleSessionTimeout);
		};

}])

// Controller to handle the manage API templates page
.controller('ManageAPITemplateCtrl', ['$scope', '$sce', '$timeout', '$filter', 'ngTableParams', 'RulesService', 'GlobalService', 'ModalService', 'UserTrackingService', 'AppService',
function($scope, $sce, $timeout, $filter, ngTableParams, RulesService, GlobalService, ModalService, UserTrackingService, AppService) {
	// Object to store the information for manage template page
	$scope.info = {};

	// Stores application name which is used for user tracking
	$scope.info.application = GlobalService.getVal('navRules');

	// Object that stores all the filter information
	$scope.info.filter = {};

	// Stores success messages
	$scope.info.successMsg = "";

	// Stores error messages
	$scope.info.errorMsg = "";

	// Stores whether session is timed out or not
	$scope.info.sessionTimedOut = false;

	// Stores the list of columns
	$scope.columns = $filter('filter')(GlobalService.getVal('APItemplatesColumns'), {
		enabled: true
	});

	// Stores the field of initial Sorting
	$scope.info.initialSortField = GlobalService.getVal('templatesSortField');

	// Initializing the filter model of each column
	for (var i in $scope.columns) {
		$scope.info[$scope.columns[i]['field']] = "";
	}

	// Sets the object of initial sorting
	$scope.info.initialSorting = {};
	$scope.info.initialSorting[$scope.info.initialSortField] = 'desc';

	// Object that stores the page information for custom pagination
	$scope.info.page = {
		"total": 0,
		"current": 1,
		"pages": 0,
		"count": 10,
		"sortField": $scope.info.initialSortField + "desc"
	};

	// Defines whether templates are loading
	$scope.info.templatesLoading = true;
	$scope.info.pageLoading = true;

	//An array that holds apiTemplateId's filtered from rule
	$scope.apiTempIdlist = [];

	$scope.templatesList = [];

	//variavles to handle delete operation
	$scope.multiDelobj = {};
	$scope.apiTemplateIds = [];
	$scope.showDeleteList = [];
	$scope.ignoreDeleteList = [];

	//mps
	$scope.mps = GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
	
	// Populate the table data for first load
	$scope.populateTable = function () {
		$scope.tableParams = new ngTableParams({
			page: 1, // show first page
			count: $scope.info.page['count'], // count per page
			sorting: $scope.info.initialSorting // Initial Sorting
		}, {
				total: $scope.templatesList.length, // length of data
				getData: function ($defer, params) {
					var orderedData = params.sorting() ? $filter('orderBy')($scope.templatesList, params.orderBy()) : $scope.templatesList;
					orderedData = $filter('filterTemplates')(orderedData, $scope.info.filter);
					params.total(orderedData.length);
					$scope.info.page['total'] = orderedData.length;
					$scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});
	};

	// Function to reload templates
	$scope.reloadTemplates = function () {
		//call to fetch api template list
		RulesService.getAPITemplates().then(function (response) {
			var templatesData = response.data.Data;
			//call to fetch config template list
			RulesService.getAPIConfigTemplates().then(function (response) {
				$scope.alertConfigList = response.data.Data;
				//combine the  data[based on config id from template add few more details(base url and Auth key) to yhe template object]
				//This is babel compiled code of ES6
				$scope.combinedData = templatesData.map(function (a) {
					return Object.assign(a, $scope.alertConfigList.find(function (b) {
						return b.apiConfigId == a.apiConfigId;
					}));
				});
				$scope.templatesList = $scope.combinedData;
				$scope.clearAppliedFilters();
				$scope.info.page['current'] = 1;
				$scope.tableParams.reload();
				$scope.tableParams.page(1);
				$scope.info.templatesLoading = false;
				RulesService.setAPITemplatesList($scope.templatesList);
				$scope.info.rulesList = RulesService.getRulesList();
				$scope.setTemplatesLabelMap();
				$scope.showDeleteList = [];
			}), function (response) {
				$scope.info.templatesLoading = false;

			}
		}, function (response) {
			$scope.templatesList = "";
			$scope.clearAppliedFilters();
			$scope.info.page['current'] = 1;
			$scope.tableParams.reload();
			$scope.tableParams.page(1);
			$scope.info.templatesLoading = false;
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				if ($scope.info.errorMsg == "") {
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['temp_load_failed'];
				} else {
					$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_load_failed'];
				}
			}

			handleSessionTimeout(response);
		});
	};

	// Function to clear all messages
	$scope.clearMessage = function () {
		if (!$scope.info.templatesLoading) {
			$scope.info.successMsg = "";
			$scope.info.errorMsg = "";
			$scope.info.addTemplateMsg = {};
		}
	};

	// Stores the list of templates
	RulesService.getAPITemplates().then(function (response) {
		$scope.templatesData = response.data.Data;
		//call get alert config list
		RulesService.getAPIConfigTemplates().then(function (response) {
			$scope.alertConfigList = response.data.Data;
			//combine the  data
			$scope.combinedData = $scope.templatesData.map(function (a) {
				return Object.assign(a, $scope.alertConfigList.find(function (b) {
					return b.apiConfigId == a.apiConfigId;
				}));
			});
			$scope.templatesList = $scope.combinedData;
			$scope.populateTable();
			$scope.info.templatesLoading = false;
			RulesService.setAPITemplatesList($scope.templatesList);
			$scope.info.rulesList = RulesService.getRulesList();
			$scope.setTemplatesLabelMap();
		}), function (response) {

		}
	}, function (response) {
		$scope.templatesList = "";
		$scope.populateTable();
		$scope.info.templatesLoading = false;
		console.error('Error loading templates list');
		if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
			GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
			$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
		} else {
			if ($scope.info.errorMsg == "") {
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['temp_load_failed'];
			} else {
				$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_load_failed'];
			}
		}
		handleSessionTimeout(response);
	});

	// Function to set the templates label map
	$scope.setTemplatesLabelMap = function () {
		var map = {};
		for (var i = 0; i < $scope.templatesList.length; i++) {
			map[$scope.templatesList[i]['template_name']] = true;
		}
		RulesService.setTemplatesLabelMap(map);
	};

	// Changes page size
	$scope.changePageSize = function () {
		$scope.info.page['count'] = parseInt($scope.info.page['count']);
		$scope.tableParams.count($scope.info.page['count']);
		$scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
		if ($scope.info.page['current'] > $scope.info.page['pages']) {
			$scope.info.page['current'] = $scope.info.page['pages'];
			$scope.tableParams.page($scope.info.page['current']);
		}
	};

	// Switch to next page if current page is not last page
	$scope.nextPage = function () {
		if ($scope.info.page['current'] < $scope.info.page['pages']) {
			$scope.info.page['current'] += 1;
			$scope.tableParams.page($scope.info.page['current']);
		}
	};

	// Switch to previous page if current page is not first page
	$scope.prevPage = function () {
		if ($scope.info.page['current'] > 1) {
			$scope.info.page['current'] -= 1;
			$scope.tableParams.page($scope.info.page['current']);
		}
	};

	// Switch to first page if not on first page
	$scope.firstPage = function () {
		if ($scope.info.page['current'] == 1)
			return;
		$scope.info.page['current'] = 1;
		$scope.tableParams.page($scope.info.page['current']);
	};

	// Switch to last page if not on last page
	$scope.lastPage = function () {
		if ($scope.info.page['current'] == $scope.info.page['pages'])
			return;
		$scope.info.page['current'] = $scope.info.page['pages'];
		$scope.tableParams.page($scope.info.page['current']);
	};

	// Select/unselect select all checkbox based on templates selection
	$scope.checkTemplatesSelection = function () {
		for (var i in $scope.templatesList) {
			if (!$scope.templatesList[i].selected) {
				$scope.info.selectAll = false;
				return;
			}
		}
		$scope.info.selectAll = true;
	};

	// Select/unselect all templates on the page
	$scope.checkSelectAll = function () {
		if (!!$scope.info.selectAll) {
			for (var i = 0; i < $scope.templatesList.length; i++) {
				$scope.templatesList[i].selected = true;
			}
		} else {
			for (var i = 0; i < $scope.templatesList.length; i++) {
				delete $scope.templatesList[i].selected;
			}
		}
	};

	// Check if any template is selected
	$scope.checkTemplateSelected = function () {
		if (!!$scope.tableParams) {
			var selectedTemplates = $filter('filter')($scope.tableParams.data, {
				selected: true
			});
			if (!!selectedTemplates.length) {
				return true;
			}
		}
		return false;
	};

	// Function to add a new API  template
	$scope.addNewTemplate = function () {
		$scope.info.templatesLoading = true;
		RulesService.setTemplateMode('new');
		$scope.$parent.changeCurrentPage('add_edit_API_template');
	};

	// Function to edit a template
	$scope.editTemplate = function (template) {
		$scope.info.templatesLoading = true;
		RulesService.setTemplateMode('edit', template);
		$scope.$parent.changeCurrentPage('add_edit_API_template');
	};

	// Function to delete a single template
	$scope.deleteAPITemplate = function (template) {
		if ($scope.filteredapiTempIdlist.includes(template.apiTemplateId)) {
			ModalService.alertBox({
				msg: GlobalService.getVal('rulesMsgs')['API_temp_del_rule_associated']
			});
			return;
		}

		$scope.delTemplate = template;
		$scope.msg = GlobalService.getVal('rulesMsgs')['temp_del_single'][0] + template.apiTemplateName + GlobalService.getVal('rulesMsgs')['temp_del_single'][1];
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/delete_template.html", $scope, false, 'static');
	};

	// Confirm the deletion of template
	$scope.deleteTemplateConfirm = function () {
		var template = $scope.delTemplate;
		$scope.info.templatesLoading = true;
		$scope.mps = GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
		var deleteObj = {};
		deleteObj.apiTemplateId = template.apiTemplateId;
		deleteObj.mps = $scope.mps;
		RulesService.deleteAPITemplate(deleteObj).then(function (response) {
			UserTrackingService.standard_user_tracking($scope.info.application, 'Manage API Template', 'delete', JSON.stringify(deleteObj)).then(function (response) {

			}, handleSessionTimeout);
			$scope.reloadTemplates();
			if ($scope.info.successMsg == "") {
				$scope.info.successMsg = GlobalService.getVal('rulesMsgs')['temp_del_success'][0] + template.apiTemplateName + GlobalService.getVal('rulesMsgs')['temp_del_success'][1];
			} else {
				$scope.info.successMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_del_success'][0] + template.apiTemplateName + GlobalService.getVal('rulesMsgs')['temp_del_success'][1];
			}
		}, function (response) {
			console.error('Unable to delete ' + template.template_name);
			$scope.info.templatesLoading = false;
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				if ($scope.info.errorMsg == "") {
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['temp_del_failed'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_failed'][1];
				} else {
					$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_del_failed'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_failed'][1];
				}
			}
			handleSessionTimeout(response);
		});
	};

	// Function to delete selected templates
	$scope.deleteSelectedTemplates = function () {
		$scope.selectedTemplates = $filter('filter')($scope.tableParams.data, {
			selected: true
		});
		var found = $scope.selectedTemplates.filter(function (obj) {
			if (!$scope.filteredapiTempIdlist.includes(obj.apiTemplateId)) {
				$scope.showDeleteList.push(obj);
				$scope.apiTemplateIds.push(obj.apiTemplateId);
			}

		});

		if ($scope.showDeleteList.length == 0) {
			ModalService.alertBox({
				msg: GlobalService.getVal('rulesMsgs')['map_temp_multiple_Del_none']
			});
			return;
		}
		var templatesString = "<br>";
		for (var i = 0; i < $scope.selectedTemplates.length; i++) {
			if (i != $scope.selectedTemplates.length - 1) {
				templatesString += "<strong>" + $scope.selectedTemplates[i].apiTemplateName + "<strong>, ";
			} else {
				templatesString += "<strong>" + $scope.selectedTemplates[i].apiTemplateName + "<strong>";
			}
		}
		$scope.msg = GlobalService.getVal('rulesMsgs')['temp_del_multiple'] + templatesString;
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/delete_api_template_multiple.html", $scope, false, 'static');
	};

	// Function to confirm the deletion of selected templates
	$scope.deleteSelectedTemplatesConfirm = function () {
		$scope.info.templatesLoading = true;
		$scope.multiDelobj.apiTemplateIds = $scope.apiTemplateIds;
		$scope.multiDelobj.mps = $scope.mps;
		RulesService.deleteAPITemplateMultiple($scope.multiDelobj).then(function (response) {
			$scope.reloadTemplates();
			if ($scope.info.successMsg == "") {
				$scope.info.successMsg = GlobalService.getVal('rulesMsgs')['temp_del_success'][0] + GlobalService.getVal('rulesMsgs')['temp_del_success'][1];
			} else {
				$scope.info.successMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_del_success'][0] + GlobalService.getVal('rulesMsgs')['temp_del_success'][1];
			}
			UserTrackingService.standard_user_tracking($scope.info.application, 'Manage API Template', 'delete', JSON.stringify($scope.multiDelobj)).then(function (response) {

			}, handleSessionTimeout);
			$scope.info.selectAll = false;
		}), function (response) {
			$scope.info.templatesLoading = false;
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				if ($scope.info.errorMsg == "") {
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['temp_del_failed'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_failed'][1];
				} else {
					$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_del_failed'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_failed'][1];
				}
			}
			handleSessionTimeout(response);
		}
	};

	// Function to call the delete API for each selected template
	$scope.callDeleteTemplate = function (template, total) {
		RulesService.deleteTemplate(template.template_id).then(function (response) {
			$scope.info.doneDeletions++;
			$scope.info.deletedTemplates.push(template.template_name);
			if ($scope.info.doneDeletions == total) {
				UserTrackingService.standard_user_tracking($scope.info.application, 'Manage Template', 'multiple delete', "[" + $scope.info.deletedTemplates.toString() + "]").then(function (response) {

				}, handleSessionTimeout);
				$scope.reloadTemplates();
			}
			if ($scope.info.successMsg == "") {
				$scope.info.successMsg = GlobalService.getVal('rulesMsgs')['temp_del_success'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_success'][1];
			} else {
				$scope.info.successMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_del_success'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_success'][1];
			}
		}, function (response) {
			console.error('Unable to delete');
			$scope.info.doneDeletions++;
			if ($scope.info.doneDeletions == total) {
				if ($scope.info.deletedTemplates.length) {
					UserTrackingService.standard_user_tracking($scope.info.application, 'Manage Template', 'multiple delete', "[" + $scope.info.deletedTemplates.toString() + "]").then(function (response) {

					}, function (response) {

					});
				}
				$scope.reloadTemplates();
			}
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				if ($scope.info.errorMsg == "") {
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['temp_del_failed'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_failed'][1];
				} else {
					$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_del_failed'][0] + template.template_name + GlobalService.getVal('rulesMsgs')['temp_del_failed'][1];
				}
			}
			handleSessionTimeout(response);
		});
	};

	// Update the filter object if any of the filter model is updated
	$scope.searchTemplate = function (field) {
		if ($scope.info[field] != "") {
			$scope.info.filter[field] = $scope.info[field];
		} else {
			if (!!$scope.info.filter[field]) {
				delete $scope.info.filter[field];
			}
		}
		$scope.tableParams.reload();
		if ($scope.info.page['current'] > $scope.info.page['pages']) {
			if ($scope.info.page['pages'] == 0) {
				$scope.info.page['current'] = 1;
			} else {
				$scope.info.page['current'] = $scope.info.page['pages'];
			}
			$scope.tableParams.page($scope.info.page['current']);
		}
	};

	// Sort the column on clicking the column header
	$scope.sortColumn = function (field) {
		if (!(document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "BUTTON")) {
			$scope.tableParams.sorting(field, $scope.tableParams.isSortBy(field, 'asc') ? 'desc' : 'asc');
			$scope.info.page['sortField'] = field + ($scope.tableParams.isSortBy(field, 'asc') ? 'asc' : 'desc');
		}
	};

	// Clear all the applied filters
	$scope.clearAppliedFilters = function () {
		if (Object.keys($scope.info.filter).length != 0) {
			for (var i in $scope.columns) {
				delete $scope.columns[i].filterString;
			}

			for (var i in $scope.columns) {
				$scope.info[$scope.columns[i]['field']] = "";
			}

			$scope.info.filter = {};
			$scope.tableParams.reload();

			$scope.info.page['current'] = 1;
			$scope.tableParams.page($scope.info.page['current']);
		}
		if ($scope.info.page['sortField'] != $scope.info.initialSortField + 'desc') {
			$scope.tableParams.sorting($scope.info.initialSortField, 'desc');
			$scope.info.page['sortField'] = $scope.info.initialSortField + 'desc';
		}
	};

	// Check if any filter is applied or not
	$scope.checkAppliedFilters = function () {
		var filters = false;
		if (Object.keys($scope.info.filter).length != 0)
			filters = true;
		if (filters || $scope.info.page['sortField'] != $scope.info.initialSortField + 'desc') {
			return true;
		}
		return false;
	};

	// Function to render text in html format
	$scope.renderHtml = function (html) {
		return $sce.trustAsHtml(html);
	};

	// Function to handle session timeout
	function handleSessionTimeout(response) {
		if (!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
			$scope.info.sessionTimedOut = true;
			ModalService.sessionTimeout();
		}
	};

	$scope.info.addTemplateMsg = RulesService.getApiTemplateAddedMessage();

	//fetches the rule list
	$scope.rulesList = RulesService.getRulesList();

	var list = $scope.rulesList.filter(function (obj) {
		if (obj.api_template_id) {
			$scope.apiTempIdlist.push(obj.api_template_id);
		}
	});
	$scope.filteredapiTempIdlist = $scope.apiTempIdlist.filter(function (elem, index, self) {
		return index == self.indexOf(elem);
	});


	$timeout(function () {
		var data = {}
		RulesService.setApiTemplateAddedMessage(data);
	}, 2000);

	//function to clear/reset the list
	$scope.emptySelectedList = function(){
		$scope.showDeleteList = [];
		}

}])


// Controller to handle adding and editing of API templates
.controller('AddEditAPITemplateCtrl', ['$scope', '$sce', '$timeout', '$filter', 'ModalService', 'RulesService', 'GlobalService', 'UserTrackingService', 'AppService',
function($scope, $sce, $timeout, $filter, ModalService, RulesService, GlobalService, UserTrackingService, AppService) {

	/*-------------------------------------------------------------------------------
	 @All Variables Declaraction Getter and Setter methods	
	---------------------------------------------------------------------------------*/

	// Object to store all information about Add/Edit Template page
	$scope.info = {};

	// Stores application name which is used for user tracking
	$scope.info.application = GlobalService.getVal('navRules');

	

	// Specifies whether rule is added
	$scope.info.templateAdded = false;

	// Stores the message to be displayed on top
	$scope.info.addTemplateMsg = {};

	// Stores whether session is timed out or not
	$scope.info.sessionTimedOut = false;

	// Stores the section column label map
	$scope.sectionsColumnLabelMap = {};

	$scope.info.scope = "row";

	$scope.alertConfigList = '';
	$scope.info.lastElementFocused = null;;
	//variables binded to form elements
	$scope.addApiTemplate = { 
		
		"apiTemplateName": "",
		"apiConfigId": "",
		"apiPayload": "",
	}

	var manufacturer = GlobalService.getVal('manufacturer');
	var product = GlobalService.getVal('product');
	var schema = GlobalService.getVal('schema');
	$scope.sectionAttributeLabelList = RulesService.getSectionsColumnLabelForManageAPI();
	$scope.showGlobAttrib = true;

	$scope.nameBeforeEdit = "";
	//console.log('sectionAttributeLabelList', $scope.sectionAttributeLabelList);

	/*----------------------------------------------------------------------------------
	@ Add Edit API Tempalte Logic and Functions 
	-----------------------------------------------------------------------------------*/

	// Function to populate add template data
	$scope.populateAddTemplate = function () {
		$scope.addApiTemplate.mps = GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
		$scope.addApiTemplate.pageLabel = 'Add Template';
		$scope.addApiTemplate.apiTemplateName = "";
		$scope.addApiTemplate.apiConfigId = "select";
		$scope.addApiTemplate.apiPayload = "";
		$scope.setSavedMode();
		
	};

	// Function to populate edit template data
	$scope.populateEditTemplate = function () {
		$scope.nameBeforeEdit = RulesService.getTemplateMode()['data']['apiTemplateName'];
		$scope.addApiTemplate.pageLabel = 'Edit Template - ' + RulesService.getTemplateMode()['data']['apiTemplateName'];
		$scope.addApiTemplate.mps = GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
		$scope.addApiTemplate.apiTemplateName = RulesService.getTemplateMode()['data']['apiTemplateName'];
		$scope.addApiTemplate.apiConfigId = RulesService.getTemplateMode()['data']['apiConfigId'];
		$scope.addApiTemplate.apiPayload = RulesService.getTemplateMode()['data']['apiPayload'];
		$scope.addApiTemplate.apiTemplateId = RulesService.getTemplateMode()['data']['apiTemplateId'];
		$scope.currentKeyLabel = RulesService.getTemplateMode()['data']['apiAuthKey'];
		$scope.setSavedMode();
	};

	// Function to set template in saved mode
	$scope.setSavedMode = function () {
		RulesService.setAPITemplateSavedStatus(false);
	};

	// Function to set template in unsaved mode
	$scope.setUnsavedMode = function () {
		RulesService.setAPITemplateSavedStatus(true);
	};
	
	// Set form elements according to new or edit mode
	if (RulesService.getTemplateMode() && RulesService.getTemplateMode()['mode'] == 'edit') {
		$scope.populateEditTemplate();
		//$scope.setKeyName();
		$scope.info.pageLoading = false;
	} else {
		$scope.populateAddTemplate();
	}
	// Function to add new template
	$scope.addNewTemplate = function () {
		RulesService.setTemplateMode('new');
		$scope.info.templateAdded = false;
		$scope.info.addTemplateMsg = {};
		$scope.populateAddTemplate();
	};
	//call get alert config list
	RulesService.getAPIConfigTemplates().then(function (response) {
		$scope.alertConfigList = response.data.Data;
		//console.log($scope.alert_config_list);
	}), function (response) {

	}
	// Function to save the template
	$scope.saveTemplate = function () {
		//var sectionColumnValues = RulesService.getSectionsAndAttributePair($scope.addApiTemplate.httpVarMap);
		if (!$scope.validateTemplate()) {
			return;
		}
		if (RulesService.getTemplateMode() && RulesService.getTemplateMode()['mode'] == 'edit') {
			// if (!$scope.validateTemplateName()) {
			// 	return;
			// }
			
			$scope.info.pageLoading = true;
			// $scope.addApiTemplate.httpCredentials = JSON.stringify($scope.addApiTemplate.httpCredentials);
			RulesService.editAPITemplateCall($scope.addApiTemplate).then(function (response) {
				$scope.info.addTemplateMsg = {
					type: 'success',
					msg: GlobalService.getVal('rulesMsgs')['add_template_success']
				};
				RulesService.setApiTemplateAddedMessage($scope.info.addTemplateMsg);
				$scope.setSavedMode();
				$scope.$parent.changeCurrentPage('manage_API_template');
				UserTrackingService.standard_user_tracking($scope.info.application, 'Add_Edit template', 'edit', JSON.stringify($scope.addApiTemplate)).then(function (response) {

				});
				$scope.info.templateAdded = true;
			}, function (response) {
				if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
					GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
					$scope.info.addTemplateMsg = {
						type: 'failure',
						msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
					};
				} else {
					$scope.info.addTemplateMsg = {
						type: 'failure',
						msg: GlobalService.getVal('rulesMsgs')['add_template_fail']
					};
				}
				$scope.info.templateAdded = false;
				$scope.info.pageLoading = false;
				handleSessionTimeout(response);
			});
		}
		else {			
			$scope.info.pageLoading = true;
			//$scope.addApiTemplate.httpCredentials = JSON.stringify($scope.addApiTemplate.httpCredentials);
			delete $scope.addApiTemplate.pageLabel;
			RulesService.addAPITemplateCall($scope.addApiTemplate).then(function (response) {
			$scope.info.addTemplateMsg = {
				type: 'success',
				msg: GlobalService.getVal('rulesMsgs')['add_template_success']
			};
			//Rule$scope.info.addTemplateMsg); 
			RulesService.setApiTemplateAddedMessage($scope.info.addTemplateMsg);
			$scope.setSavedMode();
			$scope.$parent.changeCurrentPage('manage_API_template');

			UserTrackingService.standard_user_tracking($scope.info.application, 'Add_Edit template', 'add', JSON.stringify($scope.addApiTemplate)).then(function (response) {

			}, handleSessionTimeout);

			$scope.info.templateAdded = true;
			}, function (response) {
				if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
					GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
					$scope.info.addTemplateMsg = {
						type: 'failure',
						msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
					};
				} else {
					$scope.info.addTemplateMsg = {
						type: 'failure',
						msg: GlobalService.getVal('rulesMsgs')['add_template_fail']
					};
				}
				$scope.info.templateAdded = false;
				$scope.info.pageLoading = false;
				handleSessionTimeout(response);
			});
		}
	};

	$scope.setKeyName = function () {
		var tempList = $scope.alertConfigList.filter(function (i) {
			return i.apiConfigId == $scope.addApiTemplate.apiConfigId;
		});
		$scope.currentKeyLabel = tempList[0].apiAuthKey;
	}

	/*--------------------------------------------------------------------
	  Form Validation
	 ---------------------------------------------------------------------*/

	// Function to validate the template details entered
	$scope.validateTemplate = function () {
		var found = [];
		$scope.info.apiTemplateList = RulesService.getAPITemplatesList();
		if (/^\s*$/.test($scope.addApiTemplate.apiTemplateName)) {
			ModalService.alertBox({
				msg: "Template Name" + GlobalService.getVal('rulesMsgs')['temp_field_blank']
			});
			return;
		}

		if (RulesService.getTemplateMode() && RulesService.getTemplateMode()['mode'] != 'new') {

			if ($scope.nameBeforeEdit != $scope.addApiTemplate.apiTemplateName) {
				found = $scope.info.apiTemplateList.filter(function (name) {
					return name.apiTemplateName == $scope.addApiTemplate.apiTemplateName
				});
			}
			///var filteredList = $scope.info.apiTemplateList.filter(function(name){return name.apiTemplateName != $scope.addApiTemplate.apiTemplateName});
			

		} else {
			if ($scope.info.apiTemplateList != undefined && $scope.info.apiTemplateList) {
				found = $scope.info.apiTemplateList.filter(function (name) {
					return name.apiTemplateName == $scope.addApiTemplate.apiTemplateName;
				});
			}
		}

		if (found.length > 0) {
			ModalService.alertBox({
				msg: GlobalService.getVal('rulesMsgs')['duplicateTemplateName']
			});
			return false;
		}
		// if (RulesService.getTemplateMode() && RulesService.getTemplateMode()['mode'] != 'new') {
		// 	return true;
		// }

		//check if apiconfigId is empty
		if (/^\s*$/.test($scope.addApiTemplate.apiConfigId) || $scope.addApiTemplate.apiConfigId == 'select' ) {
			ModalService.alertBox({
				msg:  GlobalService.getVal('rulesMsgs')['baseTemplateEmpty']
			});
			return;
		}

		//check if Payload Data(VarMap) is empty
		if (/^\s*$/.test($scope.addApiTemplate.apiPayload)) {
			ModalService.alertBox({
				msg: "Payload Data" + GlobalService.getVal('rulesMsgs')['temp_field_blank']
			});
			return;
		}

		// //check if Payload Data(VarMap) is valid JSON
		// var str = $scope.addApiTemplate.apiPayload;
		// function IsJsonString(str) {
		// 	try {
		// 		JSON.parse(str);
		// 	} catch (e) {
		// 		return false;
		// 	}
		// 	return true;
		// }

		// if (!IsJsonString(str)) {
		// 	ModalService.alertBox({
		// 		msg: GlobalService.getVal('rulesMsgs')['invalidJson']
		// 	});
		// 	return;
		// }

		// //check for string with #
		// if ($scope.showGlobAttrib) {
		// 	var payloadValArr = Object.values(JSON.parse(str));
		// 	for (i = 0; i < payloadValArr.length; i++) {

		// 		var splitvalues = [];
		// 		splitvalues = String(payloadValArr[i]).split(' ');
		// 		var validateValues = [];

		// 		for (j = 0; j < splitvalues.length; j++) {
		// 			if (String(splitvalues[j]).startsWith("#")) {
		// 				validateValues.push(splitvalues[j]);
		// 			}
		// 		}
		// 		if (validateValues.length > 0) {
		// 			for (k = 0; k < validateValues.length; k++) {
		// 				if ($scope.info.globalAtrributeValues.indexOf(validateValues[k]) == -1) {
		// 					ModalService.alertBox({
		// 						msg: "The attribute " + "<strong>&nbsp;" + validateValues[k] + "</strong>&nbsp;" + " is Invalid."//GlobalService.getVal('rulesMsgs')['invalidJson']
		// 					});
		// 					return;
		// 				}
		// 			}
		// 		}
		// 	}
		// }	
		if ($scope.showGlobAttrib) {
			var str = $scope.addApiTemplate.apiPayload;
			var matchList = str.match(/#\w+/gim);
			console.log(matchList);
			if (!matchList) {
				ModalService.alertBox({
					msg: "The Payload must contain altleast one global attribute."//GlobalService.getVal('rulesMsgs')['invalidJson']
				});
				return;
			}
			else {
				matchList.filter(function (item, index, inputArray) {
					return inputArray.indexOf(item) == index;
				});
		}
			if (matchList) {
				for (i = 0; i < matchList.length; i++) {
					if ($scope.info.globalAtrributeValues.indexOf(matchList[i]) == -1) {
						ModalService.alertBox({
							msg: "The attribute " + "<strong>&nbsp;" + matchList[i] + "</strong>&nbsp;" + " is Invalid."//GlobalService.getVal('rulesMsgs')['invalidJson']
						});
						return;
					}
				}
			}
		}
		return true;
	};


	// Function to render text in html format
	$scope.renderHtml = function (html) {
		return $sce.trustAsHtml(html);
	};

	// Function to handle session timeout
	function handleSessionTimeout(response) {
		if (!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
			$scope.info.sessionTimedOut = true;
			ModalService.sessionTimeout();
		}
	};


	// /*---------------------------------------------------------------------
	//   @ Template constants code
	//  ----------------------------------------------------------------------*/
	var globalTemplatesCons = angular.copy(GlobalService.getVal('templateConstants')['common']);
	// Stores the contants to be shown on templates page
	$scope.info.commonConstants = $filter('filter')(globalTemplatesCons, {
		enabled: true
	});
	$scope.info.customerConstants = $filter('filter')(globalTemplatesCons[manufacturer], {
		enabled: true
	});
	if($scope.info.customerConstants != undefined){
		$scope.info.templateConstants = new Array($scope.info.commonConstants.concat($scope.info.customerConstants));
		$scope.rawconstants = $scope.info.templateConstants;
	}
	else{
		$scope.info.templateConstants = $scope.info.commonConstants;
		$scope.rawconstants = $scope.info.templateConstants;
	}
	
	//replace object values with # and remove curly brackets
	$scope.info.templateConstants.forEach(function (obj) {
		obj.value ="#" + obj.value.replace(/{|}/gm, "");
	});

	var constValues = $scope.info.templateConstants.map(function(obj){
		return obj.value;
	});

	//Get Global attributes to display on add/edit page
	$scope.info.globalAtrributeList = RulesService.getGlobalAttribArr();
	if (Object.keys($scope.info.globalAtrributeList).length === 0 && $scope.info.globalAtrributeList.constructor === Object) {
		$scope.showGlobAttrib = false;
		$scope.info.globalAtrributeValues = constValues;
	}
	else {
		$scope.info.globalAtrributeValues = Object.values($scope.info.globalAtrributeList).concat(constValues);
	}
	
	

	/*-------------------------------------------------------------------------------
	*********************************************************************************
	END AddEditAPITemplateCtrl Controller
	*********************************************************************************
	---------------------------------------------------------------------------------*/
	
}])


// Controller to handle adding and editing of API templates
.controller('apiAdminConfigCtrl', ['$scope', '$sce', '$timeout', '$filter', 'ModalService', 'RulesService', 'GlobalService', 'UserTrackingService', 'AppService','$interval',
function($scope, $sce, $timeout, $filter, ModalService, RulesService, GlobalService, UserTrackingService, AppService, $interval) {
	/*-------------------------------------------------------------------------------
	@Author: Nishanth
	This controller is used for alert api config feature
	---------------------------------------------------------------------------------*/

	/*-------------------------------------------------------------------------------
	 @All Variables Declaraction Getter and Setter methods	
	---------------------------------------------------------------------------------*/

	// Object to store all information about Add/Edit Template page
	$scope.info = {};

	$scope.info.currentPage = 'template'; //can be "register" or "list" or "template" or edit
	$scope.info.showMsg = false;

	// Stores application name which is used for user tracking
	$scope.info.application = GlobalService.getVal('navRules');

	// Defines whether the page is loading
	$scope.info.pageLoading = true;

	// Specifies whether rule is added
	$scope.info.templateAdded = false;

	// Stores the message to be displayed on top
	$scope.info.addTemplateMsg = {};

	// Stores whether session is timed out or not
	$scope.info.sessionTimedOut = false;

	$scope.showimg = false;

	// Stores success messages
	$scope.info.successMsg = "";

	// Stores error messages
	$scope.info.errorMsg = "";

	//MPS
	var manufacturer = GlobalService.getVal('manufacturer');
	var product = GlobalService.getVal('product');
	var schema = GlobalService.getVal('schema');

	$scope.configTableData = [];

	//initial placeholders
	$scope.userplacehld = "Username";
	$scope.userpassplacehld = "Password";

	//initial data
	$scope.apiConfigPost = {
		apiConfigName: '',
		apiAuthType: 'PWD',
		apiHeaders: '',
		apiUrl: '',
		apiAuthKey: '',
		apiAuthPass: '',
		apiRequestType: "POST",
		apiTimeout: 3,
		apiRetries: 3
	};

	//setting up dynamic placeholders
	$scope.changeplaceholders = function () {
		if ($scope.apiConfigPost.apiAuthType == 'PWD') {
			$scope.userplacehld = "Username";
			$scope.userpassplacehld = "Password";
		} else {
			$scope.userplacehld = "Auth Key Label";
			$scope.userpassplacehld = "Auth Key Value";
		}
	}


	$scope.populateConfigTable = function () {
		$scope.loadListPage();
	}

	$scope.changePage = function (page) {
		$scope.info.pageLoading = true;

		if (page == 'register') {
			$scope.resetForm();
			$scope.$parent.changeCurrentPage('api_admin_config_register');
		}
		if (page == 'edit') {
			
			$scope.$parent.changeCurrentPage('api_admin_config_register');
		}
		$scope.info.currentPage = page;
		$scope.info.pageLoading = false;
	}

	$scope.imInregisterPage = function () {
		if ($scope.info.currentPage == 'register' || $scope.info.currentPage == 'edit') {
			return true;
		}

		return false;
	}

	$scope.imInListPage = function () {
		return $scope.info.currentPage == 'list';
	}

	$scope.imInAddTemplatePage = function () {
		return $scope.info.currentPage == 'template';
	}

	$scope.resetForm = function () {
		$scope.apiConfigPost = {
			apiConfigName: '',
			apiAuthType: 'PWD',
			apiHeaders: '',
			apiUrl: '',
			apiAuthKey: '',
			apiAuthPass: '',
			apiRequestType: "POST",
			apiTimeout: 3,
			apiRetries: 3
		};
	}
	//Add template function for api config
	$scope.addEditApiConfig = function () {
		if (!$scope.validateConfigTemplate()) {
			return;
		}
		$scope.info.pageLoading = true;
		if ($scope.info.currentPage == 'edit') {
			RulesService.editAPIConfigTemplate($scope.apiConfigPost).then(function (response) {
				$scope.info.addTemplateMsg = {
					type: 'success',
					msg: GlobalService.getVal('rulesMsgs')['add_template_success']
				};
				$scope.populateConfigTable();
				$scope.$parent.changeCurrentPage('api_admin_config');
				UserTrackingService.standard_user_tracking($scope.info.application, 'API config', 'Update', JSON.stringify($scope.apiConfigPost)).then(function(response) {

				});
			}, function (response) {
				if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
					GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
					$scope.info.addTemplateMsg = {
						type: 'failure',
						msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
					};
				} else {
					$scope.info.addTemplateMsg = {
						type: 'failure',
						msg: GlobalService.getVal('rulesMsgs')['add_template_fail']
					};
				}
				$scope.info.pageLoading = false;
			});

		} else {
			RulesService.addAPIConfigTemplate($scope.apiConfigPost).then(function (response) {
				$scope.info.addTemplateMsg = {
					type: 'success',
					msg: GlobalService.getVal('rulesMsgs')['add_template_success']
				};
				$scope.populateConfigTable();
				$scope.$parent.changeCurrentPage('api_admin_config');
				UserTrackingService.standard_user_tracking($scope.info.application, 'API config', 'Add', JSON.stringify($scope.apiConfigPost)).then(function(response) {

				});

			}, function (response) {
				if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
					GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
					$scope.info.addTemplateMsg = {
						type: 'failure',
						msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
					};
				} else {
					$scope.info.addTemplateMsg = {
						type: 'failure',
						msg: GlobalService.getVal('rulesMsgs')['add_template_fail']
					};
				}
				$scope.info.pageLoading = false;
			});


		}
	}

	//Edit function for api config
	$scope.editConfig = function (data) {
		if (!data.apiAuthPass) {
			data.apiAuthPass = '';
		}
		data.apiTimeout = 3;
		data.apiRetries = 3;
		$scope.apiConfigPost = data;
		$scope.changePage('edit');
	}

	// Function to delete a single template
	$scope.deleteConfigTemplateModal = function (template) {
		$scope.delTemplate = template;
		$scope.msg = GlobalService.getVal('rulesMsgs')['admin_config_temp_del_single'][0] + "<strong>" + template.apiConfigName + "</strong>" + GlobalService.getVal('rulesMsgs')['temp_del_single'][1];
		$scope.modal = ModalService.openModal("partials/rules-and-alerts/delete_api_config_template.html", $scope, false, 'static');
	};

	//Delete confirm function for api config
	$scope.deleteConfig = function () {


		if ($scope.configidarr.includes($scope.delTemplate.apiConfigId)) {
			ModalService.alertBox({
				msg: GlobalService.getVal('rulesMsgs')['admin_config_temp_associated'][0] + $scope.delTemplate.apiConfigName + GlobalService.getVal('rulesMsgs')['admin_config_temp_associated'][1]  + $scope.delTemplate.apiConfigName + GlobalService.getVal('rulesMsgs')['admin_config_temp_associated'][2] 
			});
			return;
		}

		$scope.info.pageLoading = true;
		RulesService.deleteAPIConfigTemplate($scope.delTemplate.apiConfigId).then(function (response) {
			$scope.info.addTemplateMsg = {
				type: 'success',
				msg: GlobalService.getVal('rulesMsgs')['temp_del_success'][0] + $scope.delTemplate.apiConfigName + GlobalService.getVal('rulesMsgs')['temp_del_success'][1]
			};
			$scope.populateConfigTable();
			UserTrackingService.standard_user_tracking($scope.info.application, 'API config', 'Delete', $scope.delTemplate.apiConfigId).then(function(response) {

			});
		}, function (response) {
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.addTemplateMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
				};
			} else {
				$scope.info.addTemplateMsg = {
					type: 'failure',
					msg: GlobalService.getVal('rulesMsgs')['admin_config_temp_delete_fail']
				};
			}
			$scope.info.pageLoading = false;
		});
	}

	//function to load list page table data
	$scope.loadListPage = function () {
		RulesService.getAPIConfigTemplates().then(function (response) {

			$scope.configTableData = response.data.Data;


			if (!$scope.configTableData || !$scope.configTableData.length) {
				$scope.changePage('template');
			}
			else {
				$scope.changePage('list');
			}
			$scope.info.pageLoading = false;
		}, function (response) {
			if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
				GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
				$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
			} else {
				if ($scope.info.errorMsg == "") {
					$scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['temp_load_failed'];
				} else {
					$scope.info.errorMsg += "<br>" + GlobalService.getVal('rulesMsgs')['temp_load_failed'];
				}
			}
			$scope.info.pageLoading = false;

		});

	}

	/*-----------------------------------------------------------------------------
	//form Validation
	------------------------------------------------------------------------------*/

	$scope.validateConfigTemplate = function () {

		//check if Base template label  is empty
		if (/^\s*$/.test($scope.apiConfigPost.apiConfigName)) {
			ModalService.alertBox({
				msg: "Base Template Name" + GlobalService.getVal('rulesMsgs')['temp_field_blank']
			});
			return;
		}

		//Validate Duplicat template names in case of edit template
		if ($scope.info.currentPage == 'edit') {
			var filteredList = $scope.configTableData.filter(function (name) { return name.apiConfigName != $scope.apiConfigPost.apiConfigName });
			var found = filteredList.filter(function (name) { return name.apiConfigName == $scope.apiConfigPost.apiConfigName });
			if (found.length > 0) {
				ModalService.alertBox({
					msg: GlobalService.getVal('rulesMsgs')['duplicateTemplateName']
				});
				return;
			}

			return true;
		}

		//Validate Duplicat template names in case of add template
		var found = $scope.configTableData.filter(function (name) { return name.apiConfigName == $scope.apiConfigPost.apiConfigName });
		if (found.length > 0) {
			ModalService.alertBox({
				msg: GlobalService.getVal('rulesMsgs')['duplicateTemplateName']
			});
			return;
		}



		//check if Base template label  is empty
		if (/^\s*$/.test($scope.apiConfigPost.apiHeaders)) {
			ModalService.alertBox({
				msg: "Http Header" + GlobalService.getVal('rulesMsgs')['temp_field_blank']
			});
			return;
		}

		//check if Base url  label  is empty
		if (/^\s*$/.test($scope.apiConfigPost.apiUrl)) {
			ModalService.alertBox({
				msg: "Base URL" + GlobalService.getVal('rulesMsgs')['temp_field_blank']
			});
			return;
		}

		//check for valid http url
		var validateUrl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i
			.test($scope.apiConfigPost.apiUrl);
		if (!validateUrl) {
			ModalService.alertBox({
				msg: GlobalService.getVal('rulesMsgs')['invalidHttpUrl']
			});
			return;
		}

		//check if Base template username  is empty
		if (/^\s*$/.test($scope.apiConfigPost.apiAuthKey)) {
			if ($scope.apiConfigPost.apiAuthType == "PWD") {
				var message = "Username" + GlobalService.getVal('rulesMsgs')['temp_field_blank'];
			}
			else {
				var message = "Auth Key Label" + GlobalService.getVal('rulesMsgs')['temp_field_blank'];
			}
			ModalService.alertBox({
				msg: message
			});
			return;
		}

		//check if Base template password  is empty
		if ($scope.info.currentPage == 'register') {
			if (/^\s*$/.test($scope.apiConfigPost.apiAuthPass)) {

				if ($scope.apiConfigPost.apiAuthType == "PWD") {
					var message = "Password" + GlobalService.getVal('rulesMsgs')['temp_field_blank'];
				}
				else {
					var message = "Auth Key Value" + GlobalService.getVal('rulesMsgs')['temp_field_blank'];
				}
				ModalService.alertBox({
					msg: message
				});
				return;
			}
		} return true;
	}

	// Function to clear all notification messages
	$scope.clearMessage = function () {
		if (!$scope.info.templatesLoading) {
			$scope.info.successMsg = "";
			$scope.info.errorMsg = "";
			$scope.info.addTemplateMsg = {};
		}
	};

	//Load api template list from service for validation purpose
	$scope.info.apiTemplateList = RulesService.getApiTemplateList();
	if($scope.info.apiTemplateList != undefined){
		$scope.configidarr = [];
		$scope.info.apiTemplateList.filter(function (obj) {
			$scope.configidarr.push(obj.apiConfigId);
		})
	}
	
	$scope.$on("broadPageChange", function(evt,data){ 
		//$scope.changePage('list');
		$scope.info.pageLoading = true;
		$scope.loadListPage();
	});
	 
	//load list initially
	$scope.loadListPage();

}]);
