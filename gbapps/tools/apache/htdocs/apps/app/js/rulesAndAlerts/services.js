angular.module('gbApp.services.rules', []).factory('RulesService', ['$http', '$location', '$cookies', 'GlobalService', 'UserTrackingService',
function($http, $location, $cookies, GlobalService, UserTrackingService) {
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
	    templateMode = {mode: 'new'},
	    ruleMode = {mode: 'new'},
	    rulesLabelMap = {},
	    templatesLabelMap = {},
	    stagingRules = false,
	    ruleSaved = false,
	    templateSaved = false,
	    infoserverDomainStaging,
	    infoserverStagingKeyspace,
	    logMoving = false,
	    lastLogUploadTime,
        loadExplorerData = false,
        analyticsTimeFilter = null,
        analytics={}, selectedRuleForAnalytics = null,
        analyticsColor= GlobalService.getVal('analyticsColor'),
        analyticsLoaderWait = false,
        sectionsColumnLabelMap = null,
        sectionsColumnLabelList = null,
        globalAttributes = [],
        showAlertApiFeatureflag,
        groupedData = null,
        filterState = {},
        stateGroupedData = undefined,
        infoData = {},
        pageState;


       

	return {
        ruleType: 'supported',
        setSelectedTimeFilter: function(value){
            analyticsTimeFilter = value;
        },
        getSelectedTimeFilter: function(){
            return analyticsTimeFilter;
        },
        setAnalyticsData: function(data){
            analytics = data;
        },
        getAnalytics: function(type){
            if(!type){
                return analytics;
            }
            else{
                return analytics[type];
            }
            
        },
        getAnalyticsColor: function(type){
            return analyticsColor[type];
        },
        getRuleType: function(){
            return this.ruleType;
        },
        setRuleType: function(rType){
            this.ruleType = rType;
        },	  
        //checking if api has returned with response
        setAnalyticsLoaderWait:function(state){
            analyticsLoaderWait = state;
        },
        getAnalyticsLoaderWait:function(){
            return analyticsLoaderWait;
        },     
	    //Service Method to get all owenr list
	    getRulesOwenrList : function() {
            var umsDomain = GlobalService.getVal('umsDomain');
	        return $http({
	            url: umsDomain + '/customer/user/listrulecreator/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
	            method: 'GET'
	        });
        },        
        updateRuleOwnership : function(param) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + "/rules/change_owner/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data : param
            });
        },
	    //Service Method to get Sections from API
	    getSectionsAPI : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
	        return $http({
	            url: infoserverDomain + '/meta/sections/all/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'GET',
                cache: true
	        });
        },
        //Service method for searching of attribute
        getSectionsFromAttrAPI : function(attr) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
	        return $http({
	            url: infoserverDomain + '/attribute/suggestion/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')+ '/' + attr,
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
        
        // Set this flag if you landed from explorer/apps to R&a
        loadExplorerRules : function() {
        	this.loadExplorerData = true;
        },
        
        // Returns the value of flag set above
        getloadExplorerRules : function() {
        	return this.loadExplorerData;
        },
        
        // Sets the flag to false so that it doesn't expect any logic/sections passed from explorer/apps
        disableExplorerRules : function() {
        	this.loadExplorerData = false;
        },
        
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
	    
	    // Service method to get Attributes from cache
	    getAttributes : function() {
	        return this.attributes;
	    },
	    
	    // Service method to cache Attributes data
	    setAttributes : function(data) {
	        this.attributes = data;
	    },
	    
	    // Service method to get the status of Attributes cached or not
	    getAttributesLoaded : function() {
	        return this.attributesLoaded;
	    },
	    
	    // Service method to set the status of Attributes cached or not
	    setAttributesLoaded : function(bool) {
	        this.attributesLoaded = bool;
	    },
	    
	    // Service method to get the list of prod rules from API
	    getAllRules : function(rtype) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                    url: infoserverDomain + '/rules/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + rtype,
                    method: 'GET'
                });
            
            /* if(!rtype || rtype=='supported'){
                return $http({
                    url: infoserverDomain + '/rules/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                    method: 'GET'
                });
            }else{
                return $http({
                    url: infoserverDomain + '/rules/unsupported/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                    method: 'GET'
                });
            } */
	    },
	    
	    // Service method to get rule data from staging
	    getStagingRulesData : function(ruleIDs) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
	        return $http({
                url: infoserverDomain + '/rules/stage/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data : {
                    rule_id: ruleIDs
                }
            });
	    },
	    
	    // Service method to get the list of prod rules Labels
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
        
        // Service method to set the rule mode
        setRuleMode : function(mode, ruleData) {
            if(mode == 'new') {
                this.ruleMode = {mode: 'new'};
            } else {
                this.ruleMode = {mode: 'edit', data: ruleData};
            }
        },
        
        // Service method to modify rule data
        modifyRuleData : function(modifiedData) {
            this.ruleMode.modifiedData = modifiedData;
        },
        
        // Service method to enable a prod rule
        enableRule : function(id, comments) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/enable/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + id,
                method: 'POST',
                data: {
                    comments: comments
                }
            });
        },
        
        // Service method to update staging C* bundle_rule in case of enable rule
        enableStageRule : function(id) {
            return $http({
                url: this.getStagingDomain() + '/rules/stage/enable/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + id,
                method: 'POST'
            });
        },
        
        // Service method to disable a prod rule
        disableRule : function(id, comments) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/disable/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + id,
                method: 'POST',
                data: {
                    comments: comments
                }
            });
        },
        
        // Service method to edit/update a prod rule
        editRule : function(id, data, ruletype) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/update/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + id + '/' + ruletype,
                method: 'POST',
                data: data
            });
        },
        
        // Service method to update staging C* bundle_rule in case of edit/update rule
        editStageRule : function(id) {
            return $http({
                url: this.getStagingDomain() + '/rules/stage/update/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + id,
                method: 'POST'
            });
        },
        
        // Service method to add a prod rule
        addRule : function(data) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/add/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data: data
            });
        },
	    
	    // Service method to delete a prod rule
        deleteRule : function(ids, status, email_template_ids) {
            var data = {
                rule_ids: ids,
                rule_status: status,
                api_template_ids: email_template_ids
            };
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data: data
            });
        },
		
		// Service method to get the list of prod rules from local variable
		getRulesList : function() {
		    return this.rulesList;
		},
		
		// Service method to store the list of prod rules in local variable
		setRulesList : function(data) {
		    this.rulesList = data;
		},
		
		// Service method to get prod rules label map
		getRulesLabelMap : function() {
		    return this.rulesLabelMap;
		},
		
		// Service method to set prod rules label map
		setRulesLabelMap : function(data) {
		    this.rulesLabelMap = data;
		},
		
		// Service method to get test rule data(Rules to be tested on Test Rule page)
		getTestRuleData : function() {
		    return this.testRuleData;
		},
		
		// Service method to set test rule data(Rules to be tested on Test Rule page)
		setTestRuleData : function(data) {
		    this.testRuleData = data;
		},
		
		// Service method to get the list of categories
        getCategories : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/category/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
        },
        
        // Service method to add a category
        addCategory : function(category, description) {
            var conf = {
                'category': category,
                'category_description': description
            };
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/category/add/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data: conf
            });
        },
        
        // Service method to delete a category
        deleteCategory : function(id) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/category/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + id,
                method: 'POST'
            });
        },
        
        // Service method to update a category
        updateCategory : function(id, category, description) {
            var conf = {
                'category': category,
                'category_description': description
            };
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/category/update/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + id,
                method: 'POST',
                data: conf
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
		
		// Service method to get templates label map
		getTemplatesLabelMap : function() {
            return this.templatesLabelMap;
        },
        
        // Service method to set templates label map
        setTemplatesLabelMap : function(data) {
            this.templatesLabelMap = data;
        },
		
		// Service method to get the template mode
		getTemplateMode : function() {
		    return this.templateMode;
		},
		
		// Service method to set the template mode
		setTemplateMode : function(mode, template) {
		    if(mode == 'new') {
		        this.templateMode = {mode: 'new'};
		    } else {
		        this.templateMode = {mode: 'edit', data: template};
		    }
		},
		
		// Service method to delete a template
		deleteTemplate : function(id) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http({
                url: infoserverDomain + '/rules/email_template/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + id,
                method: 'POST'
            });
		},
		
		// Service method to add a template
		addTemplate : function(name, subject, body, alertperrow) {
		    var conf = {
                'template_name': name,
                'subject': subject,
                'body': body,
            };
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/email_template/add/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data: conf
            });
		},
		
		// Service method to edit a template
		editTemplate : function(id, name,  subject, body, alertperrow) {
            var conf = {
                'template_name': name,
                'subject': subject,
                'body': body,
            };
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/rules/email_template/update/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + id,
                method: 'POST',
                data: conf
            });
        },
        
        // Service method to get bundles list from staging H2
        getStageBundles : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: this.getStagingDomain() + '/rules/stage/bundle/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'GET'
            });
        },
        
        // Service method to insert rule into staging H2
        insertRuleStaging : function(data) {
            return $http({
                url: this.getStagingDomain() + '/rules/stage/insert/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data: data
            });
        },
        
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
        
        // Service method to get template saved status
        getTemplateSavedStatus : function() {
            return this.templateSaved;
        },
        
        // Service method to set template saved status
        setTemplateSavedStatus : function(data) {
            this.templateSaved = data;
        },
        
        // Service method to insert rule association with bundle(bundle_rule CF)
        insertBundleRuleAssociation : function(data) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                method: 'POST',
                url: this.getStagingDomain() + '/rules/stage/bundle/insert/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                data: data
            });
        },
        
        // Service method to get bundle ID from load ID for a bundle
        getBundleId : function(load_id) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                method: 'GET',
                url: this.getStagingDomain() + '/rules/stage/bundle_id/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + load_id
            });
        },
        
        // Service method to get test results for a selected bundle 
        getTestResults : function(selectQuery, defer) {
            return $http({ 
            	method: 'GET', 
                url: this.getStagingDomain() + '/analytics/' + GlobalService.getVal('manufacturer') + '/' + selectQuery,
                timeout: defer.promise
            });
        },
        
        // Service method to get file upload to LCP status
        checkfileUploadToLCPStatus : function(fileEpoch) {
            return $http({ 
                method: 'GET', 
                url: this.getStagingDomain() + '/fileupload/stage/status/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + fileEpoch
            });
        },
        
        // Service method to check the running status of LCP
        checkLCPStatus : function() {
            return $http({ 
                method: 'GET', 
                url: this.getStagingDomain() + '/monitor/stage/lcp/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')
            });
        },
        
        // Service method to make an XHR to fetch all config meta info
        getAllConfig : function() {
            return UserTrackingService.getAllConfig();
        },
        
        // Service method to set staging infoserver domain
        setStagingDomain : function(domain) {
            this.infoserverDomainStaging = domain;
        },
        
        // Service method to get staging infoserver domain
        getStagingDomain : function() {
            return this.infoserverDomainStaging;
        },
        
        // Service method to get staging C* keyspace where test results are stored
        setStagingKeyspace : function(keyspace) {
            this.infoserverStagingKeyspace = keyspace;
        },
        
        // Service method to set staging C* keyspace where test results are stored
        getStagingKeyspace : function() {
            return this.infoserverStagingKeyspace;
        },
        getTopTenRulesByAlerts : function(st, et) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            //var url = 'stat/top10rulesbyalerts.json';
            var url = infoserverDomain + '/analytics/top_n/rules/by_count/'+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')  + '/' +  GlobalService.getVal('manufacturer') +'/'+st+'/'+et + '/10';
            
		    return $http({
                url : url,
                method: 'GET'
            });
        },
        getAlertsTriggerBySeverity: function (st, et) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            // var url = 'stat/alertsBySevirityvyTime.json';
            var url = infoserverDomain + '/analytics/alerts/by_severity/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')  + '/' +  GlobalService.getVal('manufacturer') +'/'+st+'/'+et;
            return $http({
                'url' : url,
                'method': 'GET'
            });
        },
        getAlertsOfARule: function (ruleId, st, et) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            //var url = 'stat/alertsByRuleId.json?ruleId='+ruleId+'&st='+st+"&et="+et;
            var url = infoserverDomain + '/analytics/alerts/by_rule_id/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')  + '/' +  GlobalService.getVal('manufacturer') +'/'+st+'/'+et + '/' + ruleId;
            return $http({
                'url' : url,
                'method': 'GET'
            });
        },
        getRulesNotTriggered: function (st, et) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var url = infoserverDomain + '/analytics/rules/nontriggered/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')  + '/' +  GlobalService.getVal('manufacturer') +'/'+st+'/'+et;
            return $http({
                'url' : url,
                'method': 'GET'
            });
        },
        getCompleteAlertsCount: function (st, et) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
           // var url = 'stat/alertsByRuleId.json?ruleId='+ruleId+'&st='+st+"&et="+et;
            var url = infoserverDomain + '/analytics/alerts/by_date/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')  + '/' +  GlobalService.getVal('manufacturer') +'/'+st+'/'+et;
            return $http({
                'url' : url,
                'method': 'GET'
            });
        },
        setSelectedRuleForAnalytics: function(rule){
            selectedRuleForAnalytics = rule;
        },
        getSelectedRuleForAnalytics: function(){
            return selectedRuleForAnalytics;
        },
        setLogBundle: function(bundles){
            this.logBundles = bundles;
        },
        getLogBundle: function(bundles){
            return this.logBundles;
        },        
        // Service method to send bundle info
        sendRulesWithLogvaultBundle : function(data) {
            var url = this.getStagingDomain() + '/logvault/rules_testing/download/bundles/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
            return $http({              
                'url' : url,
                method: 'POST',
                data: data
            });
        },
        //API for supported and unsupported rules in analytics
        newAnalyticsApi: function () {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            // var url = 'stat/alertsBySevirityvyTime.json';
            var url = infoserverDomain + '/rules/analytics/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
            return $http({
                'url' : url,
                'method': 'GET'
            });
        },
        //API for Rule drill details and change history 
        getRuleDrillDetails: function (rule_id) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            // var url = 'stat/alertsBySevirityvyTime.json';
            var url = infoserverDomain + '/rules/history/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')+ '/' + rule_id;
            return $http({
                'url' : url,
                'method': 'GET'
            });
        },
        // Service method to get the list of templates from API
		getAPITemplates : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
             //var url = 'stat/alert_api.json';
             var url = infoserverDomain + '/rules/api_template/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')
		     return $http({
                'url' : url,
                'method': 'POST'
            });
        },

        // Service method to store the list of prod rules in local variable
		setApiTemplateList : function(data) {
		    this.apiTemplateList = data;
		},
		
		
		// Service method to get the list of prod rules from local variable
		getApiTemplateList : function() {
		    return this.apiTemplateList;
		},


        // Service method to get the list of alert config
		getAPIConfigTemplates : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
             //var url = 'stat/alert_config_list.json';
             var url = infoserverDomain + '/rules/api_template/listconfig/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')
		     return $http({
                'url' : url,
                'method': 'POST'
            });
        },

         // Service method to delete  alert config
         deleteAPIConfigTemplate : function(id) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
             //var url = 'stat/alert_config_list.json';
             var url = infoserverDomain + '/rules/api_template/deleteconfig/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')+ '/' + id;
		     return $http({
                'url' : url,
                'method': 'POST'
            });
        },

        // Service method to ADD  alert config
        addAPIConfigTemplate : function(data) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
             //var url = 'stat/alert_config_list.json';
             var url = infoserverDomain + '/rules/api_template/addconfig/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')
		     return $http({
                'url' : url,
                'method': 'POST',
                data: data
            });
        },
        // Service method to ADD  alert config
        editAPIConfigTemplate : function(data) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
             //var url = 'stat/alert_config_list.json';
             var url = infoserverDomain + '/rules/api_template/updateconfig/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')
		     return $http({
                'url' : url,
                'method': 'POST',
                data: data
            });
        },
        setSectionsColumnLabelMap : function(sectionColumnMap){
            sectionsColumnLabelMap = sectionColumnMap;
        },

        getSectionsColumnLabelMap : function(){
            return sectionsColumnLabelMap;
        },

        setSectionsColumnLabelForManageAPI : function(list){
            sectionsColumnLabelList = list;
        },

        getSectionsColumnLabelForManageAPI : function(){
            return sectionsColumnLabelList;
        },

        getSectionsAndAttributePair : function(text){
            
            //get REGEX start index and end index
            var isPartOfRegex = function(curlyBraceIndex) {
                var logic = text, regexToken="", searchEndIndex=0;
                var searchIndex = logic.indexOf('REGEX');
                if( searchIndex== -1) {
                    return false;
                };
                while(searchIndex >= 0){
                    //get complete regex 
                    regexToken = $scope.parseToken(logic,searchIndex, '(', ')');
                    searchEndIndex = regexToken.length + searchIndex;
                    //check if curlyBraceIndex is within REGEX statment or not
                    if((curlyBraceIndex > searchIndex) && (curlyBraceIndex < searchEndIndex)){
                        return true;
                    }
                    searchIndex = logic.indexOf('REGEX', searchEndIndex);
                    if( searchIndex== -1) {
                        return false;
                    };
                }
                return false;
            };
            
            var isPartOfLikeoperator = function(curlyBraceIndex) {
                var logic = text, regexToken="", searchEndIndex=0;
                var searchIndex = logic.indexOf('LIKE');
                if( searchIndex== -1) {
                    return false;
                };
                while(searchIndex >= 0){
                    //get complete like operator 
                    regexToken = parseToken(logic,searchIndex, '{', '}');
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

            var parseToken = function(msg, startIndex,targetStartChar,targetEndChar) {
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

            if(!sectionsColumnLabelMap)   sectionsColumnLabelMap = {};
            var secColPairs = [],
                startPos = null,
                endPos = null,
                msg = '';
    
            if (!text.length)
                return secColPairs;
    
            for (var i = 0; i < text.length; i++) {
                // Check if {{ or }} exists in string
                if ((text[i] == '{' && startPos) || (text[i] == '}' && !startPos) || (i == text.length - 1 && startPos && text[i] != '}') || (i == text.length - 1 && text[i] == '{')) {
                     return [];
                }
                if (text[i] == '{') {
                    startPos = i + 1;
                }
                if (text[i] == '}' && startPos) {
                    endPos = i;
                    var tmpString = text.substring(startPos, endPos);
                    if (!sectionsColumnLabelMap.hasOwnProperty(tmpString)) {
                        //check if it is a part of REGEX i.e REGEX(...\d{2}..)
                        if(isPartOfRegex(startPos)){
                            msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_regex_len_attr', tmpString);
                        }else if(isPartOfLikeoperator(startPos)){
                            msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_like_curly_brace', tmpString);
                        }else{
                            msg = GlobalService.getRulesLogicAlerts('rule_logic_invalid_attr', tmpString);
                        }		
                        if(msg){
                            //displayLogicAlert(msg, startPos, endPos);
                            return;
                        }
                    }
                    secColPairs.push(tmpString);
                    startPos = null;
                }
            }
            return secColPairs;
        },

        
        // Service method to add API template
		addAPITemplateCall : function(apiData) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                'url': infoserverDomain + '/rules/api_template/add/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data: apiData
            });
        },

        // Service method to add API template
		editAPITemplateCall : function(apiData) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                'url': infoserverDomain + '/rules/api_template/update/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data: apiData
            });
        },

        // Service method to delete a template
		deleteAPITemplate : function(obj) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http({
                url: infoserverDomain + '/rules/api_template/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data: obj
            });
        },

        
        // Service method to delete multiple template
		deleteAPITemplateMultiple : function(obj) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http({
                url: infoserverDomain + '/rules/api_template/deletemultiple/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data: obj
            });
        },

        // Service method to get the templates list from local variable
		getAPITemplatesList : function() {
		    return this.templatesList;
		},
		
		// Service method to set the value of templates list
		setAPITemplatesList : function(data) {
		    this.templatesList = data;
        },
        
        
		// Service method to set the value of templates list
		setApiTemplateAddedMessage : function(data) {
		    this.templateAddedMsg = data;
		},
        
        // Service method to get the templates list from local variable
		getApiTemplateAddedMessage : function() {
		    return this.templateAddedMsg;
		},
		
        
        // Service method to set the value of Global attributes
		setGlobalAttribArr : function(data) {
            this.globalAttributes = data;
        },
        
        // Service method to get the  value of Global attributes
		getGlobalAttribArr : function() {
		    return this.globalAttributes;
        },
        // get details of chart 
        getDrillDownData : function(cType, pie){
            var result = [], _selectedPieType = "";
            if(pie.data && pie.data['name']){
                _selectedPieType =  pie.data['name'];
            }
            var _rulesList = angular.copy(this.getRulesList());

            _rulesList.forEach(function(rule){
                if(rule[cType] == _selectedPieType){
                    result.push(rule);
                }
            });
            return result;
        },
        // Service method to set the value of Global attributes
        setshowAlertApiFeature : function(data) {
            this.showAlertApiFeatureflag = data;
        },  
        
        // Service method to get the  value of Global attributes
		getshowAlertApiFeature : function() {
		    return this.showAlertApiFeatureflag;
        },
        // Service method to get template saved status
        getAPITemplateSavedStatus : function() {
            return this.templateSaved;
        },
        // Service method to set template saved status
        setAPITemplateSavedStatus : function(data) {
            this.templateSaved = data;
        },
        //get rules and alerts constants from json
        getRulesConstants: function () {
            var htmconst_url = "../config/constants/rules_constants.json";
            return $http({
                url: htmconst_url,
                method: 'GET'
            });
        },

        // Service method to get the  value of Global attributes
        getgroupdata: function (data) {
            var clinsightFlag = GlobalService.getVal('clinsightFlag')|| false;
            
            var ruledata = data;
            var me = this;
            if (stateGroupedData) {
                groupedData = stateGroupedData;
            }
            else {
                groupedData = GlobalService.getVal('groupedData')
                groupedData.forEach(function (item) {
                    if (item.field == 'tags') {
                        if (!clinsightFlag) {
                            item.multiselect = false,
                            item.enabled = false,
                            item.selected = false
                        }
                    }
                    item.data = [];
                })
            }
            ruledata.forEach(function (item) {
                groupedData.forEach(function (groupedItem) {
                    if(groupedItem.field != "tags"){
                        var freshData = item[groupedItem.field] ? angular.copy(item[groupedItem.field]) : "";
                    }
                    else {
                        var freshData = angular.copy(item[groupedItem.field])
                    }
                    
                    if (groupedItem.multiselect && freshData) {
                        if(groupedItem.field == "tags" && item[groupedItem.field].length){
                           
                            item[groupedItem.field].forEach(function(tag){
                                groupedItem.data.push(tag)
                            })
                            groupedItem.data =  groupedItem.data.filter(function (a) {
                                return !this[a.tag_id] && (this[a.tag_id] = true);
                            }, Object.create(null)) 
                        
                        }
                        else if ((!groupedItem.data || !Array.isArray(groupedItem.data)) && groupedItem.field != "tags" ) {
                            groupedItem.data = [];
                            groupedItem.data.push(freshData);
                        } else if (groupedItem.data && Array.isArray(groupedItem.data) && groupedItem.data.length == 0 && groupedItem.field != "tags") {
                            groupedItem.data.push(freshData);
                        } else {
                            var found = false, foundIndex = null;
                            groupedItem.data.forEach(function (dataItem, dataIndex) {
                                if (groupedItem.field != "tags" && typeof dataItem === "object" && dataItem.label && dataItem.label.toUpperCase() === freshData.toUpperCase()  ) {
                                    found = true;
                                } else if (groupedItem.field != "tags" && typeof dataItem === "string" && dataItem.toUpperCase() === freshData.toUpperCase() ) {
                                    found = true;
                                }
                            });
                            if (!found && groupedItem.field != "tags") {
                                groupedItem.data.push(freshData);
                            }
                        }
                    }
                })
            });

            groupedData.forEach(function (groupedItem) {

                if (groupedItem.multiselect) {
                    if (!groupedItem.data.length) {
                        groupedItem.enabled = false;
                    }
                    var len = groupedItem.data.length;
                    for (var i = 0; i < len; i++) {
                        var value = angular.copy(groupedItem.data[i]);
                        var obj = {};
                        if (typeof value !== "object") {
                            obj.label = value;
                        } else {
                            obj = value;
                        }
                        groupedItem.data[i] = obj;
                    }

                    me.deleteDataWhichAreNotInFreshlist(groupedItem, groupedItem.data, groupedItem.field, ruledata);
                }
            });
            return groupedData;
        },
        //delete data which are not in the fresh data
        deleteDataWhichAreNotInFreshlist: function(groupedItem,groupedItemData,groupedItemField,ruledata){
            for(var j=0;j<groupedItemData.length;j++){
                var found = false;
                for(var i=0;i<ruledata.length;i++){               
                    if(groupedItemField == "tags" && groupedItemData.length ){
                        if (ruledata[i][groupedItemField] && ruledata[i][groupedItemField].map(function(cur){ return cur.tag_name}).indexOf(groupedItemData[j]['label']) != -1) {
                            found = true;
                            break;
                        }
                    }else{
                        if (groupedItemData[j]['label'] === ruledata[i][groupedItemField]) {
                            found = true;
                            break;
                        }
                    }
                }
                if(!found){
                    groupedItemData.splice(j, 1);
                    groupedItem.expanded = false;
                }  
            }
        },
        //setting state of $scope.info.filter from controller
        setFilterState: function(filterObj){
           this.filterState = filterObj;
        },

        //return the filter state
        getFilterState: function(){
            return this.filterState;
        },

        //set the state maintained data of groupedfilter data
        setStateGroupData: function(filterObj){
           stateGroupedData = filterObj;
        },

        //return the state of groupedfilter data
        getStateGroupData: function(){
            return stateGroupedData;
        },

        //set the $scope.info data as its binded and used in filter
        setInfoData: function(infoData){
           this.infoData = infoData;
        },

        //return the info data
        getInfoData: function(){
            return this.infoData;
        },
          //set the page number
          setPageState: function(pagenum){
            this.pageState = pagenum;
         },
           //get the page number
           getPageState: function(){
            return this.pageState;
         },
         //Bult edit rules api
         bulkUpdateRules : function(param) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + "/rules/bulk_update/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data : param
            });
        },

        //Single subscribe Rule
        singleSubscribeRule : function(rule_id) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + "/rules/subscription/subscribe_user/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + rule_id,
                method: 'POST'
            });
        },

         //Single Unsubscribe Rule
         singleUnsubscribeRule : function(rule_id) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + "/rules/subscription/unsubscribe_user"+ '/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + rule_id,
                method: 'POST'
            });
        },

        //subscribe Rule
        subscribeRule : function(param) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + "/rules/subscription/subscribe/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data : param
            });
        },

        //unsubscribe Rule
        unsubscribeRule : function(param) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + "/rules/subscription/unsubscribe/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data : param
            });
        },

        //get all subscribers list from alertengine
        getallSubscriberList : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var url = 'stat/getRuleSubscriptionAssociation.json';
            //var url = infoserverDomain + '/analytics/top_n/rules/by_count/'+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')  + '/' +  GlobalService.getVal('manufacturer') +'/'+st+'/'+et + '/10';
            
		    return $http({
                url : url,
                method: 'GET'
            });
        },

        
         //Update Subscription
         updateSubscription : function(param) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + "/rules/subscription/updatesubscription/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data : param
            });
        },

        getNonSsoUsers : function() {
            var umsDomain = GlobalService.getVal('umsDomain');
	        return $http({
	            url: umsDomain + '/customer/user/list/' + GlobalService.getVal('manufacturer'),
	            method: 'GET'
	        });
        },

        

          // Service method to get test results for a selected bundle 
          getSingleTestResult : function(selectQuery) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({ 
            	method: 'GET', 
                url: infoserverDomain + '/analytics/' + GlobalService.getVal('manufacturer') + '/' + selectQuery,
                timeout: defer.promise
            });
        },
        
        
        getSysidList : function(startIndex, endIndex, searchObj, email) {
           
            var umsDomain = GlobalService.getVal('umsDomain');
           // https://umsqa.glassbeam.com//v1bundle/system_info/ec/list/siemens/siemens/podui/siemens/0/199
            //var infoserverDomain = GlobalService.getVal('infoserverDomain');
             //var url = 'stat/available_sysid.json';
            // "https://searchdevums.glassbeam.com/v1/user/ec/system_info/list/:mfr/:prod/:sch/:email/:st/:en"
             var umsDomain = GlobalService.getVal('umsDomain');
             var url = umsDomain + "/user/ec/system_info/list/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') +'/'+ encodeURIComponent(email) + '/'+ startIndex + '/' + endIndex;
             //var url = umsDomain + "/bundle/system_info/ec/list/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') +'/'+GlobalService.getVal('manufacturer') + '/'+ startIndex + '/' + endIndex;
             return $http({ 
            	method: 'POST', 
                url: url ,
                data: searchObj
            });
        },

        getUnsubscribedSysids : function(ruleid,email) {
            //var infoserverDomain = GlobalService.getVal('infoserverDomain');
             //var url = 'stat/excluded_sysid.json';
             var umsDomain = GlobalService.getVal('umsDomain');
             var url = umsDomain + "/rules/alerts/filters/list/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '?ruleId=' + ruleid + '&user=' + encodeURIComponent(email);
            // var url = 'stat/excluded_sysid.json';
             return $http({ 
            	method: 'GET', 
                url: url ,
            });
        },

        getSysidColList : function() {
           // https://umsqa.glassbeam.com/v1/bundle/system_cols_info/ec/list/gdi/gdi/podv10
           var umsDomain = GlobalService.getVal('umsDomain');
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            //var url = 'stat/col_list.json';
             var url = umsDomain + '/bundle/system_cols_info/ec/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')
            return $http({ 
            	method: 'GET', 
                url: url ,
            });
        },
        
        
        saveFilterAttributes : function(postdata) {
            //var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var umsDomain = GlobalService.getVal('umsDomain');
             var url = umsDomain + "/rules/alerts/filters/add_update/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
            return $http({ 
            	method: 'POST', 
                url: url ,
                data: postdata
            });
        },

        deleteFilterAttributes: function (postdata) {
            var umsDomain = GlobalService.getVal('umsDomain');
            var url = umsDomain + "/rules/alerts/filters/bulk_rules_delete/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
            return $http({
                method: 'POST',
                url: url,
                data: postdata
            });
        },

        //bulk subscribe and Unsubscribe
        bulkSubscribeUnsubscribe: function (postdata,type) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + "/rules/subscription/bulk_rules_subscription/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') +'/'+ type,
                method: 'POST',
                data: postdata
            });
        },

        deleteFilterAttributesMultiple: function (postdata) {
            var umsDomain = GlobalService.getVal('umsDomain');
            var url = umsDomain + "/rules/alerts/filters/bulk_users_delete/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
            return $http({
                method: 'POST',
                url: url,
                data: postdata
            });
        },
       
        
        getExcludedSysidDetails : function(postdata) {
            // https://umsqa.glassbeam.com/v1/bundle/system_cols_info/ec/list/gdi/gdi/podv10
            var umsDomain = GlobalService.getVal('umsDomain');
             var infoserverDomain = GlobalService.getVal('infoserverDomain');
             //var url = 'stat/col_list.json';
              var url = umsDomain + '/bundle/available_system_info/ec/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')
             return $http({ 
                 method: 'POST', 
                 url: url,
                 data: postdata
             });
         },

         //Get predefined tag list
         getPredefinedTagList : function() {
             //var url = 'stat/tagList.json';
             var infoserverDomain = GlobalService.getVal('infoserverDomain');
             return $http({ 
            	method: 'GET', 
                url: infoserverDomain + "/rules/tags/rules/list/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') +'/'+ $cookies.username, 
            });
        },

        //Add update tag association
        associateDisassociateTag: function (postdata) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + "/tags/associate/disassociate/rules/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'POST',
                data: postdata
            });
        }
};
}]);
