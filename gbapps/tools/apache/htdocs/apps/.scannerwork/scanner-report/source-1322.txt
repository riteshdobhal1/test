
angular.module('gbApp.services.explorer', []).factory('ExplorerService', ['$http', 'UserTrackingService', 'GlobalService',
function($http,  UserTrackingService, GlobalService) {
    var exportUrl, bundleData, loadView = null, ruleText = "", ruleSection = "", isDrillDown=false;

    return {
        
        getLoadView: function() {
            return loadView;
        },
        
        setLoadView: function(view) {
            loadView = view;
        },
        
        getRuleText: function() {
            return ruleText;
        },
        
        setRuleText: function(text) {
            ruleText = text;
        },
        
        getRuleSection: function() {
            return ruleSection;
        },
        
        setRuleSection: function(text) {
            ruleSection = text;
        },
        
        // Service method to make an XHR to fetch all config meta info
        getAllConfig : function() {
            return UserTrackingService.getAllConfig();
        },
        
        // Service method to get solr start and end date
        getStats : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/solr/stats/'+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
        },
        
        // Service method to make an XHR to fetch the results based on parameters given
        getData : function(urlPart, params, searchText) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var url = infoserverDomain + "/explorer/search/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "/" + urlPart;
            var tParam = angular.copy(params);
            var mParam = angular.copy(params);
            delete mParam.filter;
            return $http.post(url, {searchtext: searchText,filter:tParam.filter}, {params : mParam});
        },
        
        // Service method to get facets for the results
        getFacets : function(urlPart, params, searchText) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var url = infoserverDomain + "/explorer/search/facets/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "/" + urlPart;
            var tParam = angular.copy(params);
            var mParam = angular.copy(params);
            delete mParam.filter;
            return $http.post(url, {searchtext: searchText,filter:tParam.filter}, {params : mParam});
        },
        // Service method to get facets for the results
        getFacetsGrdually : function(urlPart, params, searchText, nextParam) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var url = infoserverDomain + "/explorer/search/facets/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "/" + urlPart + (nextParam?nextParam:"");
            var tParam = angular.copy(params);
            var mParam = angular.copy(params);
            delete mParam.filter;
            return $http.post(url, {searchtext: searchText,filter:tParam.filter}, {params : mParam});
        },
        // Service method to export events
        getExportUrl : function(urlPart, params) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var url = infoserverDomain + "/explorer/export/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "/" + urlPart;
            if(!!Object.keys(params).length) {
                url += '?';
                var firstParam = true;
                angular.forEach(params, function(value, key) {
                    url += (firstParam ? '' : '&') + key + '=' + value.replace(/\&/g, '%26').replace(/\//g, '%2F');
                    firstParam = false;
                });
            }
            return url;
        },

        //Service method to get saved filters
        getSavedFilters : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + "/explorer/view/list/all/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
        },
        
        //Service method for deleting saved filter
        deleteSavedFilter : function(filterName) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.post(infoserverDomain + "/explorer/view/delete/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + filterName);
        },

        updateLimit : function(limit) {
            var umsDomain = GlobalService.getVal('umsDomain');
            return $http.post(umsDomain + "/user/eventexport/"+ limit + '/' + GlobalService.getVal('manufacturer'));
        },
        
        //Service method to change filter accessibility
        changeFilterAccessibility : function(view) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.post(infoserverDomain + "/explorer/view/setpublic/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + !view.public + '/' + view.view_name);
        },
        
        //Service method for getting default filter info
        getDefaultFilterInfo : function(param) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/explorer/view/getdefault/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
        },
        
        //Service method to fetch the all sections for event viewer
        getSectionViewerSections : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/meta/sections/solr/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/SECTION');
        },
        
        //Service method for saving a filter
        saveFilter : function(param) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var url = infoserverDomain + "/explorer/view/add/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "/" + param.is_public + "/" + param.search_name + "/" + param.is_default;
            var data = {
                desc : param.search_desc,
                start_time : param.start_time,
                end_time : param.end_time,
                facet_filters : param.facet_string,
                search_text : param.search_string,
                search_type : param.search_type,
                last_n_log : param.last_n_log,
                last_n_log_by_me : param.last_n_log_uploaded_by_me
            };
            
            return $http.post(url, data);
        },
        
        //Service method for filter suggest
        suggestFilter : function(keyword, defer) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/explorer/attribute/suggestion/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + keyword, {timeout: defer.promise});
        },
        
        //Service method for filter suggest
        suggestFilterSection : function(type, defer) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            type = type.toUpperCase();
            return $http.get(infoserverDomain + '/meta/sections/type/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + type, {timeout: defer.promise});
        },
        //Service method for filter suggest
        suggestFilterAttribute : function(section, defer) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http({
                url: infoserverDomain + '/meta/columns/table_name/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + section,
                method: 'GET',
                params: {timeout: defer.promise},
                cache: true
            });
        },
        //Service method for filter suggest
        suggestFilterSearch : function(type, section, sectionSearch, defer) {
            var result = null;
            // section search
            if(sectionSearch){
                result = this.suggestFilterSection(type, defer);
                //filter for the section
               // response.data.Data
            }else{
            // attribute search
                result =  this.suggestFilterAttribute(section, defer);
            }          
            return result;
        },
        // Service method to set default filter
        setResetDefaultFilter : function(view) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var url = infoserverDomain + '/explorer/view/' + (view.default ? 'resetdefault' : 'setdefault') + '/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + view.view_name;
            return $http.post(url);
        },
        
        getLinkedAttributes : function() {
            // UserTrackingService.standard_user_tracking('application','module','activity','details');
            // var params = {
                // "method" : "landing",
                // "type" : "linked"
            // };
// 
            // return $http({
                // url : '/gb/ui/prod/search/api.cgi?' + JSON.stringify(params),
                // method : 'GET'
            // });
        },
        
        getLinkedAttributesData : function(linked_attributes) {
            // UserTrackingService.standard_user_tracking('application','module','activity','details');
            // var attribute_list = linked_attributes['linked'].join(",");
            // var attribute_arr = attribute_list.split(",");
            // return $http({
                // url : '/gb/ui/prod/search/get_attribute_url.cgi',
                // method : 'GET',
                // params : {
                    // "attribute" : attribute_list
                // }
            // });

        },
        
        // Service method to get sections content
        getSectionsContent : function(params) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var query = params.ns_id ? "&ns_id=" + params.ns_id : "";
            return $http({
                url: infoserverDomain + '/explorer/nscontent/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                method: 'GET',
                params: params,
                cache: true
            });
        },
        
        // Service method to get events content
        getEventsContent : function(obs_date, params, eScope, st,et, scrolldirection, sr, er,sp) {

            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var url = '/explorer/events/viewer/' + eScope + '/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + st + '/' + et + '/' + scrolldirection + '/' + sr + '/' + er+"?" + params;
            if(sp.length){
                url = url + "&filter=severity=" +'"'+sp+ '"';
            }
            //return $http.get(infoserverDomain + '/explorer/viewer/events/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + obs_date, {params: params});
            return $http.get(infoserverDomain + url);
        },
        
        //get events sources in event viewer
        getEventSources : function(){
            var infoserverDomain = GlobalService.getVal('infoserverDomain');            
            return $http.get(infoserverDomain + '/meta/sections/type/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + 'EVENT');
        },
        // Service method to get all bundles
        getAllBundles : function(sysId, sid2) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            if(!sid2) {
                sid2='NA';
            }
            var params = {
                col: 'obs_ts',
                orderby: 'obs_ts desc'
            };
            return $http.get(infoserverDomain + '/bundles/all/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + GlobalService.getVal('manufacturer') + '/' + sysId + '/' + sid2, {params: params});
        },

        // Service method to get all bundles in Time range
        getAllBundlesInRange : function(sysId, sid2, startDate, endDate) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            if(!sid2) {
                sid2='NA';
            }
            var params = {
                col: 'obs_ts',
                orderby: 'obs_ts desc'
            };
            return $http.get(infoserverDomain + '/bundles/time_range/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + GlobalService.getVal('manufacturer') + '/' + sysId + '/' + sid2 +'/'+ startDate +'/' + endDate, {params: params});
        },
        
        
        // Method to convert the urls for linked attributes to desired model.
        processUrls : function(urls) {
            var i, urlMap = {};
            for (i in urls) {
                if (Array.isArray(urlMap[urls[i]['attribute_name']])) {
                    urlMap[urls[i]['attribute_name']].push(urls[i]);
                } else {
                    urlMap[urls[i]['attribute_name']] = [];
                    urlMap[urls[i]['attribute_name']].push(urls[i]);
                }
            }
            return urlMap;
        },
        
        // Service method to get section diff
        getFileDiffSection : function(srcts, tgtts, params) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/explorer/sectiondiff/data/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + srcts + '/' + tgtts, {params: params});
        },
        
        //Service method for bundle name in section viewer suggest
        getBundles : function(param, sysId, obsDate) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/bundles/files/named/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + GlobalService.getVal('manufacturer') + '/' + sysId + '/' + obsDate, {
                params : {
                    'obs_url' : param
                }
            });
        },
        
        // Service method to get bundle data for search log bundle feature
        getBundleData : function() {
            return bundleData;
        },
        
        // Service method to set bundle data for search log bundle feature
        setBundleData : function(data) {
            bundleData = data;
        },
        
        // Service method to get date range for a selected bundle
        getDateRange : function(bundleId) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/bundles/date_boundaries/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + GlobalService.getVal('manufacturer') + '/' + bundleId);
        },
        
        // Service method to get facets for the results
        getEventGroups : function(urlPart, params, searchText) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.post(infoserverDomain + "/explorer/eventtype/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "/" + GlobalService.getVal('manufacturer') + "/" + urlPart, {searchtext: searchText}, {params : params});
        },
        
        // Service method to get facets for the results
        getEventGroupsData : function(id, sIndex, offset) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + "/explorer/viewer/eventtype/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "/" + id + "/" + sIndex + "/" + offset);
        },

        setDrillDown: function(value){
            isDrillDown = value;
        },
        getDrillDown: function(){
            return isDrillDown;
        }
    };
}]);