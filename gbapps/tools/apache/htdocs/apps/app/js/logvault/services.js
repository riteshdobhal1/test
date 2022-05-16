angular.module('gbApp.services.logvault', []).factory('LogVaultService', ['$http', '$location', 'UserTrackingService', 'GlobalService',
function($http, $location, UserTrackingService, GlobalService) {
	
	var loadView = null;

	return {
	    
	    getLoadView: function() {
	        return loadView;
	    },
	    
	    setLoadView: function(view) {
	        loadView = view;
	    },

		// Service method to make an XHR to fetch all config meta info
		getAllConfig : function() {
			return UserTrackingService.getAllConfig();
		},
		// Service method to make an XHR to fetch the results based on parameters given
		getData : function(start, rows, facets, start_date, end_date, sort_order, cl_timezone, quick_filter, uploaded_by,quick_filter_name, drill_down) {	
			start =  (start - 1) * rows;
			if(start < 0) {
				start = 0;
			}
			var conf = {};
			if(!!uploaded_by){
				conf['uploaded_by'] = uploaded_by;
			}
			if (!!quick_filter) {
				conf['quick_filter'] = quick_filter;
			}
			if(sort_order) {
				conf["sortby"] = "obs_date " + sort_order;
			}
			if(drill_down){
				conf["drill_down"] = drill_down;
			}

			var t_facets = "";
			if(facets) {
				for(var key in facets) {
					if(facets[key] && facets[key].length && facets[key].length > 0) {
						
						for(var l=0; l < facets[key].length; l++){
							if( l == 0) {
								if(t_facets == "") {
									t_facets = key;							
								}else{
									t_facets += " ~||~ " + key
								}							
								t_facets += "=" + "\""+facets[key][l];
							}else{
								t_facets += "~" + facets[key][l];
							}
						}
						t_facets += "\"";
					}
				}
			}
			if(t_facets) {
				conf["filter"] = t_facets;
			}
			var infoserverDomain = GlobalService.getVal('infoserverDomain');
			var url = infoserverDomain + "/logvault/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "/" + start_date + "/" + end_date+ "/" + start + "/" +rows;
			var tParam = angular.copy(conf);
            var mParam = angular.copy(conf);
            delete mParam.filter;
            return $http.post(url, {filter:tParam.filter}, {params : mParam});
		},
        
        //Service method for saving a filter
        saveFilter : function(param) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var url = infoserverDomain + "/logvault/view/add/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "/" + param.is_public + "/" + param.search_name + "/" + param.is_default;
            var data = {
                desc : param.search_desc,
                start_time : param.start_time,
                end_time : param.end_time,
                facet_filters : param.facet_string,
                search_type : param.search_type,
                last_n_log : param.last_n_log,
                last_n_log_by_me : param.last_n_log_uploaded_by_me
            };
            
            return $http.post(url, data);
        },
        
		//Service method to get saved filters
        getSavedFilters : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + "/logvault/view/list/all/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
        },
		
		// Service method to set default filter
        setResetDefaultFilter : function(view) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var url = infoserverDomain + '/logvault/view/' + (view.default ? 'resetdefault' : 'setdefault') + '/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + view.view_name;
            return $http.post(url);
        },
		
		//Service method for deleting saved filter
        deleteSavedFilter : function(filterName) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.post(infoserverDomain + "/logvault/view/delete/"+ GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + filterName);
        },
        
		//Service method to change filter accessibility
        changeFilterAccessibility : function(view) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.post(infoserverDomain + "/logvault/view/setpublic/" + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + !view.public + '/' + view.view_name);
        },
        
		//Service method for getting default filter info
        getDefaultFilterInfo : function(param) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/logvault/view/getdefault/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
        },
        
		getFileList : function(url, sysId, obsDate) {
			var infoserverDomain = GlobalService.getVal('infoserverDomain');
			return $http({
				url : infoserverDomain + '/bundles/files/named/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/'+ GlobalService.getVal('manufacturer') + '/'+ sysId+ '/'+ obsDate,				
				method : 'GET',
				params : {
					'obs_url' : url
				}
			});
		},
		getDownloadUrl : function(param){
			var infoserverDomain = GlobalService.getVal('infoserverDomain');
			return $http.post(infoserverDomain + '/logvault/download/bundles/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), 
				{'download': JSON.parse(param)},
				{ headers: {
			        	"Content-Type": "application/json"
			    	}
			    });
		}
	};
}]);
