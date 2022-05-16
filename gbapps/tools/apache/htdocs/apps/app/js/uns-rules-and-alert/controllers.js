// Controller to handle the change of page
angular.module('gbApp.controllers.rules', [ 'ngTable', 'ngDraggable']).controller('RulesCtrl', ['$scope', '$sce', 'session', '$cookies', 'AppService', 'GlobalService', 'ErrorService', 'ModalService', 'RulesService',
function($scope, $sce, session,  $cookies, AppService, GlobalService, ErrorService, ModalService, RulesService) {
session.then( function() {
	// Object to store information on Rules page change
	$scope.info = {};
	
	if(!!$cookies.Ticket) {
	    $scope.info.userName = $cookies.Ticket.split('&')[11];
	}
	
	// Stores the value of current selected page
	$scope.info.current = 'uns_rules_list';
	
    // Stores the list of pages
    $scope.info.pagesList = GlobalService.getVal('unsRulesPages')[$scope.info.current];

	// Function to get the URL of selected page from globals.js
	$scope.getRulesUrl = function() {
		return GlobalService.getVal($scope.info.current);
	};
	
	$scope.logoutUser = function() {
	   RulesService.logoutSessionRules(); 
	};

    // Function to change the current page
    $scope.changeCurrentPage = function(page) {
        if($scope.info.current == 'uns_test_rule_history' && !!RulesService.getLogMoving()) {
            ModalService.alertBox({msg: 'Please wait till the log is being moved to the parser'});
            return;
        } else if((page == 'uns_rules_list' && RulesService.getRuleSavedStatus())) {
            $scope.info.targetPage = page;
            $scope.title = 'Navigate from Add/Edit Rule page';
            $scope.msg = GlobalService.getVal('rulesMsgs')['add_rule_navigate'];
            $scope.modal = ModalService.openModal("partials/rules-and-alerts/navigate_add_rule.html", $scope, false, 'static');
        } else {
            $scope.info.current = page;
            $scope.info.pagesList = GlobalService.getVal('unsRulesPages')[$scope.info.current];
        }
    };
    
    
    // Function to navigate to Rules List page from Add/Edit Rule page
    $scope.changeCurrentPageConfirm = function() {
        if($scope.info.targetPage == 'uns_rules_list') {
            RulesService.setRuleSavedStatus(false);
        }
        
        $scope.info.current = $scope.info.targetPage;
        $scope.info.pagesList = GlobalService.getVal('unsRulesPages')[$scope.info.current];
    };
    
	
	// Function to get any system errors
	$scope.getError = function() {
	    return ErrorService.getErrors('gbApp');
	};
	
	// Function to render text in html format
	$scope.renderHtml = function(html) {
	    return $sce.trustAsHtml(html);
	};

})

}])


// Controller to handle the page to show list of rules
.controller('RulesListCtrl', ['$scope', '$sce', 'GlobalService', '$window', '$filter', '$timeout', 'ngTableParams', 'RulesService', 'ModalService', 'UserTrackingService',
function($scope, $sce, GlobalService, $window, $filter, $timeout, ngTableParams, RulesService, ModalService, UserTrackingService) {

    // Object to store all information about Rules list page
    $scope.info = {};

    // Object that stores the filter information for all the columns
    $scope.info.filter = {};

    // Defines whether rules are loading
    $scope.info.rulesLoading = true;

    // Stores the list of columns
    $scope.columns = $filter('filter')(GlobalService.getVal('usRulesColumns'), {
        enabled : true
    });
    
    // Stores the field of initial Sorting
    $scope.info.initialSortField = GlobalService.getVal('rulesSortField');
    
    
    // Stores the message to be displayed
    $scope.info.rulesListMsg = {};

    // Object that stores the page information for custom pagination
    $scope.info.page = {
        "total" : 0,
        "current" : 1,
        "pages" : 0,
        "count" : 10,
        "sortField" : $scope.info.initialSortField + "desc"
    };

    // Stores the list of supported rule status
    $scope.info.supportedStatus = GlobalService.getVal('rulesSupportedStatus');

    // Sets the object of initial sorting
    $scope.info.initialSorting = {};
    $scope.info.initialSorting[$scope.info.initialSortField] = 'desc';
    
    // Function to clear all messages
    $scope.clearMessage = function() {
        if(!$scope.info.rulesLoading) {
            $scope.info.rulesListMsg = {};
        }
    };

    // Function to populate the table initially
    $scope.populateTable = function() {
        $scope.tableParams = new ngTableParams({
            page : 1, // show first page
            count : $scope.info.page['count'], // count per page
            sorting : $scope.info.initialSorting // Initial sorting
        }, {
            total : $scope.rulesList.length, // length of data
            getData : function($defer, params) {
                var orderedData = params.sorting() ? $filter('orderBy')($scope.rulesList, params.orderBy()) : $scope.rulesList;
                orderedData = $filter('filterRules')(orderedData, $scope.info.filter);
                params.total(orderedData.length);
                $scope.info.page['total'] = orderedData.length;
                $scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    };

    // Stores the list of rules
    RulesService.getAllRules().then(function(response) {
        $scope.rulesList = response.data.Data;
        $scope.populateTable();
        $scope.info.rulesLoading = false;
        RulesService.setRulesList($scope.rulesList);
        $scope.setRulesLabelMap();
        $scope.setAllRulesMap();
    }, function(response) {
        $scope.rulesList = "";
        $scope.populateTable();
        $scope.info.rulesLoading = false;
        $scope.info.rulesListMsg = {
            type: 'failure',
            msg: GlobalService.getVal('rulesMsgs')['rules_load_failed']
        }
        console.error('Unable to load Rules List');
    });
    
    // Function to set the rules label map
    $scope.setRulesLabelMap = function() {
        var map = {};
        for(var i = 0; i < $scope.rulesList.length; i++) {
            map[$scope.rulesList[i]['label']] = true;
        }
        RulesService.setRulesLabelMap(map);
    };
    
    // Function to set all the rules label map
    $scope.setAllRulesMap = function() {
        RulesService.getRulesLabelsList().then(function(response) {
            if(Array.isArray(response.data.Data)) {
                var map = {};
                for(var i = 0; i < response.data.Data.length; i++) {
                    map[response.data.Data[i]] = true;
                }
                RulesService.setRulesLabelMap(map);
            }
        }, function(response) {
        });
    };
    
    // Function to reload rules list
    $scope.reloadRules = function() {
        RulesService.getAllRules().then(function(response) {
            $scope.rulesList = response.data.Data;
            $scope.clearAppliedFilters();
            $scope.info.page['current'] = 1;
            $scope.tableParams.reload();
            $scope.tableParams.page(1);
            $scope.info.rulesLoading = false;
            RulesService.setRulesList($scope.rulesList);
            $scope.setRulesLabelMap();
            $scope.setAllRulesMap();
        }, function(response) {
            $scope.rulesList = "";
            $scope.clearAppliedFilters();
            $scope.info.page['current'] = 1;
            $scope.tableParams.reload();
            $scope.tableParams.page(1);
            $scope.info.rulesLoading = false;
            $scope.info.rulesListMsg = {
                type: 'failure',
                msg: GlobalService.getVal('rulesMsgs')['rules_load_failed']
            }
            console.error('Unable to load Rules List');
        });
    };

    // Initializes the models for each column filter
    for (var i in $scope.columns) {
        if ($scope.columns[i]['field'] == 'label' || $scope.columns[i]['field'] == 'description' || $scope.columns[i]['field'] == 'author') {
            $scope.info[$scope.columns[i]['field']] = "";
        } else {
            $scope.info[$scope.columns[i]['field']] = {};
        }
    }

    // Function to add a new rule
    $scope.addNewRule = function() {
        RulesService.setRuleMode('new');
        $scope.$parent.changeCurrentPage('uns_add_rule');
    };
    
    // Select/unselect select all checkbox based on rules selection
    $scope.checkRulesSelection = function(rule) {
        for (var i in $scope.rulesList) {
            if (($scope.rulesList[i].status == $scope.info.supportedStatus.Enabled) && !$scope.rulesList[i].selected) {
                $scope.info.selectAll = false;
                return;
            }
        }
        $scope.info.selectAll = true;
    };
    
    // Select/unselect all rules on the page
    $scope.checkSelectAll = function() {
        var found = false;
        if(!!$scope.info.selectAll) {
            for(var i = 0; i < $scope.rulesList.length; i++) {
                if($scope.rulesList[i].status == $scope.info.supportedStatus.Enabled) {
                    found = true;
                    break;
                }
            }
            if(!found) {
                $scope.info.selectAll = false;
                ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['rule_select_all_error']});
                return;
            } else {
                for(var i = 0; i < $scope.rulesList.length; i++) {
                    if($scope.rulesList[i].status == $scope.info.supportedStatus.Enabled) {
                        $scope.rulesList[i].selected = true;
                    }
                }
            }
        } else {
            for(var i = 0; i < $scope.rulesList.length; i++) {
                delete $scope.rulesList[i].selected;
            }
        }
    };
    
    // Function to check if any rule is selected
    $scope.checkSelectedRules = function() {
        if(!!$scope.rulesList) {
            var selectedRules = $filter('filter')($scope.rulesList, {selected: true}) || [];
            if(selectedRules.length > 0) {
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
        $scope.$parent.changeCurrentPage('uns_test_rule_history');
    };
    
    // Function to go to test rule history
    $scope.goToTestRuleHistory = function() {
        $scope.setPageListforTesting();
        var selectedRules = [];
        RulesService.setTestRuleData(selectedRules);
        $scope.$parent.changeCurrentPage('uns_test_rule_history');
    };
    
    // Function to go to test rule
    $scope.goToTestRule = function() {
        $scope.setPageListforTesting();
        var selectedRules = [];
        for(var i = 0; i < $scope.rulesList.length; i++) {
            if(!!$scope.rulesList[i].selected && $scope.rulesList[i].status == $scope.info.supportedStatus.Enabled) {
                selectedRules.push($scope.rulesList[i]);
            }
        }
        if(selectedRules.length > 0) {
            RulesService.setTestRuleData(selectedRules);
            $scope.$parent.changeCurrentPage('uns_test_rule_history');
        }
    };
    
    // Sets page list for Test Rule Page
    $scope.setPageListforTesting = function() {
        var pageList = GlobalService.getVal('unsRulesPages');
        pageList.uns_test_rule_history = [{ name: 'uns_rules_list', label: 'Rules List'}, {name: 'uns_test_rule_history', label: 'Test Rule History'}];
        GlobalService.setVal('unsRulesPages', pageList);
    };
    
    
    // Function to enable/disable rule
    $scope.enableDisableRule = function(rule, field) {
        $scope.selectedRule = rule;
        $scope.selectedField = field;
        $scope.msg = rule[field] == $scope.info.supportedStatus.Enabled ? "Are you sure you want to disable the rule <strong>" + rule.label + "</strong>?" : "Are you sure you want to enable the rule <strong>" + rule.label + "</strong>?";
        $scope.modal = ModalService.openModal("partials/rules-and-alerts/enable_disable_rule.html", $scope, false, 'static');
    };
    
    // Function to confirm enable/disable rule
    $scope.enableDisableRuleConfirm = function() {
        var rule = $scope.selectedRule;
        var field = $scope.selectedField;
        $scope.info.rulesLoading = true;
        if(rule[field] == $scope.info.supportedStatus.Enabled) {
            RulesService.disableRule(rule.rule_id).then(function(response) {
                $scope.info.rulesListMsg = {
                    type: 'success',
                    msg: GlobalService.getVal('rulesMsgs')['rule_disable_success'][0] + rule.label + GlobalService.getVal('rulesMsgs')['rule_disable_success'][1]
                }
                UserTrackingService.standard_user_tracking('rules', 'Rules List', 'disable', rule.label).then(function(response) {
                    
                }, function(response) {
                    
                });
                $scope.reloadRules();
            }, function(response) {
                $scope.info.rulesListMsg = {
                    type: 'failure',
                    msg: GlobalService.getVal('rulesMsgs')['rule_disable_failed'][0] + rule.label + GlobalService.getVal('rulesMsgs')['rule_disable_failed'][1]
                }
                console.error("Unable to disable rule " + rule.label);
                $scope.info.rulesLoading = false;
            });
        } else if(rule[field] == $scope.info.supportedStatus.Disabled) {
            RulesService.enableRule(rule.rule_id, 0).then(function(response) {
                $scope.info.rulesListMsg = {
                    type: 'success',
                    msg: GlobalService.getVal('rulesMsgs')['rule_enable_success'][0] + rule.label + GlobalService.getVal('rulesMsgs')['rule_enable_success'][1]
                }
                UserTrackingService.standard_user_tracking('rules', 'Rules List', 'enable', rule.label).then(function(response) {
                    
                }, function(response) {
                    
                });
                $scope.reloadRules();
            }, function(response) {
                $scope.info.rulesListMsg = {
                    type: 'failure',
                    msg: GlobalService.getVal('rulesMsgs')['rule_enable_failed'][0] + rule.label + GlobalService.getVal('rulesMsgs')['rule_enable_failed'][1]
                }
                console.error("Unable to enable rule " + rule.label);
                $scope.info.rulesLoading = false;
            });
        }
    };
    
    // Function to edit a rule
    $scope.editRule = function(rule) {
        if(rule[$scope.columns[$scope.columns.length - 1].field] == $scope.info.supportedStatus.Disabled) {
            ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['edit_rule_disabled']});
            return;
        }
        RulesService.setRuleMode('edit', rule);
        $scope.$parent.changeCurrentPage('uns_add_rule');
    };
    
    // Function to delete a rule
    $scope.deleteRule = function(rule) {
        $scope.delRule = rule;
        $scope.msg = GlobalService.getVal('rulesMsgs')['rule_del_single'][0] + rule.label + GlobalService.getVal('rulesMsgs')['rule_del_single'][1];
        $scope.modal = ModalService.openModal("partials/rules-and-alerts/delete_rule.html", $scope, false, 'static');
    };
    
    // Confirm the deletion of a rule
    $scope.deleteRuleConfirm = function() {
        var rule = $scope.delRule;
        $scope.info.rulesLoading = true;
        var label = rule.label;
        RulesService.deleteRule(rule.rule_id).then(function(response) {
            $scope.reloadRules();
            var rulesLabelMap = RulesService.getRulesLabelMap();
            delete rulesLabelMap[rule.label];
            RulesService.setRulesLabelMap(rulesLabelMap);
            
            UserTrackingService.standard_user_tracking('rules', 'Rules List', 'delete', rule.label).then(function(response) {
                
            }, function(response) {
                
            });
            $scope.info.rulesListMsg = {
                type: 'success',
                msg: GlobalService.getVal('rulesMsgs')['rule_delete_success'][0] + rule.label + GlobalService.getVal('rulesMsgs')['rule_delete_success'][1]
            }
        }, function(response) {
            console.error('Unable to delete ' + rule.label);
            $scope.info.rulesLoading = false;
            $scope.info.rulesListMsg = {
                type: 'failure',
                msg: GlobalService.getVal('rulesMsgs')['rule_delete_failed'][0] + rule.label + GlobalService.getVal('rulesMsgs')['rule_delete_failed'][1]
            }
        });
        $scope.modal.close();
    };
    
    // Function to hide the delete modal
    $scope.hideDeleteModal = function() {
        $scope.modal.close();
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
    
    // Go to next page from current page if not on last page
    $scope.nextPage = function() {
        if ($scope.info.page['current'] < $scope.info.page['pages']) {
            $scope.info.page['current'] += 1;
            $scope.tableParams.page($scope.info.page['current']);
        }
    };

    // Go to previous page from current page if not on first page
    $scope.prevPage = function() {
        if ($scope.info.page['current'] > 1) {
            $scope.info.page['current'] -= 1;
            $scope.tableParams.page($scope.info.page['current']);
        }
    };

    // Go to first page from any page if not on first page
    $scope.firstPage = function() {
        if ($scope.info.page['current'] == 1)
            return;
        $scope.info.page['current'] = 1;
        $scope.tableParams.page($scope.info.page['current']);
    };

    // Go to last page from any page if not on last page
    $scope.lastPage = function() {
        if ($scope.info.page['current'] == $scope.info.page['pages'])
            return;
        $scope.info.page['current'] = $scope.info.page['pages'];
        $scope.tableParams.page($scope.info.page['current']);
    };

    // Update the filter object if some filter is applied using text box and update the page no. if required
    $scope.searchRule = function(field) {
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

    // Update the filter object if some filter is applied by selecting checkbox from dropdown and update the page no. if required
    $scope.changeFilter = function(column, value) {
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
        var details = JSON.stringify($scope.info.filter);
        UserTrackingService.standard_user_tracking('rules', 'Rules List', 'filter', details).then(function(response) {
            
        }, function(response) {
            
        });
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

    // Sort the column if clicked on the column header
    $scope.sortColumn = function(field) {
        if (!(document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "BUTTON")) {
            $scope.tableParams.sorting(field, $scope.tableParams.isSortBy(field, 'asc') ? 'desc' : 'asc');
            $scope.info.page['sortField'] = field + ($scope.tableParams.isSortBy(field, 'asc') ? 'asc' : 'desc');
        }
    };

    // Clear all the applied filters on the page and set the page no. to 1
    $scope.clearAppliedFilters = function() {
        if (Object.keys($scope.info.filter).length != 0) {
            for (var i in $scope.columns) {
                delete $scope.columns[i].filterString;
            }

            for (var i in $scope.columns) {
                if ($scope.columns[i]['field'] == 'label' || $scope.columns[i]['field'] == 'description' || $scope.columns[i]['field'] == 'author') {
                    $scope.info[$scope.columns[i]['field']] = "";
                } else {
                    $scope.info[$scope.columns[i]['field']] = {};
                }
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
    
    // Function to render text in html format
    $scope.renderHtml = function(html) {
        return $sce.trustAsHtml(html);
    };

}])

// Controller to handle testing of rules
.controller('TestRuleCtrl', ['$scope', '$sce', '$filter', '$timeout', '$window', 'AppService', 'ModalService', 'RulesService', 'GlobalService', 'ErrorService', 'FileUploader', 'ngTableParams', 'infoserverStagingSchema',
function($scope, $sce, $filter, $timeout, $window, AppService, ModalService, RulesService, GlobalService, ErrorService, FileUploader, ngTableParams, infoserverStagingSchema) {
    
    // Stores the info of test rule page
    $scope.info = {};
    
    // Stores the success message
    $scope.info.successMsg = "";
    
    // Stores the error message
    $scope.info.errorMsg = "";
    
    // Stores whether session is timed out or not
    $scope.info.sessionTimedOut = false;
    
    // Stores the list of selected rules to be tested
    $scope.info.selectedRules = RulesService.getTestRuleData();
    
    // Stores the columns to be displayed on expanding a rule
    $scope.info.columns = $filter('filter')(GlobalService.getVal('unsupportedTestRuleColumns'), {enabled: true});
    
    // Stores the columns to be displayed on Test History page
    $scope.info.testRuleHistoryColumns = $filter('filter')(GlobalService.getVal('unsupportedTestRuleHistoryColumns'), {enabled: true});
    
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
    $scope.info.testGridColumnsList = $filter('filter')(GlobalService.getVal('testGridColumns'), {enabled: true});
    
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
     var infoserverDomainStaging = GlobalService.getVal('infoserverDomainStaging');
    // Function to trigger logout when session is timed out
    $scope.sessionTimeout = function() {
        RulesService.logoutSessionRules();
    };
    
    // Function to clear all messages
    $scope.clearMessage = function() {
        if(!$scope.info.pageLoading) {
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
            // $scope.tableParams.page($scope.info.page['current']);
        }
        if(!!arguments.length) {
            $scope.populateRulesData();
        } else {
            $scope.populateDataPathData();
        }
    };

    // Switch to next page if current page is not last page
    $scope.nextPage = function() {
        if ($scope.info.page['current'] < $scope.info.page['pages']) {
            $scope.info.page['current'] += 1;
            if(!!arguments.length) {
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
            if(!!arguments.length) {
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
        if(!!arguments.length) {
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
        if(!!arguments.length) {
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
    
    if($scope.info.selectedRules.length == 1) {
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
    
    // Function to open Show datapath tunnel table modal box
    $scope.openDatapathModal = function() {
        $scope.modal = ModalService.openModal('partials/rules-and-alerts/datapath_modal.html', $scope, false, 'static');
    };
    
    // Function to show the test details for indidual labels
    $scope.showTestDetails = function(test) {
        $scope.datapathModalData = test.texts;
        $scope.datapathModalLabel = test.label;
        $scope.info.page = {
            "total" : 0,
            "current" : 1,
            "pages" : 0,
            "count" : 10,
            "displayMsg": ""
        };
        
        $scope.populateDataPathData();
        $scope.openDatapathModal();
    };
    
    // Function to populate datapath modal data
    $scope.populateDataPathData = function() {
        var orderedData = $scope.datapathModalData;
        $scope.info.page['total'] = orderedData.length;
        $scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
        $scope.info.datapathDisplayData = orderedData.slice(($scope.info.page['current'] - 1) * $scope.info.page['count'], $scope.info.page['current'] * $scope.info.page['count']);
        if($scope.info.page['current'] < $scope.info.page['pages']) {
            $scope.info.page['displayMsg'] = (($scope.info.page['current'] - 1) * $scope.info.page['count'] + 1) + ' - ' + (($scope.info.page['current'] - 1) * $scope.info.page['count'] + $scope.info.page['count']) + " of " + ($scope.info.page['total']);
        } else {
            $scope.info.page['displayMsg'] = (($scope.info.page['current'] - 1) * $scope.info.page['count'] + 1) + ' - ' + ($scope.info.page['total']) + ' of ' + ($scope.info.page['total']);
        }
    };
    
    $scope.populateRulesData = function() {
        var orderedData = $scope.info.bundleRules;
        $scope.info.page['total'] = orderedData.length;
        $scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
        $scope.info.displayRules = orderedData.slice(($scope.info.page['current'] - 1) * $scope.info.page['count'], $scope.info.page['current'] * $scope.info.page['count']);
        if($scope.info.page['current'] < $scope.info.page['pages']) {
            $scope.info.page['displayMsg'] = (($scope.info.page['current'] - 1) * $scope.info.page['count'] + 1) + ' - ' + (($scope.info.page['current'] - 1) * $scope.info.page['count'] + $scope.info.page['count']) + " of " + ($scope.info.page['total']);
        } else {
            $scope.info.page['displayMsg'] = (($scope.info.page['current'] - 1) * $scope.info.page['count'] + 1) + ' - ' + ($scope.info.page['total']) + ' of ' + ($scope.info.page['total']);
        }
    };
    
    $scope.openRulesDetails = function() {
        $scope.info.page = {
            "total" : 0,
            "current" : 1,
            "pages" : 0,
            "count" : 10,
            "displayMsg": ""
        };
        $scope.modal = ModalService.openModal('partials/rules-and-alerts/rules_details.html', $scope, "gb-rules-test-history-modal", 'static');
        if(arguments.length == 0) {
            $scope.info.bundleRules = $scope.info.selectedRules;
            $scope.populateRulesData();
        } else {
            $scope.info.rulesLoading = true;
            var ruleIDs = arguments[0];
            RulesService.getStagingRulesData(ruleIDs).then(function(response) {
                $scope.info.bundleRules = response.data.Data;
                $scope.populateRulesData();
                $scope.info.rulesLoading = false;
            }, function(response) {
                $scope.modal.close();
                $scope.info.rulesLoading = false;
                if(!$scope.info.sessionTimedOut && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                    $scope.info.sessionTimedOut = true;
                    $scope.msg = GlobalService.getVal('session_timeout_msg');
                    $scope.modal = ModalService.openModal('partials/session_timeout.html', $scope, false, 'static');
                } else if(response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
                    $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
                } else {
                    $scope.info.errorMsg = GlobalService.getVal('info_server_down');
                }
            });
        }
    };
    
    $scope.getBundleId = function(bundle) {
        if(bundle && bundle.rule_id) {
            $scope.info.testresultLoading = true;
            $scope.info.selectedBundleLoadId = bundle.load_id;
            RulesService.getBundleId(bundle.load_id).then(function(response) {
                bundle.signature = response.data.Data;
                $scope.getStagingRulesforBundle(bundle);
                // $scope.viewTestResults(bundle);
            }, function(response) {
                $scope.info.testresultLoading = true;
                if(!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                    $scope.info.sessionTimedOut = true;
                    $scope.msg = GlobalService.getVal('session_timeout_msg');
                    $scope.modal = ModalService.openModal('partials/session_timeout.html', $scope, false, 'static');
                } else if(response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
                    $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
                } else {
                    $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['test_rule_failed'];
                }
            });
        }
    };
    
    $scope.getStagingRulesforBundle = function(bundle) {
        RulesService.getStagingRulesData(bundle.rule_id).then(function(response) {
            var rulesDetails = response.data.Data || [];
            $scope.viewTestResults(bundle, rulesDetails);
        }, function(response) {
            $scope.info.testresultLoading = true;
            if(!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                $scope.info.sessionTimedOut = true;
                $scope.msg = GlobalService.getVal('session_timeout_msg');
                $scope.modal = ModalService.openModal('partials/session_timeout.html', $scope, false, 'static');
            } else if(response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
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
        if(bundle && bundle.signature && bundle.rule_id) {
            var bundleSignature = bundle.signature;
            var cols = "";
            for(var i = 0; i < $scope.info.testGridColumnsList.length; i++) {
                cols += $scope.info.testGridColumnsList[i].field + ", ";
            }
            cols += "display_msg";
            var keyspace = infoserverStagingSchema;
            var alertsTableName = GlobalService.getVal('alerts_by_bundle_table');
            var ruleIDs = bundle.rule_id;
            var selectQuery = "SELECT " + cols + " FROM " + keyspace + "." + alertsTableName + " where mfr='" + manufacturer + "' AND prod='" + product + "' AND sch='" + schema + "' AND ec='" + manufacturer + "' AND bundle_id='" + bundleSignature + "' AND rule_id IN (" + ruleIDs + ")";
            
            if($scope.info.testResultsPending) {
                $scope.deferred.resolve();
            }
            
            $scope.deferred = $q.defer();
            $scope.info.testResultsPending = true;
            RulesService.authenticateStaging().then(function(response) {
                RulesService.getTestResults(selectQuery, $scope.deferred).then(function(response) {
                    $scope.info.testResultsPending = false;
                    $scope.info.testresultLoading = false;
                    $scope.info.testResultsList = [];
                    if(!!response.data.length) {
                        for(var i = 0; i < response.data.length; i++) {
                            var labelFound = false;
                            for(var j = 0; j < $scope.info.testResultsList.length; j++) {
                                if($scope.info.testResultsList[j].label == response.data[i].label) {
                                    var msgMap = {id: (testEntry.texts.length + 1), msg: response.data[i].display_msg};
                                    testEntry.texts.push(msgMap);
                                    labelFound = true;
                                    break;
                                }
                            }
                            if(!labelFound) {
                                var testEntry = {};
                                for(var j = 0; j < $scope.info.testGridColumnsList.length; j++) {
                                    testEntry[$scope.info.testGridColumnsList[j].field] = response.data[i][$scope.info.testGridColumnsList[j].field];
                                }
                                testEntry.texts = [];
                                var msgMap = {id: 1, msg: response.data[i].display_msg};
                                testEntry.texts.push(msgMap);
                                $scope.info.testResultsList.push(testEntry);
                            }
                        }
                    }
                    
                    for(var i = 0; i < rulesDetails.length; i++) {
                        var found = ($filter('filter')($scope.info.testResultsList, {label: rulesDetails[i].label}, true) || []).length ? true : false;
                        if(!found) {
                            var testEntry = {};
                            for(var j = 0; j < $scope.info.testGridColumnsList.length; j++) {
                                testEntry[$scope.info.testGridColumnsList[j].field] = rulesDetails[i][$scope.info.testGridColumnsList[j].rules_field];
                            }
                            testEntry.texts = [];
                            $scope.info.testResultsList.push(testEntry);
                        }
                    }
                    
                    if (/\d+/.test(bundle.prod_rule_id)) {
                        var prodRules = RulesService.getRulesList();
                        var ruleFoundInProd = ($filter('filter')(prodRules, {rule_id: parseInt(bundle.prod_rule_id)}, true) || []).length ? true : false;
                        
                        if(ruleFoundInProd && !bundle.rule_modified && !!response.data.length) {
                            $scope.info.prodEnableRuleId = parseInt(bundle.prod_rule_id);
                            $scope.info.prodEnableRuleLabel = rulesDetails[0].label;
                            $scope.info.ruleTestSucceeded = true;
                        } else {
                            $scope.info.ruleTestSucceeded = false;
                        }
                    } else {
                        $scope.info.ruleTestSucceeded = false;
                    }
                    
                    var rulesLabels = [];
                    var module = "";
                }, function(response) {
                    $scope.info.testResultsPending = false;
                    if(response.status != 0) {
                        $scope.info.testresultLoading = false;
                    }
                    $scope.info.testResultsList = "";
                    $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['test_rule_failed'];
                    if(!$scope.info.sessionTimedOut && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                        $scope.info.sessionTimedOut = true;
                        $scope.msg = GlobalService.getVal('session_timeout_msg');
                        $scope.modal = ModalService.openModal('partials/session_timeout.html', $scope, false, 'static');
                    }
                });
            }, function(response){
                $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['test_rule_failed'];
            });
        }
    };
    
    // Function to enable a tested rule
    $scope.enableRule = function() {
        $scope.info.pageLoading = true;
        RulesService.enableRule($scope.info.prodEnableRuleId, 1).then(function(response) {
            $scope.info.pageLoading = false;
            $scope.info.successMsg = GlobalService.getVal('rulesMsgs')['rule_enable_success'][0] + $scope.info.prodEnableRuleLabel + GlobalService.getVal('rulesMsgs')['rule_enable_success'][1];
            $scope.info.ruleTestSucceeded = false;
        }, function(response) {
            $scope.info.pageLoading = false;
            if(response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
                $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
            } else {
                $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['rule_enable_failed'][0] + $scope.info.prodEnableRuleLabel + GlobalService.getVal('rulesMsgs')['rule_enable_failed'][1];
            }
            
            if(!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                $scope.info.sessionTimedOut = true;
                $scope.msg = GlobalService.getVal('session_timeout_msg');
                $scope.modal = ModalService.openModal('partials/session_timeout.html', $scope, false, 'static');
            }
        });
    };
    
    // Function to load the list of bundles from staging H2
    $scope.loadAllStageBundles = function() {
        if(!!$scope.info.firstLoad) {
            $scope.info.bundlesLoading = true;
        }
        RulesService.authenticateStaging().then(function(response) {
            RulesService.checkLCPStatus().then(function(response) {
                if(response.data.Status == "Success") {
                    RulesService.getStageBundles().then(function(response) {
                        $scope.info.firstLoad = false;
                        $scope.info.bundlesLoading = false;
                        if(!!$scope.info.deleteTemporaryBundle) {
                            $scope.info.temporaryBundleData = [];
                            delete $scope.info.deleteTemporaryBundle;
                        }
                        $scope.info.bundlesList = $filter('filter')(response.data.Data, {supported: false}) || [];
                        var found = false;
                        for(var i = 0; i < $scope.info.bundlesList.length; i++) {
                            if($scope.info.bundleStatus[$scope.info.bundlesList[i].bundle_state] == 'Processing' || $scope.info.bundleStatus[$scope.info.bundlesList[i].bundle_state] == 'Parsing') {
                                found = true;
                                break;
                            }
                        }
                        if(found) {
                            $timeout(function() {
                                $scope.loadAllStageBundles();
                            }, 5000);
                        }
                    }, function(response) {
                        $scope.info.bundlesLoading = false;
                        $scope.info.bundlesList = [];
                        if(response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
                            $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
                        } else {
                            $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['bundle_load_failed'];
                        }
                        if(!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                            $scope.info.sessionTimedOut = true;
                            $scope.msg = GlobalService.getVal('session_timeout_msg');
                            $scope.modal = ModalService.openModal('partials/session_timeout.html', $scope, false, 'static');
                        }
                    });
                } else {
                    $scope.info.bundlesLoading = false;
                    $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['lcp_down_msg'];
                }
                
            }, function(response) {
                if(!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                    $scope.info.sessionTimedOut = true;
                    $scope.msg = GlobalService.getVal('session_timeout_msg');
                    $scope.modal = ModalService.openModal('partials/session_timeout.html', $scope, false, 'static');
                } else {
                    $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['lcp_down_msg'];
                }
            });
        }, function(response) {
           $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['bundle_load_failed'];
        });
    };

    if($scope.info.selectedRules.length) {
        $scope.info.temporaryBundleData = [{
            rules: $scope.info.selectedRules,
            upload_log: true
        }];
    }
    $scope.info.firstLoad = true;
    $scope.loadAllStageBundles();
    
    // Function to insert selected rules to staging H2
    $scope.insertSelectedRules = function() {
        ErrorService.clearErrors('fileupload');
        if($scope.info.uploader.queue.length == 0) {
            return;
        }
        $scope.info.rulesCopying = true;
        $scope.info.temporaryBundleData = [{bundle_name: $scope.info.uploader.queue[0].file.name, waiting: true}];
        $scope.insertRules();
    };
    
    $scope.insertRules = function() {
        RulesService.authenticateStaging().then(function(response) {
                RulesService.insertRuleStaging($scope.getInsertRuleData()).then(function(response) {
                    if(response.status == 200) {
                        $scope.info.temporaryBundleData = [{bundle_name: $scope.info.uploader.queue[0].file.name, uploading: true}];
                        RulesService.setStagingRules(true);
                        $scope.info.insertedStageRules = "";
                        for(var i = 0; i < response.data.Data.length; i++) {
                            $scope.info.insertedStageRules += "," + response.data.Data[i].rule_id;
                        }
                        $scope.info.insertedStageRules = $scope.info.insertedStageRules.substring(1);
                        $scope.info.bunldeSignatureCount = response.data.Data[0].count;
                        $scope.beginUpload();
                    } else {
                        ErrorService.setError('fileupload', GlobalService.getVal('rulesMsgs')['test_rule_copy_error']);
                        $scope.info.temporaryBundleData = [];
                    }
                    $scope.info.rulesCopying = false;
                }, function(response) {
                    $scope.info.rulesCopying = false;
                    $scope.info.temporaryBundleData = [];
                    if(response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
                        ErrorService.setError('fileupload', GlobalService.getVal('rulesMsgs')['h2_down_msg']);
                    } else {
                        ErrorService.setError('fileupload', GlobalService.getVal('rulesMsgs')['test_rule_copy_error']);
                    }
                    if(!$scope.info.sessionTimedOut && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                        if(!!$scope.modal) {
                            $scope.modal.close();
                        }
                        $scope.info.sessionTimedOut = true;
                        $scope.msg = GlobalService.getVal('session_timeout_msg');
                        $scope.modal = ModalService.openModal('partials/session_timeout.html', $scope, false, 'static');
                    }
                });
        }, function(response) {
            $scope.info.rulesCopying = false;
            $scope.info.temporaryBundleData = [];
            ErrorService.setError('fileupload', GlobalService.getVal('upload_log_auth_failed'));
        });
    };
    
    // Function to check file upload to LCP status
    $scope.checkfileUploadToLCPStatus = function(fileEpoch) {
        if($scope.info.checkUploadToLCPCount < 10) {
            RulesService.checkfileUploadToLCPStatus(fileEpoch).then(function(response) {
                $scope.info.checkUploadToLCPCount++;
                if(response.data.Status == "Success") {
                    $scope.insertBundleRuleAssociation();
                } else {
                    $timeout(function() {
                        $scope.checkfileUploadToLCPStatus(fileEpoch);
                    }, 5000);
                }
            }, function(response) {
                RulesService.setLogMoving(false);
                $scope.info.temporaryBundleData = [];
                if(!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                    $scope.info.sessionTimedOut = true;
                    $scope.msg = GlobalService.getVal('session_timeout_msg');
                    $scope.modal = ModalService.openModal('partials/session_timeout.html', $scope, false, 'static');
                } else {
                    $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['log_processing_failed'];
                }
            });
        } else {
            RulesService.setLogMoving(false);
            $scope.info.temporaryBundleData = [];
            $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['log_processing_failed'];
        }
    };
    
    // Inserts rule association with a bundle
    $scope.insertBundleRuleAssociation = function() {
        var data = {
            rule_id: $scope.info.insertedStageRules,
            count: $scope.info.bunldeSignatureCount,
            supported: false,
            prod_rule_id: ($scope.info.selectedRules.length == 1 && $scope.info.selectedRules[0].status == $scope.info.supportedStatus.Draft) ? $scope.info.selectedRules[0].rule_id : "" ,
            rule_modified: false
        };
        RulesService.checkLCPStatus().then(function(response) {
            if(response.data.Status == "Success") {
                RulesService.insertBundleRuleAssociation(data).then(function(response) {
                    response.data.Data = (response.data.Data == "") ? 0 : response.data.Data;
                    if(parseInt(response.data.Data) == data.count) {
                        $timeout(function() {
                            $scope.insertBundleRuleAssociation();
                        }, 3000);
                    } else {
                        RulesService.setLogMoving(false);
                        RulesService.setLastLogUploadTime(Math.floor(Date.now()));
                        $scope.info.deleteTemporaryBundle = true;
                        var found = false;
                        for(var i = 0; i < $scope.info.bundlesList.length; i++) {
                            if($scope.info.bundleStatus[$scope.info.bundlesList[i].bundle_state] == 'Processing' || $scope.info.bundleStatus[$scope.info.bundlesList[i].bundle_state] == 'Parsing') {
                                found = true;
                                break;
                            }
                        }
                        if(!found) {
                            $scope.loadAllStageBundles();
                        }
                    }
                }, function(response) {
                    RulesService.setLogMoving(false);
                    $scope.info.temporaryBundleData = [];
                    if(response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
                        $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['h2_down_msg'];
                    } else {
                        $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['log_processing_failed'];
                    }
                    if(!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                        $scope.info.sessionTimedOut = true;
                        $scope.msg = GlobalService.getVal('session_timeout_msg');
                        $scope.modal = ModalService.openModal('partials/session_timeout.html', $scope, false, 'static');
                    }
                });
            } else {
                RulesService.setLogMoving(false);
                $scope.info.temporaryBundleData = [];
                $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['lcp_down_msg'];
            }
        }, function(response) {
            RulesService.setLogMoving(false);
            $scope.info.temporaryBundleData = [];
            if(!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                $scope.info.sessionTimedOut = true;
                $scope.msg = GlobalService.getVal('session_timeout_msg');
                $scope.modal = ModalService.openModal('partials/session_timeout.html', $scope, false, 'static');
            } else {
                $scope.info.errorMsg = GlobalService.getVal('rulesMsgs')['log_processing_failed'];
            }
        });
        
    };
    
    // Function to get insert rule data
    $scope.getInsertRuleData = function() {
        var ruleIDs = [];
        var categoryIDs = [];
        var notifierIDs = [];
        var templateIDs = [];
        for(var i = 0; i < $scope.info.selectedRules.length; i++) {
            ruleIDs.push($scope.info.selectedRules[i].rule_id);
            notifierIDs.push($scope.info.selectedRules[i].notifier_id);
            
            var categoryFound = false;
            for(var j = 0; j < categoryIDs.length; j++) {
                if(parseInt(categoryIDs[j]) == parseInt($scope.info.selectedRules[i].category_id)) {
                    categoryFound = true;
                    break;
                }
            }
            if(!categoryFound) {
                categoryIDs.push($scope.info.selectedRules[i].category_id);
            }
            
            var templateFound = false;
            for(var j = 0; j < templateIDs.length; j++) {
                if(parseInt(templateIDs[j]) == parseInt($scope.info.selectedRules[i].email_template_id)) {
                    templateFound = true;
                    break;
                }
            }
            if(!templateFound && !!$scope.info.selectedRules[i].email_template_id) {
                templateIDs.push($scope.info.selectedRules[i].email_template_id);
            }
        }
        
        var data = {
            rule_id: ruleIDs.join(","),
            notifier_id: notifierIDs.join(","),
            category_id: categoryIDs.join(",")
        };
        
        if(templateIDs.length > 0) {
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
    
    AppService.getUploadData().then(function(response) {
        $scope.info.pageLoading = false;
        $scope.info.uploadData = response.data.Data.json_form ? JSON.parse(response.data.Data.json_form) : response.data.Data.json_form;
        $scope.info.uploadDataMaxSize = parseInt(response.data.Data.max_upload_size);
        for(var i = 0; i < $scope.info.uploader.filters.length; i++) {
            if($scope.info.uploader.filters[i].name == 'extensionFilter') {
                $scope.info.uploader.filters[i] = {
                    name : 'extensionFilter',
                    fn : function(item) {
                        var match = false, i, extList = response.data.Data.allowed_extension.split(', ');
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
        if(!$scope.info.sessionTimedOut && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
            $scope.info.sessionTimedOut = true;
            $scope.msg = GlobalService.getVal('session_timeout_msg');
            $scope.modal = ModalService.openModal('partials/session_timeout.html', $scope, false, 'static');
        }
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
        url : infoserverDomainStaging + '/fileupload/uploadfile/' + manufacturer + '/' + product + '/' + schema,
        queueLimit : GlobalService.getVal('test_log_upload_limit'),
        filters : [{
            name : 'extensionFilter',
            fn : function(item) {
                var match = false, i, extList = GlobalService.getVal('file_upld_suprtd_extns').split(', ');
                for (i in extList) {
                    if (item.name.endsWith(extList[i])) {
                        match = true;
                    }
                }
                
                return match;
            }
        }],
        onAfterAddingFile : function(item) {
            $scope.checkSizeLimit();
        },
        onWhenAddingFileFailed : function(item, filter, options) {
            if (filter.name == 'queueLimit') {
                ErrorService.setError('fileupload', GlobalService.getVal('test_log_upload_limit_exceeded'));
            } else {
                ErrorService.setError('fileupload', GlobalService.getVal('file_upld_unsupported'));
            }
        },
        onErrorItem : function(item, response, status, headers) {
            if(!$scope.info.sessionTimedOut && response.hasOwnProperty('Msg') && response.Msg.match(/timeout/)) {
                if(!!$scope.modal) {
                    $scope.modal.close();
                }
                $scope.info.sessionTimedOut = true;
                ModalService.sessionTimeout();
                return;
            }
        },
        onSuccessItem : function(item, response, status, headers) {
            var fileEpoch = response.Data.split(":")[0];
            $scope.info.temporaryBundleData = [{bundle_name: $scope.info.uploader.queue[0].file.name, processing: true}];
            RulesService.setLogMoving(true);
            $scope.info.checkUploadToLCPCount = 0;
            $scope.checkfileUploadToLCPStatus(fileEpoch);
        },
        onBeforeUploadItem : function(item) {
            var t_obj;
            angular.forEach($scope.uploadForm, function(value, key) {
                t_obj = {};
                t_obj[key] = value.nodeVal;
                item.formData.push(t_obj);
            });
            $scope.info.uploadDone = false;
        },
        onCompleteAll : function() {
            var i, success = false, failure = false, cancel = false, details;
            details = {};
            for(i in $scope.uploadForm) if($scope.uploadForm.hasOwnProperty(i)){
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
        }
    });
    
    // Checks the file size limit
    $scope.checkSizeLimit = function() {
        var i, sum = 0;
        for (i in $scope.info.uploader.queue) {
            sum += $scope.info.uploader.queue[i].file.size;
        }
        ErrorService.clearErrors('fileupload');
        if (sum > $scope.info.uploadDataMaxSize) {
            ErrorService.setError('fileupload', GlobalService.getVal('file_upld_maxsize') + '<span title="' + $scope.info.uploadDataMaxSize + ' B">' + $filter('fileSize')($scope.info.uploadDataMaxSize) + '</span>');
        }
    };
    
    // Starts the upload
    $scope.beginUpload = function() {
        
        var i, details, j, upload = true;
        
        $scope.checkSizeLimit();
        
        for (i in $scope.info.uploadData) {
            if (!!$scope.info.uploadData[i]['required']) {
                if ($scope.uploadForm[$scope.info.uploadData[i]['name']].nodeVal == "") {
                    $scope.uploadForm[$scope.info.uploadData[i]['name']].error = true;
                    upload = false;
                } else {
                    $scope.uploadForm[$scope.info.uploadData[i]['name']].error = false;
                }
            }
        }
        
        if (ErrorService.getErrors('fileupload').length == 0 && upload) {
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
    
    //
    // Code for bundle upload ends
    //
}])

// Controller to handle adding or editing of rules
.controller('AddRuleCtrl', ['$scope', '$sce', '$timeout', '$window', 'ModalService', 'RulesService', '$filter', 'GlobalService', 'UserTrackingService',
function($scope, $sce, $timeout, $window, ModalService, RulesService, $filter, GlobalService, UserTrackingService) {
    // Object to store all information of Add Rule page
    $scope.info = {};

    // true if all the left hand side attributes are expanded, false instead
    $scope.info.allExpanded = false;

    // Stores the model of last focused element
    $scope.info.lastElementFocused = null;
    
    // Stores the list of max limits
    $scope.info.maxLimits = GlobalService.getVal('rulesMaxLimits');
    
    // Stores the data types of columns
    $scope.info.columnDataTypes = GlobalService.getVal('columnDataTypes');
    
    // Function to populate data for edit rule
    $scope.populateEditRule = function() {  
    
        $scope.info.pageLabel = "Edit Rule - " + RulesService.getRuleMode()['data']['label'];
        $scope.info.initialLabel = RulesService.getRuleMode()['data']['label'];
        $scope.info.initialMaxLimit = RulesService.getRuleMode()['data']['max_limit'];
        $scope.info.initialAction = parseInt(RulesService.getRuleMode()['data']['email_template_id']) == 0 ? 'none' : 'mail';
        $scope.info.initialText = RulesService.getRuleMode()['data']['text_display'];
        $scope.info.initialCol0 = RulesService.getRuleMode()['data']['col0'];
        $scope.info.initialCol1 = RulesService.getRuleMode()['data']['col1'];
        $scope.info.initialCol2 = RulesService.getRuleMode()['data']['col2'];
        $scope.info.initialCol3 = RulesService.getRuleMode()['data']['col3'];
        $scope.info.initialTables = RulesService.getRuleMode()['data']['colt'];
        $scope.info.notifierID = parseInt(RulesService.getRuleMode()['data']['notifier_id']);
        $scope.info.status = RulesService.getRuleMode()['data']['status'];

        if(RulesService.getRuleMode() && !!RulesService.getRuleMode()['modifiedData']) {
            $scope.info.label = RulesService.getRuleMode()['modifiedData']['label'];
            $scope.info.description = RulesService.getRuleMode()['modifiedData']['description'];
            $scope.info.category = parseInt(RulesService.getRuleMode()['modifiedData']['category_id']);
            $scope.info.author = RulesService.getRuleMode()['modifiedData']['author'];
            $scope.info.severity = parseInt(RulesService.getRuleMode()['modifiedData']['severity_id']);
            $scope.info.priority = parseInt(RulesService.getRuleMode()['modifiedData']['priority_id']);
            $scope.info.action = (RulesService.getRuleMode()['modifiedData']['email_template_id'] != 'select' && !!RulesService.getRuleMode()['modifiedData']['email_template_id']) ? 'mail' : 'none';
            $scope.info.emailTemplate = (RulesService.getRuleMode()['modifiedData']['email_template_id'] != 'select' && !!RulesService.getRuleMode()['modifiedData']['email_template_id']) ? parseInt(RulesService.getRuleMode()['modifiedData']['email_template_id']) : 'select';
            $scope.info.kbLink = RulesService.getRuleMode()['modifiedData']['kb_link'];
            document.getElementById('inputRecommendation').innerHTML = RulesService.getRuleMode()['modifiedData']['recommendation'];
            $scope.info.text = RulesService.getRuleMode()['modifiedData']['text_display'];
            $scope.info.scope = RulesService.getRuleMode()['modifiedData']['scope'];
            $scope.info.maxLimit = RulesService.getRuleMode()['modifiedData']['max_limit'];
            $scope.info.col0 = RulesService.getRuleMode()['modifiedData']['col0'];
            $scope.info.col1 = RulesService.getRuleMode()['modifiedData']['col1'];
            $scope.info.col2 = RulesService.getRuleMode()['modifiedData']['col2'];
            $scope.info.col3 = RulesService.getRuleMode()['modifiedData']['col3'];
            $scope.info.tables = RulesService.getRuleMode()['modifiedData']['colt'];
        } else {
            $scope.info.label = RulesService.getRuleMode()['data']['label'];
            $scope.info.description = RulesService.getRuleMode()['data']['description'];
            $scope.info.category = parseInt(RulesService.getRuleMode()['data']['category_id']);
            $scope.info.author = RulesService.getRuleMode()['data']['author'];
            $scope.info.severity = parseInt(RulesService.getRuleMode()['data']['severity_id']);
            $scope.info.priority = parseInt(RulesService.getRuleMode()['data']['priority_id']);
            $scope.info.action = parseInt(RulesService.getRuleMode()['data']['email_template_id']) == 0 ? 'none' : 'mail';
            $scope.info.emailTemplate = parseInt(RulesService.getRuleMode()['data']['email_template_id']) == 0 ? 'select': parseInt(RulesService.getRuleMode()['data']['email_template_id']);
            $scope.info.kbLink = RulesService.getRuleMode()['data']['kb_link'];
            document.getElementById('inputRecommendation').innerHTML = RulesService.getRuleMode()['data']['recommendation'];
            $scope.info.text = RulesService.getRuleMode()['data']['text_display'];
            $scope.info.scope = RulesService.getRuleMode()['data']['scope'];
            $scope.info.maxLimit = RulesService.getRuleMode()['data']['max_limit'];
            $scope.info.col0 = RulesService.getRuleMode()['data']['col0'];
            $scope.info.col1 = RulesService.getRuleMode()['data']['col1'];
            $scope.info.col2 = RulesService.getRuleMode()['data']['col2'];
            $scope.info.col3 = RulesService.getRuleMode()['data']['col3'];
            $scope.info.tables = RulesService.getRuleMode()['data']['colt'];
            $scope.setSavedMode();
        }
    };
    
    // Function to populate data for add rule
    $scope.populateAddRule = function() {
        $scope.info.initialLabel = null;
        $scope.info.initialMaxLimit = null;
        $scope.info.initialAction = null;
        $scope.info.initialText = null;
        $scope.info.initialCol0 = null;
        $scope.info.initialCol1 = null;
        $scope.info.initialCol2 = null;
        $scope.info.initialCol3 = null;
        $scope.info.initialTables = null;
        $scope.info.pageLabel = "Add Rule";
        if(RulesService.getRuleMode() && !!RulesService.getRuleMode()['modifiedData']) {
            $scope.info.label = RulesService.getRuleMode()['modifiedData']['label'];
            $scope.info.description = RulesService.getRuleMode()['modifiedData']['description'];
            $scope.info.category = RulesService.getRuleMode()['modifiedData']['category_id'] != 'select' ? parseInt(RulesService.getRuleMode()['modifiedData']['category_id']) : RulesService.getRuleMode()['modifiedData']['category_id'];
            $scope.info.author = RulesService.getRuleMode()['modifiedData']['author'];
            $scope.info.severity = RulesService.getRuleMode()['modifiedData']['severity_id'] != 'select' ? parseInt(RulesService.getRuleMode()['modifiedData']['severity_id']) : RulesService.getRuleMode()['modifiedData']['severity_id'];
            $scope.info.priority = RulesService.getRuleMode()['modifiedData']['priority_id'] != 'select' ? parseInt(RulesService.getRuleMode()['modifiedData']['priority_id']) : RulesService.getRuleMode()['modifiedData']['priority_id'];
            $scope.info.action = (RulesService.getRuleMode()['modifiedData']['email_template_id'] != 'select' && !!RulesService.getRuleMode()['modifiedData']['email_template_id']) ? 'mail' : 'none';
            $scope.info.emailTemplate = (RulesService.getRuleMode()['modifiedData']['email_template_id'] != 'select' && !!RulesService.getRuleMode()['modifiedData']['email_template_id']) ? parseInt(RulesService.getRuleMode()['modifiedData']['email_template_id']) : 'select';
            $scope.info.kbLink = RulesService.getRuleMode()['modifiedData']['kb_link'];
            document.getElementById('inputRecommendation').innerHTML = RulesService.getRuleMode()['modifiedData']['recommendation'];
            $scope.info.text = RulesService.getRuleMode()['modifiedData']['text_display'];
            delete $scope.info.initialText;
            $scope.info.scope = RulesService.getRuleMode()['modifiedData']['scope'];
            $scope.info.maxLimit = RulesService.getRuleMode()['modifiedData']['max_limit'];
            $scope.info.col0 = RulesService.getRuleMode()['modifiedData']['col0'];
            $scope.info.col1 = RulesService.getRuleMode()['modifiedData']['col1'];
            $scope.info.col2 = RulesService.getRuleMode()['modifiedData']['col2'];
            $scope.info.col3 = RulesService.getRuleMode()['modifiedData']['col3'];
            $scope.info.tables = RulesService.getRuleMode()['modifiedData']['colt'];
        } else {
            $scope.info.label = "";
            $scope.info.description = "";
            $scope.info.category = "select";
            $scope.info.author = "";
            $scope.info.severity = "select";
            $scope.info.priority = "select";
            $scope.info.action = 'none';
            $scope.info.emailTemplate = 'select';
            $scope.info.kbLink = "";
            document.getElementById('inputRecommendation').innerHTML = "";
            $scope.info.text = "";
            delete $scope.info.initialText;
            $scope.info.scope = "select";
            $scope.info.maxLimit = $scope.info.maxLimits[0];
            $scope.info.col0 = "";
            $scope.info.col1 = "";
            $scope.info.col2 = "";
            $scope.info.col3 = "";
            $scope.info.tables = "";
            $scope.setSavedMode();
        }
    };
    
    // Function to get section data in case of edit rule
    $scope.getSectionData = function(tables) {
        var tableNames = tables.split(/\s*\,\s*/g);
        $scope.info.sectionsLoaded = 0;
        for(var i = 0; i < tableNames.length; i++) {
            var section = $filter('filter')($scope.info.attributes, {table_name: tableNames[i]}, true)[0];
            if(!section.hasData) {
                $scope.info.sectionsLoading = true;
                $scope.getSectionColumns(section, tableNames.length);
            } else {
                $scope.info.sectionsLoaded++;
                if($scope.info.sectionsLoaded == tableNames.length) {
                    $scope.info.sectionsLoading = false;
                }
            }
        }
    };
    
    // Function to get section columns without expanding
    $scope.getSectionColumns = function(section, total_sections) {
        RulesService.getSectionColumns(section.table_name).then(function(response) {
            $scope.info.sectionsLoaded++;
            if($scope.info.sectionsLoaded == total_sections) {
                $scope.info.sectionsLoading = false;
            }
            section.columns = [];
            for(var i = 0; i < response.data.Data.length; i++) {
                var column = {};
                column.column_name = Object.keys(response.data.Data[i])[0];
                column.attribute_label = response.data.Data[i][column.column_name].attribute_label;
                column.type = response.data.Data[i][column.column_name].type;
                column.size = response.data.Data[i][column.column_name].size;
                section.columns.push(column);
            }
            section.hasData = true;
            RulesService.setAttributes($scope.info.attributes);
            $scope.setSectionsColumnLabelMap();
        }, function(response) {
            $scope.info.sectionsLoaded++;
            if($scope.info.sectionsLoaded == total_sections) {
                $scope.info.sectionsLoading = false;
            }
            if(response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
                $scope.info.addRuleMsg = {
                    type: 'failure',
                    msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
                };
            }
            if(!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                $scope.info.sessionTimedOut = true;
                $scope.msg = GlobalService.getVal('session_timeout_msg');
                $scope.modal = ModalService.openModal('partials/session_timeout.html', $scope, false, 'static');
            }
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
	
    // Function to modify rule data
    $scope.modifyRuleData = function() {
        var modifiedData = {
            label: $scope.info.label,
            description: $scope.info.description,
            category_id: $scope.info.category,
            author: $scope.info.author,
            severity_id: $scope.info.severity,
            priority_id: $scope.info.priority,
            scope: $scope.info.scope,
            email_template_id: $scope.info.action == 'mail' ? $scope.info.emailTemplate : '',
            max_limit: $scope.info.maxLimit,
            kb_link: $scope.info.kbLink,
            recommendation: document.getElementById('inputRecommendation').innerHTML,
            colt: $scope.info.tables,
            text_display: $scope.info.text,
            col0: $scope.info.col0,
            col1: $scope.info.col1,
            col2: $scope.info.col2,
            col3: $scope.info.col3
        };
        RulesService.modifyRuleData(modifiedData);
    };
    //Form field initialization
    if (RulesService.getRuleMode() && RulesService.getRuleMode()['mode'] == 'edit') {
        $scope.populateEditRule();
    } else {
        $scope.populateAddRule();
    }

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

    // Stores the list of operators which should be shown on UI
    $scope.info.operators = $filter('filter')(GlobalService.getVal('rulesOperators'), {
        enabled : true
    });

    // Stores the list of functions which should be shown on UI
    $scope.info.functions = $filter('filter')(GlobalService.getVal('rulesFunctions'), {
        enabled : true
    });
    
    // Stores the list of scopes
    $scope.info.scopes = GlobalService.getVal('rulesScopes');
    
    // Stores the list of supported rule status
    $scope.info.supportedStatus = GlobalService.getVal('rulesSupportedStatus');
    
    // Function to clear all messages
    $scope.clearMessage = function() {
        if(!$scope.info.categoriesLoading) {
            $scope.info.addRuleMsg = {};
        }
    };
    
    // Function to insert/edit link in the recommendation field
    $scope.insertEditLink = function() {
        var selection = $window.getSelection();
        if(selection.anchorNode == null) {
            ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['add_rule_select_recommendation_text']});
            return;
        }
        var recommendationText = selection.anchorNode.parentNode.offsetParent.innerText;
        if(!/^[a-z0-9\s\n]+$/i.test(recommendationText)) {
            ModalService.alertBox({msg: 'Only alphanumeric characters allowed for recommendation text'});
            return;
        }
        var parentElementClass = selection.anchorNode.parentNode.offsetParent.className;
        if(parentElementClass.indexOf("gb-rules-recommendation") != -1) {
            if((selection.extentOffset != selection.baseOffset) || (selection.anchorOffset != selection.focusOffset)) {
                var wholeText = selection.anchorNode.wholeText;
                var focusNodeTag = selection.focusNode.parentElement.tagName;
                if(selection.hasOwnProperty('extentOffset') && selection.hasOwnProperty('baseOffset')) {
                    var startPos = selection.extentOffset > selection.baseOffset ? selection.baseOffset : selection.extentOffset;
                    var endPos = selection.extentOffset > selection.baseOffset ? selection.extentOffset : selection.baseOffset;
                } else {
                    var startPos = selection.anchorOffset > selection.focusOffset ? selection.focusOffset : selection.anchorOffset;
                    var endPos = selection.anchorOffset > selection.focusOffset ? selection.anchorOffset : selection.focusOffset;
                }
                var text = wholeText.substring(startPos, endPos);
                if(selection.anchorNode.parentElement.tagName == "A") {
                    // For editing link
                    $scope.info.pageTitle = "Edit Link";
                    $scope.info.pageHeading = "Edit link for <strong>" + selection.anchorNode.parentElement.textContent + "</strong>";
                    $scope.info.pageLink = selection.anchorNode.parentElement.title;
                    $scope.info.htmlElement = selection.anchorNode.parentElement;
                    $scope.modal = ModalService.openModal("partials/rules-and-alerts/insert_edit_link.html", $scope, false, 'static');
                } else {
                    if(focusNodeTag == "A") {
                        ModalService.alertBox({msg: 'Something wrong in selection'});
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
            } else if(/firefox/i.test($window.navigator.userAgent) && selection.anchorNode.previousElementSibling.tagName == "A") {
                $scope.info.pageTitle = "Edit Link";
                    $scope.info.pageHeading = "Edit link for <strong>" + selection.anchorNode.previousElementSibling.textContent + "</strong>";
                    $scope.info.pageLink = selection.anchorNode.previousElementSibling.title;
                    $scope.info.htmlElement = selection.anchorNode.previousElementSibling;
                    $scope.modal = ModalService.openModal("partials/rules-and-alerts/insert_edit_link.html", $scope, false, 'static');
            } else {
                ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['add_rule_select_recommendation_text']});
                return;
            }
        } else {
            ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['add_rule_select_recommendation_text']});
            return;
        }
    };
    
    // Function to check if a link entered by user for recommendation field is valid or not
    $scope.checkLink = function(mode) {
        if(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test($scope.info.pageLink)) {
            $scope.modal.close();
            if(mode == 'insert') {
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
        if(!/^\s*$/.test($scope.info.pageLink)) {
            var innerHtml = $scope.info.innerHtml;
            var wholeTextPos = innerHtml.indexOf($scope.info.wholeText);
            $scope.info.htmlElement.innerHTML = innerHtml.substring(0, ($scope.info.startPos + wholeTextPos)) + "<a title='" + $scope.info.pageLink + "' dest='" + $scope.info.pageLink + "' onclick='window.open(this.title, \"_blank\");'>" + $scope.info.selectedText + "</a>" + innerHtml.substr($scope.info.endPos + wholeTextPos);
            $scope.setUnsavedMode();
        }
    };
    
    // Function to confirm editing recommendation link
    $scope.editLinkConfirm = function() {
        if(!/^\s*$/.test($scope.info.pageLink)) {
            $scope.info.htmlElement.dest = $scope.info.pageLink;
            $scope.info.htmlElement.title = $scope.info.pageLink;
            $scope.setUnsavedMode();
        }
    };
    
    
    // Function to set the sections column label map for converting logic and text part
    $scope.setSectionsColumnLabelMap = function() {
        var attributesWithData = $filter('filter')($scope.info.attributes, {hasData: true});
        for (var i in attributesWithData) {
            if (!!attributesWithData[i].label && !!attributesWithData[i].table_name) {
                for (var j in attributesWithData[i].columns) {
                    if (!!attributesWithData[i].columns[j].attribute_label) {
                        var tmpKey = [attributesWithData[i].label, '.', attributesWithData[i].columns[j].attribute_label].join('');
                        var tmpVal = [[attributesWithData[i].table_name, '.', attributesWithData[i].columns[j].column_name].join(''), attributesWithData[i].columns[j].column_name, (attributesWithData[i].columns[j].type == $scope.info.columnDataTypes['String']) ? (attributesWithData[i].columns[j].type) : (attributesWithData[i].columns[j].type + attributesWithData[i].columns[j].size), ["(", attributesWithData[i].table_name, GlobalService.getVal('rulesSecColDelimiter'), attributesWithData[i].columns[j].column_name, GlobalService.getVal('rulesSecColDelimiter'), attributesWithData[i].columns[j].type,")"].join(''), attributesWithData[i].table_name];
                        $scope.sectionsColumnLabelMap[tmpKey] = tmpVal;
                    }
                }
            }
        }
    };

    // Stores the list of attributes/sections
    if (!RulesService.getAttributesLoaded()) {
    	
        // This block is for getting sections data for first time
        RulesService.getSectionsAPI().then(function(response) {
            $scope.info.attributes = response.data.Data;
            $scope.info.sectionsLoading = false;
            RulesService.setAttributes($scope.info.attributes);
            RulesService.setAttributesLoaded(true);
            $scope.setSectionsColumnLabelMap();
            if(RulesService.getRuleMode() && RulesService.getRuleMode()['mode'] == 'edit' && !!RulesService.getRuleMode()['data']['colt']) {
                $scope.getSectionData(RulesService.getRuleMode()['data']['colt']);
            }
        }, function(response) {
            $scope.info.sectionsLoading = false;
            $scope.info.attributes = [];
            console.error("Unable to load attributes data");
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
            if(RulesService.getRuleMode() && RulesService.getRuleMode()['mode'] == 'edit' && !!RulesService.getRuleMode()['data']['colt']) {
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
            if(RulesService.getRuleMode() && RulesService.getRuleMode()['mode'] == 'edit' && !!RulesService.getRuleMode()['data']['colt']) {
                $scope.getSectionData(RulesService.getRuleMode()['data']['colt']);
            }
        }
        $scope.info.categoriesLoading = false;
        console.error("Unable to load categories");
    });

    // Stores the list of templates
    RulesService.getTemplates().then(function(response) {
        $scope.info.templates = response.data.Data;
    }, function(response) {
        $scope.info.templates = [];
        console.error("Unable to load templates");
    });

    // Stores the list of severities
    if (!Array.isArray(RulesService.getSeveritiesList())) {
        // Get from API if not loaded
        RulesService.getSeverities().then(function(response) {
            $scope.info.severities = response.data.Data;
            RulesService.setSeveritiesList($scope.info.severities);
        }, function(response) {
            $scope.info.severities = [];
            console.error("Unable to load severities");
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
            console.error("Unable to load priorities");
        });
    } else {
        // Get stored value if loaded
        $scope.info.priorities = RulesService.getPrioritiesList();
    }

    // Function to be called after submitting a rule
    $scope.submitRule = function() {
        // Check if each necessary element has some value
        if(!$scope.validateElements()) {
            return;
        }
        // Check for the mapping of section-column pairs used in Text
        var textPairs = $scope.validateTextMap();
        if (!Array.isArray(textPairs))
            return;
           
        // Set the value of hidden text
        $scope.setHiddenText(textPairs);
        
        // Call add/edit API accordingly
        $scope.addEditRule();
    };
    
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
        $scope.$parent.changeCurrentPage('uns_test_rule_history');
    };

    // Sets page list for Test Rule Page
    $scope.setPageListforTesting = function() {
        var pageList = GlobalService.getVal('unsRulesPages');
        pageList.uns_test_rule_history = [{ name: 'uns_rules_list', label: 'Rules List'}, { name: 'uns_add_rule', label: 'Add/Edit Rule'}, {name: 'uns_test_rule_history', label: 'Test Rule History'}];
        GlobalService.setVal('unsRulesPages', pageList);
    };
    
    // Function to add new rule
    $scope.addNewRule = function() {
        RulesService.setRuleMode('new');
        $scope.info.ruleAdded = false;
        $scope.info.addRuleMsg = {};
        $scope.populateAddRule();
    };
    
    // Function to call the add or edit rule API
    $scope.addEditRule = function() {
        $scope.info.categoriesLoading = true;
        if (RulesService.getRuleMode() && RulesService.getRuleMode()['mode'] == 'edit') {
            var data = {
                label: $scope.info.label.replace(/^\s+|\s+$/g, ''),
                description: $scope.info.description.replace(/^\s+|\s+$/g, ''),
                category_id: $scope.info.category,
                severity: $scope.info.severity,
                priority: $scope.info.priority,
                kb_link: $scope.info.kbLink.replace(/^\s+|\s+$/g, ''),
                email_template_id: $scope.info.action == 'mail' ? $scope.info.emailTemplate : '',
                text_actual: $scope.info.hiddenText.replace(/^\s+|\s+$/g, ''),
                text_display: $scope.info.text.replace(/^\s+|\s+$/g, ''),
	            table_name: $scope.info.tables.replace(/^\s+|\s+$/g, ''),
                recommendation: (document.getElementById('inputRecommendation').innerHTML).replace(/^\s+|\s+$/g, ''),
                scope: $scope.info.scope,
                author: $scope.info.author.replace(/^\s+|\s+$/g, ''), 
                col0: $scope.info.col0.replace(/^\s+|\s+$/g, ''),
                col1: $scope.info.col1.replace(/^\s+|\s+$/g, ''),
                col2: $scope.info.col2.replace(/^\s+|\s+$/g, ''),
                col3: $scope.info.col3.replace(/^\s+|\s+$/g, ''),
                status: $scope.info.status.replace(/^\s+|\s+$/g, ''),
                "update.notifier_id": $scope.info.notifierID,
                "update.set_as_draft": ($scope.info.status == $scope.info.supportedStatus.Draft || $scope.info.text.replace(/^\s+|\s+$/g, '') != $scope.info.initialText || $scope.info.initialMaxLimit != $scope.info.maxLimit || $scope.info.initialAction != $scope.info.action || $scope.info.col0.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol0 || $scope.info.col1.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol1 || $scope.info.col2.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol2 || $scope.info.col3.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol3 || $scope.info.tables.replace(/^\s+|\s+$/g, '') != $scope.info.initialTables) ? 1 : 0,
            	"update.draft": ($scope.info.status == $scope.info.supportedStatus.Draft) ? 1 : 0,
                "update.max_limit": $scope.info.maxLimit,
                "update.modify": ($scope.info.status == $scope.info.supportedStatus.Draft && RulesService.getRuleSavedStatus()) ? 1 : 0
            };
           
            RulesService.editRule(RulesService.getRuleMode()['data']['rule_id'], data).then(function(response) {
                $scope.info.categoriesLoading = false;             
                $scope.info.addRuleMsg = {
                    type: 'success',
                    msg: ($scope.info.status == $scope.info.supportedStatus.Draft || $scope.info.text.replace(/^\s+|\s+$/g, '') != $scope.info.initialText || $scope.info.initialMaxLimit != $scope.info.maxLimit || $scope.info.initialAction != $scope.info.action || $scope.info.col0.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol0 || $scope.info.col1.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol1 || $scope.info.col2.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol2 || $scope.info.col3.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol3 || $scope.info.tables.replace(/^\s+|\s+$/g, '') != $scope.info.initialTables) ? (GlobalService.getVal('rulesMsgs')['edit_rule_draft_success'][0] + $scope.info.initialLabel + GlobalService.getVal('rulesMsgs')['edit_rule_draft_success'][1]) : (GlobalService.getVal('rulesMsgs')['edit_rule_enabled_success'][0] + $scope.info.initialLabel + GlobalService.getVal('rulesMsgs')['edit_rule_enabled_success'][1])
                };
                
                $scope.info.ruleAdded = true;
                $scope.info.ruleAddedAsDraft = ($scope.info.status == $scope.info.supportedStatus.Draft || $scope.info.text.replace(/^\s+|\s+$/g, '') != $scope.info.initialText || $scope.info.initialMaxLimit != $scope.info.maxLimit || $scope.info.initialAction != $scope.info.action || $scope.info.col0.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol0 || $scope.info.col1.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol1 || $scope.info.col2.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol2 || $scope.info.col3.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol3 || $scope.info.tables.replace(/^\s+|\s+$/g, '') != $scope.info.initialTables) ? true : false;
                                
                var newData = {
                    rule_id: response.data.Data.rule_id,
                    notifier_id: response.data.Data.notifier_id,
                    label: $scope.info.label,
                    description: $scope.info.description,
                    category_id: $scope.info.category,
                    category: ($filter('filter')($scope.info.categories, {category_id: $scope.info.category}))[0].category,
                    severity_id: $scope.info.severity,
                    severity: ($filter('filter')($scope.info.severities, {severity_id: $scope.info.severity}))[0].severity,
                    priority_id: $scope.info.priority,
                    priority: ($filter('filter')($scope.info.priorities, {priority_id: $scope.info.priority}))[0].priority,
                    kb_link: $scope.info.kbLink,
                    email_template_id: $scope.info.action == 'none' ? 0 : $scope.info.emailTemplate.toString(),
                    text_display: $scope.info.text,
                    recommendation: document.getElementById('inputRecommendation').innerHTML,
                    scope: $scope.info.scope,
                    author: $scope.info.author,
	                table_name: $scope.info.tables.replace(/^\s+|\s+$/g, ''),
	                colt: $scope.info.tables.replace(/^\s+|\s+$/g, ''),
	                col0: $scope.info.col0.replace(/^\s+|\s+$/g, ''),
                	col1: $scope.info.col1.replace(/^\s+|\s+$/g, ''),
	                col2: $scope.info.col2.replace(/^\s+|\s+$/g, ''),
	                col3: $scope.info.col3.replace(/^\s+|\s+$/g, ''),
	                max_limit: $scope.info.maxLimit,
                    status: ($scope.info.status == $scope.info.supportedStatus.Draft || $scope.info.text.replace(/^\s+|\s+$/g, '') != $scope.info.initialText || $scope.info.initialMaxLimit != $scope.info.maxLimit || $scope.info.initialAction != $scope.info.action || $scope.info.col0.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol0 || $scope.info.col1.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol1 || $scope.info.col2.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol2 || $scope.info.col3.replace(/^\s+|\s+$/g, '') != $scope.info.initialCol3 || $scope.info.tables.replace(/^\s+|\s+$/g, '') != $scope.info.initialTables) ? $scope.info.supportedStatus.Draft : $scope.info.supportedStatus.Enabled
                };
              
                $scope.info.testRuleData = newData;
                
                if($scope.info.initialLabel != $scope.info.label) {
                    var rulesLabelMap = RulesService.getRulesLabelMap();
                    delete rulesLabelMap[$scope.info.initialLabel];
                    rulesLabelMap[$scope.info.label.replace(/^\s+|\s+$/g, '')] = true;
                    RulesService.setRulesLabelMap(rulesLabelMap);
                }
                
                
                // Reload rules list
                RulesService.getAllRules().then(function(response) {
                    RulesService.setRulesList(response.data.Data);
                }, function(response) {
                    
                });
                
                if($scope.info.initialLabel != $scope.info.label.replace(/^\s+|\s+$/g, '')) {
                    var details = {};
                    details['old'] = $scope.info.initialLabel;
                    details['new'] = $scope.info.label.replace(/^\s+|\s+$/g, '');
                    details = JSON.stringify(details);
                } else {
                    var details = $scope.info.initialLabel;
                }
                
                UserTrackingService.standard_user_tracking('rules', 'Rule', 'edit', details).then(function(response) {
                        
                }, function(response) {
                    
                });
                
                RulesService.setRuleMode('edit', newData);
                $scope.populateEditRule();
                
            }, function(response) {
                $scope.info.categoriesLoading = false;
                $scope.info.addRuleMsg = {
                    type: 'failure',
                    msg: GlobalService.getVal('rulesMsgs')['add_rule_fail']
                };

                $scope.info.ruleAdded = false;
                console.error('Unable to edit rule');
            });
        } else {
            var data = {
                label: $scope.info.label.replace(/^\s+|\s+$/g, ''),
                description: $scope.info.description.replace(/^\s+|\s+$/g, ''),
                author: $scope.info.author.replace(/^\s+|\s+$/g, ''),
                category_id: $scope.info.category,
                severity: $scope.info.severity,
                priority: $scope.info.priority,
                kb_link: $scope.info.kbLink.replace(/^\s+|\s+$/g, ''),
                email_template_id: $scope.info.action == 'mail' ? $scope.info.emailTemplate : '',
                text_actual: $scope.info.hiddenText.replace(/^\s+|\s+$/g, ''),
                text_display: $scope.info.text.replace(/^\s+|\s+$/g, ''),
                recommendation: (document.getElementById('inputRecommendation').innerHTML).replace(/^\s+|\s+$/g, ''),
                scope: $scope.info.scope,
                table_name: $scope.info.tables.replace(/^\s+|\s+$/g, ''),
                col0: $scope.info.col0.replace(/^\s+|\s+$/g, ''),
                col1: $scope.info.col1.replace(/^\s+|\s+$/g, ''),
                col2: $scope.info.col2.replace(/^\s+|\s+$/g, ''),
                col3: $scope.info.col3.replace(/^\s+|\s+$/g, ''),
                set_as_draft: "1",
                "update.max_limit": $scope.info.maxLimit
            };
          
            RulesService.addRule(data).then(function(response) {
                $scope.info.categoriesLoading = false;
                $scope.info.addRuleMsg = {
                    type: 'success',
                    msg: GlobalService.getVal('rulesMsgs')['add_us_rule_success']
                };
                
                $scope.info.ruleAdded = true;
                $scope.info.ruleAddedAsDraft = true;

                var newData = {
                    rule_id: response.data.Data.rule_id,
                    notifier_id: response.data.Data.notifier_id,
                    label: $scope.info.label,
                    description: $scope.info.description,
                    category_id: $scope.info.category,
                    category: ($filter('filter')($scope.info.categories, {category_id: $scope.info.category}))[0].category,
                    severity_id: $scope.info.severity,
                    severity: ($filter('filter')($scope.info.severities, {severity_id: $scope.info.severity}))[0].severity,
                    priority_id: $scope.info.priority,
                    priority: ($filter('filter')($scope.info.priorities, {priority_id: $scope.info.priority}))[0].priority,
                    kb_link: $scope.info.kbLink,
                    email_template_id: $scope.info.action == 'none' ? 0 : $scope.info.emailTemplate.toString(),
                    text_display: $scope.info.text,
                    recommendation: document.getElementById('inputRecommendation').innerHTML,
                    scope: $scope.info.scope,
                    author: $scope.info.author, 
	                text_actual: $scope.info.hiddenText,
	                text_display: $scope.info.text,  
	                table_name: $scope.info.tables.replace(/^\s+|\s+$/g, ''),
	                colt: $scope.info.tables.replace(/^\s+|\s+$/g, ''),
	                status : $scope.info.supportedStatus.Draft,
	                col0: $scope.info.col0,
	                col1: $scope.info.col1,
	                col2: $scope.info.col2,
	                col3: $scope.info.col3,
                    max_limit: $scope.info.maxLimit
                };
                              
                $scope.info.testRuleData = newData;
                
                var rulesLabelMap = RulesService.getRulesLabelMap();
                rulesLabelMap[$scope.info.label] = true;
                RulesService.setRulesLabelMap(rulesLabelMap);
                
                // Reload rules list
                RulesService.getAllRules().then(function(response) {
                    RulesService.setRulesList(response.data.Data);
                }, function(response) {
                    
                });
                
                UserTrackingService.standard_user_tracking('rules', 'Rule', 'add', $scope.info.label.replace(/^\s+|\s+$/g, '')).then(function(response) {
                    
                }, function(response) {
                    
                });
                
                RulesService.setRuleMode('edit', newData);
                $scope.populateEditRule();
                
            }, function(response) {
                $scope.info.categoriesLoading = false;
                $scope.info.addRuleMsg = {
                    type: 'failure',
                    msg: GlobalService.getVal('rulesMsgs')['add_rule_fail']
                };
                $scope.info.ruleAdded = false;
                console.error('Unable to add rule');
            });
        }
    };
    
    // Function to create unique section-column-type pairs
    $scope.createColumnType = function(col0, col2, col3) {
        $scope.info.secColTypePairs = [];
        $scope.info.tables = [];
        for(var i = 0; i < col0.length; i++) {
            var pairFound = false;
            var tableFound = false;
            for(var j = 0; j < $scope.info.secColTypePairs.length; j++) {
                if($scope.sectionsColumnLabelMap[col0[i]][3] == $scope.info.secColTypePairs[j]) {
                    pairFound = true;
                    break;
                }
            }
            for(var j = 0; j < $scope.info.tables.length; j++) {
                if($scope.sectionsColumnLabelMap[col0[i]][4] == $scope.info.tables[j]) {
                    tableFound = true;
                    break;
                }
            }
            if(!pairFound) {
                $scope.info.secColTypePairs.push($scope.sectionsColumnLabelMap[col0[i]][3]);
            }
            if(!tableFound) {
                $scope.info.tables.push($scope.sectionsColumnLabelMap[col0[i]][4]);
            }
        }
        for(var i = 0; i < col2.length; i++) {
            var pairFound = false;
            var tableFound = false;
            for(var j = 0; j < $scope.info.secColTypePairs.length; j++) {
                if($scope.sectionsColumnLabelMap[col2[i]][3] == $scope.info.secColTypePairs[j]) {
                    pairFound = true;
                    break;
                }
            }
            for(var j = 0; j < $scope.info.tables.length; j++) {
                if($scope.sectionsColumnLabelMap[col2[i]][4] == $scope.info.tables[j]) {
                    tableFound = true;
                    break;
                }
            }
            if(!pairFound) {
                $scope.info.secColTypePairs.push($scope.sectionsColumnLabelMap[col2[i]][3]);
            }
            if(!tableFound) {
                $scope.info.tables.push($scope.sectionsColumnLabelMap[col2[i]][4]);
            }
        }
        
        for(var i = 0; i < col3.length; i++) {
            var pairFound = false;
            var tableFound = false;
            for(var j = 0; j < $scope.info.secColTypePairs.length; j++) {
                if($scope.sectionsColumnLabelMap[col3[i]][3] == $scope.info.secColTypePairs[j]) {
                    pairFound = true;
                    break;
                }
            }
            for(var j = 0; j < $scope.info.tables.length; j++) {
                if($scope.sectionsColumnLabelMap[col3[i]][4] == $scope.info.tables[j]) {
                    tableFound = true;
                    break;
                }
            }
            if(!pairFound) {
                $scope.info.secColTypePairs.push($scope.sectionsColumnLabelMap[col3[i]][3]);
            }
            if(!tableFound) {
                $scope.info.tables.push($scope.sectionsColumnLabelMap[col3[i]][4]);
            }
        }
    };
    
    // Function to check if necessary elements have some value
    $scope.validateElements = function() {
        if(/^\s*$/.test($scope.info.label)) {
            ModalService.alertBox({msg: 'Label' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']});
            return;
        }
        var rulesLabelMap = RulesService.getRulesLabelMap();
        if(!!$scope.info.initialLabel && rulesLabelMap) {
            if($scope.info.label != $scope.info.initialLabel && rulesLabelMap.hasOwnProperty($scope.info.label)) {
                ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['add_rule_duplicate_label']});
                return;
            }
        } else {
            if(rulesLabelMap && rulesLabelMap.hasOwnProperty($scope.info.label)) {
                ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['add_rule_duplicate_label']});
                return;
            }
        }
        if($scope.info.category == "select") {
            ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'category'});
            return;
        }
        if(/^\s*$/.test($scope.info.author)) {
            ModalService.alertBox({msg: 'Author' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']});
            return;
        }
        if($scope.info.severity == "select") {
            ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'severity'});
            return;
        }
        if($scope.info.priority == "select") {
            ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'priority'});
            return;
        }
        if($scope.info.scope == "select") {
            ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'scope'});
            return;
        }
        if($scope.info.action == 'mail' && $scope.info.emailTemplate == 'select') {
            ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['add_rule_field_unselected'] + 'template'});
            return;
        }
      
        if(/^\s*$/.test($scope.info.tables)) {
            ModalService.alertBox({msg: 'Tables name' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']});
            return;
        }
        var ifMoreThanOneTable = false;
        if($scope.info.tables) {
        	$scope.info.tables = $scope.info.tables.replace(/^\s+|\s*|,$/gm,'');
        	$scope.info.tables = $scope.info.tables.replace(/^,+|\,+$/gm,'');
        	//check multiple tables are availabe or not
        	if($scope.info.tables.indexOf(",") != -1){
        		var tables = $scope.info.tables.split(",");
        		for(var i=0; i< tables.length; i++){
        			ifMoreThanOneTable = true;
        			//trim white spaces
        			tables[i] = tables[i].replace(/^\s+|\s+$/gm,'');
        			if(!$scope.validateTableName(tables[i])){
			            ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['uns_add_rule_table_not_matching']});
        				return false;
        			}        			
        		}
        	}else{
        		// trim white spaces
    			if(!$scope.validateTableName($scope.info.tables)){
		            ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['uns_add_rule_table_not_matching']});
    				return false;
    			}        			
        	}
        	//check for duplicate
        	var tables1 = $scope.info.tables.split(",");
        	var tables2 = $scope.info.tables.split(",");
        	var ifMatch = false;
        	for(var i=0; i< tables1.length; i++){
        		tables1[i] = tables1[i].replace(/^\s+|\s+$/gm,'');
	        	for(var j=(i +1); j< tables2.length; j++){
	        		tables2[j] = tables2[j].replace(/^\s+|\s+$/gm,'');
	        		if(tables1[i] == tables2[j]){
	        			ifMatch = true;
	        			break;
	        		}
	        	}
	        	if(ifMatch){
	        		break;
	        	}
        	}
        	if(ifMatch) {        		
	            ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['uns_add_rule_duplicate_table']});
				return false;
        	}
        	
        }
        
        
        if(ifMoreThanOneTable && ($scope.info.scope.toLowerCase() == 'table')) {
            ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['add_rule_multiple_tables']});
            return false;
        }
        
        if(/^\s*$/.test($scope.info.text)) {
            ModalService.alertBox({msg: 'Text' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']});
            return;
        }
        if(/^\s*$/.test($scope.info.col0)) {
            ModalService.alertBox({msg: 'Col0' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']});
            return;
        }
        if(/^\s*$/.test($scope.info.col1)) {
            ModalService.alertBox({msg: 'Col1' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']});
            return;
        }
        if(/^\s*$/.test($scope.info.col2)) {
            ModalService.alertBox({msg: 'Col2' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']});
            return;
        }
        if(/^\s*$/.test($scope.info.col3)) {
            ModalService.alertBox({msg: 'Col3' + GlobalService.getVal('rulesMsgs')['add_rule_field_empty']});
            return;
        }
        return true;
    };
    $scope.validateTableName = function(tabName) {
    	var len = $scope.info.attributes.length;
    	var attributes = $scope.info.attributes;
    	for(var i=0; i<len; i++) {
    		if(attributes[i]["table_name"] == tabName){
    			return true;
    		}
    	}
    	return false;
    };
   
    // Function to check whether each section-column pair entered in Logic is valid or not
    $scope.validateCol2Map = function() {
        var secColPairs = [],
            startPos = null,
            endPos = null;
        
        if(!$scope.info.col2.length) return secColPairs;
            
        for (var i = 0; i < $scope.info.col2.length; i++) {
            // Check if {{ or }} exists in string
            if (($scope.info.col2[i] == '{' && startPos) || ($scope.info.col2[i] == '}' && !startPos) || (i == $scope.info.col2.length - 1 && startPos && $scope.info.col2[i] != '}') || (i == $scope.info.col2.length - 1 && $scope.info.col2[i] == '{')) {
                ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['rule_logic_error']});
                return;
            }
            if ($scope.info.col2[i] == '{') {
                startPos = i + 1;
            }
            if ($scope.info.col2[i] == '}' && startPos) {
                endPos = i;
                var tmpString = $scope.info.col2.substring(startPos, endPos);
                if (!$scope.sectionsColumnLabelMap.hasOwnProperty(tmpString)) {
                    ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['rule_logic_invalid_attr'][0] + tmpString + GlobalService.getVal('rulesMsgs')['rule_logic_invalid_attr'][1]});
                    return;
                }
                secColPairs.push(tmpString);
                startPos = null;
            }
        }
        return secColPairs;
    };

    // Function to check whether each section-column pair entered in Text is valid or not
    $scope.validateCol0Map = function() {
        var secColPairs = [],
            startPos = null,
            endPos = null;
        for (var i = 0; i < $scope.info.col0.length; i++) {
            // Check if {{ or }} exists in string
            if (($scope.info.col0[i] == '{' && startPos) || ($scope.info.col0[i] == '}' && !startPos) || (i == $scope.info.col0.length - 1 && startPos && $scope.info.col0[i] != '}') || (i == $scope.info.col0.length - 1 && $scope.info.col0[i] == '{')) {
                ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['rule_text_error']});
                return;
            }
            if ($scope.info.col0[i] == '{') {
                startPos = i + 1;
            }
            if ($scope.info.col0[i] == '}' && startPos) {
                endPos = i;
                var tmpString = $scope.info.col0.substring(startPos, endPos);
                if (!$scope.sectionsColumnLabelMap.hasOwnProperty(tmpString)) {
                    ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['rule_text_invalid_attr'][0] + tmpString + GlobalService.getVal('rulesMsgs')['rule_text_invalid_attr'][1]});
                    return;
                }
                secColPairs.push(tmpString);
                startPos = null;
            }
        }
        return secColPairs;
    };
	

    // Function to check whether each section-column pair entered in Text is valid or not
    $scope.validateCol3Map = function() {
        var secColPairs = [],
            startPos = null,
            endPos = null;
        for (var i = 0; i < $scope.info.col3.length; i++) {
            // Check if {{ or }} exists in string
            if (($scope.info.col3[i] == '{' && startPos) || ($scope.info.col3[i] == '}' && !startPos) || (i == $scope.info.col3.length - 1 && startPos && $scope.info.col3[i] != '}') || (i == $scope.info.col3.length - 1 && $scope.info.col3[i] == '{')) {
                ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['rule_text_error']});
                return;
            }
            if ($scope.info.col3[i] == '{') {
                startPos = i + 1;
            }
            if ($scope.info.col3[i] == '}' && startPos) {
                endPos = i;
                var tmpString = $scope.info.col3.substring(startPos, endPos);
                if (!$scope.sectionsColumnLabelMap.hasOwnProperty(tmpString)) {
                    ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['rule_text_invalid_attr'][0] + tmpString + GlobalService.getVal('rulesMsgs')['rule_text_invalid_attr'][1]});
                    return;
                }
                secColPairs.push(tmpString);
                startPos = null;
            }
        }
        return secColPairs;
    };
	
	
    // Function to check whether each section-column pair entered in Text is valid or not
    $scope.validateTextMap = function() {
        var secColPairs = [],
            startPos = null,
            endPos = null;
        for (var i = 0; i < $scope.info.text.length; i++) {
            // Check if {{ or }} exists in string
            if (($scope.info.text[i] == '{' && startPos) || ($scope.info.text[i] == '}' && !startPos) || (i == $scope.info.text.length - 1 && startPos && $scope.info.text[i] != '}') || (i == $scope.info.text.length - 1 && $scope.info.text[i] == '{')) {
                ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['rule_text_error']});
                return;
            }
            if ($scope.info.text[i] == '{') {
                startPos = i + 1;
            }
            if ($scope.info.text[i] == '}' && startPos) {
                endPos = i;
                var tmpString = $scope.info.text.substring(startPos, endPos);
                if (!$scope.sectionsColumnLabelMap.hasOwnProperty(tmpString)) {
                    ModalService.alertBox({msg: GlobalService.getVal('rulesMsgs')['rule_text_invalid_attr'][0] + tmpString + GlobalService.getVal('rulesMsgs')['rule_text_invalid_attr'][1]});
                    return;
                }
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
    };

    // Function to set the value of hidden text
    $scope.setHiddenText = function(textPairs) {
        $scope.info.hiddenText = $scope.info.text;
        for (var i in textPairs) {
            var tempStr = textPairs[i];
            var tempReplaceStr = "rule." + $scope.sectionsColumnLabelMap[textPairs[i]][0];
            $scope.info.hiddenText = $scope.info.hiddenText.replace(tempStr, tempReplaceStr);
        }
    };
    
    // Function to expand/collapse a section
    $scope.expandSection = function(section) {
        if(!!section.expanded && !section.hasOwnProperty('hasData')) {
            $scope.getSectionColumns(section);
        }
    };
	
    // Function to update the lastElementFocused variable on change of element focus
    $scope.focusElement = function(element) {
        $scope.info.lastElementFocused = element;
    };
    
    // Function to handle double click on attributes/operators/columns
    $scope.addLogicText = function(data) {
        if($scope.info.lastElementFocused == 'logic') {
            $scope.onDropLogic(data);
        } else if($scope.info.lastElementFocused == 'text') {
            $scope.onDropText(data);
        } else {
            ModalService.alertBox({msg: 'Please put your cursor on text'});
            return;
        }
    };
	
    // Function to call when some value is dropped on text box
    $scope.onDropText = function(data, evt) {
        var position = angular.element(document.getElementById('inputText')).prop("selectionStart"),
            newPos;
        if (data[1].type == 'operator') {
            ModalService.alertBox({msg: 'Relational & Logical operators not valid for Text'});
            return;
        } else if (data[1].type == 'function') {
            $scope.info.text = [$scope.info.text.slice(0, position), data[1].text, $scope.info.text.slice(position)].join('');
            newPos = position + data[1].positionInc;
        } else if (!(data[1].type == 'operator' || data[1].type == 'function')) {
            $scope.info.text = [$scope.info.text.slice(0, position), " {", data[0], ".", data[1].label, "} ", $scope.info.text.slice(position)].join('');
            newPos = position + data[0].length + data[1].label.length + 5;
        }
        document.getElementById('inputText').focus();
        document.getElementById('inputText').setSelectionRange(newPos, newPos);
    };

    // Function to go to the Add Category page
    $scope.goToAddCategory = function() {
        $scope.$parent.changeCurrentPage('add_category');
    };

    // Function to go to the Manage Templates page
    $scope.goToManageTemplates = function() {
        $scope.$parent.changeCurrentPage('manage_template');
    };
    
}])
.controller('SessionController', ['$modalInstance', 'GlobalService', 'AppService',
    function ($modalInstance, GlobalService, AppService) {
        var sessionCtrl = this;
        sessionCtrl.msg = GlobalService.getVal('session_timeout_msg');
        sessionCtrl.ok = function () {
            sessionTimeout();
            $modalInstance.close("Ok");
        };
        function sessionTimeout() {
            AppService.logoutSessionTimeout();
        }
    }])
.controller('AbortUploadController', ['$modalInstance', 'GlobalService',
    function ($modalInstance, GlobalService) {
        var abortCtrl = this;
        abortCtrl.msg = GlobalService.getVal('abort_upld');
        abortCtrl.hideAbortUpload = function () {
            $modalInstance.dismiss("cancel");
        };
        abortCtrl.abortUpload = function () {
            $modalInstance.close("ok");
        };
    }])
.controller('AlertController', ['$modalInstance', 'GlobalService', 'items',
    function ($modalInstance, GlobalService, items) {
        var alertCtrl = this;
        if (items.msg) {
            alertCtrl.msg = items.msg
        } else {
            alertCtrl.msg = GlobalService.getVal(items.msgKey);
        }
        alertCtrl.ok = function () {
            $modalInstance.close("ok");
        };
    }]);
