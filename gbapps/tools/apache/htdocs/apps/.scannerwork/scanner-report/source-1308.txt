/* Services */

angular.module('gbApp.services.analytics', ['ui.bootstrap', 'ui.unique']).factory('MenuService', ['$http', 'useLocal', 'GlobalService',
    function ($http, useLocal, GlobalService) {
        var currentLabel = 'Section View', appsLoaded = false;
        return {
            getConfig: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var url = infoserverDomain + '';
                //if (useLocal) {
                url = 'stat/menuconfig.json';
                //}
                return $http.get(url);
            },
            getCurrentLabel: function() {
                return this.currentLabel;
            },
            setCurrentLabel: function(label) {
                this.currentLabel = label;
            },
            getAppsLoaded: function() {
                return this.appsLoaded;
            },
            setAppsLoaded: function() {
                this.appsLoaded = true;
            }
        };
    }]);

angular.module('gbApp.services.analytics').factory('DefaultFilterService', ['$http', 'useLocal', 'GlobalService', 'metaDataService',
    function ($http, useLocal, GlobalService, metaDataService) {
        var defaultEndCust, defaultSysId, defaultObservation, selectedObservation, selectedObsGrp, loadPage, loadSysId, loadObservation, configDiffFields, setBundleDetailForSectionDiff, logvaultRec;

        return {
            setLogVaultRec : function(val) {
                logvaultRec = val;
            },
            getLogVaultRec : function(val) {
                return logvaultRec;
            },
            setBundleDetailForSectionDiff : function(val) {
                setBundleDetailForSectionDiff = val;
            },
            getBundleDetailForSectionDiff : function(val) {
                return setBundleDetailForSectionDiff;
            },
            setConfigDiffFields: function(val) {
                configDiffFields = val;
            },
            getConfigDiffFields: function() {
                return configDiffFields;
            },
            getDefaultEndCust: function () {
                return this.defaultEndCust;
            },
            setDefaultEndCust: function (endCust) {
                this.defaultEndCust = endCust;
            },
            getDefaultSysId: function () {
                return this.defaultSysId;
            },
            setDefaultSysId: function (sysId) {
                this.defaultSysId = sysId;
            },
            setSysId2: function(id) {
                this.sid2 = id;
            },
            getSysId2: function() {
                if(!metaDataService.isSysid2Enable()){
                    return 'NA';
                }
                return this.sid2;
            },
            setSubSys: function(list) {
                this.subSys = list;
            },
            getSubSys: function() {
                return this.subSys;
            },
            getDefaultObservation: function () {
                return this.defaultObservation;
            },
            setDefaultObservation: function (observation) {
                this.defaultObservation = observation;
            },
            getSelectedObservation: function () {
                return this.selectedObservation;
            },
            setSelectedObservation: function (observation) {
                this.selectedObservation = observation;
            },
            getLoadPage: function () {
                return this.loadPage;
            },
            setLoadPage: function (page) {
                this.loadPage = page;
            },
            getLoadSysId: function () {
                return this.loadSysId;
            },
            setLoadSysId: function (sysid) {
                this.loadSysId = sysid;
            },
            getLoadObservation: function () {
                return this.loadObservation;
            },
            setLoadObservation: function (observation) {
                this.loadObservation = observation;
            },
            getSelectedObsGrp: function () {
                return this.selectedObsGrp;
            },
            setSelectedObsGrp: function (obsgrp) {
                this.selectedObsGrp = obsgrp;
            },
            getEC: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/analytics/standard/ecs/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
            },
            getSerialNum: function (ec) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/analytics/standard/systems/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec['ec_name']);
            },
            getObservations: function (ec, sid,sid2) {
                if(!sid2){
                    sid2 = 'NA';
                }
                if(!ec){
                    ec = GlobalService.getVal('manufacturer');
                }
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({                    
                    url: infoserverDomain + '/bundles/all/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec + '/' + sid['sys_id'] + '/' + sid2 + '?orderby=obs_ts DESC&limit=1',
                    method: 'GET',
                    cache: true
                });
            },
            getAllObservations: function (ec, sid, sid2) {
                if(!sid2){
                    sid2 = 'NA';
                }
                if(!ec){
                    ec = GlobalService.getVal('manufacturer');
                }
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({                    
                    url: infoserverDomain + '/bundles/all/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec + '/' + sid['sys_id'] + '/' + sid2 + '?orderby=obs_ts DESC',
                    method: 'GET',
                    cache: true
                });
            },
            getNObservations: function (ec, sid, n) {
                 var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({                   
                    url: infoserverDomain + '/bundles/last_n/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec['ec_name'] + '/' + sid['sys_id'] + '/' + n,
                    method: 'GET',
                    cache: true
                });
            },
            getObservationsTimeRange: function (ec, sid, fromTime, toTime) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({                    
                    url: infoserverDomain + '/bundles/time_range/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec['ec_name'] + '/' + sid['sys_id'] + '/' + fromTime + '/' + toTime,
                    method: 'GET',
                    cache: true
                });
            },
            getEcSys: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({                    
                    url: infoserverDomain + '/analytics/ec/cluster/all/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                    method: 'GET',
                    cache: true
                });
            },
            getDefaultFilterData: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/analytics/standard/default_filters/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
            },
            getObsGroups: function () {
                var url = '';
                // if (useLocal) {
                url = 'stat/obs_groups.json';
                // }
                return $http({
                    'url' : url,
                    'method': 'GET',
                    'cache': true
                });
            }
        };
    }]);

angular.module('gbApp.services.analytics').factory('SectionsMetaService', ['$q', '$http', 'useLocal', 'ngTableParams', '$filter', 'DefaultFilterService', 'GlobalService', 'ModalService', '$cookies', '$window', 'UserTrackingService',
    function ($q, $http, useLocal, ngTableParams, $filter, DefaultFilterService, GlobalService, ModalService, $cookies, $window, UserTrackingService) {
        var kbLink, sectionsMap = {}, appliedView, obs_ts, sid1, sid2, ready = false, viewName = 'Select view', viewsCount, sectionsLoading, selectedView, loadView = null;

        return {
            getLoadView: function() {
                return loadView;
            },
            setLoadView: function(view) {
                loadView = view;
            },
            setSelectedView: function (value) {
                selectedView = value;
            },
            getSelectedView: function () {
                return selectedView;
            },
            setSectionLoading: function (bool) {
                sectionsLoading = bool;
            },
            getSectionLoading: function () {
                return sectionsLoading;
            },
            getAppliedView: function () {
                return !!appliedView ? appliedView : false;
            },
            setAppliedView: function (view) {
                appliedView = view;
            },
            setReady: function (r) {
                ready = r;
            },
            isReady: function () {
                return ready;
            },
            getViewName: function () {
                return viewName;
            },
            setViewName: function (name) {
                viewName = name;
            },
            setViewsCount: function (count) {
                viewsCount = count;
            },
            getViewsCount: function () {
                return viewsCount;
            },
            getSections: function (obs) {
                if (obs) {
                    return sectionsMap[$filter('bundleName')(obs['bundle_name']) + obs['obs_time']];
                } else if (obs_ts) {
                    return sectionsMap[obs_ts];
                } else {
                    return [];
                }
            },
            setSections: function (obs, t_sections) {
                if (obs && t_sections) {
                    obs_ts = $filter('bundleName')(obs['bundle_name']) + obs['obs_time'];
                    sectionsMap[obs_ts] = t_sections;
                }
            },
            getKbLink: function () {
                if (!!this.getAppliedView()) {
                    return (this.kbLink == 'NA' ? false : this.kbLink);
                } else {
                    return null;
                }
            },
            setKbLink: function (lnk) {
                this.kbLink = lnk;
            },
            clearSectionView: function () {
                var sections = this.getSections(DefaultFilterService.getDefaultObservation());
                for (var i in sections) {
                    sections[i]['selected'] = false;
                    sections[i]['default'] = false;
                    sections[i]['visible'] = true;
                    this.resetFilter(sections[i]);
                }
                this.setSections(DefaultFilterService.getDefaultObservation(), sections);
                this.setAppliedView(null);
                this.setViewName("Select view");
            },
            resetFilter: function (section) {
                var i;
                if (section.hasOwnProperty('isTranspose')) {
                    section.isTranspose = false;
                }
                for (i in section.columns) {
                    if (!!section.filter[section.columns[i].field]) {
                        section.filter[section.columns[i].field]['value'] = "";
                        section.filter = {};
                        this.populateSectionData(section);
                    }
                    section.columns[i]['value'] = null;
                }
                if(!!section.info && !!section.info.sorting) {
                    delete section.info.sorting;
                    this.populateSectionData(section);
                }
            },
            parseFilters: function (view) {
                if (view.filters.length == 0) {
                    return;
                }
                var parsedFilters = {};
                var filters = view.filters[0].split(',');
                for (var i = 0; i < filters.length; i++) {
                    var filter = filters[i].split(':');
                    var filter_text;
                    if (filter[2] == '~') {
                        filter_text = filter[1] + filter[2] + '\"' + filter[3] + '\"';
                    } else {
                        filter_text = filter[1] + filter[2] + filter[3];
                    }
                    if (!!parsedFilters[filter[0]]) {
                        parsedFilters[filter[0]] += ' AND ' + filter_text;
                    } else {
                        parsedFilters[filter[0]] = filter_text;
                    }
                }
                return parsedFilters;
            },
            applyViewFromLogVault: function(selectedView){                
                // XHR to fetch the meta for the given view.
                var me = this;
                this.loadView(selectedView)
                    .then(function (response) {
                        var appliedView;
                        appliedView = response.data.Data[0];
                        if(angular.element(document.getElementById("sectionview-select-view-div"))){
                            angular.element(document.getElementById("sectionview-select-view-div")).removeClass("open");
                        }                        
                        if (!!appliedView) {
                            me.applyView(appliedView);
                            me.setSelectedView(selectedView);
                            // Applying the view that is fetched.
                            UserTrackingService.standard_user_tracking(GlobalService.getVal('navLog'), 'Section View', 'Apply View', "{\'" + selectedView['view_name'] + "\'}")
                                .then(function(response){}, function(response){});
                        } else {
                            ModalService.alertBox({msg: 'No Applied View'});
                        }
                    }, function(response){
                        console.log(response);
                    }, me);
            },
            applyView: function (view, scope) {
                var trans = view.transpose[0];
                trans = trans.replace("{\'", "");
                trans = trans.replace("\'}", "");
                view.transpose[0] = trans;
                var filt = view.filters[0];
                filt = filt.replace("{\'", "");
                filt = filt.replace("\'}", "");
                view.filters[0] = filt;
                var col = view.cols[0];
                col = col.replace("{\'", "");
                col = col.replace("\'}", "");
                view.cols[0] = col;
                var deferred = [], p_view, p_filters, p_cols, sections, i, j, k, l, keys, bool, transpose, val;
                this.setKbLink(view.kbase);
                this.setAppliedView(view);
                sections = this.getSections(DefaultFilterService.getDefaultObservation());
                p_view = this.parseSavedView(view);
                p_filters = this.parseFilters(view);

                keys = Object.keys(p_view);
                if (!!p_filters) {
                    filter_keys = Object.keys(p_filters);
                }
                for (i in sections) {
                    sections[i]['selected'] = false;
                    sections[i]['default'] = false;
                    sections[i]['isTranspose'] = false;
                }
                transpose = view.transpose[0].split(",");
                for (i in sections) {
                    for (j in keys) {
                        if (sections[i].table_name == keys[j]) {
                            sections[i]['selected'] = true;
                            sections[i]['default'] = true;
                            for (k in filter_keys) {
                                if (sections[i].table_name == filter_keys[k]) {
                                    sections[i]['filters'] = p_filters[filter_keys[k]];
                                }
                            }
                            if (p_filters.hasOwnProperty(sections[i].table_name)) {
                                sections[i]['filters'] = p_filters[sections[i].table_name];
                            } else {
                                sections[i]['filters'] = null;
                            }
                            deferred[i] = $q.defer();
                            this.loadData(sections[i], scope, deferred[i], i, j, true);
                            deferred[i].promise.then(function (res_col) {
                                var d_cols, index_i, index_j;
                                d_cols = res_col['cols'];
                                index_i = res_col['index_i'];
                                index_j = res_col['index_j'];
                                p_cols = p_view[keys[index_j]];
                                for (k in d_cols) {
                                    
                                    d_cols[k]['selected'] = false;
                                    d_cols[k]['visible'] = false;
                                }
                                if(p_cols.length == 1 && p_cols[0] == "*") {
                                    for (l in d_cols) {
                                        if(sections[index_i].columnType[d_cols[l]['field']] != 'G') {
                                            d_cols[l]['selected'] = true;
                                            d_cols[l]['visible'] = true;
                                        }
                                    }
                                } else {
                                    for (k in p_cols) {
                                        for (l in d_cols) {
                                            if (p_cols[k] == d_cols[l]['field']) {
                                                d_cols[l]['selected'] = true;
                                                d_cols[l]['visible'] = true;
                                            }
                                        }
                                    }
                                }
                                bool = true;
                                for (k in d_cols) {
                                    if (d_cols[k]['visible'] == false) {
                                        bool = false;
                                    }
                                }
                                sections[index_i].columns = d_cols;
                                sections[index_i]['meta'].shownAll = bool;
                            }, function (res_col) {
                                console.error(res_col);
                            });
                        }
                    }
                }
                for (i in sections) {
                    for (j in transpose) {
                        val = transpose[j].split(":");
                        if (sections[i].table_name == val[0]) {
                            if (val[1] == "false") {
                                sections[i].isTranspose = false;
                            } else {
                                sections[i].isTranspose = true;
                            }
                        }
                    }
                }
                this.setSections(DefaultFilterService.getDefaultObservation(), sections);
            },
            parseSavedView: function (view) {
                var p_view = {}, cols, i, oneCol;
                var colsstring = view['cols'][0];
                colsstring = colsstring.replace("{\'", "");
                colsstring = colsstring.replace("\'}", "");
                cols = colsstring.split(',');
                for (i in cols) {
                    oneCol = cols[i].split(':');
                    if (!!p_view[oneCol[0]]) {
                        p_view[oneCol[0]].push(oneCol[1]);
                    } else {
                        p_view[oneCol[0]] = [];
                        p_view[oneCol[0]].push(oneCol[1]);
                    }
                }
                return p_view;
            },
            getColumnDefs: function (data) {
                var columns = [], key, keyStr, title, type;
                for (key in Object.keys(data[0])) {
                    keyStr = Object.keys(data[0])[key];
                    if (typeof data[0][keyStr] === "number") {
                        type = "number";
                    } else if (typeof data[0][keyStr] === "boolean") {
                        type = "boolean";
                    } else {
                        type = "string";
                    }
                    title = keyStr;
                    columns.push({
                        title: title,
                        field: keyStr,
                        visible: true,
                        selected: true,
                        type: type,
                        operator: '>'
                    });
                }
                return columns;
            },
            processData: function (data, refCol) {
                var row, col, rdata, pdata = [], key;
                for (row in data.data[0].rows) {
                    rdata = {};
                    for (col in data.data[0].rows[row].columns) {
                        key = Object.keys(data.data[0].rows[row].columns[col])[0];
                        if (key.indexOf('obs') == -1 && refCol[key] && refCol[key].length > 0) {
                            rdata[key] = data.data[0].rows[row].columns[col][key];
                        }
                    }
                    pdata.push(rdata);
                }
                return pdata;
            },
            loadData: function (t_section, scope, defer, i, j, applyView) {
                var section, that, res_col;
                t_section.no_cols = false;
                if (t_section.visible === undefined) {
                    t_section.visible = true;
                }
                if (!t_section.a_data) {
                    that = this;
                    t_section.d_loading = true;
                    // Adding column label map for all the sections.
                    this.getColumns(t_section['table_name']).then(function (response) {
                        var x;
                        t_section.columnsMap = {};
                        t_section.columnType = {};
                        for (x in response.data.Data) {
                            //Add attribute 'column_name' if its missing in the response
                            var gtg = response.data.Data[x];
                            for (var k in gtg) {
                                response.data.Data[x][Object.keys(response.data.Data[x])[0]]['column_name'] = k;
                                break;
                            }
                            t_section.columnsMap[response.data.Data[x][Object.keys(response.data.Data[x])[0]]['column_name']] = response.data.Data[x][Object.keys(response.data.Data[x])[0]]['attribute_label'];
                            t_section.columnType[response.data.Data[x][Object.keys(response.data.Data[x])[0]]['column_name']] = response.data.Data[x][Object.keys(response.data.Data[x])[0]]['solr_facet'];
                        }
                        // Fetching parsed data for the given section
                        that.getSectionData(t_section.name, t_section.table_name, 0, GlobalService.getVal('rc_threshold')).then(function (response) {
                            t_section.tot_count = response.data.Data['row_count'];
                            t_section.d_loading = false;
                            if (t_section.tot_count > GlobalService.getVal('rc_threshold')) {
                                // console.info("Total rows are more than threshold.");
                            } else {
                                // console.info("Total rows are less than threshold.");
                            }
                            if (response.data.Data.data != "") {
                                t_section.a_data = that.processData(response.data.Data, t_section.columnsMap);
                                t_section.columns = that.getColumnDefs(t_section.a_data);
                                t_section.meta = {};
                                t_section.filter = {};
                                if (!!t_section.filters) {
                                    var filters = t_section.filters.split(' AND ');
                                    var field, value, operator;
                                    for (var i1 = 0; i1 < filters.length; i1++) {
                                        if (filters[i1].indexOf('~') != -1) {
                                            field = filters[i1].split('~')[0];
                                            value = filters[i1].split('~')[1].replace(/\"/g, "");
                                        } else if (filters[i1].indexOf('<') != -1) {
                                            field = filters[i1].split('<')[0];
                                            value = parseInt(filters[i1].split('<')[1]);
                                            operator = "<";
                                        } else if (filters[i1].indexOf('>') != -1) {
                                            field = filters[i1].split('>')[0];
                                            value = parseInt(filters[i1].split('>')[1]);
                                            operator = ">";
                                        } else if (filters[i1].indexOf('=') != -1) {
                                            field = filters[i1].split('=')[0];
                                            value = parseInt(filters[i1].split('=')[1]);
                                            operator = "=";
                                        }
                                        for (var j1 in t_section.columns) {
                                            if (t_section.columns[j1]['field'] === field) {
                                                t_section.columns[j1]['filter'] = {};
                                                t_section.columns[j1]['filter']['field'] = field;
                                                t_section.columns[j1]['filter']['type'] = t_section.columns[j1]['type'];
                                                if (t_section.columns[j1]['filter']['type'] == 'number') {
                                                    t_section.columns[j1]['filter']['value'] = value;
                                                    t_section.columns[j1]['value'] = value;
                                                    t_section.columns[j1]['filter']['operator'] = operator;
                                                    t_section.columns[j1]['operator'] = operator;
                                                } else {
                                                    t_section.columns[j1]['filter']['value'] = value;
                                                    t_section.columns[j1]['value'] = value;
                                                    t_section.columns[j1]['filter']['operator'] = t_section.columns[j1]['operator'];
                                                }
                                                t_section.filter[t_section.columns[j1]['field']] = t_section.columns[j1]['filter'];
                                            }
                                        }
                                    }
                                    delete t_section.filters;
                                }
                                t_section.count = 10;
                                if(!applyView) {
                                	var sysColFound = false;
                                	var nonSysColFound = false;
                                	angular.forEach(t_section.columns, function(column) {
	                                    if(t_section.columnType[column.title] == "G") {
	                                        column.selected = false;
	                                        column.visible = false;
	                                        sysColFound = true;
	                                    } else {
	                                        nonSysColFound = true;
	                                    }
	                                });
	                                
	                                if(sysColFound) {
	                                    t_section.meta['shownAll'] = false;
	                                } else {
	                                    t_section.meta['shownAll'] = true;
	                                }
	                                if(!nonSysColFound) {
	                                    t_section.no_cols = true;
	                                }
                                }
                                
                                if (!!defer) {
                                    res_col = {};
                                    res_col['index_i'] = i;
                                    res_col['index_j'] = j;
                                    res_col['cols'] = t_section.columns;
                                    defer.resolve(res_col);
                                } else {
                                    //t_section.isTranspose = false;
                                }
                                if (!t_section.display_data) {
                                    t_section.info = {};
                                    t_section.info.page = {
                                        total: 0,
                                        current: 1,
                                        pages: 0,
                                        count: 10
                                    };
                                } else {
                                    t_section.firstLoad = true;
                                }
                                that.populateSectionData(t_section);
                            } else {
                                delete t_section.a_data;
                                delete t_section.display_data;
                                t_section.info = {};
                                t_section.info.page = {
                                    total: 0,
                                    current: 1,
                                    pages: 0,
                                    count: 10
                                };
                                t_section.meta = {};
                                t_section.filter = {};
                                t_section.showlog = false;
                            }
                        }, function (response) {
                            if (!scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                                scope.info.sessionTimedOut = true;
                                ModalService.sessionTimeout();
                            }
                        });
                    }, function (response) {
                        if (!scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                            scope.info.sessionTimedOut = true;
                            ModalService.sessionTimeout();
                        }
                    });

                    t_section.r_loading = true;
                    this.getSectionRawData(t_section.name, t_section.table).then(function (response) {
                        t_section.r_loading = false;
                        if (response.data.Data[0]) {
                            t_section.rawdata = response.data.Data[0]['content'];
                            t_section.rawdataArr = t_section.rawdata.split('\n');
                            if (t_section.rawdataArr.length > 10) {
                                t_section.rawdata = t_section.rawdataArr[0] + '<br\>' + t_section.rawdataArr[1] + '<br\>' + t_section.rawdataArr[2]
                                + '<br\>' + t_section.rawdataArr[3] + '<br\>' + t_section.rawdataArr[4] + '<br\>' + t_section.rawdataArr[5]
                                + '<br\>' + t_section.rawdataArr[6] + '<br\>' + t_section.rawdataArr[7] + '<br\>' + t_section.rawdataArr[8]
                                + '<br\>' + t_section.rawdataArr[9];
                            }
                        } else {
                            t_section.rawdata = GlobalService.getVal('no_data');
                        }
                    }, function (response) {
                        if (!(scope && scope.info && scope.info.sessionTimedOut) && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                            scope.info.sessionTimedOut = true;
                            ModalService.sessionTimeout();
                        }
                        t_section.r_loading = false;
                    });
                } else {
                    if (!!t_section.filters) {
                        t_section.filter = {};
                        var filters = t_section.filters.split(' AND ');
                        var field, value, operator;
                        for (var i1 = 0; i1 < filters.length; i1++) {
                            if (filters[i1].indexOf('~') != -1) {
                                field = filters[i1].split('~')[0];
                                value = filters[i1].split('~')[1].replace(/\"/g, "");
                            } else if (filters[i1].indexOf('<') != -1) {
                                field = filters[i1].split('<')[0];
                                value = parseInt(filters[i1].split('<')[1]);
                                operator = "<";
                            } else if (filters[i1].indexOf('>') != -1) {
                                field = filters[i1].split('>')[0];
                                value = parseInt(filters[i1].split('>')[1]);
                                operator = ">";
                            } else if (filters[i1].indexOf('=') != -1) {
                                field = filters[i1].split('=')[0];
                                value = parseInt(filters[i1].split('=')[1]);
                                operator = "=";
                            }
                            for (var j1 in t_section.columns) {
                                if (t_section.columns[j1]['field'] === field) {
                                    t_section.columns[j1]['filter'] = {};
                                    t_section.columns[j1]['filter']['field'] = field;
                                    t_section.columns[j1]['filter']['type'] = t_section.columns[j1]['type'];
                                    if (t_section.columns[j1]['filter']['type'] == 'number') {
                                        t_section.columns[j1]['filter']['value'] = value;
                                        t_section.columns[j1]['value'] = value;
                                        t_section.columns[j1]['filter']['operator'] = operator;
                                        t_section.columns[j1]['operator'] = operator;
                                    } else {
                                        t_section.columns[j1]['filter']['value'] = value;
                                        t_section.columns[j1]['value'] = value;
                                        t_section.columns[j1]['filter']['operator'] = t_section.columns[j1]['operator'];
                                    }
                                    t_section.filter[t_section.columns[j1]['field']] = t_section.columns[j1]['filter'];
                                }
                            }
                        }
                        delete t_section.filters;
                    } else if (applyView) {
                        t_section.filter = {};
                    }
                    if (!!defer) {
                        res_col = {};
                        res_col['index_i'] = i;
                        res_col['index_j'] = j;
                        res_col['cols'] = t_section.columns;
                        defer.resolve(res_col);
                    }
                    if(!applyView) {
                    	var sysColFound = false;
	                    var nonSysColFound = false;
	                    angular.forEach(t_section.columns, function(column) {
	                        if(t_section.columnType[column.title] == "G") {
	                            column.selected = false;
	                            column.visible = false;
	                            sysColFound = true;
	                        } else {
	                            nonSysColFound = true;
	                        }
	                    });
	                    if(sysColFound) {
	                        t_section.meta['shownAll'] = false;
	                    } else {
	                        t_section.meta['shownAll'] = true;
	                    }
	                    if(!nonSysColFound) {
	                        t_section.no_cols = true;
	                    }
                    }
                    
                    this.populateSectionData(t_section);
                }
            },

            populateSectionData: function (section) {
                var tdata, orderedData = section.info.sorting ? $filter('orderBy')(section.a_data, section.info.sorting.field, section.info.sorting.reverse) : section.a_data;
                orderedData = section.filter ? $filter('numberFilter')(orderedData, section.filter) : orderedData;
                section.info.page.total = orderedData.length;
                section.info.page.pages = Math.ceil(section.info.page.total / section.info.page.count);
                if (section.info.page.pages == 0) {
                    section.info.page.current = 1;
                }
                else if (section.info.page.current > section.info.page.pages) {
                    section.info.page.current = section.info.page.pages;
                }
                section.export_data = orderedData;
                tdata = orderedData.slice((section.info.page.current - 1) * section.info.page.count, section.info.page.current * section.info.page.count);
                section.display_data = tdata;
            },

            getAll: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    url: infoserverDomain + '/meta/sections/type/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')+'/SECTION',
                    method: 'GET',
                    cache: true
                });
            },

            getSectionsFilteredByByndleType: function (bType) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    url: infoserverDomain + '/meta/sections/btype/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')+'/'+bType,
                    method: 'GET',
                    cache: true
                });
            },
            getColumns: function (table_name) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    method: 'GET',
                    url: infoserverDomain + '/meta/columns/table_name/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + table_name,
                    cache: true
                });
            },
            getS2: function(sid1){
                var ec,sid1;
                ec = GlobalService.getVal('manufacturer');
                if(!sid1){
                    sid1 = DefaultFilterService.getDefaultSysId()["sys_id"];
                }

                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    method: 'GET',
                    url: infoserverDomain + '/analytics/ec/cluster/sysid/all/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec + '/' + sid1,
                    cache: true
                });
            },
            getSectionData: function (sec_name, table_name, sr, er, filters, ec) {
                var sid1= DefaultFilterService.getDefaultSysId()["sys_id"];
				sid2=DefaultFilterService.getSysId2(), sid3='NA';
                var ts = DefaultFilterService.getDefaultObservation()['obs_time'], http_url;
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                if(!ec){
                    ec = GlobalService.getVal('manufacturer');
                }
                if(!sid2){
                    sid2 = 'NA';
                }
                if (!!filters) {
                    http_url = infoserverDomain + '/base/columns/system/ts/all/row_range/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec + '/' + sid1 + '/' + sid2 + '/' + sid3 + '/' + table_name + '/' + ts + '/' + sr + '/' + er + '?filter=' + filters;
                } else {
                    http_url = infoserverDomain + '/base/columns/system/ts/all/row_range/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec + '/' + sid1 + '/' + sid2 + '/' + sid3 + '/' + table_name + '/' + ts + '/' + sr + '/' + er;
                }
                return $http({
                    url: http_url,
                    method: 'GET',
                    cache: true
                });
            },
            getSectionParsedData: function (sid1, sid2, sid3, table_name, ts, sr, er, filters, ec,params) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                if (!!filters) {
                    http_url = infoserverDomain + '/base/columns/system/ts/all/row_range/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec + '/' + sid1 + '/' + sid2 + '/' + sid3 + '/' + table_name + '/' + ts + '/' + sr + '/' + er + '?filter=' + filters;
                } else {
                    http_url = infoserverDomain + '/base/columns/system/ts/all/row_range/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec + '/' + sid1 + '/' + sid2 + '/' + sid3 + '/' + table_name + '/' + ts + '/' + sr + '/' + er;
                }
                return $http({
                    url: http_url,
                    method: 'GET',
                    params: params,
                    cache: true
                });
            },
            getSectionRawData: function (sec_name, table_name) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    url: infoserverDomain + '/explorer/nscontent/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                    method: 'GET',
                    params: {
                        bundle: DefaultFilterService.getDefaultObservation()['obs_url'],
                        ts: DefaultFilterService.getDefaultObservation()['obs_time'],
                        ns: sec_name
                    },
                    cache: true
                });
            },
            saveSelectedView: function (param, data) {
                var url;
                if (!data.desc) {
                    data.desc = 'NA';
                }
                if (!data.kbase) {
                    data.kbase = 'NA';
                }
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                url = infoserverDomain + '/sectionview/add/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + param['public'] + "/" + param.name + "/" + param['default'];
                return $http.post(url, data);
            },
            getAllSavedViews: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/sectionview/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
            },
            /*
             * Retrive all views for all user's public and private view.
             */
            getAllViews: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/sectionview/list/all/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
            },
            deleteView: function (param) {
                if (this.getViewName() == param.view_name) {
                    this.setViewName('Select view');
                }
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.post(infoserverDomain + '/sectionview/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "/" + param.view_name);
            },
            loadView: function (param) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                this.setViewName(param.view_name);
                return $http({
                    method: "GET",
                    url: infoserverDomain + '/sectionview/meta/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "/" + param.view_name,
                    params: {
                        "created_by": param['created_by']
                    },
                    cache: false
                });
            },
            setDefault: function (param) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.post(infoserverDomain + '/sectionview/setdefault/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + param.view_name);
            },
            resetDefault: function (param) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.post(infoserverDomain + '/sectionview/resetdefault/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + param.view_name);
            },
            setAccessibility: function (param) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.post(infoserverDomain + '/sectionview/setpublic/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + (param['public'] == false ? "true" : "false") + '/' + param.view_name);
            },
            getDefault: function (param) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/sectionview/getdefault/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
            },
            exportXlsUrl: function (param) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var filters = "", cols = "", filters, i, filter_keys,ec;
                for (i in param.columns) {
                    if (cols != "") {
                        cols += "&";
                    }
                    cols += "col=" + param.columns[i]['field'];
                }
                filter_keys = Object.keys(param['filter']);
                for (i in filter_keys) {
                    if (filters != "") {
                        filters += "&";
                    }
                    filters += "filter=" + filter_keys[i];
                    if (param.filter[filter_keys[i]].type == 'number') {
                        filters += param.filter[filter_keys[i]]['operator'];
                    } else {
                        filters += '=';
                    }
                    filters += param.filter[filter_keys[i]]['value'];
                }
                ec = GlobalService.getVal('manufacturer');
                var sid1= DefaultFilterService.getDefaultSysId()["sys_id"];
				sid2=DefaultFilterService.getSysId2(), sid3='NA';
                if(!sid2){
                    sid2 = 'NA';
                }if(!sid3){
                    sid3 = 'NA';
                }
                return infoserverDomain + '/base/export/system/ts/named/time_range/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec + '/' + sid1 + '/' + sid2 + '/' + sid3 + '/' + param.table_name + '/' + DefaultFilterService.getDefaultObservation()['obs_time'].substr(0, 19) + '/' + DefaultFilterService.getDefaultObservation()['obs_time'].substr(0, 19) + '?' + cols; // + '&' + filters;
            }
        };

    }]);

angular.module('gbApp.services.analytics').factory('Analytics', ['$http', 'GlobalService',
    function ($http, GlobalService) {

        return {
            custom_x_gby_y: function (instance) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/analytics/x_gby_y/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/all/model/system_count/' + instance.dashboardId + '/' + instance.id);
            },
            standard_user_tracking: function (module, activity, details) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var url = infoserverDomain + '/user_tracking/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/Analytics/' + module + '/' + activity;
                return $http.post(url, {
                    "details": details
                });
            },
            custom_user_tracking: function (d_id, r_id) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/user_tracking/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + d_id + '/' + r_id);
            }
        };
    }]);

angular.module('gbApp.services.analytics').factory('NavigationService', ['GlobalService', 'ErrorService', 'AppService',
    function (GlobalService, ErrorService, AppService) {
        var cur_url;
        return {
            getUrlByKey: function (key) {
                return GlobalService.getVal(key);
            },
            setUrl: function (key, label) {
                if (key !== '#' && AppService.isAuthorized() && AppService.isInfoServerUp()) {
                    cur_url = GlobalService.getVal(key);
                    ErrorService.setError("");
                }
            },
            getUrl: function () {
                if (AppService.isAuthorized() && AppService.isInfoServerUp()) {
                    if (cur_url === undefined) {
                        cur_url = GlobalService.getVal(GlobalService.getVal('default_landing_page'));
                    }
                    return cur_url;
                } else {
                    return undefined;
                }
            }
        };
    }]);

angular.module('gbApp.services.analytics').factory('ConfigDiffService', ['$http', 'SectionsMetaService', 'GlobalService', 'DefaultFilterService', '$q', '$filter', 'ModalService', 'metaDataService',
    function ($http, SectionsMetaService, GlobalService, DefaultFilterService, $q, $filter, ModalService, metaDataService) {
        var kbLink, sections = [], appliedView,selectedView, viewName, obs_ts, viewsCount, sectionsLoading, goldenConfig, loadView = null,clusterId,sysd2;

        return {
            getLoadView: function() {
                return loadView;
            },            
            setLoadView: function(view) {
                loadView = view;
            },            
            getViewName: function () {
                return viewName;
            },
            setViewName: function (name) {
                viewName = name;
            },
            setSectionLoading: function (bool) {
                sectionsLoading = bool;
            },
            getSectionLoading: function () {
                return sectionsLoading;
            },
            setClusterId: function (id) {
                clusterId = id;
            },
            getClusterId: function () {
                return clusterId;
            },
            setSysId2: function(id) {
                this.sid2 = id;
            },
            getSysId2: function() {
                if(!metaDataService.isSysid2Enable()){
                    return 'NA';
                }
                return this.sid2;
            },
            setGoldenConfig: function(config) {
                goldenConfig = config;
            },
            getGoldenConfig: function() {
                return goldenConfig;
            },
            getAll: function () {
                return SectionsMetaService.getAll();
            },
            getDefault: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    method: 'GET',
                    url: infoserverDomain + '/configview/getdefault/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')
                });
            },
            getAppliedView: function () {
                return !!appliedView ? appliedView : false;
            },
            setAppliedView: function (view) {
                appliedView = view;
            },
            getSections: function (obs) {
                return sections;
            },
            setSections: function (t_sections) {
                sections = t_sections;
            },
            setViewsCount: function (count) {
                viewsCount = count;
            },
            getViewsCount: function () {
                return viewsCount;
            },
            getKbLink: function () {
                if (!!this.getAppliedView()) {
                    return (this.kbLink == 'NA' ? false : this.kbLink);
                } else {
                    return null;
                }
            },
            setKbLink: function (lnk) {
                this.kbLink = lnk;
            },
            clearConfigDiff: function () {
                var i, sections = this.getSections();
                for (i in sections) {
                    sections[i]['selected'] = false;
                    sections[i]['default'] = false;
                    sections[i]['count'] = 2;
                }
                this.setSections(sections);
                this.setAppliedView(null);
                this.setViewName('Select view');
            },
            resetFilter: function (section) {
                var key;
                section.no_cols = false;
            },

             setSelectedView: function (value) {
                 selectedView = value;
             },
             getSelectedView: function () {
                 return selectedView;
             },
             applyViewFromLogVault: function(selectedView){                
                // XHR to fetch the meta for the given view.
                var me = this;
                this.loadView(selectedView)
                    .then(function (response) {
                        var appliedView;
                        appliedView = response.data.Data[0];
                        me.setViewName(selectedView.view_name);
                        if(angular.element(document.getElementById("configdiff-select-view-div"))){
                            angular.element(document.getElementById("configdiff-select-view-div")).removeClass("open");
                        }                        
                        if (!!appliedView) {
                             var sysId = me.getClusterId();
                            var ec = DefaultFilterService.getDefaultEndCust();
                             //me.applyView(appliedView);
                            me.applyView(appliedView, null, me.getSections(), ec, sysId, DefaultFilterService.getDefaultObservation());
                            me.setSelectedView(selectedView);
                            // Applying the view that is fetched.
                            /*UserTrackingService.standard_user_tracking(GlobalService.getVal('navLog'), 'Config diff', 'Apply View', "{\'" + selectedView['view_name'] + "\'}")
                                .then(function(response){}, function(response){});*/
                        } else {
                            ModalService.alertBox({msg: 'No Applied View'});
                        }
                    }, function(response){
                        console.log(response);
                    }, me);
            },
            applyView: function (view, scope, sections, ec, system, obs) {
                var col = view.cols[0];
                col = col.replace("{\'", "");
                col = col.replace("\'}", "");
                view.cols[0] = col;
                var obs_ct = view.obs_ct[0];
                obs_ct = obs_ct.replace("{\'", "");
                obs_ct = obs_ct.replace("\'}", "");
                view.obs_ct[0] = obs_ct;
                var p_view, i, j, k, deferred = [], obs_cnt;
                obs_cnt = view.obs_ct[0].split(',');
                this.setKbLink(view.kbase);
                this.setAppliedView(view);
                p_view = this.parseSavedView(view);
                for (i in sections) {
                    if (!!p_view[sections[i].table_name]) {
                        sections[i]['default'] = true;
                        sections[i]['selected'] = true;
                        sections[i]['count'] = p_view[sections[i].table_name].obs_cnt;
                        sections[i]['no_cols'] = false;
                        deferred[i] = $q.defer();
                        this.loadData(sections[i], scope, ec, system, obs, deferred[i]);
                        deferred[i].promise.then(function (section) {
                            var no_cols = true;
                            var shownAll = true;
                            for (j in section.keys) {
                                section.keys[j]['visible'] = false;
                            }
                            for (j in section.keys) {
                                if(p_view[section.table_name]['cols'].length == 1 && p_view[section.table_name]['cols'][0] == "*") {
                                    if(section.columnType[section.keys[j]['key']] != "G") {
                                        section.keys[j]['visible'] = true;
                                        no_cols = false;
                                    }
                                    if (!section.keys[j]['visible']) {
                                        shownAll = false;
                                    }
                                } else {
                                    for (k in p_view[section.table_name]['cols']) {
                                        if (section.keys[j]['key'] == p_view[section.table_name]['cols'][k]) {
                                            section.keys[j]['visible'] = true;
                                            no_cols = false;
                                        }
                                    }
                                    if (!section.keys[j]['visible']) {
                                        shownAll = false;
                                    }
                                }
                                
                            }
                            section['shownAll'] = shownAll;
                            section['no_cols'] = no_cols;
                        }, function () {
                            console.error('Error');
                        });
                    } else {
                        sections[i]['default'] = false;
                        sections[i]['selected'] = false;
                    }
                }
            },
            parseSavedView: function (view) {
                var p_view = {}, cols, i, oneCol, obs_cnt, one_cnt;
                obs_cnt = view.obs_ct[0].split(',');
                cols = view['cols'][0].split(',');
                for (i in cols) {
                    oneCol = cols[i].split(':');
                    if (!!p_view[oneCol[0]]) {
                        p_view[oneCol[0]]['cols'].push(oneCol[1]);
                    } else {
                        p_view[oneCol[0]] = {};
                        p_view[oneCol[0]]['cols'] = [];
                        p_view[oneCol[0]]['cols'].push(oneCol[1]);
                    }
                }
                for (i in obs_cnt) {
                    one_cnt = obs_cnt[i].split(':');
                    if (!!p_view[one_cnt[0]]) {
                        p_view[one_cnt[0]]['obs_cnt'] = one_cnt[1];
                    } else {
                        p_view[one_cnt[0]] = {};
                        p_view[one_cnt[0]]['obs_cnt'] = one_cnt[1];
                    }
                }
                return p_view;
            },
            parseData: function (section, data) {
                var t_data = [], i, obs_data, key, j, cols, cols_ref;
                delete section.keys;
                if (section.keys == undefined) {
                    section.keys = [];
                    for (i in data.data[0].rows[0].columns) {
                        key = {};
                        key['key'] = Object.keys(data.data[0].rows[0].columns[i])[0];
                        key['col_name'] = section.columnsMap[Object.keys(data.data[0].rows[0].columns[i])[0]];
                        key['visible'] = true;
                        key['changed'] = false;
                        if (key['key'].indexOf('obs') == -1 && key['col_name']) {
                            section.keys.push(key);
                        }
                    }
                } else {
                    for (i in section.keys) {
                        section.keys[i]['changed'] = false;
                    }
                }
                cols_ref = data.data[0].rows[0].columns.filter(function (value) {
                    return (Object.keys(value)[0].indexOf('obs') == -1 && section.columnsMap[Object.keys(value)[0]]);
                });
                for (i in data.data) {
                    obs_data = {};
                    obs_data['obs'] = data.data[i]['time'];
                    obs_data['data'] = {};
                    cols = data.data[i].rows[0].columns.filter(function (value) {
                        return (Object.keys(value)[0].indexOf('obs') == -1 && section.columnsMap[Object.keys(value)[0]]);
                    });
                    for (j in cols) {
                        obs_data['data'][section.keys[j]['key']] = cols[j][section.keys[j]['key']];
                        if (i > 0 && cols_ref[j][section.keys[j]['key']] != cols[j][section.keys[j]['key']]) {
                            section.keys[j]['changed'] = true;
                        }
                    }
                    t_data.push(obs_data);
                }
                section.data = t_data;
                section.ref_data = section.data[0].data;
            },
            loadData: function (section, scope, ec, system, obs, defer) {
                var that = this;
                section.data = null;
                section.ref_data = null;
                if (section.count == undefined) {
                    section.count = 2;
                }
                if (section.keys == undefined) {
                    section.no_cols = false;
                    section.shownAll = true;
                }
                section.loading = true;
                // Adding column label map for all the sections.
                SectionsMetaService.getColumns(section['table_name']).then(function (response) {
                    var j;
                    section.columnsMap = {};
                    section.columnType = {};
                    section.columnDesc = {};
                    for (j in response.data.Data) {
                        //Add attribute 'column_name' if its missing in the response
                        var gtg = response.data.Data[j];
                        for (var k in gtg) {
                            response.data.Data[j][Object.keys(response.data.Data[j])[0]]['column_name'] = k;
                            break;
                        }
                        section.columnsMap[response.data.Data[j][Object.keys(response.data.Data[j])[0]]['column_name']] = response.data.Data[j][Object.keys(response.data.Data[j])[0]]['attribute_label'];
                        section.columnType[response.data.Data[j][Object.keys(response.data.Data[j])[0]]['column_name']] = response.data.Data[j][Object.keys(response.data.Data[j])[0]]['solr_facet'];
                        section.columnDesc[response.data.Data[j][Object.keys(response.data.Data[j])[0]]['column_name']] = response.data.Data[j][Object.keys(response.data.Data[j])[0]]['type'];
                    }
                    that.getDiffData(section.name, section.table_name, obs['obs_time'].substring(0, 19), section.count).then(function (response) {
                        if (response.data.Data == "" || response.data.Data.data.length == 0) {
                            section.data = null;
                            section.ref_data = null;
                        } else {
                            that.parseData(section, response.data.Data);
                        }
                        if (!!defer) {
                            defer.resolve(section);
                        }
                        var sysColFound = false;
                        var nonSysColFound = false;
                        angular.forEach(section.keys, function(column) {
                            if(section.columnType[column.key] == "G") {
                                column.visible = false;
                                sysColFound = true;
                            } else {
                                nonSysColFound = true;
                            }
                        });
                        if(sysColFound) {
                            section.shownAll = false;
                        } else {
                            section.shownAll = true;
                        }
                        if(!nonSysColFound) {
                            section.no_cols = true;
                        }
                        section.loading = false;
                    }, function (response) {
                        section.loading = false;
                        if (!scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                            scope.info.sessionTimedOut = true;
                            ModalService.sessionTimeout();
                        }

                    });
                }, function (response) {
                    if (!scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                        scope.info.sessionTimedOut = true;
                        ModalService.sessionTimeout();
                    }
                });

                section.visible = true;
                //section.isTranspose = false;
            },
            getDiffData: function (ns, tbl, ts, n) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var ec = GlobalService.getVal('manufacturer');
                var sid2= this.getSysId2(),sid3='NA';
                var sid1 = this.getClusterId();
                if(!sid1){
                    sid1 = 'NA';
                }
                if(!sid2){
                    sid2 = 'NA';
                }
                return $http({
                    method: 'GET',
                    url: infoserverDomain + '/base/columns/system/ts/named/last_n/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec + '/' + sid1 + '/' + sid2 + '/' + sid3 + '/' + tbl + '/' + ts + '/' + n,
                    cache: true
                });
            },
            saveSelectedView: function (param, data) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var url;
                if (!data.desc) {
                    data.desc = 'NA';
                }
                if (!data.kbase) {
                    data.kbase = 'NA';
                }
                url = infoserverDomain + '/configview/add/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + param['public'] + "/" + param.name + "/" + param['default'];
                return $http.post(url, data);
            },
            getSavedViews: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    method: 'GET',
                    url: infoserverDomain + '/configview/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')
                });
            },
            /*
             * Retrive all views for all user's public and private view.
             */
            getAllViews: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    method: "GET",
                    cache: true,
                    url: infoserverDomain + '/configview/list/all/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')
                });
            },
            setDefault: function (view) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    method: 'POST',
                    url: infoserverDomain + '/configview/setdefault/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + view.view_name
                });
            },
            resetDefault: function (view) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    method: 'POST',
                    url: infoserverDomain + '/configview/resetdefault/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + view.view_name
                });
            },
            deleteView: function (view) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    method: 'POST',
                    url: infoserverDomain + '/configview/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + view.view_name
                });
            },
            setAccessibility: function (view) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    method: 'POST',
                    url: infoserverDomain + '/configview/setpublic/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + view['public'] + '/' + view.view_name
                });
            },
            loadView: function (param) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    method: "GET",
                    url: infoserverDomain + '/configview/meta/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "/" + param.view_name,
                    params: {
                        "created_by": param['created_by']
                    }
                });
            },
            exportXlsUrl: function (ec, sys, obs, param) {
                var cols = "", i;
                for (i in param.keys) {
                    if (cols != "") {
                        cols += "&";
                    }
                    cols += "col=" + param.keys[i]['key'];
                }
                var infoserverDomain = GlobalService.getVal('infoserverDomain');

                var sid1 = this.getClusterId();
                //var sid1= DefaultFilterService.getDefaultSysId()["sys_id"];
				var  sid2=DefaultFilterService.getSysId2(), sid3='NA';
                if(!sid2){
                    sid2 = 'NA';
                }if(!sid3){
                    sid3 = 'NA';
                }
                if(!ec){
                    ec = GlobalService.getVal('manufacturer');
                }
                return infoserverDomain + '/base/export/system/ts/all/last_n/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec + '/' + sid1 + '/' + sid2 + '/' + sid3 + '/' + param.table_name + '/' + obs['obs_time'].substr(0, 19) + '/' + param.count + '?' + cols;
            },
            getAllFacets: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    url: infoserverDomain + '/meta/columns/context/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                    method: 'GET',
                    cache: true
                });
            },
            getGoldenConfigCategories: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    url: infoserverDomain + '/base/gconf/category/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'),
                    method: 'GET',
                    cache: true
                });
            },
            getGoldenConfigDiffData: function (ec, system, ns, tbl, ts, n) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http({
                    url: infoserverDomain + '/base/gconf/tbl/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec + '/' + system + '/' + tbl + '/' + ts,
                    method: 'GET'
                });
            },
            loadGoldenConfigDiffData: function (section, scope, ec, system, obs, defer) {
                var that = this;
                section.data = null;
                section.ref_data = null;
                if (section.count == undefined) {
                    section.count = 2;
                }
                if (section.keys == undefined) {
                    section.no_cols = false;
                    section.shownAll = true;
                }
                section.loading = true;
                this.getGoldenConfigDiffData(ec['ec_name'], system['sys_id'], section.name, section.table_name, obs['obs_time'].substring(0, 19), section.count).then(function (response) {
                    if (response.data.Data == "") {
                        section.data = null;
                        section.ref_data = null;
                    } else {
                        that.parseData(section, response.data.Data);
                    }
                    if (!!defer) {
                        defer.resolve(section);
                    }
                    section.loading = false;
                }, function (response) {
                    section.loading = false;
                    if (!scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                        scope.info.sessionTimedOut = true;
                        ModalService.sessionTimeout();
                    }
                });
                section.visible = true;
                //section.isTranspose = false;
            },

            // Formats the facets data to use on UI.
            formatFacets : function(rfacets) {
                var facets = [{
                    label: 'All',
                    name: 'all'
                }], facet;
                angular.forEach(rfacets, function(value) {
                    angular.forEach(value, function(tfacet, key) {
                        if (tfacet['solr_facet'] == 'S' && tfacet['attribute_label'] && key && key.indexOf('obs_') != 0) {
                            facet = {};
                            facet['label'] = tfacet['attribute_label'];
                            facet['name'] = key;
                            facets.push(facet);
                        }
                    });
                });
                //Filtering out to remove duplicates.
                return $filter('unique')(facets, 'label');
            }
        };
    }]);
