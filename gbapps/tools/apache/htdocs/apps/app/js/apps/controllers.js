/* Controllers for analytics - All the controllers related to analytics app */

angular.module('gbApp.controllers.analytics', ['gbApp.services', 'gbApp.globals', 'gbApp.services.analytics'])

// MenuCtrl - Responsible for holding the model that constructs menu within analytics.
    .controller('MenuCtrl', ['$modal', 'MenuService', 'NavigationService', 'GlobalService', 'AppService', '$filter', 'SectionsMetaService', 'DefaultFilterService', 'ConfigDiffService', 'ModalService',
        function ($modal, MenuService, NavigationService, GlobalService, AppService, $filter, SectionsMetaService, DefaultFilterService, ConfigDiffService, ModalService) {
            var menuCtrl = this;
            MenuService.getConfig()
                .then(function (response) {
                    menuCtrl.menu = response.data.Data;
                }, function (response) {
                    menuCtrl.menu = response.data.Data;
                    if (!menuCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                        menuCtrl.info.sessionTimedOut = true;
                        ModalService.sessionTimeout();
                    }
                });
            menuCtrl.info = {};
            // Highlights the current selection on the menu
            MenuService.setCurrentLabel(GlobalService.getVal("default_landing_label"));
            menuCtrl.info.tabview = "sectionview";
            // Stores whether session is timed out or not
            menuCtrl.info.sessionTimedOut = false;
            //Loading the default landing selection which is defined in globals.js
            MenuService.setAppsLoaded();
            menuCtrl.setUrl = function (key, label) {
                var selectedSections;
                if (NavigationService.getUrl() != NavigationService.getUrlByKey(key)) {
                    if (key !== '#' && AppService.isAuthorized() && AppService.isInfoServerUp()) {
                        /*if (key === 'configdiff') {
                            selectedSections = $filter('filter')(SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation()), {
                                'selected': true
                            });
                        } else {
                            selectedSections = $filter('filter')(ConfigDiffService.getSections(), {
                                'selected': true
                            });
                        }
                        if (selectedSections && selectedSections.length) {
                            var modalInstance = $modal.open({
                                templateUrl: 'partials/apps_change_view.html',
                                controller: 'ChangeViewController as changeViewCtrl',
                                resolve: {
                                    items: function () {
                                        return {
                                            key: key,
                                            label: label,
                                            current: MenuService.getCurrentLabel()
                                        };
                                    }
                                }
                            });
                            modalInstance.result.then(function (label) {
                                MenuService.setCurrentLabel(label);
                            });
                        } else {
                            NavigationService.setUrl(key);
                            MenuService.setCurrentLabel(label);
                        }*/
                        NavigationService.setUrl(key);
                        MenuService.setCurrentLabel(label);
                    }
                }
            };
            
            menuCtrl.getCurrentLabel = function() {
                return MenuService.getCurrentLabel();
            }
        }])
    .controller('ChangeViewController', ['$modalInstance', '$localStorage', '$sce', '$window', 'SectionsMetaService', 'ConfigDiffService', 'GlobalService', 'DefaultFilterService', 'items', 'NavigationService', '$timeout',
        function ($modalInstance, $localStorage, $sce, $window, SectionsMetaService, ConfigDiffService, GlobalService, DefaultFilterService, items, NavigationService, $timeout) {
            var changeViewCtrl = this;
            changeViewCtrl.msg = $sce.trustAsHtml(GlobalService.getVal('nav_confirm'));
            changeViewCtrl.changeViewConfirm = function () {
                NavigationService.setUrl(items.key);
                if (items.key === 'configdiff') {
                    SectionsMetaService.clearSectionView();
                } else {
                    ConfigDiffService.clearConfigDiff();
                }
                $modalInstance.close(items.label);
            };
            changeViewCtrl.hideChangeViewModal = function () {
                $modalInstance.dismiss('cancel');
            };
            changeViewCtrl.openChangeViewModal = function () {
                var selectedSysId = JSON.stringify(DefaultFilterService.getDefaultSysId());
                var selectedObservation = JSON.stringify(DefaultFilterService.getSelectedObservation());
                var selectedEndCust = JSON.stringify(DefaultFilterService.getDefaultEndCust());
                var defualtObsGroup = DefaultFilterService.getSelectedObsGrp();
                var url = "";
                if (items.current === "Section View") {
                    url = "tabview=config";
                } else {
                    url = "tabview=section";
                }
                url += "&selobsgroup=" + defualtObsGroup + "&selsysid=" + selectedSysId + "&selobservation=" + selectedObservation;
                
                $localStorage.tabview = url;
                
                $timeout(function() {
                    $window.open(GlobalService.getVal('redirect_new_window'), '_blank');
                }, 250);
                $modalInstance.dismiss('cancel');
            };
        }])

// SectionsCtrl - Responsible for holding the model for everything related to sections.
    .controller('SectionsCtrl', ['$filter', 'metaDataService', 'SectionsMetaService', 'DefaultFilterService', 'UserTrackingService', 'GlobalService', 'ModalService', '$window', '$cookies', 'InstanceHandler', 'AppService', '$sce', 'ExplorerService',
        function ($filter, metaDataService, SectionsMetaService, DefaultFilterService, UserTrackingService, GlobalService, ModalService, $window, $cookies, InstanceHandler, AppService, $sce, ExplorerService) {
            var sectionCtrl = this;
            var visible = false;
            
            // Controls the visibility of the sections portion of the page.
            sectionCtrl.select = {};
            // For filtering selected sections from all the sections.
            sectionCtrl.search = {};
            // For filtering the sections based on keyword given by the user.
            sectionCtrl.select['selected'] = true;
            sectionCtrl.info = {};
            // Stores whether session is timed out or not
            sectionCtrl.info.sessionTimedOut = false;
            
            sectionCtrl.info.application = GlobalService.getVal('navLog');
            // Returns whether all XHR calls are complete to display start me
            sectionCtrl.isReady = function () {
                return SectionsMetaService.isReady();
            };
            // Returns all the sections for the current observation.
            sectionCtrl.getSections = function () {
                return SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation());
            };
            sectionCtrl.getSectionsLoading = function () {
                return SectionsMetaService.getSectionLoading();
            };
            sectionCtrl.renderHtml = function (html) {
                return $sce.trustAsHtml(html);
            };
            // Gets the values from the globals based on the given key.
            sectionCtrl.getValue = function (key) {
                return GlobalService.getVal(key);
            };
            sectionCtrl.removeSection = function () {
                if (SectionsMetaService.getViewName() != "Select view") {
                    // ModalService.alertBox({msg: 'Your current applied view is lost'});
                    SectionsMetaService.setViewName("Select view");
                    SectionsMetaService.setKbLink(null);
                }
            };
            // Transposes the given section and logs the activity.
            sectionCtrl.doTranspose = function (section) {
                section.isTranspose = !section.isTranspose;
                sectionCtrl.removeSection();
                UserTrackingService.standard_user_tracking(sectionCtrl.info.application, 'Section View', 'Transpose Section', "{\'" + section.label + "\'}")
                    .then(successHandler, handleSessionTimeout);
            };
            // Returns true if the section has any filter applied on it.
            sectionCtrl.hasFilter = function (section) {
                var bool = false, i, keys;
                if (!!section.filter) {
                    keys = Object.keys(section.filter);
                    if (keys.length != 0) {
                        for (i in keys) {
                            if (!!section.filter[keys[i]]['value'] || section.filter[keys[i]]['value'] === 0) {
                                bool = true;
                            }
                        }
                    }
                }
                return bool;
            };
            sectionCtrl.addSectionInstance = function (section) {
                if (!DefaultFilterService.getDefaultObservation()) {
                    ModalService.alertBox({msg: 'Please select observation'});
                    return;
                }
                var bundleName = DefaultFilterService.getDefaultObservation()['obs_url'];
                if (bundleName.indexOf("\/") != -1) {
                    var bundleList = bundleName.split("\/");
                    bundleName = bundleList[bundleList.length - 1];
                }
                var result = {
                    //'obs_url': DefaultFilterService.getDefaultObservation()['bundle_name'],
                    'filename': bundleName,
                    'namespace_id': bundleName + '-0',
                    'namespace': section['name'],
                    'obs_date': DefaultFilterService.getDefaultObservation()['obs_time'].substring(0, 19) + 'Z',
                    'sysid': DefaultFilterService.getDefaultSysId()['sys_id']
                };
                
                angular.forEach(DefaultFilterService.getLogVaultRec(), function(value, key) {
                  if(!result[key]){
                    result[key] = value;
                  }
                });

                var instance = {
                    "type": 'section',
                    "title": 'Section Viewer',
                    "app" : sectionCtrl.info.application,
                    "module" : 'Section View',
                    "data": {
                        "result": result,
                        "bundle": bundleName,
                        "sysId": DefaultFilterService.getDefaultSysId()['sys_id'],
                        //"file": $filter('bundleName')(bundleName),
                        "instanceDisplay": DefaultFilterService.getConfigDiffFields(),
                        "start_time": DefaultFilterService.getDefaultObservation()['obs_time'].substring(0, 19) + 'Z',
                        "end_time": DefaultFilterService.getDefaultObservation()['obs_time'].substring(0, 19) + 'Z',
                        'observation': DefaultFilterService.getDefaultObservation()['obs_time'],
                        'observationStr': DefaultFilterService.getDefaultObservation()['obs_time']
                    }
                };
                InstanceHandler.addInstance(instance);
            };
            // Toggles the show log status for a given section
            sectionCtrl.toggleShowlog = function (section) {
                var status = section.showlog ? 'Hide Log' : 'Show Log';
                section.showlog = !section.showlog;
                UserTrackingService.standard_user_tracking(sectionCtrl.info.application, 'Section View', status, "{\'" + section.label + "\'}")
                    .then(successHandler, handleSessionTimeout);
            };
            // Returns true if the given column of the given section has any filters applied on it.
            sectionCtrl.hasColumnFilter = function (section, column) {
                if (!section.columns) {
                    return false;
                }
                var bool = false;
                if (!!section.filter[column.field] && (!!section.filter[column.field]['value'] || section.filter[column.field]['value'] === 0)) {
                    bool = true;
                }
                return bool;
            };
            // Resets the applied filters for any given section.
            sectionCtrl.resetFilter = function (section) {
                SectionsMetaService.resetFilter(section);
                sectionCtrl.removeSection();
            };
            // Invoked on clicking of cancel button in select sections. Reverts the selection of sections to previous done state.
            sectionCtrl.cancel = function () {
                var i, sections = SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation());
                for (i in sections) {
                    sections[i]['default'] = sections[i].selected;
                }
                SectionsMetaService.setSections(DefaultFilterService.getDefaultObservation(), sections);
                visible = false;
            };
            // Invoked on clicking of done button in select sections. Loads both raw n parsed data for the sections selected.
            sectionCtrl.done = function (event) {
                if (!DefaultFilterService.getDefaultObservation()) {
                    ModalService.alertBox({msg: 'Please select observation!'});
                    return;
                }
                var section, error_txt = "", sections = SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation());
                if (DefaultFilterService.getDefaultEndCust() === null) {
                    error_txt += "Please select End Customer.\n";
                }
                if (DefaultFilterService.getDefaultSysId() === null) {
                    error_txt += "Please select System ID.\n";
                }
                if (error_txt.length > 0) {
                    visible = false;
                    for (section in sections) {
                        if (sections[section]['selected'] == true) {
                            sections[section]['default'] = true;
                        } else {
                            sections[section]['default'] = false;
                        }
                    }
                    SectionsMetaService.setSections(DefaultFilterService.getDefaultObservation(), sections);
                    return;
                } else {
                    var sections_list = "";
                    for (section in sections) {
                        if (sections[section]['default'] == true) {
                            if (sections_list == "") {
                                sections_list += sections[section]['label'];
                            }
                            else {
                                sections_list += "," + sections[section]['label'];
                            }
                            if (!sections[section].selected) {
                                sectionCtrl.removeSection();
                            }
                            if(!sections[section].selected) {
                                SectionsMetaService.loadData(sections[section], sectionCtrl);
                            }
                            sections[section].selected = true;
                        } else {
                            if (sections[section].selected == true) {
                                sectionCtrl.removeSection();
                            }
                            sections[section].selected = false;
                        }
                    }
                    UserTrackingService.standard_user_tracking(sectionCtrl.info.application, 'Section View', 'Sections Selected', "{\'" + sections_list + "\'}")
                        .then(successHandler, handleSessionTimeout);
                    SectionsMetaService.setSections(DefaultFilterService.getDefaultObservation(), sections);
                    visible = false;
                }
            };
            // Toggles the selection of all columns for a given section
            sectionCtrl.toggleAll = function (section) {
                var column;
                var cols_list = "";
                for (column in section.columns) {
                    section.columns[column].selected = section.meta['shownAll'];
                    if (section.columns[column].selected) {
                        if(cols_list == "") {
                            cols_list += section.columnsMap[section.columns[column].title];
                        } else {
                            cols_list += "," + section.columnsMap[section.columns[column].title];
                        }
                    }
                }
                sectionCtrl.removeSection();
                updateColumns(section);
                UserTrackingService.standard_user_tracking(sectionCtrl.info.application, 'Section View', 'Columns selected', "{\'" + section.label + "\':\'" + cols_list + "\'}")
                        .then(successHandler, handleSessionTimeout);
            };
            // Updates the Shown All on the select columns based on the column selection by the user.
            sectionCtrl.changeShownAll = function (section) {
                var cols_list = "";
                var column, bool = true;
                for (column in section.columns) {
                    if (!section.columns[column].selected) {
                        bool = false;
                    } else {
                        if(cols_list == "") {
                            cols_list += section.columnsMap[section.columns[column].title];
                        } else {
                            cols_list += "," + section.columnsMap[section.columns[column].title];
                        }
                    }
                }
                section.meta['shownAll'] = bool;
                sectionCtrl.removeSection();
                updateColumns(section);
                UserTrackingService.standard_user_tracking(sectionCtrl.info.application, 'Section View', 'Columns selected', "{\'" + section.label + "\':\'" + cols_list + "\'}")
                        .then(successHandler, handleSessionTimeout);
            };
            // Blocks the click event propagation in column filters.
            sectionCtrl.stopFilter = function (event, section, column) {
                event.stopPropagation();
            };
            // Applies the specified filter on the given column of the section and logs the activity.
            sectionCtrl.doneFilter = function (event, section, column) {
                var secstr = "";
                secstr += section.name;
                column.filter = {};
                column.filter['field'] = column.field;
                column.filter['type'] = column.type;
                if (column.type == 'boolean') {
                    column.filter['true'] = column['true'];
                    column.filter['false'] = column['false'];
                } else if (column.type == 'number') {
                    column.filter['value'] = column.value;
                    column.filter['operator'] = column.operator;
                } else {
                    if(!!column.value && !!column.value.length) {
                        column.filter['value'] = column.value;
                    } else {
                        column.filter = {};
                    }
                }
                section.filter[column.field] = column.filter;
                var pages = Math.ceil(section.info.page.total / section.info.page.count);
                if (pages == 0) {
                    section.info.page.current = 1;
                } else if (section.info.page.current > pages) {
                    section.info.page.current = pages;
                }
                SectionsMetaService.populateSectionData(section);
                section.firstLoad = false;
                angular.element(document.querySelector('.dropdown.open')).removeClass('open');
                secstr += ":" + column.field + ":" + JSON.stringify(column.filter);
                sectionCtrl.removeSection();
                UserTrackingService.standard_user_tracking(sectionCtrl.info.application, 'Section View', 'Column Filters', "{\'" + secstr + "\'}")
                    .then(successHandler, handleSessionTimeout);
            };
            sectionCtrl.sortClicked = function(event, section, field) {
            	if(event.target.id == "columnHeader" || event.target.id == "columnDiv" || event.target.id == "columnLabel") {
            		sectionCtrl.changeSortField(section, field);
            	}
            };
            sectionCtrl.changeSortField = function (section, field) {
                if (!!section.info.sorting) {
                    if (section.info.sorting.field == field) {
                        section.info.sorting.reverse = !section.info.sorting.reverse;
                    } else {
                        section.info.sorting = {
                            field: field,
                            reverse: false
                        }
                    }
                } else {
                    section.info.sorting = {
                        field: field,
                        reverse: false
                    }
                }
                SectionsMetaService.populateSectionData(section);
            };
            sectionCtrl.getSectionColumns = function (columns) {
                var visibleCount = 0;
                if (!columns || !columns.length) return columns;
                for (var i = 0; i < columns.length; i++) {
                    columns[i].firstVisible = false;
                    if (!!columns[i].visible) {
                        visibleCount++;
                    }
                }
                if (visibleCount > 1) {
                    for (var i = 0; i < columns.length; i++) {
                        columns[i].firstVisible = false;
                        if (!!columns[i].visible) {
                            visibleCount++;
                        }
                    }
                    for (var i = 0; i < columns.length; i++) {
                        if (!!columns[i].visible) {
                            columns[i].firstVisible = true;
                            break;
                        }
                    }
                }
                return columns;
            };
            
            sectionCtrl.exportAllPDF = function() {
                var allSectionsDetails = SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation());
                var selectedSections = sectionCtrl.getSelectedSections() || [];
                if (!selectedSections.length) {
                    ModalService.alertBox({msg: 'Please select at least one section!'});
                    return;
                }
                if (!getSelectedSectionsData().length) {
                    ModalService.alertBox({msg: 'Please select at least one column in a section!'});
                    return;
                }
                var selectedSections = $filter('filter')(allSectionsDetails, {
                    'selected': true
                }) || [];
                var sectionDataAvailable = false;
                for (var i in selectedSections) {
                    if (!!selectedSections[i].display_data) {
                        sectionDataAvailable = true;
                        break;
                    }
                }
                if (!sectionDataAvailable) {
                    ModalService.alertBox({msg: 'Please select a section with data'});
                    return;
                }
                exportPDF();
            };
            
            function exportPDF() {
                var selectedSections = sectionCtrl.getSelectedSections() || [];
                var sectionAdded = false;
                var pdf = new jsPDF('p', 'pt', 'a1');
                angular.forEach(selectedSections, function(section) {
                    if(Array.isArray(section.export_data) && !!section.export_data.length) {
                        var selectedCols = $filter('filter')(section.columns, {selected: true}) || [];
                        if(!!selectedCols.length) {
                            var pageAdded = false;
                            if(pdf.autoTableEndPosY() > 2250) {
                                pdf.addPage();
                                pageAdded = true;
                            }
                            
                            var startY = (!!sectionAdded && !pageAdded ? pdf.autoTableEndPosY() : 0) + 60;
                            pdf.text(section.label, 40, startY - 10);
                            pageAdded = false;

                            var cols = [], rows = [], config = {};
                            
                            if(!section.isTranspose) {
                                angular.forEach(selectedCols, function(col) {
                                    cols.push({
                                        title: section.columnsMap[col.title],
                                        key: col.title
                                    });
                                });
                                rows = section.export_data;
                                config = {
                                    startY: startY,
                                    tableWidth: 'auto',
                                    columnWidth: 'auto',
                                    styles: {
                                        overflow: 'linebreak'
                                    }
                                };
                            } else {
                                for(n = 0; n < section.export_data.length; n+=20) {
                                    cols = [{
                                        title: "",
                                        key: "col_name"
                                    }];
                                    var rangeEnd = (n+20 <= section.export_data.length) ? (n+20) : section.export_data.length;
                                    for(var i = n; i < rangeEnd; i++) {
                                        cols.push({
                                            title: "",
                                            key: "col" + i
                                        });
                                    }
                                    rows = [];
                                    angular.forEach(selectedCols, function(col) {
                                        var tempRow = {};
                                        tempRow['col_name'] = section.columnsMap[col.title];
                                        for(var i = n; i < rangeEnd; i++) {
                                            tempRow['col' + i] = section.export_data[i][col.title];
                                        }
                                        rows.push(tempRow);
                                    });
                                    
                                    if(n != 0) {
                                        startY = pdf.autoTableEndPosY() + 15;
                                    }
                                    
                                    config = {
                                        startY: startY,
                                        tableWidth: 'auto',
                                        columnWidth: 'auto',
                                        styles: {
                                            overflow: 'linebreak'
                                        }, createdCell: function (cell, data) {
                                            if (data.column.dataKey === 'col_name') {
                                               cell.styles.fillColor = data.row.index % 2 == 0 ? [41, 128, 185] : [61, 148, 205];
                                               cell.styles.textColor = 255;
                                            } 
                                        }, createdHeaderCell: function (cell, data) {
                                            cell.styles.rowHeight = 0;
                                            cell.styles.fillColor = 255;
                                        }
                                    };
                                    
                                    if(rangeEnd != section.export_data.length) {
                                        pdf.autoTable(cols, rows, config);
                                        sectionAdded = true;
                                    }
                                }
                            }
                            
                            pdf.autoTable(cols, rows, config);
                            sectionAdded = true;
                        }
                    }
                });
                if(!!sectionAdded) {
                    pdf.save("Sections.pdf");
                }
            }
            
            sectionCtrl.getSelectedSections = function () {
                var selectedSections = $filter('filter')(SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation()), {
                    'selected': true
                });
                return selectedSections;
            };
            
            function getSelectedSectionsData() {
                var selectedSections = $filter('filter')(SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation()), {
                    'selected': true
                });
                var updatedSectionList = [];
                for (var k in selectedSections) {
                    var eachSectionData = selectedSections[k];
                    if (eachSectionData.a_data) {
                        var sectionKeys = eachSectionData.columns;
                        for (var x in sectionKeys) {
                            var aKey = sectionKeys[x];
                            if (aKey.visible) {
                                updatedSectionList.push(eachSectionData);
                                break;
                            }
                        }
                    } else {
                        updatedSectionList.push(eachSectionData);
                    }
                }
                return updatedSectionList;
            }
            
            // Reverts the changes the made the column filter
            sectionCtrl.cancelFilter = function (event, section, column) {
                angular.element(document.querySelector('.dropdown.open')).removeClass('open');
            };
            // Increments the results per page of the section view.
            sectionCtrl.increasePageSize = function (section) {
                section.count = parseInt(section.count, 10) < 100 && (parseInt(section.count, 10) < section.tot_count) ? parseInt(section.count) + 10 : section.count;
                section.info.page.count = section.count;
                SectionsMetaService.populateSectionData(section);
            };
            // Decrements the results per page of the section view.
            sectionCtrl.decreasePageSize = function (section) {
                section.count = parseInt(section.count, 10) > 10 ? parseInt(section.count) - 10 : section.count;
                section.info.page.count = section.count;
                SectionsMetaService.populateSectionData(section);
            };
            sectionCtrl.firstPage = function (section) {
                if (section.info.page.current == 1)
                    return;
                section.info.page.current = 1;
                SectionsMetaService.populateSectionData(section);
            };
            sectionCtrl.prevPage = function (section) {
                if (section.info.page.current > 1) {
                    section.info.page.current -= 1;
                    SectionsMetaService.populateSectionData(section);
                }
            };
            sectionCtrl.nextPage = function (section) {
                if (section.info.page.current < section.info.page.pages) {
                    section.info.page.current += 1;
                    SectionsMetaService.populateSectionData(section);
                }
            };
            sectionCtrl.lastPage = function (section) {
                if (section.info.page.current == section.info.page.pages)
                    return;
                section.info.page.current = section.info.page.pages;
                SectionsMetaService.populateSectionData(section);
            };
            
            sectionCtrl.generateRuleLogic = function(section, column) {
            	ExplorerService.setRuleSection(section.name);
            	var logic = ExplorerService.getRuleText();
            	if(column.type == 'string') {
            		logic = "{" + section.label + "." + section.columnsMap[column.title] + "} LIKE '%" + logic + "%'";
            	} else if(column.type == 'number') {
            		logic = "{" + section.label + "." + section.columnsMap[column.title] + "} = " + logic;
            	}
            	ExplorerService.setRuleText(logic);
            };
            
            // Updates the columns selection for a given section based on user selection.
            function updateColumns(section) {
                var i, secstr = "", bool = true;
                for (i in section.columns) {
                    if (secstr != "") {
                        secstr += ", ";
                    }
                    section.columns[i].visible = section.columns[i].selected;
                    if (section.columns[i].visible) {
                        bool = false;
                        secstr += section.name + ":" + section.columns[i].title;
                    }
                }
                if (bool) {
                    section.no_cols = true;
                } else {
                    section.no_cols = false;
                }
            }

            function handleSessionTimeout(response) {
                if (!sectionCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                    sectionCtrl.info.sessionTimedOut = true;
                    ModalService.sessionTimeout();
                }
            }

            function successHandler() {
            }
        }])

// DefaultFitlerCtrl - Responsible for holding the model related the default filters i.e., end_customer, sys_id and observation
    .controller('DefaultFilterCtrl', ['$scope', 'DefaultFilterService', 'SectionsMetaService', 'UtilService', 'GlobalService', 'ModalService', 'AppService', 'UserTrackingService', '$filter', '$window', '$timeout', '$q', '$modal', 'metaDataService',
        function ($scope, DefaultFilterService, SectionsMetaService, UtilService, GlobalService, ModalService, AppService, UserTrackingService, $filter, $window, $timeout, $q, $modal, metaDataService) {
            var defaultFilterCtrl = this, allSectionsDetails;

            defaultFilterCtrl.info = {};
            defaultFilterCtrl.defaultFilters = [];
            defaultFilterCtrl.info.ready = false;
            defaultFilterCtrl.resultLoading = true;
            defaultFilterCtrl.info.setObservationNull = false;
            defaultFilterCtrl.info.sysIdIndex = -1;
            defaultFilterCtrl.info.selectedSystemId = null;
            defaultFilterCtrl.info.sid2 = null;
            defaultFilterCtrl.info.subSysfilter = "";
            defaultFilterCtrl.application = GlobalService.getVal('navLog');
            defaultFilterCtrl.info.sysIdLimit = GlobalService.getVal('max_sysid_limit');
            var defaultSysId, defaultEndCust, found = false;
            var loadSysId, loadObservation, bundleLoad = false;
            defaultFilterCtrl.info.selectedObsGroup = null;
            SectionsMetaService.setSectionLoading(true);
            // Stores whether session is timed out or not
            defaultFilterCtrl.info.sessionTimedOut = false;

            $scope.$watch('defaultFilterCtrl.resultLoading', function() {
                if(!defaultFilterCtrl.resultLoading){
                    AppService.hidePanelLoading();
                }
            })
            //Event to check when application is ready
             $scope.$on('AppLoadEvent-apps', function (event, reload) {
                if(!defaultFilterCtrl.resultLoading){   
                    AppService.hidePanelLoading();
                }
                if(reload) {
                    $scope.init();
                }
             });


            // XHR to fetch ec n sys
            $scope.init = function () {
                // Holds the current selection of ec, sys n obs.
                /*if (DefaultFilterService.getDefaultSysId()) {
                    defaultSysId = DefaultFilterService.getDefaultSysId();
                    defaultEndCust = DefaultFilterService.getDefaultEndCust();
                    found = true;
                }*/
               /* if (DefaultFilterService.getLoadPage() == 'sectionview') {
                    loadSysId = DefaultFilterService.getLoadSysId();
                    loadObservation = DefaultFilterService.getLoadObservation();
                    DefaultFilterService.setLoadSysId(null);
                    DefaultFilterService.setLoadObservation(null);
                    DefaultFilterService.setLoadPage(null);
                    bundleLoad = true;
                }*/
                defaultFilterCtrl.resultLoading = false;
                SectionsMetaService.setReady(true);

                SectionsMetaService.getAll().then(function (response) {
                    var obs = DefaultFilterService.getDefaultObservation();
                    var sorted_data = $filter("filter")(response.data.Data, {
                        "namespace_type": "!EVENT"
                    });
                    sorted_data = $filter("filter")(sorted_data, {
                        "namespace_type": "!UNPARSED"
                    });
                    sorted_data = $filter("orderBy")(sorted_data, "label");
                    SectionsMetaService.setSections(DefaultFilterService.getDefaultObservation(), sorted_data);
                    sections = SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation());
                    SectionsMetaService.getDefault()
                        .then(function (response) {
                            var dashboardView = SectionsMetaService.getLoadView();
                            if(!!dashboardView) {
                                defaultFilterCtrl.loadDashboardView(dashboardView, response.data.Data);
                            } else {
                                defaultFilterCtrl.loadDefaultView(response.data.Data);
                            }
                            /*if (defaultFilterCtrl.info.setObservationNull == true) {
                                defaultFilterCtrl.info.setObservationNull = false;
                                defaultFilterCtrl.info['defaultObservation'] = null;
                                DefaultFilterService.setDefaultObservation(null);
                                DefaultFilterService.setSelectedObservation(null);
                            }*/
                            defaultFilterCtrl.info.ready = true;
                            SectionsMetaService.setReady(true);
                        }, handleSessionTimeout);
                    }, function (response) {
                        sections = response.data.Data;
                        handleSessionTimeout(response);
                    });               
            };
            defaultFilterCtrl.changeSubSysId = function(sid){
                if(DefaultFilterService.getSysId2() == sid){
                    return;
                }
                DefaultFilterService.setSysId2(sid);
                defaultFilterCtrl.info.ready = true;
                old_sections = SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation());
                SectionsMetaService.setSectionLoading(false);
                var sections = SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation());
                var obs = DefaultFilterService.getDefaultObservation();
                for (section in old_sections) {
                    if (old_sections[section]['selected'] == true) {
                        sections[section]['selected'] = true;
                        sections[section]['default'] = true;
                        sections[section]["a_data"] = null;
                        SectionsMetaService.loadData(sections[section], defaultFilterCtrl);
                    } else {
                        sections[section].selected = false;
                        sections[section]['default'] = false;
                    }
                }
                if (defaultFilterCtrl.info.setObservationNull == true) {
                    defaultFilterCtrl.info.setObservationNull = false;
                    defaultFilterCtrl.info['defaultObservation'] = null;
                    DefaultFilterService.setDefaultObservation(null);
                    DefaultFilterService.setSelectedObservation(null);
                }
                var dashboardView = SectionsMetaService.getLoadView();
                if(!!dashboardView) {
                    defaultFilterCtrl.loadDashboardView(dashboardView);
                } else {
                    if (SectionsMetaService.getViewName() != 'Select view') {
                        loadView(SectionsMetaService.getSelectedView());
                    }
                }
                SectionsMetaService.setSections(DefaultFilterService.getDefaultObservation(), sections);
            }
            defaultFilterCtrl.getSysId2 = function() {
                return DefaultFilterService.getSysId2();
            }
            function checkSysIdMatch(sysId) {
                for (var i = 0; i < defaultFilterCtrl.defaultFilters[0].sys_ids.length; i++) {
                    if (defaultFilterCtrl.defaultFilters[0].sys_ids[i].sys_id == sysId) {
                        defaultFilterCtrl.info['defaultSysId'] = defaultFilterCtrl.defaultFilters[0].sys_ids[i];
                        DefaultFilterService.setDefaultSysId(defaultFilterCtrl.info['defaultSysId']);
                        break;
                    }
                }
            }
            
            function setSelectedObsGroup() {
                if (DefaultFilterService.getSelectedObsGrp()) {
                    defaultFilterCtrl.info.selectedObsGroup = DefaultFilterService.getSelectedObsGrp();
                }
            }
            defaultFilterCtrl.selectObsGroup = function (obsgrp) {
                defaultFilterCtrl.info.selectedObsGroup = obsgrp;
                DefaultFilterService.setSelectedObsGrp(obsgrp);
            };
            // Returns the knowledge base link of the applied view for displaying on the UI.
            defaultFilterCtrl.getKbLink = function () {
                return SectionsMetaService.getKbLink();
            };
            defaultFilterCtrl.moveThroughSysId = function ($event) {
                var sysIds = defaultFilterCtrl.info.defaultEndCust.sys_ids;
                if (!!defaultFilterCtrl.sysfilter) {
                    sysIds = $filter('filter')(defaultFilterCtrl.info.defaultEndCust.sys_ids, defaultFilterCtrl.sysfilter);
                }
                if ($event.keyCode == 40) {
                    if (defaultFilterCtrl.info.sysIdIndex == -1 || defaultFilterCtrl.info.sysIdIndex == (sysIds.length - 1)) {
                        defaultFilterCtrl.info.sysIdIndex = 0;
                    } else {
                        defaultFilterCtrl.info.sysIdIndex++;
                    }
                    for (var i in sysIds) {
                        sysIds[i]['selected'] = false;
                    }
                    sysIds[defaultFilterCtrl.info.sysIdIndex]['selected'] = true;
                    defaultFilterCtrl.info.selectedSystemId = sysIds[defaultFilterCtrl.info.sysIdIndex];
                } else if ($event.keyCode == 38) {
                    if (defaultFilterCtrl.info.sysIdIndex == -1 || defaultFilterCtrl.info.sysIdIndex == 0) {
                        defaultFilterCtrl.info.sysIdIndex = sysIds.length - 1;
                    } else {
                        defaultFilterCtrl.info.sysIdIndex--;
                    }
                    for (var i in defaultFilterCtrl.info.defaultEndCust.sys_ids) {
                        defaultFilterCtrl.info.defaultEndCust.sys_ids[i]['selected'] = false;
                    }
                    sysIds[defaultFilterCtrl.info.sysIdIndex]['selected'] = true;
                    defaultFilterCtrl.info.selectedSystemId = sysIds[defaultFilterCtrl.info.sysIdIndex];
                } else if ($event.keyCode == 13) {
                    defaultFilterCtrl.info.defaultSysId = defaultFilterCtrl.info.selectedSystemId;
                    defaultFilterCtrl.changeSysId();
                    defaultFilterCtrl.resetMoveThroughSysId();
                    angular.element('.btn-group.open .dropdown-toggle').dropdown('toggle');
                    if (!!defaultFilterCtrl.sysfilter) {
                        defaultFilterCtrl.sysfilter.sys_id = "";
                    }
                } else {
                    defaultFilterCtrl.resetMoveThroughSysId();
                }
            };
            defaultFilterCtrl.resetMoveThroughSysId = function () {
                defaultFilterCtrl.info.sysIdIndex = -1;
                defaultFilterCtrl.info.selectedSystemId = null;
                for (var i in defaultFilterCtrl.info.defaultEndCust.sys_ids) {
                    defaultFilterCtrl.info.defaultEndCust.sys_ids[i]['selected'] = false;
                }
            };
            // Fetches meta for the given view and applies the same.
            function loadView(selectedView) {
                // XHR to fetch the meta for the given view.
                SectionsMetaService.loadView(selectedView).then(function (response) {
                    var appliedView;
                    appliedView = response.data.Data[0];
                    if (!!appliedView) {
                        SectionsMetaService.applyView(appliedView, $scope);
                    } else {
                        ModalService.alertBox({msg: 'No Applied View'});
                    }
                }, handleSessionTimeout);
            }

            // Angular watcher to reach for the changes to ec selection
            $scope.$watch("defaultFilterCtrl.info['defaultEndCust']", function (newVal, oldVal) {
                DefaultFilterService.setDefaultEndCust(newVal);
            });
            // Angular watcher to reach for the changes to sys selection
            /*$scope.$watch("defaultFilterCtrl.info['defaultSysId']", function (newVal, oldVal) {
                DefaultFilterService.setDefaultSysId(newVal);
            });*/
            
            defaultFilterCtrl.loadDashboardView = function(dashboardView, defView) {
                if(dashboardView.type == "custom") {
                    var view = dashboardView.view;
                    view.view_name = "Select View";
                    SectionsMetaService.applyView(view);
                    SectionsMetaService.setSelectedView(view);
                    SectionsMetaService.setSectionLoading(false);
                } else if (dashboardView.type == "savedView") {
                    SectionsMetaService.getAllViews().then(function(response) {
                        var view = $filter('filter')(response.data.Data, {view_name: dashboardView.view}, true) || [];
                        if(view.length == 1) {
                            firstTimeLoaded = true;
                            // SectionsMetaService.applyView(view[0], $scope);
                            defaultFilterCtrl.loadView(view[0]);
                        } else {
                            SectionsMetaService.setSectionLoading(false);
                            ModalService.alertBox({msg: "View not found"});
                            if(!firstTimeLoaded) {
                                defaultFilterCtrl.loadDefaultView(defView);
                            }
                        }
                    }, function(response) {
                        SectionsMetaService.setSectionLoading(false);
                        ModalService.alertBox({msg: "View not found"});
                        if(!firstTimeLoaded) {
                            defaultFilterCtrl.loadDefaultView(defView);
                        }
                    });
                }
                SectionsMetaService.setLoadView(null);
            };
            
            defaultFilterCtrl.loadView = function(view) {
                SectionsMetaService.loadView(view)
                    .then(function (response) {
                        SectionsMetaService.setSectionLoading(false);
                        var appliedView;
                        appliedView = response.data.Data[0];
                        if (!!appliedView) {
                            SectionsMetaService.applyView(appliedView);
                            SectionsMetaService.setSelectedView(view);
                            // Applying the view that is fetched.
                            UserTrackingService.standard_user_tracking(defaultFilterCtrl.application, 'Section View', 'Apply View', "{\'" + view['view_name'] + "\'}")
                                .then(successHandler, handleSessionTimeout);
                        } else {
                            SectionsMetaService.setSectionLoading(false);
                            ModalService.alertBox({msg: 'No Applied View'});
                        }
                    }, handleSessionTimeout);
            };
            
            defaultFilterCtrl.loadDefaultView = function(defView) {
                var sections = SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation());
                firstTimeLoaded = true;
                if (defView) {
                    // SectionsMetaService.setViewName(defView.view_name);
                    // SectionsMetaService.applyView(defView, $scope);
                } else {
                    // for (section in sections) {
                        // if (sections[section]['default'] == true) {
                            // sections[section].selected = true;
                            // SectionsMetaService.loadData(sections[section], defaultFilterCtrl);
                        // } else {
                            // sections[section].selected = false;
                        // }
                    // }
                }
                SectionsMetaService.setSectionLoading(false);
            };

            defaultFilterCtrl.getSysId2List = function() {
                defaultFilterCtrl.info.sid2 = DefaultFilterService.getSubSys();
                if(defaultFilterCtrl.info.sid2 && defaultFilterCtrl.info.sid2.length && defaultFilterCtrl.info.sid2.length > 0){
                    if(!DefaultFilterService.getSysId2()){
                        DefaultFilterService.setSysId2(defaultFilterCtrl.info.sid2[0]);
                    }                    
                }
                return defaultFilterCtrl.info.sid2;
            };

            var firstTimeLoaded = false;
            
            // Angular watcher to reach for the changes to obs selection
            /*$scope.$watch("defaultFilterCtrl.info['defaultObservation']", function (newVal, oldVal) {
                
                //hack need to remove
                return;
                var sorted_data, i, obs;
                DefaultFilterService.setDefaultObservation(newVal);
                var section, sections, old_sections;
                if (!!newVal && !!newVal['obs_time']) {
                    // First time when page is loaded.
                    var isSections = SectionsMetaService.getSections();
                    if (obs == undefined && !(isSections && isSections.length > 0)) {
                        defaultFilterCtrl.info.ready = false;
                        defaultFilterCtrl.info['file_name'] = newVal['file_name'];
                        SectionsMetaService.getAll().then(function (response) {
                            obs = DefaultFilterService.getDefaultObservation();
                            sorted_data = $filter("filter")(response.data.Data, {
                                "namespace_type": "!EVENT"
                            });
                            sorted_data = $filter("filter")(sorted_data, {
                                "namespace_type": "!UNPARSED"
                            });
                            defaultFilterCtrl.info.ready = true;
                            sorted_data = $filter("orderBy")(sorted_data, "label");
                            SectionsMetaService.setSections(DefaultFilterService.getDefaultObservation(), sorted_data);
                            sections = SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation());
                            SectionsMetaService.getDefault()
                                .then(function (response) {
                                    var dashboardView = SectionsMetaService.getLoadView();
                                    if(!!dashboardView) {
                                        defaultFilterCtrl.loadDashboardView(dashboardView, response.data.Data);
                                    } else {
                                        defaultFilterCtrl.loadDefaultView(response.data.Data);
                                    }
                                    if (defaultFilterCtrl.info.setObservationNull == true) {
                                        defaultFilterCtrl.info.setObservationNull = false;
                                        defaultFilterCtrl.info['defaultObservation'] = null;
                                        DefaultFilterService.setDefaultObservation(null);
                                        DefaultFilterService.setSelectedObservation(null);
                                    }
                                    defaultFilterCtrl.info.ready = true;
                                    SectionsMetaService.setReady(true);
                                }, handleSessionTimeout);
                        }, function (response) {
                            sections = response.data.Data;
                            handleSessionTimeout(response);
                        });
                    } else if (SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation()) == undefined) {// When obs data is not available in the cache.
                        sections = SectionsMetaService.getSections(obs);
                        SectionsMetaService.setSectionLoading(false);
                        obs = DefaultFilterService.getDefaultObservation();
                        sections = angular.copy(sections);
                        var sectionsCount = 0;
                        var sectionsLoaded = 0;
                        var dashboardView = SectionsMetaService.getLoadView();
                        if(!!dashboardView) {
                            for (var i in sections) {
                                sections[i]['selected'] = false;
                                sections[i]['default'] = false;
                                sections[i]['visible'] = true;
                                SectionsMetaService.resetFilter(sections[i]);
                            }
                            SectionsMetaService.setSections(DefaultFilterService.getDefaultObservation(), sections);
                            SectionsMetaService.setAppliedView(null);
                            SectionsMetaService.setViewName("Select view");
                            defaultFilterCtrl.loadDashboardView(dashboardView);
                        }
                        for (section in sections) {
                            delete sections[section].a_data;
                            if (sections[section]['selected'] == true) {
                                sectionsCount++;
                                sections[section].deferred = $q.defer();
                                // delete sections[section].tableParams;
                                SectionsMetaService.loadData(sections[section], defaultFilterCtrl, sections[section].deferred);
                                sections[section].deferred.promise.then(function () {
                                    sectionsLoaded = sectionsLoaded + 1;
                                    if (SectionsMetaService.getViewName() != 'Select view' && sectionsLoaded == sectionsCount) {
                                        loadView(SectionsMetaService.getSelectedView());
                                        // var dashboardView = SectionsMetaService.getLoadView();
                                        // if(!!dashboardView) {
                                            // defaultFilterCtrl.loadDashboardView(dashboardView);
                                        // } else {
//                                             
                                        // }
                                        
                                    }
                                }, function () {
                                    sectionsLoaded = sectionsLoaded + 1;
                                    if (SectionsMetaService.getViewName() != 'Select view' && sectionsLoaded == sectionsCount) {
                                        loadView(SectionsMetaService.getSelectedView());
                                        // var dashboardView = SectionsMetaService.getLoadView();
                                        // if(!!dashboardView) {
                                            // defaultFilterCtrl.loadDashboardView(dashboardView);
                                        // } else {
//                                             
                                        // }
                                    }
                                });
                                
                            } else {
                                sections[section].selected = false;
                            }
                        }
                        if (defaultFilterCtrl.info.setObservationNull == true) {
                            defaultFilterCtrl.info.setObservationNull = false;
                            defaultFilterCtrl.info['defaultObservation'] = null;
                            DefaultFilterService.setDefaultObservation(null);
                            DefaultFilterService.setSelectedObservation(null);
                        }
                    } else {// When obs data in available in the cache.
                        defaultFilterCtrl.info.ready = true;
                        old_sections = SectionsMetaService.getSections(obs);
                        SectionsMetaService.setSectionLoading(false);
                        sections = SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation());
                        obs = DefaultFilterService.getDefaultObservation();
                        for (section in old_sections) {
                            if (old_sections[section]['selected'] == true) {
                                sections[section]['selected'] = true;
                                sections[section]['default'] = true;
                                SectionsMetaService.loadData(sections[section], defaultFilterCtrl);
                            } else {
                                sections[section].selected = false;
                                sections[section]['default'] = false;
                            }
                        }
                        if (defaultFilterCtrl.info.setObservationNull == true) {
                            defaultFilterCtrl.info.setObservationNull = false;
                            defaultFilterCtrl.info['defaultObservation'] = null;
                            DefaultFilterService.setDefaultObservation(null);
                            DefaultFilterService.setSelectedObservation(null);
                        }
                        var dashboardView = SectionsMetaService.getLoadView();
                        if(!!dashboardView) {
                            defaultFilterCtrl.loadDashboardView(dashboardView);
                        } else {
                            if (SectionsMetaService.getViewName() != 'Select view') {
                                loadView(SectionsMetaService.getSelectedView());
                            }
                        }
                    }
                    SectionsMetaService.setSections(DefaultFilterService.getDefaultObservation(), sections);
                }
            });*/

            //  Defines the grouping for observations.
            DefaultFilterService.getObsGroups().then(function (response) {
                defaultFilterCtrl.obsGroups = response.data.Data;
            }, function (response) {
                defaultFilterCtrl.obsGroups = response.data.Data;
                handleSessionTimeout(response);
            });

            // Filters the observation list to return only the observations from the last hour.
            var getLastHourObservations = function () {
                var observations = [], default_obs, t_obs, obs;
                if (defaultFilterCtrl.info['defaultSysId']) {
                    default_obs = new Date();
                    default_obs.setHours(default_obs.getHours() - 1);
                    for (obs in defaultFilterCtrl.info['defaultSysId'].observations) {
                        t_obs = UtilService.parseDate(defaultFilterCtrl.info['defaultSysId'].observations[obs].obs_time);
                        if (t_obs > default_obs) {
                            observations.push(defaultFilterCtrl.info['defaultSysId'].observations[obs]);
                        }
                    }
                    return observations;
                }
            };
            // Filters the observation list to return only the observations from the last 12 hours.
            var getLast12HourObservations = function () {
                var observations = [], default_obs, t_obs, obs;
                if (defaultFilterCtrl.info['defaultSysId']) {
                    default_obs = new Date();
                    default_obs.setHours(default_obs.getHours() - 12);
                    for (obs in defaultFilterCtrl.info['defaultSysId'].observations) {
                        t_obs = UtilService.parseDate(defaultFilterCtrl.info['defaultSysId'].observations[obs].obs_time);
                        if (t_obs > default_obs) {
                            observations.push(defaultFilterCtrl.info['defaultSysId'].observations[obs]);
                        }
                    }
                    return observations;
                }
            };
            // Filters the observation list to return only the observations of yesterday.
            var getYesterdayObservations = function () {
                var observations = [], default_obs, t_obs, obs;
                if (defaultFilterCtrl.info['defaultSysId']) {
                    default_obs = new Date();
                    default_obs.setDate(default_obs.getDate() - 1);
                    for (obs in defaultFilterCtrl.info['defaultSysId'].observations) {
                        t_obs = UtilService.parseDate(defaultFilterCtrl.info['defaultSysId'].observations[obs].obs_time);
                        if (t_obs > default_obs) {
                            observations.push(defaultFilterCtrl.info['defaultSysId'].observations[obs]);
                        }
                    }
                    return observations;
                }
            };
            // Filters the observation list to return only the observations from the last 2 days.
            var getLast2DaysObservations = function () {
                var observations = [], default_obs, t_obs, obs;
                if (defaultFilterCtrl.info['defaultSysId']) {
                    default_obs = new Date();
                    default_obs.setDate(default_obs.getDate() - 2);
                    for (obs in defaultFilterCtrl.info['defaultSysId'].observations) {
                        t_obs = UtilService.parseDate(defaultFilterCtrl.info['defaultSysId'].observations[obs].obs_time);
                        if (t_obs > default_obs) {
                            observations.push(defaultFilterCtrl.info['defaultSysId'].observations[obs]);
                        }
                    }
                    return observations;
                }
            };
            // Filters the observation list to return only the observations of current week.
            var getThisWeekObservations = function () {
                var observations = [], default_obs, t_obs, obs;
                if (defaultFilterCtrl.info['defaultSysId']) {
                    default_obs = new Date();
                    for (obs in defaultFilterCtrl.info['defaultSysId'].observations) {
                        t_obs = UtilService.parseDate(defaultFilterCtrl.info['defaultSysId'].observations[obs].obs_time);
                        if (t_obs && t_obs.getWeek() === default_obs.getWeek()) {
                            observations.push(defaultFilterCtrl.info['defaultSysId'].observations[obs]);
                        }
                    }
                    return observations;
                }
            };
            var getMostRecentObservations = function () {
                var observations = [];
                if (defaultFilterCtrl.info['defaultSysId'] && defaultFilterCtrl.info['defaultSysId'].lastNObservations) {
                    observations.push(defaultFilterCtrl.info['defaultSysId'].lastNObservations[0]);
                    return observations;
                }
            };
            // Filters the observation list to return only the observations of the current month.
            var getThisMonthObservations = function () {
                var observations = [], default_obs, t_obs, obs;
                if (defaultFilterCtrl.info['defaultSysId']) {
                    default_obs = new Date();
                    for (obs in defaultFilterCtrl.info['defaultSysId'].observations) {
                        t_obs = UtilService.parseDate(defaultFilterCtrl.info['defaultSysId'].observations[obs].obs_time);
                        if (t_obs && t_obs.getMonth() === default_obs.getMonth()) {
                            observations.push(defaultFilterCtrl.info['defaultSysId'].observations[obs]);
                        }
                    }
                    return observations;
                }
            };
            var getLastNObservations = function () {
                var observations = [];
                if (defaultFilterCtrl.info['defaultSysId'] && defaultFilterCtrl.info['defaultSysId'].lastNObservations) {
                    for (obs in defaultFilterCtrl.info['defaultSysId'].lastNObservations) {
                        observations.push(defaultFilterCtrl.info['defaultSysId'].lastNObservations[obs]);
                    }
                    return observations;
                }
            };
            // Sets the most recent observation as the current observation.
            function setRecentObservation() {
                var i, flag = 0, default_obs, t_obs;
                for (i in defaultFilterCtrl.info['defaultSysId'].observations) {
                    if (flag) {
                        default_obs = UtilService.parseDate(defaultFilterCtrl.info['defaultObservation'].obs_time);
                        t_obs = UtilService.parseDate(defaultFilterCtrl.info['defaultSysId'].observations[i].obs_time);
                        if (default_obs < t_obs) {
                            defaultFilterCtrl.info['defaultObservation'] = defaultFilterCtrl.info['defaultSysId'].observations[i];
                            DefaultFilterService.setSelectedObservation(defaultFilterCtrl.info['defaultObservation']);
                        }
                    } else {
                        defaultFilterCtrl.info['defaultObservation'] = defaultFilterCtrl.info['defaultSysId'].observations[i];
                        DefaultFilterService.setSelectedObservation(defaultFilterCtrl.info['defaultObservation']);
                        flag = 1;
                    }
                }
                DefaultFilterService.setDefaultObservation(defaultFilterCtrl.info['defaultObservation']);
                defaultFilterCtrl.info.selectedObsGroup = 'Most Recent';
                DefaultFilterService.setSelectedObsGrp('Most Recent');
            }

            // Triggered when ec is changed.
            defaultFilterCtrl.changeEndCust = function () {
                DefaultFilterService.setDefaultSysId(null);
                DefaultFilterService.setDefaultObservation(null);
                defaultFilterCtrl.info['defaultObservation'] = null;
                defaultFilterCtrl.info['defaultSysId'] = null;
            };
            // Gets the values from the globals based on the given key.
            defaultFilterCtrl.getValue = function (key) {
                return GlobalService.getVal(key);
            };
            defaultFilterCtrl.getSysId2Tooltip = function() {
            	var manufacturer = GlobalService.getVal('manufacturer');
            	var sysId2 = GlobalService.getVal('systemId2');
            	if(sysId2.customer.hasOwnProperty(manufacturer)) {
            		return sysId2.customer[manufacturer];
            	} else {
            		return sysId2.common;
            	}
            };
            defaultFilterCtrl.showSysid2DD = function() {
                var bool = metaDataService.isSysid2Enable();
                return bool;
            };
            // Triggered when sys is changed.
            defaultFilterCtrl.changeSysId = function () {
                if (!!defaultFilterCtrl.sysfilter) {
                    defaultFilterCtrl.sysfilter.sys_id = "";
                }
                defaultFilterCtrl.info['defaultObservation'] = null;
                if (defaultFilterCtrl.info['defaultSysId'].observations === undefined) {
                    DefaultFilterService.getObservations(defaultFilterCtrl.info['defaultEndCust'], defaultFilterCtrl.info['defaultSysId'])
                        .then(function (response) {
                            var obs, obscnt;
                            defaultFilterCtrl.info['defaultSysId'].observations = [];
                            for (obscnt in response.data.Data) {
                                obs = {};
                                obs['obs_time'] = response.data.Data[obscnt].obs_ts;
                                var bundleName = response.data.Data[obscnt].bundle_name;
                                obs['bundle_name'] = bundleName;
                                obs['file_name'] = response.data.Data[obscnt].file_name;
                                defaultFilterCtrl.info['defaultSysId'].observations.push(obs);
                            }
                            getObservationsTimeRange('This Month');
                            getObservationsTimeRange('This Week');
                            getObservationsTimeRange('Last 2 Days');

                        }, handleSessionTimeout);
                }
                if (defaultFilterCtrl.info['defaultSysId'].lastNObservations === undefined) {
                    DefaultFilterService.getNObservations(defaultFilterCtrl.info['defaultEndCust'], defaultFilterCtrl.info['defaultSysId'], GlobalService.getVal('no_of_bundles'))
                        .then(function (response) {
                            var obs;
                            SectionsMetaService.setReady(true);
                            defaultFilterCtrl.info['defaultSysId'].lastNObservations = [];
                            for (var i = 0; i < response.data.Data.length; i++) {
                                obs = {};
                                obs['obs_time'] = response.data.Data[i].obs_ts;
                                var bundleName = response.data.Data[i].bundle_name;
                                obs['obs_url'] = response.data.Data[i].bundle_name;
                                obs['bundle_name'] = bundleName;
                                defaultFilterCtrl.info['defaultSysId'].lastNObservations.push(obs);
                            }
                        }, handleSessionTimeout);
                }
                DefaultFilterService.setDefaultObservation(null);
                defaultFilterCtrl.info['defaultObservation'] = null;
                DefaultFilterService.setSelectedObservation(null);
            };
            // Sets the given observation as the current selection.
            defaultFilterCtrl.setDefaultObservation = function (obs) {
                SectionsMetaService.setAppliedView(null);
                defaultFilterCtrl.info['defaultObservation'] = obs;
                DefaultFilterService.setDefaultObservation(obs);
                DefaultFilterService.setSelectedObservation(obs);
                DefaultFilterService.setDefaultObservation(defaultFilterCtrl.info['defaultObservation']);
            };

            // Removed because not in use anymore - Ashwin
            // $scope.setDefaultObservationConfirm = function (obs) {
                // SectionsMetaService.setAppliedView(null);
                // defaultFilterCtrl.info['defaultObservation'] = obs;
                // DefaultFilterService.setDefaultObservation(obs);
                // DefaultFilterService.setSelectedObservation(obs);
                // DefaultFilterService.setDefaultObservation(defaultFilterCtrl.info['defaultObservation']);
                // $scope.modal.close();
            // };

            // Returns the budles having only the last part of the bundle name for the UI to display.
            defaultFilterCtrl.getObservations = function (obsgrp) {
                var obsMethod;
                if (!obsgrp) return;
                obsMethod = obsgrp.replace(/\s/g, '');
                obsMethod = 'get' + obsMethod + 'Observations';
                obsMethod = observationObj[obsMethod];
                if (typeof obsMethod === 'function') {
                    return obsMethod();
                } else {
                    ModalService.alertBox({msg: 'Not function'});
                }
            };

            function getObservationsTimeRange(obsgrp) {
                var fromTime, toTime;
                var currentDateobj = new Date();
                var Day = currentDateobj.getUTCDate();
                var Hour = currentDateobj.getUTCHours();
                var Month = 1 + (currentDateobj.getUTCMonth());
                var Year = currentDateobj.getUTCFullYear();

                switch (obsgrp) {
                    // Commenting because not in use - Ashwin
                    // case 'Last Hour':
                        // toTime = $filter('utcDateTZ')(currentDateobj);
                        // var tempTime = new Date(currentDateobj.setUTCHours(currentDateobj.getUTCHours() - 1));
                        // fromTime = $filter('utcDateTZ')(tempTime);
                        // break;
                    // case 'Last 12 Hour':
                        // toTime = $filter('utcDateTZ')(currentDateobj);
                        // var tempTime = new Date(currentDateobj.setUTCHours(currentDateobj.getUTCHours() - 12));
                        // fromTime = $filter('utcDateTZ')(tempTime);
                        // break;
                    // case 'Yesterday':
                        // var yesterdayDateTime = new Date(currentDateobj.setUTCDate(currentDateobj.getUTCDate() - 1));
                        // yesterdayDateTime.setUTCHours(0);
                        // yesterdayDateTime.setUTCMinutes(0);
                        // yesterdayDateTime.setUTCSeconds(0);
                        // toTime = $filter('utcDateTZ')(yesterdayDateTime);
                        // var yesterdayDateTime2 = new Date(yesterdayDateTime);
                        // var tempTime = new Date(yesterdayDateTime2);
                        // tempTime.setUTCHours(23);
                        // tempTime.setUTCMinutes(59);
                        // tempTime.setUTCSeconds(59);
                        // fromTime = $filter('utcDateTZ')(tempTime);
                        // break;
                    case 'Last 2 Days':
                        toTime = $filter('utcDateTZ')(currentDateobj);
                        var tempTime = new Date(currentDateobj.setUTCDate(currentDateobj.getUTCDate() - 2));
                        tempTime.setUTCHours(0);
                        tempTime.setUTCMinutes(0);
                        tempTime.setUTCSeconds(0);
                        fromTime = $filter('utcDateTZ')(tempTime);
                        break;
                    case 'This Month':
                        toTime = $filter('utcDateTZ')(currentDateobj);
                        var tempTime = new Date(currentDateobj.setUTCDate(1));
                        tempTime.setUTCHours(0);
                        tempTime.setUTCMinutes(0);
                        tempTime.setUTCSeconds(0);
                        fromTime = $filter('utcDateTZ')(tempTime);
                        break;
                    case 'This Week':
                        toTime = $filter('utcDateTZ')(currentDateobj);
                        var d = new Date();
                        var day = d.getUTCDay();
                        diff = d.getUTCDate() - day + (day == 0 ? -6 : 1);
                        tempTime = new Date(d.setUTCDate(diff));
                        tempTime.setUTCHours(0);
                        tempTime.setUTCMinutes(0);
                        tempTime.setUTCSeconds(0);
                        fromTime = $filter('utcDateTZ')(tempTime);
                        break;

                }
                DefaultFilterService.getObservationsTimeRange(defaultFilterCtrl.info['defaultEndCust'], defaultFilterCtrl.info['defaultSysId'], fromTime, toTime)
                    .then(function (response) {
                        var obs, obscnt;
                        if(Array.isArray(response.data.Data)) {
                            for (obscnt in response.data.Data) {
                                obs = {};
                                obs['obs_time'] = response.data.Data[obscnt].obs_ts;
                                var bundleName = response.data.Data[obscnt].bundle_name;
                                obs['bundle_name'] = bundleName;
                                obs['file_name'] = response.data.Data[obscnt].file_name;
                                var found = false;
                                for (var k = 0; k < defaultFilterCtrl.info['defaultSysId'].observations.length; k++) {
                                    if (defaultFilterCtrl.info['defaultSysId'].observations[k].bundle_name == obs.bundle_name) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    defaultFilterCtrl.info['defaultSysId'].observations.push(obs);
                                }
                            }
                        }
                    }, handleSessionTimeout);
            }

            defaultFilterCtrl.getSelectedSections = function () {
                var selectedSections = $filter('filter')(SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation()), {
                    'selected': true
                });
                return selectedSections;
            };

            defaultFilterCtrl.resetSections = function () {
                var sections = SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation());
                var modalInstance = $modal.open({
                    templateUrl: 'partials/sectionview_reset_view.html',
                    controller: 'ResetViewController as resetViewCtrl'
                });
                modalInstance.result.then(function () {
                    for (var i in sections) {
                        sections[i]['selected'] = false;
                        sections[i]['default'] = false;
                        sections[i]['visible'] = true;
                        SectionsMetaService.resetFilter(sections[i]);
                    }
                    SectionsMetaService.setSections(DefaultFilterService.getDefaultObservation(), sections);
                    SectionsMetaService.setAppliedView(null);
                    SectionsMetaService.setViewName("Select view");
                    UserTrackingService.standard_user_tracking(defaultFilterCtrl.application, 'Section View', 'Clear Filter', "{}")
                                .then(successHandler, handleSessionTimeout);
                });
            };

            $scope.hideNavigationModal = function () {
                $scope.modal.close();
            };
            // Shows up the save view modal
            defaultFilterCtrl.showModal = function () {
                if (SectionsMetaService.getViewsCount() >= GlobalService.getVal('max_views_limit')) {
                    ModalService.alertBox({msgKey: 'max_views_msg'});
                    return;
                }
                allSectionsDetails = SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation());
                var selectedSections = defaultFilterCtrl.getSelectedSections();
                if (!selectedSections.length) {
                    ModalService.alertBox({msg: 'Please select at least one section!'});
                    return;
                }
                if (!getSelectedSectionsData().length) {
                    ModalService.alertBox({msg: 'Please select at least one column in a section!'});
                    return;
                }
                var selectedSections = $filter('filter')(allSectionsDetails, {
                    'selected': true
                });
                var sectionDataAvailable = false;
                for (var i in selectedSections) {
                    if (!!selectedSections[i].display_data) {
                        sectionDataAvailable = true;
                        break;
                    }
                }
                if (!sectionDataAvailable) {
                    ModalService.alertBox({msg: 'Please select a section with data'});
                    return;
                }
                $modal.open({
                    templateUrl: 'partials/save_view.html',
                    controller: 'SaveFilter as saveFilterCtrl',
                    resolve: {
                        items: function () {
                            return {
                                allSectionsDetails: allSectionsDetails
                            };
                        }
                    }
                })
            };
            var observationObj = {
                getLastHourObservations: getLastHourObservations,
                getLast12HourObservations: getLast12HourObservations,
                getYesterdayObservations: getYesterdayObservations,
                getLast2DaysObservations: getLast2DaysObservations,
                getThisWeekObservations: getThisWeekObservations,
                getMostRecentObservations: getMostRecentObservations,
                getThisMonthObservations: getThisMonthObservations,
                getLastNObservations: getLastNObservations
            };
            
            function getSelectedSectionsData() {
                var selectedSections = $filter('filter')(SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation()), {
                    'selected': true
                });
                var updatedSectionList = [];
                for (var k in selectedSections) {
                    var eachSectionData = selectedSections[k];
                    if (eachSectionData.a_data) {
                        var sectionKeys = eachSectionData.columns;
                        for (var x in sectionKeys) {
                            var aKey = sectionKeys[x];
                            if (aKey.visible) {
                                updatedSectionList.push(eachSectionData);
                                break;
                            }
                        }
                    } else {
                        updatedSectionList.push(eachSectionData);
                    }
                }
                return updatedSectionList;
            }

            $scope.init();
            function successHandler(response) {
            }
            function handleSessionTimeout(response) {
                if (!defaultFilterCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                    defaultFilterCtrl.info.sessionTimedOut = true;
                    ModalService.sessionTimeout();
                }
            }
        }])

// AnalyticsCtrl - Responsible for holding the model for analytics app and handles authentication.
    .controller('AnalyticsCtrl', ['NavigationService', '$sce', 'ErrorService',
        function (NavigationService, $sce, ErrorService) {
            var analyticsCtrl = this;
            // Returns the url of the currently selected page to load.
            analyticsCtrl.getUrl = function () {
                return NavigationService.getUrl();
            };
            analyticsCtrl.renderHtml = function (html) {
                return $sce.trustAsHtml(html);
            };
            analyticsCtrl.getError = function () {
                return ErrorService.getErrors('analytics');
            };
            analyticsCtrl.isSectionTab = function () {
                if(NavigationService.getUrl() == 'partials/sectionview.html'){
                    return true;
                };
                if(NavigationService.getUrl() != 'partials/sectionview.html'){
                    return false;
                };
                return false;
            };

        }])

// ShowSavedFilters - Responsible for holding the list of saved views and model related to it.
    .controller('ShowSavedFilters', ['$modal', 'metaDataService', 'AppService', 'ModalService', '$cookies', 'SectionsMetaService', 'UserTrackingService', 'GlobalService', 'DefaultFilterService',
        function ($modal, metaDataService, AppService, ModalService, $cookies, SectionsMetaService, UserTrackingService, GlobalService, DefaultFilterService) {
            var showSavedFilterCtrl = this;
            showSavedFilterCtrl.meta = {};
            showSavedFilterCtrl.meta['visible'] = false;
            showSavedFilterCtrl.filterBtn = "all";
            showSavedFilterCtrl.inlineSearch = "";
            showSavedFilterCtrl.views = [];
            showSavedFilterCtrl.dataNotFound = false;
            showSavedFilterCtrl.application = GlobalService.getVal('navLog');
            var setDefaultStatus = null;
            var changeAccessibilityStatus = null;
            // Stores whether session is timed out or not
            var sessionTimedOut = false;
            // Returns the current view.
            showSavedFilterCtrl.getCurrentViewName = function () {
                return SectionsMetaService.getViewName();
            };
            // Loads the list of saved views.
            showSavedFilterCtrl.loadSavedViews = function () {
                showSavedFilterCtrl.savedViewsLoading = true;
                showSavedFilterCtrl.inlineSearch = "";
                // XHR to fetch all the saved views.
                SectionsMetaService.getAllSavedViews()
                    .then(function (response) {
                        showSavedFilterCtrl.savedViewsLoading = false;
                        showSavedFilterCtrl.views = response.data.Data;
                        if (!!showSavedFilterCtrl.views.length) {
                            SectionsMetaService.setViewsCount(showSavedFilterCtrl.views.length);
                        } else {
                            SectionsMetaService.setViewsCount(0);
                        }
                        changeAccessibilityStatus = "success";
                        setDefaultStatus = "success";
                        if (showSavedFilterCtrl.views == "" || showSavedFilterCtrl.views.length == 0) {
                            showSavedFilterCtrl.dataNotFound = true;
                        } else {
                            showSavedFilterCtrl.dataNotFound = false;
                        }
                    }, function (response) {
                        handleSessionTimeout(response);
                        showSavedFilterCtrl.dataNotFound = false;
                    });
            };
            // Fetches meta for the given view and applies the same.
            showSavedFilterCtrl.loadView = function (selectedView) {
                showSavedFilterCtrl.meta.visible = !showSavedFilterCtrl.meta.visible;
                if (!DefaultFilterService.getSelectedObservation()) {
                    ModalService.alertBox({msg: 'Please select observation!'});
                    return;
                }
                // XHR to fetch the meta for the given view.
                SectionsMetaService.loadView(selectedView)
                    .then(function (response) {
                        var appliedView;
                        appliedView = response.data.Data[0];
                        angular.element(document.getElementById("sectionview-select-view-div")).removeClass("open");
                        if (!!appliedView) {
                            SectionsMetaService.applyView(appliedView);
                            SectionsMetaService.setSelectedView(selectedView);
                            // Applying the view that is fetched.
                            UserTrackingService.standard_user_tracking(showSavedFilterCtrl.application, 'Section View', 'Apply View', "{\'" + selectedView['view_name'] + "\'}")
                                .then(successHandler, handleSessionTimeout);
                        } else {
                            ModalService.alertBox({msg: 'No Applied View'});
                        }
                    }, handleSessionTimeout);
            };
            // Shows up the delete view modal.
            showSavedFilterCtrl.deleteView = function (selectedView, event) {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/delete_view.html',
                    controller: 'DeleteViewController as delCtrl',
                    resolve: {
                        deleteModal: function () {
                            return selectedView;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    showSavedFilterCtrl.loadSavedViews();
                    // To refresh the list of views.
                });
            };
            // Set/unset the given view as the default for the current user.
            showSavedFilterCtrl.setDefaultView = function (selectedView, event) {
                // Check given view is default ??
                if (selectedView['default']) {
                    //reset default
                    setDefaultStatus = selectedView['view_name'];
                    // XHR to unset the default view.
                    SectionsMetaService.resetDefault(selectedView)
                        .then(function (response) {
                            showSavedFilterCtrl.loadSavedViews();
                            UserTrackingService.standard_user_tracking(showSavedFilterCtrl.application, 'Section View', 'Reset Default View', "{\'" + selectedView['view_name'] + "\'}")
                                .then(successHandler, handleSessionTimeout);
                        }, function (response) {
                            handleSessionTimeout(response);
                            setDefaultStatus = "error";
                        });
                } else {
                    // Current view is not default.
                    setDefaultStatus = selectedView['view_name'];
                    // XHR to unset the default view.
                    SectionsMetaService.setDefault(selectedView)
                        .then(function (response) {
                            showSavedFilterCtrl.loadSavedViews();
                            UserTrackingService.standard_user_tracking(showSavedFilterCtrl.application, 'Section View', 'Set Default View', "{\'" + selectedView['view_name'] + "\'}")
                                .then(successHandler, handleSessionTimeout);
                        }, function (response) {
                            handleSessionTimeout(response);
                            setDefaultStatus = "error";
                        });
                }
            };
            // Sets the accessibility of a view public/private based on the user selection.
            showSavedFilterCtrl.setAccessibility = function (selectedView, event) {
                changeAccessibilityStatus = selectedView['view_name'];
                // XHR to change the accessibility
                SectionsMetaService.setAccessibility(selectedView)
                    .then(function (response) {
                        showSavedFilterCtrl.loadSavedViews();
                        UserTrackingService.standard_user_tracking(showSavedFilterCtrl.application, 'Section View', !!selectedView['public'] ? 'Set View Private' : 'Set View Public', "{\'" + selectedView['view_name'] + "\'}")
                            .then(successHandler, handleSessionTimeout);
                    }, function (response) {
                        handleSessionTimeout(response);
                        changeAccessibilityStatus = "error";
                    });
            };
            // Filters the views based on user selection on the UI.
            showSavedFilterCtrl.filterByScope = function (view) {
                if (showSavedFilterCtrl.filterBtn == 'all')
                    return true;
                else if (showSavedFilterCtrl.filterBtn == 'my' && view.created_by == showSavedFilterCtrl.getLoggedInUserName())
                    return true;
                else if (showSavedFilterCtrl.filterBtn == 'others' && view.created_by != showSavedFilterCtrl.getLoggedInUserName())
                    return true;
                else
                    return false;
            };
            // Returns the logged in user name
            showSavedFilterCtrl.getLoggedInUserName = function () {
                return metaDataService.getUser()['email'];
            };
            function handleSessionTimeout(response) {
                if (!sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                    sessionTimedOut = true;
                    ModalService.sessionTimeout();
                }
            }

            function successHandler(response) {
            }
        }])
    .controller('DeleteViewController', ['$modalInstance', 'SectionsMetaService', 'UserTrackingService', 'ModalService', 'GlobalService', 'deleteModal', function ($modalInstance, SectionsMetaService, UserTrackingService, ModalService, GlobalService, deleteModal) {
        var delCtrl = this;
        delCtrl.deleteModal = deleteModal;
        delCtrl.deleteModal.deleteOperation = "initiated";
        delCtrl.deleteModal.deleteOperationMsg = "";
        delCtrl.application = GlobalService.getVal('navLog');
        // Closes the open model
        delCtrl.hideDeleteModal = function () {
            $modalInstance.close('ok');
        };
        // Sends the request to delete the given view and tracks the user activity for the operation.
        delCtrl.deleteViewRequest = function (selectedView) {
            delCtrl.deleteModal.deleteOperation = "progress";
            // XHR to delete the given view.
            SectionsMetaService.deleteView(selectedView)
                .then(function (response) {
                    SectionsMetaService.setViewsCount(SectionsMetaService.getViewsCount() - 1);
                    delCtrl.deleteModal.deleteOperation = "success";
                    delCtrl.deleteModal.deleteOperationMsg = "Deleted successfully";
                    //User activity tracking
                    UserTrackingService.standard_user_tracking(delCtrl.application, 'Section View', 'Delete View', "{\'" + selectedView['view_name'] + "\'}")
                        .then(function (response) {
                            
                        }, handleSessionTimeout);
                }, function (response) {
                    handleSessionTimeout(response);
                    delCtrl.deleteModal.deleteOperation = "error";
                    delCtrl.deleteModal.deleteOperationMsg = "Error : " + response.data.Msg;
                });
        };
        function handleSessionTimeout(response) {
            if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                $modalInstance.dismiss('cancel');
                ModalService.sessionTimeout();
            }
        }
    }])

// SaveFilter - Responsible for holding model of the save view modal.
    .controller('SaveFilter', ['$scope', '$modalInstance', 'ModalService', 'AppService', 'GlobalService', 'SectionsMetaService', '$filter', 'UserTrackingService', 'DefaultFilterService', 'items', '$cookies', 'metaDataService',
        function ($scope, $modalInstance, ModalService, AppService, GlobalService, SectionsMetaService, $filter, UserTrackingService, DefaultFilterService, items, $cookies, metaDataService) {
            var saveFilterCtrl = this, savedFiltersList = [], emptySectionList = [];
            var attributeOfSelectedSection = items.allSectionsDetails[0].columns, allSectionsDetails = items.allSectionsDetails;
            saveFilterCtrl.saveModal = {};
            saveFilterCtrl.saveModal.saveStatus = "initiated";
            saveFilterCtrl.saveModal.message = "";
            saveFilterCtrl.form = {};
            saveFilterCtrl.info = {};
            saveFilterCtrl.saveModal.viewOverwrite = false;
            // Stores whether session is timed out or not
            saveFilterCtrl.info.sessionTimedOut = false;
            //Setting first option as selected in section select
            saveFilterCtrl.info.application = GlobalService.getVal('navLog');
            saveFilterCtrl.form = {
                type: items.allSectionsDetails[0].name
            };
            saveFilterCtrl.info.selected = $filter('filter')(allSectionsDetails, {selected: true})[0];
            SectionsMetaService.getAllViews()
                .then(function (response) {
                    savedFiltersList = response.data.Data;
                    SectionsMetaService.setViewsCount(savedFiltersList.length);
                }, handleSessionTimeout);
            // On focus puts the http:// in the kbase field
            saveFilterCtrl.kbaseOnFocus = function () {
                if (saveFilterCtrl.saveModal.kbase == '') {
                    saveFilterCtrl.saveModal.kbase = 'http://';
                }
            };
            // On blur removes the http:// if the user hasn't typed in an url in the kbase field.
            saveFilterCtrl.kbaseOnBlur = function () {
                if (saveFilterCtrl.saveModal.kbase == 'http://') {
                    saveFilterCtrl.saveModal.kbase = '';
                }
            };
            saveFilterCtrl.getEmptySectionList = function () {
                return emptySectionList;
            };
            // Updates the attributes selected for a given section to show in save view modal.
            saveFilterCtrl.updateColumnAttributes = function (sectionName) {
                if (sectionName) {
                    attributeOfSelectedSection = getSection(sectionName).columns;
                }
            };
            // Closes the modal held by $scope.modal
            saveFilterCtrl.hideModal = function () {
                $modalInstance.close('OK');
            };
            saveFilterCtrl.getSelectedSectionsNew = function () {
                emptySectionList = [];
                var selectedSections = $filter('filter')(SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation()), {
                    'selected': true
                });
                var updatedSectionList = [];
                for (var k in selectedSections) {
                    var eachSectionData = selectedSections[k];
                    if (eachSectionData.a_data) {
                        var sectionKeys = eachSectionData.columns;
                        for (var x in sectionKeys) {
                            var aKey = sectionKeys[x];
                            if (aKey.visible) {
                                updatedSectionList.push(eachSectionData);
                                break;
                            }
                        }
                    }
                }
                //filter empty section
                for (var m = 0; m < selectedSections.length; m++) {
                    var match = false;
                    for (var n = 0; n < updatedSectionList.length; n++) {
                        if (selectedSections[m].label == updatedSectionList[n].label) {
                            match = true;
                            break;

                        }
                    }
                    if (!match) {
                        emptySectionList.push(selectedSections[m]);
                    }
                }
                return updatedSectionList;
            };
            saveFilterCtrl.checkViewName = function () {
                saveFilterCtrl.saveModal.viewOverwrite = false;
                if (savedFiltersList && savedFiltersList.length && savedFiltersList.length > 0) {
                    viewDuplicateCheck();
                } else {
                    getAllSavedViews(true);
                }
            };
            // Gets the values from the globals based on the given key.
            saveFilterCtrl.getValue = function (key) {
                return GlobalService.getVal(key);
            };
            // Saves the current selection as new view with details given by the user.
            saveFilterCtrl.saveFilter = function () {
                saveFilterCtrl.submitted = true;
                if (!saveFilterCtrl.form.saveViewModal.$valid) {
                    return;
                }
                saveFilterCtrl.saveModal.saveStatus = "progress";
                var param = {};
                var data = {};
                var i, j, colstr = "", transpose = "", filterstr = "";
                param.name = saveFilterCtrl.saveModal.name;
                param['public'] = saveFilterCtrl.saveModal.access == 'public' ? true : false;
                param['default'] = false;
                data.desc = escape(saveFilterCtrl.saveModal.desc);
                data.kbase = saveFilterCtrl.saveModal.kbase;
                var sections = SectionsMetaService.getSections(DefaultFilterService.getDefaultObservation());
                for (i in sections) {
                    if (sections[i]['selected'] && !!sections[i].a_data) {
                        for (j in sections[i].columns) {
                            if (sections[i].columns[j].visible) {
                                if (colstr) {
                                    colstr += ",";
                                }
                                colstr += sections[i].table_name + ":" + sections[i].columns[j].field;
                                if (!!sections[i].columns[j].filter) {
                                    if (filterstr) {
                                        filterstr += ",";
                                    }
                                    filterstr += sections[i].table_name + ":" + sections[i].columns[j].title + ":" + (sections[i].columns[j].type === "string" ? '~' : sections[i].columns[j].filter.operator) + ":" + sections[i].columns[j].filter.value;
                                }
                            }
                        }
                    }
                    if (transpose && sections[i].selected && !!sections[i].a_data) {
                        transpose += ",";
                    }
                    if (sections[i].selected && !!sections[i].a_data) {
                        transpose += sections[i].table_name + ":" + (sections[i].isTranspose?sections[i].isTranspose: false);
                    }
                }
                data.cols = "{\'" + colstr + "\'}";
                data.transpose = "{\'" + transpose + "\'}";
                data.filters = "{\'" + filterstr + "\'}";
                // XHR to save the view.
                SectionsMetaService.saveSelectedView(param, data)
                    .then(function (response) {
                        SectionsMetaService.setViewsCount(SectionsMetaService.getViewsCount() + 1);
                        saveFilterCtrl.saveModal.saveStatus = "success";
                        saveFilterCtrl.saveModal.message = "View saved successfully.";
                        UserTrackingService.standard_user_tracking(saveFilterCtrl.info.application, 'Section View', 'Save View', data.cols)
                            .then(function (response) {
                                
                            }, handleSessionTimeout);
                    }, function (response) {
                        handleSessionTimeout(response)
                        saveFilterCtrl.saveModal.saveStatus = "error";
                        saveFilterCtrl.saveModal.message = "Error :" + (response.data && response.data.hasOwnProperty('Msg') ? response.data.Msg : '');
                    });
            };
            // Returns the section object based on user selection.
            function getSection(sectionName) {
                attributeOfSelectedSection = [];
                var totalSections = allSectionsDetails.length;
                for (var i = 0; i < totalSections; i++) {
                    if (allSectionsDetails[i].name == sectionName) {
                        return allSectionsDetails[i];
                    }
                }
            }

            function getAllSavedViews() {
                SectionsMetaService.getAllViews().then(function (response) {
                    savedFiltersList = response.data.Data;
                    viewDuplicateCheck();
                }, handleSessionTimeout);
            }
            
            function viewDuplicateCheck() {
                var found = false;
                for (var i = 0; i < savedFiltersList.length; i++) {
                    if (savedFiltersList[i]["view_name"] == saveFilterCtrl.saveModal.name) {
                        if (savedFiltersList[i]["created_by"] == metaDataService.getUser()['email']) {
                            saveFilterCtrl.saveModal.viewOverwrite = true;
                            continue;
                        } else {
                            found = true;
                            break;
                        }
                    }
                }
                if (found) {
                    // mark it as invalid
                    saveFilterCtrl.form.saveViewModal.viewName.$setValidity('duplicate', false)
                } else {
                    saveFilterCtrl.form.saveViewModal.viewName.$setValidity('duplicate', true)
                }
            }

            function handleSessionTimeout(response) {
                if (!saveFilterCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                    saveFilterCtrl.info.sessionTimedOut = true;
                    saveFilterCtrl.hideModal();
                    ModalService.sessionTimeout();
                }
            }
        }])

// LogiCtrl - To load the external logi dashboards
    .controller('LogiCtrl', ['$scope', '$sce',
        function ($scope, $sce) {
            // sets the given url as the secure url to load on the ui.
            $scope.sceURL = function (url) {
                return $sce.trustAsResourceUrl(url);
            };
        }])
// ConfigCtrl - A single controller for all the configdiff functionality.
    .controller('ConfigCtrl', ['$q', '$scope', '$modal', 'DefaultFilterService', 'ConfigDiffService', 'UtilService', '$filter', 'GlobalService', 'AppService', 'ModalService', '$cookies', 'UserTrackingService', 'InstanceHandler', '$window', 'metaDataService', 'ExplorerService',
        function ($q, $scope, $modal, DefaultFilterService, ConfigDiffService, UtilService, $filter, GlobalService, AppService, ModalService, $cookies, UserTrackingService, InstanceHandler, $window, metaDataService, ExplorerService) {
            var configCtrl = this;
            configCtrl.info = {};
            configCtrl.supportEmail = GlobalService.getVal('supportEmail')
            // Holds the current view name
            configCtrl.info.currentViewName = 'Select view';
            configCtrl.info.ready = false;
            configCtrl.info.userrole = metaDataService.getUser()['role'];
            configCtrl.info.usertype = metaDataService.getUser()['org_type'];
            configCtrl.info['max_obs_limit'] = GlobalService.getVal('max_obs_limit');
            // Maximum limit for the number of observations that can be loaded.
            configCtrl.info['min_obs_limit'] = GlobalService.getVal('min_obs_limit');
            // Minimum limit for the number of observations that can be loaded.
            configCtrl.select = {};
            configCtrl.select['selected'] = true;
            configCtrl.defaultFilters = [];
            // Defines whether gconf info is loaded or not
            configCtrl.info.loaded = false;
            configCtrl.info.sysIdIndex = -1;
            configCtrl.info.selectedSystemId = null;
            configCtrl.info.sysIdLimit = GlobalService.getVal('max_sysid_limit');
            // Stores whether session is timed out or not
            configCtrl.info.sessionTimedOut = false;
            configCtrl.info.setObservationNull = false;
            configCtrl.info.selectedObsGroup = null;
            configCtrl.info.application = GlobalService.getVal('navLog');
            ConfigDiffService.setSectionLoading(true);
            configCtrl.resultLoading = true;

            $scope.$watch('configCtrl.resultLoading', function() {
                if(!configCtrl.resultLoading){
                    AppService.hidePanelLoading();
                }
            })
            //Event to check when application is ready
             $scope.$on('AppLoadEvent-apps', function (event, reload) {
                if(!configCtrl.resultLoading){  
                    AppService.hidePanelLoading();
                }
                if(reload) {
                    $scope.init();
                }
             });

            configCtrl.showSysid2DD = function() {
                var bool = metaDataService.isSysid2Enable();
                return bool;
            };            
            // Returns the current view.
            configCtrl.getCurrentViewName = function () {
                return ConfigDiffService.getViewName();
            };
            // Gets the values from the globals based on the given key.
            configCtrl.getValue = function (key) {
                return GlobalService.getVal(key);
            };
            configCtrl.getSysId2Tooltip = function() {
            	var manufacturer = GlobalService.getVal('manufacturer');
            	var sysId2 = GlobalService.getVal('systemId2');
            	if(sysId2.customer.hasOwnProperty(manufacturer)) {
            		return sysId2.customer[manufacturer];
            	} else {
            		return sysId2.common;
            	}
            };
            // Returns true if the section has any filter applied on it.
            configCtrl.hasFilter = function (section) {
                var bool = false, i, keys;
                if (!!section.filter) {
                    keys = Object.keys(section.filter);
                    if (keys.length != 0) {
                        for (i in keys) {
                            if (!!section.filter[keys[i]]['value'] || section.filter[keys[i]]['value'] === 0) {
                                bool = true;
                            }
                        }
                    }
                }
                return bool;
            };
            // Resets the applied filters for any given section.
            configCtrl.resetFilter = function (section) {
                ConfigDiffService.resetFilter(section);
                resetViewCheck();
            };

            // XHR to get the ec and sys info
            ConfigDiffService.getSavedViews()
                .then(function (response) {
                    configCtrl.views = response.data.Data;
                    ConfigDiffService.setViewsCount(configCtrl.views.length);
                }, handleSessionTimeout);
             
            $scope.init = function() {
                configCtrl.info.ready = true;
                ConfigDiffService.setSectionLoading(false);

                configCtrl.resultLoading = false;

                configCtrl.info.ready = false;
                // XHR to load all the sections meta data.
                ConfigDiffService.getAll()
                    .then(function (response) {
                        obs = configCtrl.info['defaultObservation'];
                        sorted_data = $filter("filter")(response.data.Data, {
                            "namespace_type": "!UNPARSED"
                        });
                        sorted_data = $filter("filter")(sorted_data, {
                            "namespace_type": "!EVENT"
                        });
                        sorted_data = $filter("orderBy")(sorted_data, "label");
                        sections = sorted_data;
                        ConfigDiffService.setSections(sections);
                        // XHR to check if there is a default view set for the user
                        ConfigDiffService.getDefault()
                            .then(function (response) {
                                var dashboardView = ConfigDiffService.getLoadView();
                                if(!!dashboardView) {
                                    configCtrl.loadDashboardView(dashboardView, response.data.Data, sections);
                                } else {
                                    ConfigDiffService.setSectionLoading(false);
                                    configCtrl.loadDefaultView(response.data.Data, sections);
                                }                                        
                                if (configCtrl.info.setObservationNull == true) {
                                    configCtrl.info.setObservationNull = false;
                                    configCtrl.info['defaultObservation'] = null;
                                    DefaultFilterService.setDefaultObservation(null);
                                    DefaultFilterService.setSelectedObservation(null);
                                }
                                configCtrl.info.ready = true;
                            }, handleSessionTimeout);
                    }, function (response) {
                        sections = response.data.Data;
                        handleSessionTimeout(response)
                    });
            };
            
            $scope.$on("LoadConfigDiffView", function(event) {
            	$scope.init();
            });
            
            $scope.init();

            configCtrl.moveThroughSysId = function ($event) {
                var sysIds = configCtrl.info.defaultEndCust.sys_ids;
                if (!!configCtrl.sysfilter) {
                    sysIds = $filter('filter')(configCtrl.info.defaultEndCust.sys_ids, configCtrl.sysfilter);
                }
                if ($event.keyCode == 40) {
                    if (configCtrl.info.sysIdIndex == -1 || configCtrl.info.sysIdIndex == (sysIds.length - 1)) {
                        configCtrl.info.sysIdIndex = 0;
                    } else {
                        configCtrl.info.sysIdIndex++;
                    }
                    for (var i in sysIds) {
                        sysIds[i]['selected'] = false;
                    }
                    sysIds[configCtrl.info.sysIdIndex]['selected'] = true;
                    configCtrl.info.selectedSystemId = sysIds[configCtrl.info.sysIdIndex];
                } else if ($event.keyCode == 38) {
                    if (configCtrl.info.sysIdIndex == -1 || configCtrl.info.sysIdIndex == 0) {
                        configCtrl.info.sysIdIndex = sysIds.length - 1;
                    } else {
                        configCtrl.info.sysIdIndex--;
                    }
                    for (var i in configCtrl.info.defaultEndCust.sys_ids) {
                        configCtrl.info.defaultEndCust.sys_ids[i]['selected'] = false;
                    }
                    sysIds[configCtrl.info.sysIdIndex]['selected'] = true;
                    configCtrl.info.selectedSystemId = sysIds[configCtrl.info.sysIdIndex];
                } else if ($event.keyCode == 13) {
                    configCtrl.info.defaultSysId = configCtrl.info.selectedSystemId;
                    configCtrl.changeSysId();
                    configCtrl.resetMoveThroughSysId();
                    angular.element('.btn-group.open .dropdown-toggle').dropdown('toggle');
                    if (!!configCtrl.sysfilter) {
                        configCtrl.sysfilter.sys_id = "";
                    }
                } else {
                    configCtrl.resetMoveThroughSysId();
                }
            };
            configCtrl.resetMoveThroughSysId = function () {
                configCtrl.info.sysIdIndex = -1;
                configCtrl.info.selectedSystemId = null;
                for (var i in configCtrl.info.defaultEndCust.sys_ids) {
                    configCtrl.info.defaultEndCust.sys_ids[i]['selected'] = false;
                }
            };
            configCtrl.getSectionsLoading = function () {
                return ConfigDiffService.getSectionLoading();
            };
            function setSelectedObsGroup() {
                if (DefaultFilterService.getSelectedObsGrp()) {
                    configCtrl.info.selectedObsGroup = DefaultFilterService.getSelectedObsGrp();
                }
            }
            function checkSysIdMatch(sysId) {
                for (var i = 0; i < configCtrl.defaultFilters[0].sys_ids.length; i++) {
                    if (configCtrl.defaultFilters[0].sys_ids[i].sys_id == sysId) {
                        configCtrl.info['defaultSysId'] = configCtrl.defaultFilters[0].sys_ids[i];
                        DefaultFilterService.setDefaultSysId(configCtrl.info['defaultSysId']);
                        break;
                    }
                }
            }
            configCtrl.selectObsGroup = function (obsgrp) {
                configCtrl.info.selectedObsGroup = obsgrp;
                DefaultFilterService.setSelectedObsGrp(obsgrp);
            };
            // Returns the current sections object holding all the sections data.
            configCtrl.getSections = function () {
                return ConfigDiffService.getSections();
            };
            // Keeps the shownAll field in sync with column selection by the user for the given section.
            configCtrl.changeShownAll = function (section) {
                var key, bool = true, no_cols = true;
                for (key in section.keys) {
                    if (!section.keys[key].visible) {
                        bool = false;
                        break;
                    }
                }
                section.shownAll = bool;
                for (key in section.keys) {
                    if (section.keys[key].visible) {
                        no_cols = false;
                        break;
                    }
                }
                var cols_list = "";
                for (key in section.keys) {
                    if (section.keys[key].visible) {
                        if(cols_list == "") {
                            cols_list += section.keys[key].col_name;
                        } else {
                            cols_list += "," + section.keys[key].col_name;
                        }
                    }
                }
                
                section.no_cols = no_cols;
                resetViewCheck();
                UserTrackingService.standard_user_tracking(configCtrl.info.application, 'Config Diff', 'Columns selected', "{\'" + section.label + "\':\'" + cols_list + "\'}")
                        .then(successHandler, handleSessionTimeout);
            };
            // Remove a section from the selection and logs the user activity.
            configCtrl.removeSection = function (section) {
                section['default'] = false;
                section['selected'] = false;
                resetViewCheck();
                UserTrackingService.standard_user_tracking(configCtrl.info.application, 'Config Diff', 'Remove Section', "{\'" + section['name'] + "\'}")
                    .then(function (response) {
                        
                    }, handleSessionTimeout);
            };
            // Toggles the visibility of all the columns for a given section.
            configCtrl.toggleAll = function (section) {
                var key;
                for (key in section.keys) {
                    section.keys[key].visible = !!section.shownAll;
                }
                var cols_list = "";
                for (key in section.keys) {
                    if (section.keys[key].visible) {
                        if(cols_list == "") {
                            cols_list += section.keys[key].col_name;
                        } else {
                            cols_list += "," + section.keys[key].col_name;
                        }
                    }
                }
                if (!section.shownAll) {
                    section.no_cols = true;
                } else {
                    section.no_cols = false;
                }
                resetViewCheck();
                UserTrackingService.standard_user_tracking(configCtrl.info.application, 'Config Diff', 'Columns selected', "{\'" + section.label + "\':\'" + cols_list + "\'}")
                        .then(successHandler, handleSessionTimeout);
            };
            // Returns the kb link for the current view.
            configCtrl.getKbLink = function () {
                return ConfigDiffService.getKbLink();
            };
            // Cancel button click handler for selection of sections in the config diff
            configCtrl.cancel = function () {
                configCtrl.visible = false;
                 var i, sections = ConfigDiffService.getSections();
                for (i in sections) {
                    sections[i]['default'] = sections[i].selected;
                }
                ConfigDiffService.setSections(sections);
               
            };
            // Done button click handler for selection of sections in the config diff
            configCtrl.done = function (event) {
                if (!configCtrl.info.defaultObservation) {
                    ModalService.alertBox({msg: 'Please select observation!'});
                    return;
                }
                var section, error_txt = "", sections = ConfigDiffService.getSections();
                if (configCtrl.info['defaultEndCust'] === null) {
                    error_txt += "Please select End Customer.\n";
                }
                if (configCtrl.info['defaultSysId'] === null) {
                    error_txt += "Please select System ID.\n";
                }
                if (error_txt.length > 0) {
                    configCtrl.visible = false;
                    for (section in sections) {
                        if (sections[section]['selected'] == true) {
                            sections[section]['default'] = true;
                        } else {
                            sections[section]['default'] = false;
                        }
                    }
                    ConfigDiffService.setSections(sections);
                    return;
                } else {
                    var sections_list = "";
                    for (section in sections) {
                        if (sections[section]['default'] == true) {
                            if (sections_list == "") {
                                sections_list += sections[section]['label'];
                            }
                            else {
                                sections_list += "," + sections[section]['label'];
                            }
                            if (!sections[section].selected) {
                                resetViewCheck();
                            }
                            if(!sections[section].selected) {
                                ConfigDiffService.loadData(sections[section], $scope, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                            }
                            sections[section].selected = true;
                        } else {
                            if (sections[section].selected == true) {
                                resetViewCheck();
                            }
                            sections[section].selected = false;
                        }
                    }
                    UserTrackingService.standard_user_tracking(configCtrl.info.application, 'Config Diff', 'Sections Selected', "{\'" + sections_list + "\'}")
                        .then(function(response) {
                            
                        }, handleSessionTimeout);
                    ConfigDiffService.setSections(sections);
                    configCtrl.visible = false;
                }
            };
            
            
            configCtrl.loadDashboardView = function(dashboardView, defView, sections) {
                if(dashboardView.type == "custom") {
                    var view = dashboardView.view;
                    view.view_name = "Select View";
                    ConfigDiffService.applyView(view, $scope, sections, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                    configCtrl.info.currentViewName = view.view_name;
                    ConfigDiffService.setSectionLoading(false);
                } else if (dashboardView.type == "savedView") {
                    ConfigDiffService.getAllViews().then(function(response) {
                        var view = $filter('filter')(response.data.Data, {view_name: dashboardView.view}, true) || [];
                        if(view.length == 1) {
                            firstTimeLoaded = true;
                            configCtrl.loadView(view[0]);
                        } else {
                            ConfigDiffService.setSectionLoading(false);
                            ModalService.alertBox({msg: "View not found"});
                            if(!firstTimeLoaded) {
                                configCtrl.loadDefaultView(defView, sections);
                            }
                        }
                    }, function(response) {
                        ConfigDiffService.setSectionLoading(false);
                        ModalService.alertBox({msg: "View not found"});
                        if(!firstTimeLoaded) {
                            configCtrl.loadDefaultView(defView, sections);
                        }
                    });
                }
                ConfigDiffService.setLoadView(null);
            };            
            configCtrl.getSysId2 = function() {
                return ConfigDiffService.getSysId2();
            };            
            configCtrl.getSysId2List = function() {
                configCtrl.info.sid2 = DefaultFilterService.getSubSys();
                if(configCtrl.info.sid2 && configCtrl.info.sid2.length && configCtrl.info.sid2.length > 0){
                    if(!ConfigDiffService.getSysId2()){
                        ConfigDiffService.setSysId2(configCtrl.info.sid2[0]);
                    }
                }
                return configCtrl.info.sid2;
            };
            configCtrl.changeSubSysId = function(sid){
                if(ConfigDiffService.getSysId2() == sid){
                    return;
                }
                ConfigDiffService.setSysId2(sid);
                var sections = ConfigDiffService.getSections();
                 var sections_list = "";
                    for (section in sections) {
                        if (sections[section]['default'] == true) {
                            if (sections_list == "") {
                                sections_list += sections[section]['label'];
                            }
                            else {
                                sections_list += "," + sections[section]['label'];
                            }
                           /* if (!sections[section].selected) {
                                resetViewCheck();
                            }*/
                            //if(!sections[section].selected) {
                                ConfigDiffService.loadData(sections[section], $scope, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                            //}
                            sections[section].selected = true;
                        } else {
                            if (sections[section].selected == true) {
                                resetViewCheck();
                            }
                            sections[section].selected = false;
                        }
                    }
                    ConfigDiffService.setSections(sections);
            };

            configCtrl.loadDefaultView = function(defView, sections) {
                firstTimeLoaded = true;
                if (defView) {
                    // if there is a default view set as default then apply that view.
                    // configCtrl.info.currentViewName = defView.view_name;
                    // ConfigDiffService.applyView(defView, $scope, sections, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                } else {
                    // configCtrl.info.currentViewName = 'Select view';
                    // var sectionsCount = 0;
                    // var sectionsLoadCount = 0;
                    // for (section in sections) {
                        // if (sections[section]['default'] == true) {
                            // sections[section].selected = true;
                            // sectionsCount++;
                            // sections[section].deferred = $q.defer();
                            // ConfigDiffService.loadData(sections[section], $scope, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation'], sections[section].deferred);
                            // sections[section].deferred.promise.then(function () {
                                // sectionsLoadCount = sectionsLoadCount + 1;
                                // if (configCtrl.info.currentViewName != 'Select view' && sectionsLoadCount == sectionsCount) {
                                    // configCtrl.loadView(configCtrl.info.currentView);
                                // }
                            // }, function () {
                                // sectionsLoadCount = sectionsLoadCount + 1;
                                // if (configCtrl.info.currentViewName != 'Select view' && sectionsLoadCount == sectionsCount) {
                                    // configCtrl.loadView(configCtrl.info.currentView);
                                // }
                            // });
                        // } else {
                            // sections[section].selected = false;
                        // }
                    // }
                }
                // if (defView) {
                    // configCtrl.info.currentViewName = defView.view_name;
                    // ConfigDiffService.applyView(defView, $scope, sections, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                // } else {
                    // for (section in sections) {
                        // if (sections[section]['default'] == true) {
                            // sections[section].selected = true;
                            // ConfigDiffService.loadData(sections[section], $scope, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                        // } else {
                            // sections[section].selected = false;
                        // }
                    // }
                // }
                // ConfigDiffService.setSectionLoading(false);
            };
            
            var firstTimeLoaded = false;
            
            // Angular watcher to watch the changes to selected observation
            $scope.$watch("configCtrl.info['defaultObservation']", function (newVal, oldVal) {
                configCtrl.info.defaultObservation = DefaultFilterService.getDefaultObservation();
                //need to remove: HACK
                return;
              /*  var sorted_data, i, obs;
                var section, sections, old_sections;
                configCtrl.info['selected'] = undefined;
                if (!!newVal && !!newVal['obs_time']) {
                    var isSections = ConfigDiffService.getSections();
                    if (obs == undefined && !(isSections && isSections.length > 0)) {
                        // First time
                        configCtrl.info['file_name'] = newVal['file_name'];
                        configCtrl.info.ready = false;
                        // XHR to load all the sections meta data.
                        ConfigDiffService.getAll()
                            .then(function (response) {
                                obs = configCtrl.info['defaultObservation'];
                                sorted_data = $filter("filter")(response.data.Data, {
                                    "namespace_type": "!UNPARSED"
                                });
                                sorted_data = $filter("filter")(sorted_data, {
                                    "namespace_type": "!EVENT"
                                });
                                sorted_data = $filter("orderBy")(sorted_data, "label");
                                sections = sorted_data;
                                ConfigDiffService.setSections(sections);
                                // XHR to check if there is a default view set for the user
                                ConfigDiffService.getDefault()
                                    .then(function (response) {
                                        var dashboardView = ConfigDiffService.getLoadView();
                                        if(!!dashboardView) {
                                            configCtrl.loadDashboardView(dashboardView, response.data.Data, sections);
                                        } else {
                                            ConfigDiffService.setSectionLoading(false);
                                            configCtrl.loadDefaultView(response.data.Data, sections);
                                        }
                                        
                                        // if (response.data.Data) {
                                            // // if there is a default view set as default then apply that view.
                                            // configCtrl.info.currentViewName = response.data.Data.view_name;
                                            // ConfigDiffService.applyView(response.data.Data, $scope, sections, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                                        // } else {
                                            // configCtrl.info.currentViewName = 'Select view';
                                            // var sectionsCount = 0;
                                            // var sectionsLoadCount = 0;
                                            // for (section in sections) {
                                                // if (sections[section]['default'] == true) {
                                                    // sections[section].selected = true;
                                                    // sectionsCount++;
                                                    // sections[section].deferred = $q.defer();
                                                    // ConfigDiffService.loadData(sections[section], $scope, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation'], sections[section].deferred);
                                                    // sections[section].deferred.promise.then(function () {
                                                        // sectionsLoadCount = sectionsLoadCount + 1;
                                                        // if (configCtrl.info.currentViewName != 'Select view' && sectionsLoadCount == sectionsCount) {
                                                            // configCtrl.loadView(configCtrl.info.currentView);
                                                        // }
                                                    // }, function () {
                                                        // sectionsLoadCount = sectionsLoadCount + 1;
                                                        // if (configCtrl.info.currentViewName != 'Select view' && sectionsLoadCount == sectionsCount) {
                                                            // configCtrl.loadView(configCtrl.info.currentView);
                                                        // }
                                                    // });
                                                // } else {
                                                    // sections[section].selected = false;
                                                // }
                                            // }
                                        // }
                                        if (configCtrl.info.setObservationNull == true) {
                                            configCtrl.info.setObservationNull = false;
                                            configCtrl.info['defaultObservation'] = null;
                                            DefaultFilterService.setDefaultObservation(null);
                                            DefaultFilterService.setSelectedObservation(null);
                                        }
                                        configCtrl.info.ready = true;
                                        // ConfigDiffService.setSectionLoading(false);
                                    }, handleSessionTimeout);
                            }, function (response) {
                                sections = response.data.Data;
                                handleSessionTimeout(response)
                            });
                    } else {
                        configCtrl.info.ready = true;
                        // if sections meta data is already present in the cache.
                        sections = ConfigDiffService.getSections();
                        ConfigDiffService.setSectionLoading(false);
                        // if there's an applied view
                        var dashboardView = ConfigDiffService.getLoadView();
                        if(!!dashboardView) {
                            for (var i in sections) {
                                sections[i]['selected'] = false;
                                sections[i]['default'] = false;
                                sections[i]['count'] = 2;
                                ConfigDiffService.resetFilter(sections[i]);
                            }
                            ConfigDiffService.setSections(sections);
                            ConfigDiffService.setAppliedView(null);
                            configCtrl.info.currentViewName = 'Select view';
                            configCtrl.loadDashboardView(dashboardView, null, sections);
                        } else {
                            if (!!ConfigDiffService.getAppliedView()) {
                                // then apply that view effectively for the selected observation.
                                configCtrl.info.currentViewName = ConfigDiffService.getAppliedView()['view_name'];
                                ConfigDiffService.applyView(ConfigDiffService.getAppliedView(), $scope, sections, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                            } else {
                                // if there's no applied view.
                                for (section in sections) {
                                    if (sections[section]['selected'] == true) {
                                        delete sections[section].data;
                                        // delete sections[section].keys;
                                        delete sections[section].ref_data;
                                        ConfigDiffService.loadData(sections[section], $scope, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                                    } else {
                                        sections[section].selected = false;
                                        sections[section]['default'] = false;
                                    }
                                }
                            }
                        }
                        
                        if (configCtrl.info.setObservationNull == true) {
                            configCtrl.info.setObservationNull = false;
                            configCtrl.info['defaultObservation'] = null;
                            DefaultFilterService.setDefaultObservation(null);
                            DefaultFilterService.setSelectedObservation(null);
                        }
                    }
                    ConfigDiffService.setSections(sections);
                }*/
            });
            // XHR to load the grouping meta info.
            DefaultFilterService.getObsGroups()
                .then(function (response) {
                    configCtrl.obsGroups = response.data.Data;
                }, function (response) {
                    configCtrl.obsGroups = response.data.Data;
                });
            // Increments the obs count for the configdiff
            configCtrl.incObsCount = function (section) {
                if (section.count < configCtrl.info.max_obs_limit) {
                    section.count = parseInt(section.count) + 1;
                    delete section.data;
                    delete section.ref_data;
                    ConfigDiffService.loadData(section, $scope, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                    UserTrackingService.standard_user_tracking(configCtrl.info.application, 'Config Diff', 'Add Observation', "{\'" + section['name'] + "\'}")
                        .then(function (response) {
                            
                        }, handleSessionTimeout);
                }
            };
            // Decrements the obs count for the configdiff
            configCtrl.decObsCount = function (section) {
                if (section.count > configCtrl.info.min_obs_limit) {
                    section.count -= 1;
                    delete section.data;
                    delete section.ref_data;
                    ConfigDiffService.loadData(section, $scope, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                    UserTrackingService.standard_user_tracking(configCtrl.info.application, 'Config Diff', 'Remove Observation', "{\'" + section['name'] + "\'}")
                        .then(function (response) {
                            
                        }, handleSessionTimeout);
                }
            };
            // Triggered when then ec changes
            configCtrl.changeEndCust = function () {
                configCtrl.info['defaultObservation'] = null;
                configCtrl.info['defaultSysId'] = null;
                DefaultFilterService.setDefaultEndCust(configCtrl.info['defaultEndCust']);
            };
            // Triggered when the sys changes
            configCtrl.changeSysId = function () {
                if (!!configCtrl.sysfilter) {
                    configCtrl.sysfilter.sys_id = "";
                }
                if (configCtrl.info['defaultSysId'].observations === undefined) {
                    DefaultFilterService.getObservations(configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'])
                        .then(function (response) {
                            var obs, obscnt;
                            configCtrl.info['defaultSysId'].observations = [];
                            for (obscnt in response.data.Data) {
                                obs = {};
                                obs['obs_time'] = response.data.Data[obscnt].obs_ts;
                                var bundleName = response.data.Data[obscnt].bundle_name;
                                obs['obs_url'] = response.data.Data[obscnt].bundle_name;
                                obs['bundle_name'] = bundleName;
                                obs['file_name'] = response.data.Data[obscnt].file_name;
                                configCtrl.info['defaultSysId'].observations.push(obs);
                            }
                            getObservationsTimeRange('This Month');
                            getObservationsTimeRange('This Week');
                            getObservationsTimeRange('Last 2 Days');
                        }, handleSessionTimeout);
                }
                if (configCtrl.info['defaultSysId'].lastNObservations === undefined) {
                    DefaultFilterService.getNObservations(configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], GlobalService.getVal('no_of_bundles'))
                        .then(function (response) {
                            var obs;
                            configCtrl.info['defaultSysId'].lastNObservations = [];
                            for (var i = 0; i < response.data.Data.length; i++) {
                                obs = {};
                                obs['obs_time'] = response.data.Data[i].obs_ts;
                                var bundleName = response.data.Data[i].bundle_name;
                                obs['obs_url'] = response.data.Data[i].bundle_name;
                                obs['bundle_name'] = bundleName;
                                configCtrl.info['defaultSysId'].lastNObservations.push(obs);
                            }
                        }, handleSessionTimeout);
                }
                configCtrl.info['defaultObservation'] = null;
                DefaultFilterService.setDefaultObservation(null);
                DefaultFilterService.setSelectedObservation(null);
                DefaultFilterService.setDefaultSysId(configCtrl.info['defaultSysId']);
            };
            // Sets the given observation as the current observation
            configCtrl.setDefaultObservation = function (obs) {
                ConfigDiffService.setAppliedView(null);
                configCtrl.info['defaultObservation'] = obs;
                DefaultFilterService.setDefaultObservation(configCtrl.info['defaultObservation']);
                DefaultFilterService.setSelectedObservation(configCtrl.info['defaultObservation']);
            };

            // Returns all the observations splicing only the bundle names from the obs_url.
            configCtrl.getObservations = function (obsgrp) {
                var obsMethod;
                if (!obsgrp) return;
                obsMethod = obsgrp.replace(/\s/g, '');
                obsMethod = 'get' + obsMethod + 'Observations';
                obsMethod = observationObj[obsMethod];
                if (typeof obsMethod === 'function') {
                    return obsMethod();
                } else {
                    ModalService.alertBox({msg: 'Not function'});
                }
            };
            function getObservationsTimeRange(obsgrp) {
                var fromTime, toTime;
                var currentDateobj = new Date();
                var Day = currentDateobj.getUTCDate();
                var Hour = currentDateobj.getUTCHours();
                var Month = 1 + (currentDateobj.getUTCMonth());
                var Year = currentDateobj.getUTCFullYear();
                switch (obsgrp) {
                    // These cases are not used according to unit tests --- still keeping for future reference
                    // case 'Last Hour':
                        // toTime = $filter('utcDateTZ')(currentDateobj);
                        // var tempTime = new Date(currentDateobj.setUTCHours(currentDateobj.getUTCHours() - 1));
                        // fromTime = $filter('utcDateTZ')(tempTime);
                        // break;
                    // case 'Last 12 Hour':
                        // toTime = $filter('utcDateTZ')(currentDateobj);
                        // var tempTime = new Date(currentDateobj.setUTCHours(currentDateobj.getUTCHours() - 12));
                        // fromTime = $filter('utcDateTZ')(tempTime);
                        // break;
                    // case 'Yesterday':
                        // var yesterdayDateTime = new Date(currentDateobj.setUTCDate(currentDateobj.getUTCDate() - 1));
                        // yesterdayDateTime.setUTCHours(0);
                        // yesterdayDateTime.setUTCMinutes(0);
                        // yesterdayDateTime.setUTCSeconds(0);
                        // toTime = $filter('utcDateTZ')(yesterdayDateTime);
                        // var yesterdayDateTime2 = new Date(yesterdayDateTime);
                        // var tempTime = new Date(yesterdayDateTime2);
                        // tempTime.setUTCHours(23);
                        // tempTime.setUTCMinutes(59);
                        // tempTime.setUTCSeconds(59);
                        // fromTime = $filter('utcDateTZ')(tempTime);
                        // break;
                    case 'Last 2 Days':
                        toTime = $filter('utcDateTZ')(currentDateobj);
                        var tempTime = new Date(currentDateobj.setUTCDate(currentDateobj.getUTCDate() - 2));
                        tempTime.setUTCHours(0);
                        tempTime.setUTCMinutes(0);
                        tempTime.setUTCSeconds(0);
                        fromTime = $filter('utcDateTZ')(tempTime);
                        break;
                    case 'This Month':
                        toTime = $filter('utcDateTZ')(currentDateobj);
                        var tempTime = new Date(currentDateobj.setUTCDate(1));
                        tempTime.setUTCHours(0);
                        tempTime.setUTCMinutes(0);
                        tempTime.setUTCSeconds(0);
                        fromTime = $filter('utcDateTZ')(tempTime);
                        break;
                    case 'This Week':
                        toTime = $filter('utcDateTZ')(currentDateobj);
                        var d = new Date();
                        var day = d.getUTCDay();
                        diff = d.getUTCDate() - day + (day == 0 ? -6 : 1);
                        tempTime = new Date(d.setUTCDate(diff));
                        tempTime.setUTCHours(0);
                        tempTime.setUTCMinutes(0);
                        tempTime.setUTCSeconds(0);
                        fromTime = $filter('utcDateTZ')(tempTime);
                        break;
                }
                DefaultFilterService.getObservationsTimeRange(configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], fromTime, toTime)
                    .then(function (response) {
                        var obs, obscnt;
                        if(Array.isArray(response.data.Data)) {
                            for (obscnt in response.data.Data) {
                                obs = {};
                                obs['obs_time'] = response.data.Data[obscnt].obs_ts;
                                var bundleName = response.data.Data[obscnt].bundle_name;
                                obs['bundle_name'] = bundleName;
                                obs['file_name'] = response.data.Data[obscnt].file_name;
                                var found = false;
                                for (var k = 0; k < configCtrl.info['defaultSysId'].observations.length; k++) {
                                    if (configCtrl.info['defaultSysId'].observations[k].bundle_name == obs.bundle_name) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    configCtrl.info['defaultSysId'].observations.push(obs);
                                }
                            }
                        }
                    }, handleSessionTimeout);
            }
            
            configCtrl.exportAllPDF = function() {
                if (!selectedSectionsNew().length) {
                    ModalService.alertBox({msg: 'Please select at least one section!'});
                    return;
                }
                if (!selectedSectionsData().length) {
                    ModalService.alertBox({msg: 'Please select at least one column in a section!'});
                    return;
                }
                var selectedSections = $filter('filter')(ConfigDiffService.getSections(), {
                    'selected': true
                });
                var sectionDataAvailable = false;
                for (var i in selectedSections) {
                    if (!!selectedSections[i].data) {
                        sectionDataAvailable = true;
                        break;
                    }
                }
                if (!sectionDataAvailable) {
                    ModalService.alertBox({msg: 'Please select a section with data'});
                    return;
                }
                exportPDF();
            };
            
            function exportPDF() {
                var selectedSections = selectedSectionsNew() || [];
                var sectionAdded = false;
                var pdf = new jsPDF('p', 'pt', 'a1');
                angular.forEach(selectedSections, function(section) {
                    if(Array.isArray(section.data) && section.data.length > 1) {
                        var observationsLength = section.data.length;
                        var selectedCols = $filter('filter')(section.keys, {visible: true}) || [];
                        if(!!selectedCols.length) {
                            var pageAdded = false;
                            if(pdf.autoTableEndPosY() > 2250) {
                                pdf.addPage();
                                pageAdded = true;
                            }
                            
                            var startY = (!!sectionAdded && !pageAdded ? pdf.autoTableEndPosY() : 0) + 60;
                            pdf.text(section.label, 40, startY - 10);
                            pageAdded = false;

                            var cols = [{
                                title: "Observations (" + observationsLength +  ")",
                                key: "obs"
                            }];
                            var colCount = 0;
                            angular.forEach(section.data, function(row) {
                                cols.push({
                                    title: row.obs,
                                    key: "col" + colCount
                                });
                                colCount++;
                            });
                            var rows = [], config = {};
                            angular.forEach(selectedCols, function(col) {
                                var rowObj = {};
                                rowObj["obs"] = col.col_name;
                                for(var i = 0; i < observationsLength; i++) {
                                    rowObj["col" + i] = section.data[i]['data'][col.key];
                                }
                                rows.push(rowObj);
                            });
                            config = {
                                startY: startY,
                                tableWidth: 'auto',
                                columnWidth: 'auto',
                                styles: {
                                    overflow: 'linebreak'
                                }, createdCell: function (cell, data) {
                                    if (data.column.dataKey === 'obs') {
                                       cell.styles.textColor = [41, 128, 185];
                                    }
                                    if (!(data.column.dataKey === 'obs' || data.column.dataKey === 'col0')) {
                                        if(section.ref_data[selectedCols[data.row.index].key].toString() != cell.text) {
                                            data.row.cells[data.column.dataKey].styles.fillColor = data.row.index % 2 == 0 ? [61, 148, 205] : [71, 158, 215];
                                            data.row.cells[data.column.dataKey].styles.textColor = 255;
                                            data.row.cells.obs.styles.textColor = [0, 87, 144];
                                            data.row.cells.obs.styles.fontSize = 11;
                                        }
                                    }  
                                }
                            };
                            
                            pdf.autoTable(cols, rows, config);
                            sectionAdded = true;
                        }
                    }
                });
                if(!!sectionAdded) {
                    pdf.save("Sections.pdf");
                }
            }

            // Shows up the modal for saving the view in configdiff.
            configCtrl.showSaveViewModal = function () {
                if (ConfigDiffService.getViewsCount() >= GlobalService.getVal('max_views_limit')) {
                    ModalService.alertBox({msgKey: 'max_views_msg'});
                    return;
                }
                var allSectionsDetails = selectedSectionsData();
                if (!selectedSectionsNew().length) {
                    ModalService.alertBox({msg: 'Please select at least one section!'});
                    return;
                }
                if (!selectedSectionsData().length) {
                    ModalService.alertBox({msg: 'Please select at least one column in a section!'});
                    return;
                }
                var selectedSections = $filter('filter')(ConfigDiffService.getSections(), {
                    'selected': true
                });
                var sectionDataAvailable = false;
                for (var i in selectedSections) {
                    if (!!selectedSections[i].data) {
                        sectionDataAvailable = true;
                        break;
                    }
                }
                if (!sectionDataAvailable) {
                    ModalService.alertBox({msg: 'Please select a section with data'});
                    return;
                }
                $modal.open({
                    templateUrl: 'partials/config-diff-save-view.html',
                    controller: 'SaveConfigFilter as saveConfigCtrl',
                    resolve: {
                        items: function () {
                            return {
                                allSectionsDetails: allSectionsDetails
                            };
                        }
                    }
                })
            };
            function selectedSectionsNew() {
                var selectedSections = $filter('filter')(ConfigDiffService.getSections(), {
                    'selected': true
                });
                return selectedSections;
            }

            function selectedSectionsData() {
                var selectedSections = $filter('filter')(ConfigDiffService.getSections(), {
                    'selected': true
                });
                var updatedSectionList = [];
                for (var k in selectedSections) {
                    var eachSectionData = selectedSections[k];
                    if (eachSectionData.data) {
                        var sectionKeys = eachSectionData.keys;
                        for (var x in sectionKeys) {
                            var aKey = sectionKeys[x];
                            if (aKey.visible) {
                                updatedSectionList.push(eachSectionData);
                                break;
                            }
                        }
                    } else {
                        updatedSectionList.push(eachSectionData);
                    }
                }
                return updatedSectionList;
            };
            // Fetches the list of saved views
            configCtrl.getSavedViews = function () {
                configCtrl.views = [];
                configCtrl.v_loading = true;
                // XHR to fetch the list of saved views.
                ConfigDiffService.getSavedViews()
                    .then(function (response) {
                        configCtrl.views = response.data.Data;
                        ConfigDiffService.setViewsCount(configCtrl.views.length);
                        configCtrl.v_loading = false;
                        configCtrl.info['filterBtn'] = 'all';
                    }, function (response) {
                        configCtrl.v_loading = false;
                        handleSessionTimeout(response);
                    });
            };
            // Filters the list of saved views based on the user selection on the UI.
            configCtrl.filterByScope = function (view) {
                if (configCtrl.info.filterBtn == 'all')
                    return true;
                else if (configCtrl.info.filterBtn == 'my' && view.created_by == configCtrl.getLoggedInUserName())
                    return true;
                else if (configCtrl.info.filterBtn == 'others' && view.created_by != configCtrl.getLoggedInUserName())
                    return true;
                else
                    return false;
            };
            // Returns the username of the current user.
            configCtrl.getLoggedInUserName = function () {
                return metaDataService.getUser()['email'];
            };
            // Set/unset the given view as default and tracks the user activity.
            configCtrl.setDefaultView = function (view, event) {
                var i;
                // Check if the given view is default
                if (!!!view['default']) {
                    // if given view is not default
                    view.inProgress = true;
                    // XHR to set given view as default.
                    ConfigDiffService.setDefault(view)
                        .then(function (response) {
                            for (i in configCtrl.views) {
                                configCtrl.views[i]['default'] = false;
                            }
                            if (response.data.Status == "Success") {
                                view['default'] = true;
                                UserTrackingService.standard_user_tracking(configCtrl.info.application, 'Config Diff', 'Set Default View', "{\'" + view['view_name'] + "\'}")
                                    .then(function (response) {
                                        
                                    }, handleSessionTimeout);
                            }
                            view.inProgress = false;
                        }, function (response) {
                            if(!handleSessionTimeout(response)) {
                                ModalService.alertBox({msg: 'Failed to set as default. Kindly try after sometime.'});
                            }
                            view.inProgress = false;
                        });
                } else {
                    // if the given view is not the default.
                    view.inProgress = true;
                    // XHR to unset the given view as default.
                    ConfigDiffService.resetDefault(view)
                        .then(function (response) {
                            if (response.data.Status == "Success") {
                                view['default'] = false;
                                UserTrackingService.standard_user_tracking(configCtrl.info.application, 'Config Diff', 'Reset Default View', "{\'" + view['view_name'] + "\'}")
                                    .then(function (response) {
                                        
                                    }, handleSessionTimeout);
                            }
                            view.inProgress = false;
                        }, function (response) {
                            view.inProgress = false;
                            handleSessionTimeout(response);
                        });
                }
            };
            // Shows up the delete view modal
            configCtrl.showDeleteView = function (view, event) {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/delete_config_diff.html',
                    controller: 'DeleteConfigViewController as delConfigCtrl',
                    resolve: {
                        deleteConfigModal: function () {
                            return view;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    // To refresh the list of views.
                    configCtrl.getSavedViews();
                    if (view.view_name == configCtrl.info.currentViewName) {
                        // ModalService.alertBox({msg: 'Your current applied view is lost'});
                        configCtrl.info.currentViewName = "Select view";
                        ConfigDiffService.setKbLink(null);
                    }
                });
            };
            // Sets the accessibility of the given view to private/public based on the user selection on the UI and tracks the user activity.
            configCtrl.setAccessibility = function (view) {
                view.accessProgress = true;
                view['public'] = !view['public'];
                ConfigDiffService.setAccessibility(view)
                    .then(function (response) {
                        if (response.data.Status != "Success") {
                            view['public'] = !view['public'];
                        }
                        view.accessProgress = false;
                        UserTrackingService.standard_user_tracking(configCtrl.info.application, 'Config Diff', !!view['public'] ? 'Set View Public' : 'Set View Private', "{\'" + view['view_name'] + "\'}")
                            .then(function (response) {
                                
                            }, handleSessionTimeout);
                    }, function (response) {
                        view['public'] = !view['public'];
                        view.accessProgress = false;
                        handleSessionTimeout(response)
                    });
            };
            // Loads the given view and tracks the user activity.
            configCtrl.loadView = function (view) {
                if (!DefaultFilterService.getSelectedObservation()) {
                    ModalService.alertBox({msg: 'Please select observation!'});
                    return;
                }
                var me = this;
                ConfigDiffService.loadView(view)
                    .then(function (response) {
                        var appliedView;
                        appliedView = response.data.Data[0];
                        angular.element(document.getElementById("configdiff-select-view-div")).removeClass("open");
                        ConfigDiffService.setSectionLoading(false);
                        if (!!appliedView) {
                            // XHR to fetch the view metadata.
                            ConfigDiffService.applyView(appliedView, $scope, ConfigDiffService.getSections(), configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                            configCtrl.info.currentViewName = view.view_name;
                            ConfigDiffService.setViewName(view.view_name);
                            configCtrl.info.currentView = view;
                            UserTrackingService.standard_user_tracking(configCtrl.info.application, 'Config Diff', 'Apply View', "{\'" + view['view_name'] + "\'}")
                                .then(function (response) {
                                    
                                }, handleSessionTimeout);
                        } else {
                            ModalService.alertBox({msg: 'No Applied View'});
                        }

                    }, function (response) {
                        ConfigDiffService.setSectionLoading(false);
                        if (!handleSessionTimeout(response)) {
                            ModalService.alertBox({msg: 'No view to apply.'});
                        }
                    },me);
            };
            configCtrl.getSelectedSections = function () {
                var selectedSections = $filter('filter')(ConfigDiffService.getSections(), {
                    'selected': true
                });
                return selectedSections;
            };
            configCtrl.resetSections = function () {
                var sections = ConfigDiffService.getSections();
                var modalInstance = $modal.open({
                    templateUrl: 'partials/sectionview_reset_view.html',
                    controller: 'ResetViewController as resetViewCtrl'
                });
                modalInstance.result.then(function () {
                    for (var i in sections) {
                        sections[i]['selected'] = false;
                        sections[i]['default'] = false;
                        sections[i]['count'] = 2;
                        ConfigDiffService.resetFilter(sections[i]);
                    }
                    ConfigDiffService.setSections(sections);
                    ConfigDiffService.setAppliedView(null);
                    ConfigDiffService.setViewName('Select view');
                    configCtrl.info.currentViewName = 'Select view';
                    UserTrackingService.standard_user_tracking(configCtrl.info.application, 'Config Diff', 'Clear Filter', "{}")
                                .then(successHandler, handleSessionTimeout);
                });
            };
            
            /*
            * Golden configuration		
            */		
           		
            var goldenConfig = {};		
            goldenConfig.loading = true;		
            goldenConfig.files = [];		
            goldenConfig.facets = [];		
            goldenConfig.disabled = true;		
            ConfigDiffService.setGoldenConfig(goldenConfig);		
           		
            ConfigDiffService.getGoldenConfigCategories()		
                .then(function (response) {		
                    goldenConfig = ConfigDiffService.getGoldenConfig();		
                    goldenConfig.category = response.data.Data.category;		
                    goldenConfig.sub_category = response.data.Data.sub_category;		
                    if (goldenConfig.category !== 'NA' && goldenConfig.sub_category !== 'NA') {		
                        goldenConfig.disabled = true;		
                        configCtrl.info.loaded = true;		
                    } else {		
                        goldenConfig.disabled = false;		
                        configCtrl.info.loaded = true;		
                    }		
                    ConfigDiffService.setGoldenConfig(goldenConfig);		
                }, handleSessionTimeout);
            
            /*
             * Show Golden config upload modal: for admin user
             */
            configCtrl.showGoldenConfig = function () {
                if (metaDataService.getUser()['role'] == GlobalService.getVal('manufacturer') + '_admin' || metaDataService.getUser()['org_type'] == GlobalService.getVal('gbUserOrgType')) {
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/golden_config.html',
                        controller: 'GoldenConfigController as goldenConfigCtrl'
                    });
                } else {
                    ModalService.alertBox({msg: 'Non admin'});
                }
            };
            /*
             * Fetch file name from file controller
             */
            // Ashwin - Commenting because not used anywhere
            // $scope.getGCUploadedfiles = function (files) {
                // if (files.length > 0) {
                    // var file = {};
                    // for (var i = 0; i < files.length; i++) {
                        // file = {
                            // name: files[i].name,
                            // status: Math.floor((Math.random() * 100) + 1)
                        // };
                        // configCtrl.info.goldenconfig.files.push(file);
                    // }
                // }
            // };
            /*
             * Show diff from non-admin user
             */
            
            configCtrl.toggleGoldenConfigData = function() {
            	if(!!configCtrl.hasGoldenConfigSection()) {
            		configCtrl.clearGoldenConfigData();
            	} else {
            		configCtrl.loadGoldenConfigData();
            	}
            };
            
            configCtrl.loadGoldenConfigData = function () {
                var section, sections = ConfigDiffService.getSections();
                goldenConfig = ConfigDiffService.getGoldenConfig();
                if (!configCtrl.info.loaded) {
                    ModalService.alertBox({msg: 'Golden config not defined. Please contact ' + configCtrl.supportEmail});
                } else if (!goldenConfig.disabled) {
                    ModalService.alertBox({msg: 'Golden config not defined. Please contact ' + configCtrl.supportEmail});
                } else {
                    if ($filter('filter')(sections, {'selected': true}).length) {
                        for (section in sections) {
                            if (sections[section]['default'] == true) {
                                sections[section].selected = true;
                                ConfigDiffService.loadGoldenConfigDiffData(sections[section], $scope, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                            } else {
                                sections[section].selected = false;
                            }
                        }
                        ConfigDiffService.setSections(sections);
                        configCtrl.visible = false;
                    } else {
                        ModalService.alertBox({msgKey: 'select_section'});
                    }
                }
                ConfigDiffService.setSections(sections);
                configCtrl.visible = false;
            };
            
            configCtrl.hasGoldenConfigSection = function() {
            	var section, sections = ConfigDiffService.getSections();
            	var filteredSections = $filter('filter')(sections, {'selected': true}) || [];
            	if(filteredSections.length) {
            		for (section in filteredSections) {
                            if (filteredSections[section].hasOwnProperty('data')) {
                            	for(var index in filteredSections[section].data) {
                            		if(/golden\s+config/i.test(filteredSections[section].data[index].obs)) {
                            			return true;
                            		}
                            	}
                            }
                        }
            	}
            	return false;
            };
            
            configCtrl.clearGoldenConfigData = function() {
            	var section, sections = ConfigDiffService.getSections();
            	var filteredSections = $filter('filter')(sections, {'default': true}) || [];
            	if(filteredSections.length) {
            		for (section in filteredSections) {
                        if (filteredSections[section]['selected'] == true) {
                        	if(filteredSections[section].hasOwnProperty('data')) {
                        		for(var index in filteredSections[section].data) {
                            		if(/golden\s+config/i.test(filteredSections[section].data[index].obs)) {
                            			ConfigDiffService.loadData(filteredSections[section], $scope, configCtrl.info['defaultEndCust'], configCtrl.info['defaultSysId'], configCtrl.info['defaultObservation']);
                            			break;
                            		}
                            	}
                        	}
                        } else {
                        	filteredSections[section].selected = false;
                        }
                    }
            	}
            };
            
            configCtrl.generateRuleLogic = function(section, column) {
            	ExplorerService.setRuleSection(section.name);
            	var logic = ExplorerService.getRuleText();
            	if(section.columnDesc[column.key] == 'STRING') {
            		logic = "{" + section.label + "." + column['col_name'] + "} LIKE '%" + logic + "%'";
            	} else if(section.columnDesc[column.key] == 'INTEGER' || section.columnDesc[column.key] == 'REAL') {
            		logic = "{" + section.label + "." + column['col_name'] + "} = " + logic;
            	}
            	ExplorerService.setRuleText(logic);
            };
            
            // Shows the section diff in the section viewer
            $scope.showSectionDiff = function (section) {
                if (!DefaultFilterService.getDefaultObservation()) {
                    ModalService.alertBox({msg: 'Please select observation'});
                    return;
                }
                var bundleName = DefaultFilterService.getDefaultObservation()['bundle_name'];
                if (bundleName.indexOf("\/") != -1) {
                    var bundleList = bundleName.split("\/");
                    bundleName = bundleList[bundleList.length - 1];
                }
                var result = {
                    'obs_url': DefaultFilterService.getDefaultObservation()['bundle_name'],
                    'filename': bundleName,
                    'namespace_id': bundleName + '-0',
                    'namespace': section['name'],
                    'obs_date': DefaultFilterService.getDefaultObservation()['obs_time'].substring(0, 19) + 'Z',
                    'sysid': DefaultFilterService.getDefaultSysId()['sys_id']
                };

                var bundlesResult = DefaultFilterService.getBundleDetailForSectionDiff();
                //copy it into result object
                angular.forEach(bundlesResult, function(value, key){
                    if(!result[key]){
                        result[key] = value;
                    }
                });
                var instance = {
                    'type': 'section',
                    'title': 'Section Diff',
                    'defaultTab': 'changes',
                    "app" : configCtrl.info.application,
                    "module" : 'Config Diff',
                    'data': {
                        "result": result,
                        "bundle": /*$filter('bundleName')*/(DefaultFilterService.getDefaultObservation()['bundle_name']),
                        "sysId": DefaultFilterService.getDefaultSysId()['sys_id'],
                        // "file": $filter('bundleName')(DefaultFilterService.getDefaultObservation()['bundle_name']),
                        "instanceDisplay": DefaultFilterService.getConfigDiffFields(),//GlobalService.getVal('instance_viewer_displayfield'),
                        "start_time": DefaultFilterService.getDefaultObservation()['obs_time'].substring(0, 19) + 'Z',
                        "end_time": DefaultFilterService.getDefaultObservation()['obs_time'].substring(0, 19) + 'Z',
                        'observation': DefaultFilterService.getDefaultObservation()['obs_time'],
                        'observationStr': DefaultFilterService.getDefaultObservation()['obs_time']
                    }
                };
                InstanceHandler.addInstance(instance);
            };
            // Filters all observations to return only the last hour observation.
            var getLastHourObservations = function () {
                var observations = [], default_obs, t_obs, obs;
                if (configCtrl.info['defaultSysId']) {
                    default_obs = new Date();
                    default_obs.setHours(default_obs.getHours() - 1);
                    for (obs in configCtrl.info['defaultSysId'].observations) {
                        t_obs = UtilService.parseDate(configCtrl.info['defaultSysId'].observations[obs].obs_time);
                        if (t_obs > default_obs) {
                            observations.push(configCtrl.info['defaultSysId'].observations[obs]);
                        }
                    }
                    return observations;
                }
            };
            // Filters all observations to return only the last 12 hour observation
            var getLast12HourObservations = function () {
                var observations = [], default_obs, t_obs, obs;
                if (configCtrl.info['defaultSysId']) {
                    default_obs = new Date();
                    default_obs.setHours(default_obs.getHours() - 12);
                    for (obs in configCtrl.info['defaultSysId'].observations) {
                        t_obs = UtilService.parseDate(configCtrl.info['defaultSysId'].observations[obs].obs_time);
                        if (t_obs > default_obs) {
                            observations.push(configCtrl.info['defaultSysId'].observations[obs]);
                        }
                    }
                    return observations;
                }
            };
            // Filters all observations to return only yesterday's observations
            var getYesterdayObservations = function () {
                var observations = [], default_obs, t_obs, obs;
                if (configCtrl.info['defaultSysId']) {
                    default_obs = new Date();
                    default_obs.setDate(default_obs.getDate() - 1);
                    for (obs in configCtrl.info['defaultSysId'].observations) {
                        t_obs = UtilService.parseDate(configCtrl.info['defaultSysId'].observations[obs].obs_time);
                        if (t_obs > default_obs) {
                            observations.push(configCtrl.info['defaultSysId'].observations[obs]);
                        }
                    }
                    return observations;
                }
            };
            // Filters all observations to return only last 2 days observations
            var getLast2DaysObservations = function () {
                var observations = [], default_obs, t_obs, obs;
                if (configCtrl.info['defaultSysId']) {
                    default_obs = new Date();
                    default_obs.setDate(default_obs.getDate() - 2);
                    for (obs in configCtrl.info['defaultSysId'].observations) {
                        t_obs = UtilService.parseDate(configCtrl.info['defaultSysId'].observations[obs].obs_time);
                        if (t_obs > default_obs) {
                            observations.push(configCtrl.info['defaultSysId'].observations[obs]);
                        }
                    }
                    return observations;
                }
            };
            // Filters all observations to return only this week observations
            var getThisWeekObservations = function () {
                var observations = [], default_obs, t_obs, obs;
                if (configCtrl.info['defaultSysId']) {
                    default_obs = new Date();
                    for (obs in configCtrl.info['defaultSysId'].observations) {
                        t_obs = UtilService.parseDate(configCtrl.info['defaultSysId'].observations[obs].obs_time);
                        if (t_obs && t_obs.getWeek() === default_obs.getWeek()) {
                            observations.push(configCtrl.info['defaultSysId'].observations[obs]);
                        }
                    }
                    return observations;
                }
            };
            var getMostRecentObservations = function () {
                var observations = [];
                if (configCtrl.info['defaultSysId'] && configCtrl.info['defaultSysId'].lastNObservations) {
                    observations.push(configCtrl.info['defaultSysId'].lastNObservations[0]);
                    return observations;
                }
            };
            // Filters all observations to return only this month's observations
            var getThisMonthObservations = function () {
                var observations = [], default_obs, t_obs, obs;
                if (configCtrl.info['defaultSysId']) {
                    default_obs = new Date();
                    for (obs in configCtrl.info['defaultSysId'].observations) {
                        t_obs = UtilService.parseDate(configCtrl.info['defaultSysId'].observations[obs].obs_time);
                        if (t_obs && t_obs.getMonth() === default_obs.getMonth()) {
                            observations.push(configCtrl.info['defaultSysId'].observations[obs]);
                        }
                    }
                    return observations;
                }
            };
            var getLastNObservations = function () {
                var observations = [];
                if (configCtrl.info['defaultSysId'] && configCtrl.info['defaultSysId'].lastNObservations) {
                    for (obs in configCtrl.info['defaultSysId'].lastNObservations) {
                        observations.push(configCtrl.info['defaultSysId'].lastNObservations[obs]);
                    }
                    return observations;
                }
            };
            var observationObj = {
                getLastHourObservations: getLastHourObservations,
                getLast12HourObservations: getLast12HourObservations,
                getYesterdayObservations: getYesterdayObservations,
                getLast2DaysObservations: getLast2DaysObservations,
                getThisWeekObservations: getThisWeekObservations,
                getMostRecentObservations: getMostRecentObservations,
                getThisMonthObservations: getThisMonthObservations,
                getLastNObservations: getLastNObservations
            };
            // Sets the recent observation as the current observation
            function setRecentObservation() {
                var i, flag = 0, default_obs, t_obs;
                for (i in configCtrl.info['defaultSysId'].observations) {
                    if (flag) {
                        default_obs = UtilService.parseDate(configCtrl.info['defaultObservation'].obs_time);
                        t_obs = UtilService.parseDate(configCtrl.info['defaultSysId'].observations[i].obs_time);
                        if (default_obs < t_obs) {
                            configCtrl.info['defaultObservation'] = configCtrl.info['defaultSysId'].observations[i];
                        }
                    } else {
                        configCtrl.info['defaultObservation'] = configCtrl.info['defaultSysId'].observations[i];
                        flag = 1;
                    }
                }
                DefaultFilterService.setDefaultObservation(configCtrl.info['defaultObservation']);
                DefaultFilterService.setSelectedObservation(configCtrl.info['defaultObservation']);
                configCtrl.info.selectedObsGroup = 'Most Recent';
                DefaultFilterService.setSelectedObsGrp('Most Recent');
            }
            function resetViewCheck() {
                if (configCtrl.info.currentViewName != "Select view") {
                    // ModalService.alertBox({msg: 'Your current applied view is lost'});
                    configCtrl.info.currentViewName = "Select view";
                    ConfigDiffService.setKbLink(null);
                }
            }
            function handleSessionTimeout(response) {
                if (!configCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                    configCtrl.info.sessionTimedOut = true;
                    ModalService.sessionTimeout();
                    return true;
                }
                return;
            }
            function successHandler() {
            }
        }])
    // Controller for Golden Config
    .controller('GoldenConfigController', ['$scope', '$modalInstance', 'ModalService', 'ConfigDiffService', 'FileUploader', 'GlobalService',
        function($scope, $modalInstance, ModalService, ConfigDiffService, FileUploader, GlobalService) {
                
            var goldenConfigCtrl = this;
            goldenConfigCtrl.info = {};
            goldenConfigCtrl.info.loading = true;
            goldenConfigCtrl.info.goldenConfig = {
            	loading: true,
            	files: [],
            	facets: [],
            	disabled: true
            };
            
            if (goldenConfigCtrl.info.goldenConfig.loading) {
                ConfigDiffService.getAllFacets().then(function (response) {
                    goldenConfigCtrl.info.goldenConfig.facets = ConfigDiffService.formatFacets(response.data.Data);
                    ConfigDiffService.getGoldenConfigCategories().then(function (response) {
                        goldenConfigCtrl.info.loading = false;
                        goldenConfigCtrl.info.goldenConfig.category = response.data.Data.category;
                        goldenConfigCtrl.info.goldenConfig.sub_category = response.data.Data.sub_category;
                        if (goldenConfigCtrl.info.goldenConfig.category !== 'NA' && goldenConfigCtrl.info.goldenConfig.sub_category !== 'NA') {
                            goldenConfigCtrl.info.goldenConfig.disabled = true;
                            angular.forEach(goldenConfigCtrl.info.goldenConfig.facets, function(facet) {
                            	if(facet.name == response.data.Data.category) {
                            		goldenConfigCtrl.info.goldenConfig.category = facet;
                            	}
                            	if(facet.name == response.data.Data.sub_category) {
                            		goldenConfigCtrl.info.goldenConfig.sub_category = facet;
                            	}
                            });
                        } else {
                            goldenConfigCtrl.info.goldenConfig.disabled = false;
                            goldenConfigCtrl.info.goldenConfig.category = goldenConfigCtrl.info.goldenConfig.facets[0];
                            goldenConfigCtrl.info.goldenConfig.sub_category = goldenConfigCtrl.info.goldenConfig.facets[0];
                        }
                        goldenConfigCtrl.info.goldenConfig.loading = false;
                        updateGoldenConfig();
                    }, function (response) {
                        goldenConfigCtrl.info.loading = false;
                        updateGoldenConfig();
                        handleSessionTimeout(response);
                        console.error(response);
                    });
                }, function (response) {
                    goldenConfigCtrl.info.loading = false;
                    updateGoldenConfig();
                    handleSessionTimeout(response);
                    console.error(response);
                });
            } else {
                goldenConfigCtrl.info.loading = false;
            }
            
            var manufacturer = GlobalService.getVal('manufacturer');
            var product = GlobalService.getVal('product');
            var schema = GlobalService.getVal('schema');
            var infoserverDomain = GlobalService.getVal('infoserverDomain');

            // File Upload Object for GoldenConf.
            goldenConfigCtrl.uploader = new FileUploader({
                url: infoserverDomain + '/fileupload/uploadfile/' + manufacturer + '/' + product + '/' + schema,
                queueLimit: 1,
                onBeforeUploadItem: function (item) {
                    item.url = item.url + '?category=' + goldenConfigCtrl.info.goldenConfig.category.name + '&subcategory=' + goldenConfigCtrl.info.goldenConfig.sub_category.name;
                },
                onErrorItem : function(item, response, status, headers) {
                    if(!goldenConfigCtrl.info.sessionTimedOut && response && response.hasOwnProperty('Msg') && response.Msg.match(/timeout/)) {
                        $modalInstance.dismiss('cancel');
                        goldenConfigCtrl.info.sessionTimedOut = true;
                        ModalService.sessionTimeout();
                        return;
                    }
                }
            });
            
            // Initiates the upload of all files.
            goldenConfigCtrl.beginUpload = function () {
                goldenConfigCtrl.uploader.uploadAll();
            };
            
            goldenConfigCtrl.hideModal = function() {
                $modalInstance.dismiss('cancel');
            };
            
            goldenConfigCtrl.changeCategory = function() {
                if(goldenConfigCtrl.info.goldenConfig.category.name == 'all') {
                    goldenConfigCtrl.info.goldenConfig.sub_category = angular.copy(goldenConfigCtrl.info.goldenConfig.category);
                }
                else if(goldenConfigCtrl.info.goldenConfig.sub_category.name == 'all') {
                    goldenConfigCtrl.info.goldenConfig.sub_category = {};
                }
            };
            
            goldenConfigCtrl.changeSubCategory = function() {
                if(goldenConfigCtrl.info.goldenConfig.sub_category.name == 'all') {
                    goldenConfigCtrl.info.goldenConfig.category = angular.copy(goldenConfigCtrl.info.goldenConfig.sub_category);
                } else if(goldenConfigCtrl.info.goldenConfig.category.name == 'all') {
                    goldenConfigCtrl.info.goldenConfig.category = {};
                }
            };

            function updateGoldenConfig() {
                ConfigDiffService.setGoldenConfig(goldenConfigCtrl.info.goldenConfig);
            }
            
            function handleSessionTimeout(response) {
                if (!goldenConfigCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                    goldenConfigCtrl.info.sessionTimedOut = true;
                    $modalInstance.dismiss('cancel');
                    ModalService.sessionTimeout();
                }
            }
        }])
// SaveFilter - Responsible for holding model of the save view modal.
    .controller('SaveConfigFilter', ['$scope', '$modalInstance', 'ModalService', 'AppService', 'GlobalService', 'ConfigDiffService', '$filter', 'UserTrackingService', 'DefaultFilterService', 'items', '$cookies', 'metaDataService',
        function ($scope, $modalInstance, ModalService, AppService, GlobalService, ConfigDiffService, $filter, UserTrackingService, DefaultFilterService, items, $cookies, metaDataService) {
            var saveConfigCtrl = this, savedFiltersList = [], emptySectionList = [];
            var attributeOfSelectedSection = items.allSectionsDetails[0].columns, allSectionsDetails = items.allSectionsDetails;
            saveConfigCtrl.saveModal = {};
            saveConfigCtrl.saveModal.saveStatus = "initiated";
            saveConfigCtrl.saveModal.message = "";
            saveConfigCtrl.form = {};
            saveConfigCtrl.info = {};
            saveConfigCtrl.info.application = GlobalService.getVal('navLog');
            saveConfigCtrl.saveModal.viewOverwrite = false;
            // Stores whether session is timed out or not
            saveConfigCtrl.info.sessionTimedOut = false;
            //Setting first option as selected in section select
            saveConfigCtrl.form = {
                visible: true,
                message: ""
            };
            // filters the sections based on user selection
            saveConfigCtrl.selectedSections = function () {
                var selectedSections, updatedSectionList = [];
                emptySectionList = [];
                selectedSections = $filter('filter')(ConfigDiffService.getSections(), {
                    'selected': true
                });
                for (var k in selectedSections) {
                    var eachSectionData = selectedSections[k];
                    if (!!eachSectionData.data) {
                        updatedSectionList.push(eachSectionData);
                    }
                }
                //filter empty section
                for (var m = 0; m < selectedSections.length; m++) {
                    var match = false;
                    for (var n = 0; n < updatedSectionList.length; n++) {
                        if (selectedSections[m].label == updatedSectionList[n].label) {
                            match = true;
                            break;
                        }
                    }
                    if (!match) {
                        emptySectionList.push(selectedSections[m]);
                    }
                }
                return updatedSectionList;
            };
            // On focus puts the http:// in the kbase field
            saveConfigCtrl.kbaseOnFocus = function () {
                if (saveConfigCtrl.saveModal.kbase == '') {
                    saveConfigCtrl.saveModal.kbase = 'http://';
                }
            };
            // On blur removes the http:// if the user hasn't typed in an url in the kbase field.
            saveConfigCtrl.kbaseOnBlur = function () {
                if (saveConfigCtrl.saveModal.kbase == 'http://') {
                    saveConfigCtrl.saveModal.kbase = '';
                }
            };
            saveConfigCtrl.getEmptySectionList = function () {
                return emptySectionList;
            };
            // Updates the attributes selected for a given section to show in save view modal.
            saveConfigCtrl.updateColumnAttributes = function (sectionName) {
                if (sectionName) {
                    attributeOfSelectedSection = getSection(sectionName).columns;
                }
            };
            // Closes the modal held by $scope.modal
            saveConfigCtrl.hideModal = function () {
                $modalInstance.close('OK');
            };
            saveConfigCtrl.checkViewName = function () {
                saveConfigCtrl.saveModal.viewOverwrite = false;
                if (savedFiltersList && savedFiltersList.length && savedFiltersList.length > 0) {
                    var found = false;
                    for (var i = 0; i < savedFiltersList.length; i++) {
                        if (savedFiltersList[i]["view_name"] == saveConfigCtrl.saveModal.name) {
                            if (savedFiltersList[i]["created_by"] == metaDataService.getUser()['email']) {
                                saveConfigCtrl.saveModal.viewOverwrite = true;
                                continue;
                            } else {
                                found = true;
                                break;
                            }
                        }
                    }
                    if (found) {
                        // mark it as invalid
                        saveConfigCtrl.form.saveViewModal.viewName.$setValidity('duplicate', false)
                    } else {
                        saveConfigCtrl.form.saveViewModal.viewName.$setValidity('duplicate', true)
                    }
                } else {
                    getAllSavedViews();
                }
            };
            // Gets the values from the globals based on the given key.
            saveConfigCtrl.getValue = function (key) {
                return GlobalService.getVal(key);
            };
            // Saves the current selection as new view with details given by the user.
            saveConfigCtrl.saveFilter = function () {
                saveConfigCtrl.submitted = true;
                if (!saveConfigCtrl.form.saveViewModal.$valid) {
                    return;
                }
                saveConfigCtrl.saveModal.saveStatus = "progress";
                var param = {};
                var data = {};
                var i, j, colstr = "", transpose = "", filterstr = "";
                param.name = saveConfigCtrl.saveModal.name;
                param['public'] = saveConfigCtrl.saveModal.access == 'public' ? true : false;
                param['default'] = false;
                data.desc = escape(saveConfigCtrl.saveModal.desc);
                data.kbase = saveConfigCtrl.saveModal.kbase;
                var opsCnt = "";
                var sections = ConfigDiffService.getSections();
                for (i in sections) {
                    if (sections[i]['selected'] && !!sections[i].data) {
                        for (j in sections[i].keys) {
                            if (sections[i].keys[j].visible) {
                                if (colstr) {
                                    colstr += ",";
                                }
                                colstr += sections[i].table_name + ":" + sections[i].keys[j].key;
                            }
                        }
                    }
                    if (opsCnt && sections[i].selected && !!sections[i].data) {
                        opsCnt += ",";
                    }
                    if (sections[i].selected && !!sections[i].data) {
                        opsCnt += sections[i].table_name + ":" + sections[i].count;
                    }
                }
                data.cols = "{\'" + colstr + "\'}";
                data.obs_ct = "{\'" + opsCnt + "\'}";
                // XHR to save the view.
                ConfigDiffService.saveSelectedView(param, data).then(function (response) {
                    ConfigDiffService.setViewsCount(ConfigDiffService.getViewsCount() + 1);
                    saveConfigCtrl.saveModal.saveStatus = "success";
                    saveConfigCtrl.saveModal.message = "View saved successfully.";
                    getAllSavedViews();
                    // Tracking user activity to save the view.
                    UserTrackingService.standard_user_tracking(saveConfigCtrl.info.application, 'Config Diff', 'Save View', data.cols)
                        .then(function (response) {
                            
                        }, handleSessionTimeout);
                }, function (response) {
                    handleSessionTimeout(response);
                    saveConfigCtrl.saveModal.saveStatus = "error";
                    saveConfigCtrl.saveModal.message = "Error :" + response.data.Msg;
                });
            };
            // Returns the section object based on user selection.
            function getSection(sectionName) {
                attributeOfSelectedSection = [];
                var totalSections = allSectionsDetails.length;
                for (var i = 0; i < totalSections; i++) {
                    if (allSectionsDetails[i].name == sectionName) {
                        return allSectionsDetails[i];
                    }
                }
            }

            function getAllSavedViews() {
                ConfigDiffService.getAllViews()
                    .then(function (response) {
                        savedFiltersList = response.data.Data;
                        var found = false;
                        for (var i = 0; i < savedFiltersList.length; i++) {
                            if (savedFiltersList[i]["view_name"] == saveConfigCtrl.saveModal.name) {
                                if (savedFiltersList[i]["created_by"] == metaDataService.getUser()['email']) {
                                    saveConfigCtrl.saveModal.viewOverwrite = true;
                                    continue;
                                } else {
                                    found = true;
                                    break;
                                }
                            }
                        }
                        if (found) {
                            // mark it as invalid
                            saveConfigCtrl.form.saveViewModal.viewName.$setValidity('duplicate', false)
                        } else {
                            saveConfigCtrl.form.saveViewModal.viewName.$setValidity('duplicate', true)
                        }
                    }, handleSessionTimeout);
            }

            function handleSessionTimeout(response) {
                if (!saveConfigCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                    saveConfigCtrl.info.sessionTimedOut = true;
                    $modalInstance.dismiss('cancel');
                    ModalService.sessionTimeout();
                }
            }
        }])
    .controller('ResetViewController', ['$modalInstance', function ($modalInstance) {
        var resetViewCtrl = this;
        resetViewCtrl.msg = "Are you sure to loose the current selection ??";
        resetViewCtrl.resetViewConfirm = function () {
            $modalInstance.close('ok');
        };
        resetViewCtrl.hideNavigationModal = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('DeleteConfigViewController', ['$modalInstance', 'ConfigDiffService', 'UserTrackingService', 'ModalService', 'GlobalService', 'deleteConfigModal', function ($modalInstance, ConfigDiffService, UserTrackingService, ModalService, GlobalService, deleteConfigModal) {
        var delConfigCtrl = this;
        delConfigCtrl.deleteModal = deleteConfigModal;
        delConfigCtrl.deleteModal.status = "initiated";
        delConfigCtrl.deleteModal.deleteOperationMsg = "";
        delConfigCtrl.application = GlobalService.getVal('navLog');
        // Closes the open model
        delConfigCtrl.hideDeleteView = function () {
            $modalInstance.close('ok');
        };
        // Sends the request to delete the given view.
        delConfigCtrl.deleteView = function (view, event) {
            delConfigCtrl.deleteModal.status = "progress";
            // XHR to delete the given view
            ConfigDiffService.deleteView(view)
                .then(function (response) {
                    ConfigDiffService.setViewsCount(ConfigDiffService.getViewsCount() - 1);
                    delConfigCtrl.deleteModal.status = "success";
                    delConfigCtrl.deleteModal.deleteOperationMsg = "View deleted successfully.";
                    ConfigDiffService.setViewName('Select view');
                    UserTrackingService.standard_user_tracking(delConfigCtrl.application, 'Config Diff', 'Delete View', "{\'" + view['view_name'] + "\'}")
                        .then(function (response) {
                            
                        }, handleSessionTimeout);
                }, function (response) {
                    delConfigCtrl.deleteModal.status = "error";
                    handleSessionTimeout(response)
                    delConfigCtrl.deleteModal.deleteOperationMsg = "Unable to delete view. Try again later.";
                });
        };
        function successHandler(response) {
            
        }
        function handleSessionTimeout(response) {
            if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                $modalInstance.dismiss('cancel');
                ModalService.sessionTimeout();
            }
        }
    }]);
