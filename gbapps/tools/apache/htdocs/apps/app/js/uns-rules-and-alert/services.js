angular.module('gbApp.services.rules', []).factory('RulesService', ['$http', '$location', '$cookies', 'GlobalService','AppService','$window',
function($http, $location, $cookies, GlobalService,AppService,$window) {
	var rulesList,
	    templatesList,
	    rulesColumns,
	    templatesColumns,
	    categories,
	    attributes = null,
	    attributesLoaded = false,
	    rulesList = null,
	    templatesList = null,
	    severitiesList = null,
	    prioritiesList = null,
	    testRuleData = null,
	    ruleMode = {mode: 'new'},
	    rulesLabelMap = {},
        stagingRules = false,
        ruleSaved = false,
        // singleBundleTesting = true,
        // logUploading = false,
        // logParsing = false,
        // draftTestPending = false,
        logMoving = false,
        lastLogUploadTime;
	    
	return {
	    //Service Method to get Sections from API
        getSectionsAPI : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/meta/sections/all/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'GET'
            });
        },
        
        //Service Method to get Columns for a section from API
        getSectionColumns : function(sec_table_name) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/meta/columns/table_name/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + sec_table_name,
                method: 'GET'
            });
        },
        
        // Service method to get draft tested status
        // getDraftTestPending : function() {
            // return this.draftTestPending;
        // },
        
        // Service method to set draft tested status
        // setDraftTestPending : function(data) {
            // this.draftTestPending = data;
        // },
        
        // Service method to get the log moving status
        getLogMoving : function() {
            return this.logMoving;
        },
        
        // Service method to set the log moving status
        setLogMoving : function(data) {
            this.logMoving = data;
        },
        
        // Service method to set last log uploaded time
        setLastLogUploadTime : function(data) {
            this.lastLogUploadTime = data;
        },
        
        // Service method to get last log uploaded time
        getLastLogUploadTime : function() {
            return this.lastLogUploadTime;
        },
        
        // Service method to get the log parsing status
        // getLogParsing : function() {
            // return this.logParsing;
        // },
        
        // Service method to set the log parsing status
        // setLogParsing : function(data) {
            // this.logParsing = data;
        // },
        
        // Service method to get the log uploading status
        // getLogUploading : function() {
            // return this.logUploading;
        // },
        
        // Service method to set the log uploading status
        // setLogUploading : function(data) {
            // this.logUploading = data;
        // },
	    
	    // Service method to get Attributes from cache
	    getAttributes : function() {
	        return this.attributes;
	    },
	    
	    // Service method to cache Attributes data
	    setAttributes : function(data) {
	        this.attributes = data;
	    },
	    
	    // getSingleBundleTesting : function() {
            // return this.singleBundleTesting;
        // },
//         
        // setSingleBundleTesting : function(data) {
            // this.singleBundleTesting = data;
        // },
	    
	    // Service method to get the status of Attributes cached or not
	    getAttributesLoaded : function() {
	        return this.attributesLoaded;
	    },
	    
	    // Service method to set the status of Attributes cached or not
	    setAttributesLoaded : function(bool) {
	        this.attributesLoaded = bool;
	    },
	    
	    // Service method to get the list of rules from API
	    getAllRules : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
	        return $http({
                url: infoserverDomain + '/rules/unsupported/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'GET'
            });
	    },
	    
	    // Service method to get rule data from staging
        getStagingRulesData : function(ruleIDs) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/stage/unsupported/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data : {
                    rule_id: ruleIDs
                }
            });
        },
	    
	    // Service method to get the list of rules Labels
        getRulesLabelsList : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/labels/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'GET'
            });
        },
	    
	    // Service method to get the rule mode
        getRuleMode : function() {
            return this.ruleMode;
        },
        
        // Service method to set the template mode
        setRuleMode : function(mode, rule) {
            if(mode == 'new') {
                this.ruleMode = {mode: 'new'};
            } else {
                this.ruleMode = {mode: 'edit', data: rule};
            }
        },
        
        // Service method to modify rule data
        modifyRuleData : function(modifiedData) {
            this.ruleMode.modifiedData = modifiedData;
        },
        
        // Service method to enable a rule
        enableRule : function(id, draft) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/unsupported/enable/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + id,
                method: 'POST',
                data: {
                    is_draft: draft
                }
            });
        },
        
        // Service method to disable a rule
        disableRule : function(id) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/unsupported/disable/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + id,
                method: 'POST'
            });
        },
        
        // Service method to edit a rule
        editRule : function(id, data) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/unsupported/update/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + id,
                method: 'POST',
                data: data
            });
        },
        
        // Service method to add a rule
        addRule : function(data) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/unsupported/add/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data: data
            });
        },
	    
	    // Service method to delete a rule
        deleteRule : function(id) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/unsupported/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + id,
                method: 'POST'
            });
        },
		
		// Service method to get the list of rules from local variable
		getRulesList : function() {
		    return this.rulesList;
		},
		
		// Service method to store the list of rules in local variable
		setRulesList : function(data) {
		    this.rulesList = data;
		},
		
		getRulesLabelMap : function() {
		    return this.rulesLabelMap;
		},
		
		setRulesLabelMap : function(data) {
		    this.rulesLabelMap = data;
		},
		
		// Service method to get test rule data
		getTestRuleData : function() {
		    return this.testRuleData;
		},
		
		// Service method to set test rule data
		setTestRuleData : function(data) {
		    this.testRuleData = data;
		},
		// Service method to get the list of categories
        getCategories : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/category/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'GET'
            });
        },
        
        // Service method to get the list of severity
        getSeverities : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/severity/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'GET'
            });
        },
        
        // Service method to get the stored list of severities
        getSeveritiesList : function() {
            return this.severitiesList;
        },
        
        // Service method to store the list of severities locally
        setSeveritiesList : function(data) {
            this.severitiesList = data;
        },
        
        // Service method to get the list of priorities
        getPriorities : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/priority/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'GET'
            });
        },
        
         // Service method to get the stored list of priorities
        getPrioritiesList : function() {
            return this.prioritiesList;
        },
        
        // Service method to store the list of priorities locally
        setPrioritiesList : function(data) {
            this.prioritiesList = data;
        },
		
		// Service method to get the list of templates from API
		getTemplates : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http({
                url: infoserverDomain + '/rules/email_template/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'GET'
            });
		},
		
		// Service method to get the templates list from local variable
		getTemplatesList : function() {
		    return this.templatesList;
		},
		
		// Service method to set the value of templates list
		setTemplatesList : function(data) {
		    this.templatesList = data;
		},
       
        // Service method to get bundles list from staging H2
        getStageBundles : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/stage/bundle/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'GET'
            });
        },
        
        // Service method to get last bundles from staging H2
        // getSingleStageBundles : function() {
            // return $http({
                // url: infoserverDomain + '/rules/stage/bundle/lastseen/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                // method: 'GET'
            // });
        // },
        
        // Service method to insert rule into staging H2
        insertRuleStaging : function(data) {
            var infoserverDomainStaging = GlobalService.getVal('infoserverDomainStaging');
            return $http({
                url: infoserverDomainStaging + '/rules/stage/insert/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data: data
            });
        },
        
        // Service method to delete rule from staging H2
        // deleteRuleStaging : function() {
            // return $http({
                // url: infoserverDomain + '/rules/stage/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                // method: 'POST'
            // });
        // },
        
        // Service method to get staging rule data
        getStagingRules : function() {
            return this.stagingRules;
        },
        
        // Service method to set staging rule data
        setStagingRules : function(data) {
            this.stagingRules = data;
        },
        
        // Service method to get rule saved status
        getRuleSavedStatus : function() {
            return this.ruleSaved;
        },
        
        // Service method to set rule saved status
        setRuleSavedStatus : function(data) {
            this.ruleSaved = data;
        },
        
        // Service method to insert rule association with bundle
        insertBundleRuleAssociation : function(data) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                method: 'POST',
                url: infoserverDomain + '/rules/stage/bundle/insert/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                data: data
            });
        },
        
        // Service method to get bundle ID from load ID
        getBundleId : function(load_id) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                method: 'GET',
                url: infoserverDomain + '/rules/stage/bundle_id/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + load_id
            });
        },
        
        // Service method to authenticate staging infoserver
        authenticateStaging : function() {
            var protocol = $location.protocol();
            var internal_domain_url = $location.host();
            // if (infoserverDomainLocal == 1) {
                // protocol = 'http';
                // internal_domain_url = 'localhost';
            // }
            var infoserverDomainStaging = GlobalService.getVal('infoserverDomainStaging');
            return $http({
                method : 'GET',
                url : infoserverDomainStaging + '/authenticate/' + $cookies.CGISESSID + '/' + protocol + '/' + internal_domain_url
            });
        },
        
        // Service method to get test results for a selected bundle 
        getTestResults : function(selectQuery) {
            var infoserverDomainStaging = GlobalService.getVal('infoserverDomainStaging');
            return $http({ 
                method: 'GET', 
                url: infoserverDomainStaging + '/analytics/' + GlobalService.getVal('manufacturer') + '/' + selectQuery
            });
        },
        
        // Service method to get file upload to LCP status
        checkfileUploadToLCPStatus : function(fileEpoch) {
            var infoserverDomainStaging = GlobalService.getVal('infoserverDomainStaging');
            return $http({ 
                method: 'GET', 
                url: infoserverDomainStaging + '/fileupload/stage/status/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + fileEpoch
            });
        },
        
        // Service method to check the running status of LCP
        checkLCPStatus : function() {
            var infoserverDomainStaging = GlobalService.getVal('infoserverDomainStaging');
            return $http({ 
                method: 'GET', 
                url: infoserverDomainStaging + '/monitor/stage/lcp/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')
            });
        },
		logoutSessionRules : function() {
                    AppService.logoutInfoserver().then(function(response) {
                        $window.location.href=GlobalService.getVal('logout_rules_url');
                    }, function(response) {
                        $window.location.href=GlobalService.getVal('logout_rules_url');
                    });
                },


	};
}]);
