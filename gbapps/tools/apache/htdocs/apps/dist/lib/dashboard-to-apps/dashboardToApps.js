document.domain = location.host.split(/\.(.+)?/)[1];

/*
 * Params:
 * 
 * start_ts: start time in UTC Timezone String format (e.g.: "2016-09-22T11:55:00Z")
 * end_ts: end time in UTC Timezone String format (e.g.: "2016-09-24T11:55:00Z")
 * selectedFacets: Object containing selected facets with key as string and value as array of string(e.g.: {"namespace": ["mc", "mc.aaaauthserrstat"], "sysid": ["CP0004165"]})
 * last_n_log: 0, 1, 5 or 10 (0 for Custom Date range, 1 for Most recent log, 5 for Last 5 logs, 10 for Last 10 logs)
 */

function loadLogVaultCustom(start_ts, end_ts, selectedFacets, last_n_log) {
    var error = false;
    if(typeof start_ts != "string" || !checkDateFormat(start_ts)) {
        console.error("Start Date format not correct");
        error = true;
    }
    if(typeof end_ts != "string" || !checkDateFormat(end_ts)) {
        console.error("End Date format not correct");
        error = true;
    }
    if(typeof selectedFacets != "object") {
        console.error("Selected facets data should be a javascript object");
        error = true;
    } else {
        var keys = Object.keys(selectedFacets);
        for(var i = 0; i < keys.length; i++) {
            if(!Array.isArray(selectedFacets[keys[i]])) {
                console.error("Facet values for " + keys[i] + " should be inside an array");
                error = true;
            }
            for(var j = 0; j < selectedFacets[keys[i]].length; j++) {
                if(typeof selectedFacets[keys[i]][j] != "string") {
                    console.error("Facet value: " + selectedFacets[keys[i]][j] + " for facet " + keys[i] + " is not a string");
                    error = true;
                }
            }
        }
    }
    if(!(last_n_log == 0 || last_n_log == 1 || last_n_log == 5 || last_n_log == 10)) {
        console.error("Last N Log Value not correct");
        error = true;
    }
    if(!error) {
        if(last_n_log == 1) {
            selectedFacets['relativetimefilter'] = ["mostrecent"];
        } else if(last_n_log == 5) {
            selectedFacets['relativetimefilter'] = ["last5"];
        } else if(last_n_log == 10) {
            selectedFacets['relativetimefilter'] = ["last10"];
        }
        var viewJSON = {
            "start_ts": start_ts,
            "end_ts": end_ts,
            "facet_filters": selectedFacets,
            "last_n_log": last_n_log
        };
        var params = {
            "app": "logvault",
            "type": "custom",
            "view": viewJSON
        };
    
        callLoadFunction(params);
    }
}

/*
 * Params:
 * 
 * view_name: Name of the saved view
 * selectedFacets(optional): Object containing selected facets with key as string and value as array of string(e.g.: {"namespace": ["mc", "mc.aaaauthserrstat"], "sysid": ["CP0004165"]})
 */

function loadLogVaultSavedView(view_name, selectedFacets) {
    var error = false;
    if(typeof view_name != "string") {
        console.error("View Name should be a string");
        error = true;
    }
    if(!!selectedFacets && typeof selectedFacets != "object") {
        console.error("Selected facets data should be a javascript object");
        error = true;
    }
    if(!error) {
        var params = {
            "app": "logvault",
            "type": "savedView",
            "view": view_name
        };
        
        if(!!selectedFacets) {
        	params['facets'] = selectedFacets;
        }
    
        callLoadFunction(params);
    }
}

/*
 * Params:
 * 
 * start_ts: start time in UTC Timezone String format (e.g.: "2016-09-22T11:55:00Z")
 * end_ts: end time in UTC Timezone String format (e.g.: "2016-09-24T11:55:00Z")
 * search_text: text to be searched on Explorer (e.g.: "error")
 * search_type: schema to be search on explorer("SECTION" for Sections, "EVENT" for Events)
 * selectedFacets: Object containing selected facets with key as string and value as array of string(e.g.: {"namespace": ["mc", "mc.aaaauthserrstat"], "sysid": ["CP0004165"]})
 * last_n_log: 0, 1, 5 or 10 (0 for Custom Date range, 1 for Most recent log, 5 for Last 5 logs, 10 for Last 10 logs)
 */

function loadExplorerCustom(start_ts, end_ts, search_text, search_type, selectedFacets, last_n_log) {
    var error = false;
    if(typeof start_ts != "string" || !checkDateFormat(start_ts)) {
        console.error("Start Date format not correct");
        error = true;
    }
    if(typeof end_ts != "string" || !checkDateFormat(end_ts)) {
        console.error("End Date format not correct");
        error = true;
    }
    if(typeof selectedFacets != "object") {
        console.error("Selected facets data should be a javascript object");
        error = true;
    } else {
        var keys = Object.keys(selectedFacets);
        for(var i = 0; i < keys.length; i++) {
            if(!Array.isArray(selectedFacets[keys[i]])) {
                console.error("Facet values for " + keys[i] + " should be inside an array");
                error = true;
            }
            for(var j = 0; j < selectedFacets[keys[i]].length; j++) {
                if(typeof selectedFacets[keys[i]][j] != "string") {
                    console.error("Facet value: " + selectedFacets[keys[i]][j] + " for facet " + keys[i] + " is not a string");
                    error = true;
                }
            }
        }
    }
    if(!(last_n_log == 0 || last_n_log == 1 || last_n_log == 5 || last_n_log == 10)) {
        console.error("Last N Log Value not correct");
        error = true;
    }
    if(!error) {
        if(last_n_log == 1) {
            selectedFacets['relativetimefilter'] = ["mostrecent"];
        } else if(last_n_log == 5) {
            selectedFacets['relativetimefilter'] = ["last5"];
        } else if(last_n_log == 10) {
            selectedFacets['relativetimefilter'] = ["last10"];
        }
        var viewJSON = {
            "start_ts": start_ts,
            "end_ts": end_ts,
            "search_text": search_text,
            "search_type": search_type,
            "facet_filters": selectedFacets,
            "last_n_log": last_n_log
        };
        var params = {
            "app": "explorer",
            "type": "custom",
            "view": viewJSON
        };
    
        callLoadFunction(params);
    }
}

/*
 * Params:
 * 
 * view_name: Name of the saved view
 * selectedFacets(optional): Object containing selected facets with key as string and value as array of string(e.g.: {"namespace": ["mc", "mc.aaaauthserrstat"], "sysid": ["CP0004165"]})
 */

function loadExplorerSavedView(view_name, selectedFacets) {
    var error = false;
    if(typeof view_name != "string") {
        console.error("View Name should be a string");
        error = true;
    }
    if(!!selectedFacets && typeof selectedFacets != "object") {
        console.error("Selected facets data should be a javascript object");
        error = true;
    }
    if(!error) {
        var params = {
            "app": "explorer",
            "type": "savedView",
            "view": view_name
        };
        
        if(!!selectedFacets) {
        	params['facets'] = selectedFacets;
        }
    
        callLoadFunction(params);
    }
}

/*
 * Params:
 * 
 * sections: An array of objects contaning details of the sections to be selected. Each object contains following keys and values:
 *      table_name(required): A string containing table name of the section to be selected
 *      cols(required): A string which contains either list of columns to be selected(comma separated) or *(select all columns except system columns)
 *      filters(optional): A string containing filter information comma separated for the columns(e.g: "col1:~:test,col2:>:12"). Use ~ as operator for string columns and <,> or = for integer columns.
 *      transpose(optional): Boolean denoting whether section should be displayed in transposed form.
 * 
 * observation: obs_url of the bundle to be selected on Section View
 * obs_date: obs_date of the bundle to be selected on Section View
 * sysid1: Sysid1 to be selected (e.g.: "CP0004165")
 * sysid2(optional): Sysid2 to be selected (e.g.: "CP0004165")
 */

function loadSectionViewCustom(sections, observation, obs_date, sysid1, sysid2) {
    var error = false;
    if(!Array.isArray(sections)) {
        console.error("Sections data should be an array");
        error = true;
    } else {
        for(var i = 0; i < sections.length; i++) {
            if(typeof sections[i] != "object") {
                console.error("Each section should be an object");
                error = true;
            } else {
                var keys = Object.keys(sections[i]);
                if(!sections[i].hasOwnProperty("table_name")) {
                    console.error("'table_name' property missing for section at index " + i);
                    error = true;
                }
                if(!sections[i].hasOwnProperty("cols")) {
                    console.error("'cols' property missing for section at index " + i);
                    error = true;
                }
                if(sections[i].hasOwnProperty("filters") && typeof sections[i]["filters"] != "string") {
                    console.error("Filters of section at index " + i + " is not a string");
                    error = true;
                }
                if(sections[i].hasOwnProperty("transpose") && typeof sections[i]["transpose"] != "boolean") {
                    console.error("Transpose of section at index " + i + " is not a boolean");
                    error = true;
                }
            }
        }
    }
    if(typeof observation != "string") {
        console.error("Observation should be a string");
        error = true;
    }
    if(typeof obs_date != "string" || !checkDateFormat(obs_date)) {
        console.error("Obs Date format not correct");
        error = true;
    }
    if(typeof sysid1 != "string") {
        console.error("Sysid1 should be a string");
        error = true;
    }
    if(!!sysid2 && typeof sysid2 != "string") {
        console.error("Sysid2 should be a string");
        error = true;
    }
    if(!sysid2) {
    	sysid2 = 'NA';
    }
    if(!error) {
        var cols = "";
        var filters = "";
        var transpose = "";
        
        for(var i = 0; i < sections.length; i++) {
            var sectionCols = sections[i]["cols"].split(",");
            for(var j = 0; j < sectionCols.length; j++) {
                cols += (!!cols.length ? "," : "") + sections[i]["table_name"] + ":"  + sectionCols[j];
            }
            if(!!sections[i]["filters"]) {
                var sectionFilters = sections[i]["filters"].split(",");
                for(var j = 0; j < sectionFilters.length; j++) {
                    filters += (!!filters.length ? "," : "") + sections[i]["table_name"] + ":"  + sectionFilters[j];
                }
            }
            if(!!sections[i]["transpose"]) {
                transpose += (!!transpose.length ? "," : "") + sections[i]["table_name"] + ":" + !!sections[i]["transpose"];
            }
        }
        
        var params = {
            "app": "apps",
            "sub_app": "section",
            "sysid1": sysid1,
            "sysid2": sysid2,
            "observation": observation,
            "obs_date": obs_date,
            "type": "custom",
            "view": {
                "cols": [cols],
                "filters": [filters],
                "transpose": [transpose]
            }
        };
        callLoadFunction(params);
    }
}

/*
 * Params:
 *
 * sections: An array of objects contaning details of the sections to be selected. Each object contains following keys and values:
 *      table_name(required): A string containing table name of the section to be selected
 *      cols(required): A string which contains either list of columns to be selected(comma separated) or *(select all columns except system columns)
 *      filters(optional): A string containing filter information comma separated for the columns(e.g: "col1:~:test,col2:>:12"). Use ~ as operator for string columns and <,> or = for integer columns.
 *      transpose(optional): Boolean denoting whether section should be displayed in transposed form.
 *
 * observation: obs_url of the bundle to be selected on Section View
 * obs_date: obs_date of the bundle to be selected on Section View
 * sysid1: Sysid1 to be selected (e.g.: "CP0004165")
 * Bundle type(optional): Bundle type to be selected (e.g.: "UCSM")
 */
function loadSectionViewCustomBundle(sections, observation, obs_date, sysid1, bundle_type) {
    var error = false;
    if(!Array.isArray(sections)) {
        console.error("Sections data should be an array");
        error = true;
    } else {
        for(var i = 0; i < sections.length; i++) {
            if(typeof sections[i] != "object") {
                console.error("Each section should be an object");
                error = true;
            } else {
                var keys = Object.keys(sections[i]);
                if(!sections[i].hasOwnProperty("table_name")) {
                    console.error("'table_name' property missing for section at index " + i);
                    error = true;
                }
                if(!sections[i].hasOwnProperty("cols")) {
                    console.error("'cols' property missing for section at index " + i);
                    error = true;
                }
                if(sections[i].hasOwnProperty("filters") && typeof sections[i]["filters"] != "string") {
                    console.error("Filters of section at index " + i + " is not a string");
                    error = true;
                }
                if(sections[i].hasOwnProperty("transpose") && typeof sections[i]["transpose"] != "boolean") {
                    console.error("Transpose of section at index " + i + " is not a boolean");
                    error = true;
                }
            }
        }
    }
    if(typeof observation != "string") {
        console.error("Observation should be a string");
        error = true;
    }
    if(typeof obs_date != "string" || !checkDateFormat(obs_date)) {
        console.error("Obs Date format not correct");
        error = true;
    }
	 if(typeof sysid1 != "string") {
        console.error("Sysid1 should be a string");
        error = true;
    }
    if(!error) {
        var cols = "";
        var filters = "";
        var transpose = "";

        for(var i = 0; i < sections.length; i++) {
            var sectionCols = sections[i]["cols"].split(",");
            for(var j = 0; j < sectionCols.length; j++) {
                cols += (!!cols.length ? "," : "") + sections[i]["table_name"] + ":"  + sectionCols[j];
            }
            if(!!sections[i]["filters"]) {
                var sectionFilters = sections[i]["filters"].split(",");
                for(var j = 0; j < sectionFilters.length; j++) {
                    filters += (!!filters.length ? "," : "") + sections[i]["table_name"] + ":"  + sectionFilters[j];
                }
            }
            if(!!sections[i]["transpose"]) {
                transpose += (!!transpose.length ? "," : "") + sections[i]["table_name"] + ":" + !!sections[i]["transpose"];
            }
        }

        var params = {
            "app": "apps",
            "sub_app": "section",
            "sysid1": sysid1,
            "observation": observation,
            "obs_date": obs_date,
            "type": "custom",
            "view": {
                "cols": [cols],
                "filters": [filters],
				"transpose": [transpose]
            }
        };
        if(bundle_type){
            params['bundle_type'] = bundle_type;
        }
        callLoadFunction(params);
    }
}



/*
 * Params:
 * 
 * view_name: Name of the saved view
 * observation: Name of the observation to be selected
 * obs_date: Date of the observation to be selected in UTC Timezone String format(e.g.: "2016-09-22T11:55:00Z")
 * sysid1: Sysid1 to be selected (e.g.: "CP0004165")
 * sysid2(optional): Sysid2 to be selected (e.g.: "CP0004165")
 */

function loadSectionViewSavedView(view_name, observation, obs_date, sysid1, sysid2) {
    var error = false;
    if(typeof view_name != "string") {
        console.error("View Name should be a string");
        error = true;
    }
    if(typeof observation != "string") {
        console.error("Observation should be a string");
        error = true;
    }
    if(typeof obs_date != "string" || !checkDateFormat(obs_date)) {
        console.error("Obs Date format not correct");
        error = true;
    }
    if(typeof sysid1 != "string") {
        console.error("Sysid1 should be a string");
        error = true;
    }
    if(!!sysid2 && typeof sysid2 != "string") {
        console.error("Sysid2 should be a string");
        error = true;
    }
    if(!sysid2) {
    	sysid2 = 'NA';
    }
    if(!error) {
        var params = {
            "app": "apps",
            "sub_app": "section",
            "sysid1": sysid1,
            "sysid2": sysid2,
            "observation": observation,
            "obs_date": obs_date,
            "type": "savedView",
            "view": view_name
        };
        callLoadFunction(params);
    }
}

/*
 * Params:
 *
 * view_name: Name of the saved view
 * observation: Name of the observation to be selected
 * obs_date: Date of the observation to be selected in UTC Timezone String format(e.g.: "2016-09-22T11:55:00Z")
 * sysid1: Sysid1 to be selected (e.g.: "CP0004165")
 * Bundle Type(optional): Bundle Type to be selected (e.g.: "UCSM")
 */


function loadSectionViewSavedViewBundle(view_name, observation, obs_date, sysid1, bundle_type) {
    var error = false;
    if(typeof view_name != "string") {
        console.error("View Name should be a string");
        error = true;
    }
    if(typeof observation != "string") {
        console.error("Observation should be a string");
        error = true;
    }
    if(typeof obs_date != "string" || !checkDateFormat(obs_date)) {
        console.error("Obs Date format not correct");
        error = true;
    }
    if(typeof sysid1 != "string") {
        console.error("Sysid1 should be a string");
        error = true;
    }
    if(!error) {
        var params = {
            "app": "apps",
            "sub_app": "section",
            "sysid1": sysid1,
            "observation": observation,
            "obs_date": obs_date,
            "type": "savedView",
            "view": view_name
        };
        if(bundle_type){
            params['bundle_type'] = bundle_type;
        }
        callLoadFunction(params);
    }
}
/*
 * Params:
 * 
 * sections: An array of objects contaning details of the sections to be selected. Each object contains following keys and values:
 *      table_name(required): A string containing table name of the section to be selected
 *      cols(required): A string which contains either list of columns to be selected(comma separated) or *(select all columns except system columns)
 *      obs_count(optional): A number which denotes the number of observations to compare after landing(default: 2)
 * 
 * observation: obs_url of the bundle to be selected on Config Diff
 * obs_date: obs_date of the bundle to be selected on Config Diff
 * sysid1: Sysid1 to be selected on Config Diff
 * sysid2(optional): Sysid2 to be selected on Config Diff
 */

function loadConfigDiffCustom(sections, observation, obs_date, sysid1, sysid2) {
    var error = false;
    if(!Array.isArray(sections)) {
        console.error("Sections data should be an array");
        error = true;
    } else {
        for(var i = 0; i < sections.length; i++) {
            if(typeof sections[i] != "object") {
                console.error("Each section should be an object");
                error = true;
            } else {
                var keys = Object.keys(sections[i]);
                if(!sections[i].hasOwnProperty("table_name")) {
                    console.error("'table_name' property missing for section at index " + i);
                    error = true;
                }
                if(!sections[i].hasOwnProperty("cols")) {
                    console.error("'cols' property missing for section at index " + i);
                    error = true;
                }
                if(sections[i].hasOwnProperty("obs_count") && typeof sections[i]["obs_count"] != "number") {
                    console.error("Obs Count of section at index " + i + " is not a number");
                    error = true;
                }
            }
        }
    }
    if(typeof observation != "string") {
        console.error("Observation should be a string");
        error = true;
    }
    if(typeof obs_date != "string" || !checkDateFormat(obs_date)) {
        console.error("Obs Date format not correct");
        error = true;
    }
    if(typeof sysid1 != "string") {
        console.error("Sysid1 should be a string");
        error = true;
    }
    if(!!sysid2 && typeof sysid2 != "string") {
        console.error("Sysid2 should be a string");
        error = true;
    }
    if(!sysid2) {
    	sysid2 = 'NA';
    }
    if(!error) {
        var cols = "";
        var obs_ct = "";
        
        for(var i = 0; i < sections.length; i++) {
            var sectionCols = sections[i]["cols"].split(",");
            for(var j = 0; j < sectionCols.length; j++) {
                cols += (!!cols.length ? "," : "") + sections[i]["table_name"] + ":"  + sectionCols[j];
            }
            obs_ct += (!!obs_ct.length ? "," : "") + sections[i]["table_name"] + ":" + (!!sections[i]["obs_count"] ? sections[i]["obs_count"] : "2");
        }
        
        var params = {
            "app": "apps",
            "sub_app": "config",
            "sysid1": sysid1,
            "sysid2": sysid2,
            "observation": observation,
            "obs_date": obs_date,
            "type": "custom",
            "view": {
                "cols": [cols],
                "obs_ct": [obs_ct]
            }
        };
        callLoadFunction(params);
    }
}

/*
 * Params:
 * 
 * view_name: Name of the saved view
 * observation: Name of the observation to be selected
 * obs_date: Date of the observation to be selected in UTC Timezone String format(e.g.: "2016-09-22T11:55:00Z")
 * sysid1: Sysid1 to be selected on Config Diff
 * sysid2(optional): Sysid2 to be selected on Config Diff
 */

function loadConfigDiffSavedView(view_name, observation, obs_date, sysid1, sysid2) {
    var error = false;
    if(typeof view_name != "string") {
        console.error("View Name should be a string");
        error = true;
    }
    if(typeof observation != "string") {
        console.error("Observation should be a string");
        error = true;
    }
    if(typeof obs_date != "string" || !checkDateFormat(obs_date)) {
        console.error("Obs Date format not correct");
        error = true;
    }
    if(typeof sysid1 != "string") {
        console.error("Sysid1 should be a string");
        error = true;
    }
    if(!!sysid2 && typeof sysid2 != "string") {
        console.error("Sysid2 should be a string");
        error = true;
    }
    if(!sysid2) {
    	sysid2 = 'NA';
    }
    if(!error) {
        var params = {
            "app": "apps",
            "sub_app": "config",
            "sysid1": sysid1,
            "sysid2": sysid2,
            "observation": observation,
            "obs_date": obs_date,
            "type": "savedView",
            "view": view_name
        };
    
        callLoadFunction(params);
    }
}

function callLoadFunction(params) {
    window.parent.moveToApplication(params);
}

function checkDateFormat(date) {
    if(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/.test(date)) {
        return true;
    }
    return false;
}
