// Controller to handle the change of page
angular.module('internalAdminApp.controllers', ['ngDraggable','angular-table'])
.controller('MainCtrl', ['$scope', '$location', 'internalAdminService', 'GlobalMessages', 'GlobalService', 'MessageService',
    function($scope, $location, internalAdminService, GlobalMessages, GlobalService, MessageService) {
        angular.element(window.document)[0].title = GlobalMessages.getValue('PAGE_TITLE');
        $scope.logo = "";
        $scope.logo_url = "";
        $scope.logo_url = '/apps/app/login/images/logo.png';
        $scope.logo = '/apps/app/login/images/logo.png';
    }
])
.controller('internalAdminCtrl', ['$scope', '$location', 'internalAdminService', 'GlobalMessages', 'GlobalService', 'MessageService', 'ngTableParams', '$filter','$window','$document','$timeout','$q',
    function($scope, $location, internalAdminService, GlobalMessages, GlobalService, MessageService, ngTableParams, $filter, $window, $document,$timeout,$q) {
        angular.element(window.document)[0].title = GlobalMessages.getValue('PAGE_TITLE');
        $scope.logo = "";
		      $scope.currentDomain = $location.host().split(/\.(.+)?/)[1];
        $scope.logo_url = "";
        $scope.data_loading = false;
        $scope.logo_url = '/apps/app/login/images/logo.png';
        $scope.logo = '/apps/app/login/images/logo.png';
        $scope.tempMpsData = [];
        $scope.defRoleData = [];
        $scope.step2FormRealm = "prod";
        $scope.mpsConfigData = [];
        $scope.mpsUiData = [];
        $scope.mfsConfigFlag = 0;
        $scope.manTableGrid = {};
        $scope.gridOptions2 = {};
        $scope.step5FormDefRoleNameDis = "";
        $scope.step5FormDefRoleName = "";
        $scope.step2FormSsoLoginUrl = "";
        $scope.step2FormSsoLogoutUrl = "";
        $scope.step2FormSsoId = "";
        $scope.step2FormSsoRoles = "";
        $scope.roleFeatures = GlobalService.getVal('roleFeatures');
        $scope.roleFeaturesNoAdmin = GlobalService.getVal('roleFeaturesNoAdmin');
        $scope.extensions = GlobalService.getVal('extensions');
        $scope.mfsUiFlag = 0;
        $scope.manTabConfig = {
            itemsPerPage: GlobalService.getVal('maxTableItems'),
            maxPages: GlobalService.getVal('maxTableItems'),
            fillLastPage: "yes",
          };
        $scope.realmTabConfig = {
            itemsPerPage: 5,
            maxPages: 2,
            fillLastPage: "yes"
          };
        $scope.manTableData = [];
        $scope.defRoleProdName = [];
        $scope.tempUserData = [];

        $scope.wizardSlideTitle = GlobalService.getVal('wizardSlideTitle');
        $scope.AddRealmModalTitle = GlobalService.getVal('AddRealmModalTitle');
        $scope.realmTableTitle = GlobalService.getVal('realmTableTitle');
        $scope.editBtnText = GlobalService.getVal('editBtnText');
        $scope.deleteBtnText = GlobalService.getVal('deleteBtnText');
        $scope.addRealmBtnTitle = GlobalService.getVal('addRealmBtnTitle');
        $scope.ManTableManName = GlobalService.getVal('ManTableManName');
        $scope.ManTableMPSList = GlobalService.getVal('ManTableMPSList');
        $scope.ManTableMaxLic = GlobalService.getVal('ManTableMaxLic');
        $scope.ManTableMaxUsr = GlobalService.getVal('ManTableMaxUsr');
        $scope.ManTableRealm = GlobalService.getVal('ManTableRealm');
        $scope.ManTableStatus = GlobalService.getVal('ManTableStatus');
        $scope.ManTableAction = GlobalService.getVal('ManTableAction');
        $scope.realmConfigBtnTitle = GlobalService.getVal('realmConfigBtnTitle');
        $scope.AddManBtnTitle = GlobalService.getVal('AddManBtnTitle');
        $scope.realmAppVer = GlobalService.getVal('realmAppVer');
        $scope.realmUiUrl = GlobalService.getVal('realmUiUrl');
        $scope.realmInfoUrl = GlobalService.getVal('realmInfoUrl');
        $scope.wizStep2Title = GlobalService.getVal('wizStep2Title');
        $scope.wizStep3Title = GlobalService.getVal('wizStep3Title');
        $scope.wizStep4Title = GlobalService.getVal('wizStep4Title');
        $scope.wizStep5Title = GlobalService.getVal('wizStep5Title');
        $scope.wizStep6Title = GlobalService.getVal('wizStep6Title');
        $scope.wizStep1Info = GlobalService.getVal('wizStep1Info');
        $scope.wizStep1MfrTitle = GlobalService.getVal('wizStep1MfrTitle');
        $scope.wizStep1DescTitle = GlobalService.getVal('wizStep1DescTitle');
        $scope.wizStep1MaxUsrTitle = GlobalService.getVal('wizStep1MaxUsrTitle');
        $scope.wizStep1MaxLicTitle = GlobalService.getVal('wizStep1MaxLicTitle');
        $scope.wizStep2Info1 = GlobalService.getVal('wizStep2Info1');
        $scope.wizStep2Info2 = GlobalService.getVal('wizStep2Info2');
        $scope.wizStepInfoError = GlobalService.getVal('wizStepInfoError');
        $scope.wizStep2Error = GlobalService.getVal('wizStep2Error');
        $scope.wizStep2TabProd = GlobalService.getVal('wizStep2TabProd');
        $scope.wizStep2TabSch = GlobalService.getVal('wizStep2TabSch');
        $scope.wizStep2TabRealm = GlobalService.getVal('wizStep2TabRealm');
        $scope.wizStep2TabEc = GlobalService.getVal('wizStep2TabEc');
        $scope.wizStep2TabSsoId = GlobalService.getVal('wizStep2TabSsoId');
        $scope.wizStep2TabSsoLoginUrl = GlobalService.getVal('wizStep2TabSsoLoginUrl');
        $scope.wizStep2TabSsoLogoutUrl = GlobalService.getVal('wizStep2TabSsoLogoutUrl');
        $scope.wizStep2TabSsoRoles = GlobalService.getVal('wizStep2TabSsoRoles');
        $scope.wizStep3Info2 = GlobalService.getVal('wizStep3Info2');
        $scope.wizStep3Info1 = GlobalService.getVal('wizStep3Info1');
        $scope.wizStep3DefFeatureExt = GlobalService.getVal('wizStep3DefFeatureExt');
        $scope.wizStep3DefFeatureInt = GlobalService.getVal('wizStep3DefFeatureInt');
        $scope.wizStep3Logo = GlobalService.getVal('wizStep3Logo');
        $scope.wizStep3LogoUrl = GlobalService.getVal('wizStep3LogoUrl');
        $scope.wizStep3Nsr = GlobalService.getVal('wizStep3Nsr');
        $scope.wizStep3Active = GlobalService.getVal('wizStep3Active');
        $scope.wizStep4Info2 = GlobalService.getVal('wizStep4Info2');
        $scope.wizStep4Info1 = GlobalService.getVal('wizStep4Info1');
        $scope.wizStep5Info2 = GlobalService.getVal('wizStep5Info2');
        $scope.wizStep5Info1 = GlobalService.getVal('wizStep5Info1');
        $scope.wizStep5RoleName = GlobalService.getVal('wizStep5RoleName');
        $scope.wizStep5Error = GlobalService.getVal('wizStep5Error');
        $scope.wizStep5DomName = GlobalService.getVal('wizStep5DomName');
        $scope.wizStep5FeatPer = GlobalService.getVal('wizStep5FeatPer');
        $scope.wizStep5PowUserInfo = GlobalService.getVal('wizStep5PowUserInfo');
        $scope.wizStep6Info1 = GlobalService.getVal('wizStep6Info1');
        $scope.wizStep6Info2 = GlobalService.getVal('wizStep6Info2');
        $scope.wizStep6Fname = GlobalService.getVal('wizStep6Fname');
        $scope.wizStep6Lname = GlobalService.getVal('wizStep6Lname');
        $scope.wizStep6Email = GlobalService.getVal('wizStep6Email');
        $scope.wizStep6Phone = GlobalService.getVal('wizStep6Phone');
        $scope.wizStep6Dept = GlobalService.getVal('wizStep6Dept');
        $scope.wizStep6State = GlobalService.getVal('wizStep6State');
        $scope.wizStep6City = GlobalService.getVal('wizStep6City');
        $scope.wizStep6Country = GlobalService.getVal('wizStep6Country');
        $scope.realmDelConfHead = GlobalService.getVal('realmDelConfHead');
        $scope.realmDeleteConfBody = GlobalService.getVal('realmDeleteConfBody');
        $scope.manDelConfHead = GlobalService.getVal('manDelConfHead');
        $scope.manDeleteConfBody = GlobalService.getVal('manDeleteConfBody');
        $scope.defFeatError = GlobalService.getVal('defFeatError');
        $scope.default_exp_view = GlobalService.getVal('default_exp_view');
        $scope.allowedExtLbl = GlobalService.getVal('allowedExtLbl');
        $scope.compound_rowsLbl = GlobalService.getVal('compound_rowsLbl');
        $scope.core_delimiterLbl = GlobalService.getVal('core_delimiterLbl');
        $scope.default_daysLbl = GlobalService.getVal('default_daysLbl');
        $scope.default_exp_viewLbl = GlobalService.getVal('default_exp_viewLbl');
        $scope.exp_display_fieldsLbl = GlobalService.getVal('exp_display_fieldsLbl');
        $scope.facet_limitLbl = GlobalService.getVal('facet_limitLbl');
        $scope.iv_display_fieldsLbl = GlobalService.getVal('iv_display_fieldsLbl');
        $scope.is_stage_domainLbl = GlobalService.getVal('is_stage_domainLbl');
        $scope.is_stage_keyspaceLbl = GlobalService.getVal('is_stage_keyspaceLbl');
        $scope.max_day_rangeLbl = GlobalService.getVal('max_day_rangeLbl');
        $scope.max_upload_sizeLbl = GlobalService.getVal('max_upload_sizeLbl');
        $scope.lv_to_expLbl = GlobalService.getVal('lv_to_expLbl');
        $scope.max_day_rangeunit = GlobalService.getVal('max_day_rangeunit');
        $scope.max_upload_sizeunit = GlobalService.getVal('max_upload_sizeunit');
        $scope.json_formLbl = GlobalService.getVal('json_formLbl');
        $scope.mfrType = GlobalService.getVal('mfrType');
        $scope.allowedExtLblTooltip = GlobalService.getVal('allowedExtLblTooltip');
        $scope.RoleReadOnlyHelp = GlobalService.getVal('RoleReadOnlyHelp');
        $scope.wizStep6TabName = GlobalService.getVal('wizStep6TabName');
        $scope.wizStep6TabProd = GlobalService.getVal('wizStep6TabProd');
        $scope.wizContinueMsg = GlobalService.getVal('wizContinueMsg');
        $scope.wizardOpenHelp = GlobalService.getVal('wizardOpenHelp');
        //Add Realm Help Texts
        $scope.formNewRealmNameHelp = GlobalService.getVal('formNewRealmNameHelp');
        $scope.formNewRealmAppVersionHelp = GlobalService.getVal('formNewRealmAppVersionHelp');
        $scope.formNewRealmIsUrlHelp = GlobalService.getVal('formNewRealmIsUrlHelp');
        $scope.formNewRealmUiUrlHelp = GlobalService.getVal('formNewRealmUiUrlHelp');
        //Add Realm Help Texts Ends
        //Add Manufacturer Help Text Starts
        $scope.MfrReadOnlyHelp = GlobalService.getVal('MfrReadOnlyHelp');
        $scope.wizStep1MaxUsrTitleHelp = GlobalService.getVal('wizStep1MaxUsrTitleHelp');
        $scope.wizStep1MaxLicTitleHelp = GlobalService.getVal('wizStep1MaxLicTitleHelp');
        $scope.wizStep2TabProdHelp = GlobalService.getVal('wizStep2TabProdHelp');
        $scope.wizStep2TabSchHelp = GlobalService.getVal('wizStep2TabSchHelp');
        $scope.step2FormRealmHelp = GlobalService.getVal('step2FormRealmHelp');
        $scope.wizStep2TabEcHelp = GlobalService.getVal('wizStep2TabEcHelp');
        $scope.wizStep2TabSsoIdHelp = GlobalService.getVal('wizStep2TabSsoIdHelp');
        $scope.wizStep2TabSsoLoginUrlHelp = GlobalService.getVal('wizStep2TabSsoLoginUrlHelp');
        $scope.wizStep2TabSsoLogoutUrlHelp = GlobalService.getVal('wizStep2TabSsoLogoutUrlHelp');
        $scope.wizStep2TabSsoRolesHelp = GlobalService.getVal('wizStep2TabSsoRolesHelp');
        $scope.wizStep3DefFeatureExtHelp = GlobalService.getVal('wizStep3DefFeatureExtHelp');
        $scope.wizStep3DefFeatureIntHelp = GlobalService.getVal('wizStep3DefFeatureIntHelp');
        $scope.wizStep3LogoHelp = GlobalService.getVal('wizStep3LogoHelp');
        $scope.wizStep3LogoUrlHelp = GlobalService.getVal('wizStep3LogoUrlHelp');
        $scope.compound_rowsLblHelp = GlobalService.getVal('compound_rowsLblHelp');
        $scope.core_delimiterLblHelp = GlobalService.getVal('core_delimiterLblHelp');
        $scope.default_exp_viewLblHelp = GlobalService.getVal('default_exp_viewLblHelp');
        $scope.allowedExtLblHelp = GlobalService.getVal('allowedExtLblHelp');
        $scope.default_daysLblHelp = GlobalService.getVal('default_daysLblHelp');
        $scope.exp_display_fieldsLblHelp = GlobalService.getVal('exp_display_fieldsLblHelp');
        $scope.facet_limitLblHelp = GlobalService.getVal('facet_limitLblHelp');
        $scope.iv_display_fieldsLblHelp = GlobalService.getVal('iv_display_fieldsLblHelp');
        $scope.is_stage_domainLblHelp = GlobalService.getVal('is_stage_domainLblHelp');
        $scope.is_stage_keyspaceLblHelp = GlobalService.getVal('is_stage_keyspaceLblHelp');
        $scope.max_upload_sizeLblHelp = GlobalService.getVal('max_upload_sizeLblHelp');
        $scope.max_day_rangeLblHelp = GlobalService.getVal('max_day_rangeLblHelp');
        $scope.json_formLblHelp = GlobalService.getVal('json_formLblHelp');
        $scope.addRealmHelp = GlobalService.getVal('addRealmHelp');
        $scope.jsonErrorMsg = GlobalService.getVal('jsonErrorMsg');
        $scope.wizEditMode = false;
        //Add Manufacturer Help Text Ends
        $scope.step6FormuserDashboard_AdminLbl = GlobalService.getVal('step6FormuserDashboard_AdminLbl');
        $scope.step6FormuserReportUsageLbl = GlobalService.getVal('step6FormuserReportUsageLbl');
        $scope.step6FormuserReportUsage = true;
        $scope.step6FormuserDashboard_Admin = true;
        $scope.init = function () {
          $scope.getLoginDetails();
          $scope.getManTable();
          $scope.getRealmTable();
        };
        $scope.deleteMan = function () {
            $scope.data_loading = true;
            internalAdminService.deleteMan($scope.manDelConfItem).then(function (response) {
                $scope.manDelConfItem = "";
                $scope.getManTable();
                $('#manDelConf').modal('hide');
                $scope.data_loading = false;
            },function(error){
              $scope.data_loading = false;
            });
        };
        $scope.deleteRealm = function () {
            $scope.data_loading = true;
            internalAdminService.deleteRealm($scope.realmDelConfItem).then(function (response) {
                $scope.realmDelConfItem = "";
                $scope.getRealmTable();
                $('#realmDelConf').modal('hide');
                $scope.data_loading = false;
            },function(error){
              $scope.data_loading = false;
            });
        };
        $scope.addRealm = function () {            
            $scope.data_loading = true;
            if($scope.realmEditMode){
                var formdata = {
                    "name":$scope.formNewRealmName,
                    "apps_version":$scope.formNewRealmAppVersion,
                    "is_url":$scope.formNewRealmIsUrl,
                    "ui_url":$scope.formNewRealmUiUrl
                }
                internalAdminService.editRealm(formdata).then(function (response) {
                    $scope.getRealmTable();
                    $('#realmModal').modal('hide');
                    $scope.data_loading = false;
                },function(error){
                  $scope.data_loading = false;
                });
            }else {
                var formdata = {
                    "name":$scope.formNewRealmName,
                    "apps_version":$scope.formNewRealmAppVersion,
                    "is_url":$scope.formNewRealmIsUrl,
                    "ui_url":$scope.formNewRealmUiUrl
                }
                internalAdminService.addRealm(formdata).then(function (response) {
                    $scope.getRealmTable();
                    $('#realmModal').modal('hide');
                    $scope.data_loading = false;
                },function(error){
                  $scope.data_loading = false;
                });
            }
        };
        $scope.editMps = function (item) {
            $scope.step2FormProd = item.prod;
            $scope.step2FormSch = item.sch;
            $scope.step2FormRealm = item.realm;
            $scope.mfrName =item.mfr;
            $scope.step2FormSsoId = item.ssoId;
            $scope.step2FormSsoLoginUrl = item.ssoLoginUrl;
            $scope.step2FormSsoLogoutUrl = item.ssoLogoutUrl;
            $scope.step2FormSsoRoles = item.ssoRole;
            $("#addMpsForm").slideDown();
            $("#addMoreMps").hide();
        };
        $scope.editManEntry = function (item,mode) {
            $scope.data_loading = true;
            var deferred = $q.defer();
            if(mode!="cont") {
                $scope.wizEditMode = true;
            }
            else {
                $scope.wizEditMode = false;
            }
            if($scope.wizEditMode){
                $("#wizStep2").addClass("btn-success");
                $("#wizStep2").removeClass("btn-secondary");
                $("#wizStep3").addClass("btn-success");
                $("#wizStep3").removeClass("btn-secondary");                
                $("#wizStep4").addClass("btn-success");
                $("#wizStep4").removeClass("btn-secondary");                
                $("#wizStep5").addClass("btn-success");
                $("#wizStep5").removeClass("btn-secondary");
                $("#wizStep6").addClass("btn-success");
                $("#wizStep6").removeClass("btn-secondary");
            }
            $scope.mfrName = item.mfr;
            $scope.mfr = item.mfr;
            $scope.maxUsers = item.max_users;
            $scope.MaxLic = item.max_licensed_users;
            internalAdminService.getMpsDetails(item.mfr).then(function (response) {
                var data = response.data.Data;
                for(i=0;i<data.length;i++){
                    var tempObj = {};
                    tempObj.prod = data[i].prod;
                    tempObj.sch = data[i].sch;
                    tempObj.realm = data[i].realm;
                    tempObj.ec = data[i].ec;
                    tempObj.ssoId = data[i].sso_idp_id;
                    tempObj.ssoLoginUrl = data[i].sso_login_url;
                    tempObj.ssoLogoutUrl = data[i].sso_logout_url;
                    tempObj.ssoRole = data[i].sso_roles;
                    $scope.tempMpsData.push(tempObj);
                }
                $scope.tempMpsTable = new ngTableParams({
                    reload: $scope.tempMpsTable
                  }, {
                    getData: function ($defer, params) {
                      if (params.settings().$scope == null) {
                        params.settings().$scope = $scope;
                      }
                      $scope.tempMpsTabledata = $scope.tempMpsData;
                      $defer.resolve($scope.tempMpsTabledata);
                    }
                  });
                $scope.tempMpsTable.reload();
                $("#addMpsForm").slideUp();
                $("#addMoreMps").show();
                internalAdminService.getDefFearture(item.mfr).then(function (response) {
                    var data = response.data.Data;
                    for(i=0;i<$scope.tempMpsData.length;i++){
                        for(j=0;j<data.length;j++){
                            if($scope.tempMpsData[i].prod == data[j].prod && $scope.tempMpsData[i].sch == data[j].sch) {
                                $scope.tempMpsData[i].active = data[j].active;
                                $scope.tempMpsData[i].default_feature_internal = data[j].default_feature_internal;
                                $scope.tempMpsData[i].default_feature_external = data[j].default_feature_external;
                                $scope.tempMpsData[i].nsr_enabled = data[j].nsr_enabled;
                                $scope.tempMpsData[i].logo = data[j].logo;
                                $scope.tempMpsData[i].logo_url = data[j].logo_url;
                            }
                        }
                    }
                    internalAdminService.getUiFearture(item.mfr).then(function (response) {
                        var data = response.data.Data;
                        for(i=0;i<$scope.tempMpsData.length;i++){
                            for(j=0;j<data.length;j++){
                                if($scope.tempMpsData[i].prod == data[j].prod && $scope.tempMpsData[i].sch == data[j].sch) {
                                    $scope.tempMpsData[i].allowed_extension = data[j].allowed_extension;
                                    $scope.tempMpsData[i].compound_rows = data[j].compound_rows;
                                    $scope.tempMpsData[i].core_delimiter = data[j].core_delimiter;
                                    $scope.tempMpsData[i].default_days = data[j].default_days;
                                    $scope.tempMpsData[i].default_exp_view = data[j].default_exp_view;
                                    $scope.tempMpsData[i].iv_display_fields = data[j].iv_display_fields;
                                    $scope.tempMpsData[i].exp_display_fields = data[j].exp_display_fields;
                                    $scope.tempMpsData[i].facet_limit = data[j].facet_limit;
                                    $scope.tempMpsData[i].is_stage_domain = data[j].is_stage_domain;
                                    $scope.tempMpsData[i].is_stage_keyspace = data[j].is_stage_keyspace;
                                    $scope.tempMpsData[i].max_day_range = data[j].max_day_range;
                                    $scope.tempMpsData[i].json_form = data[j].json_form;
                                    $scope.tempMpsData[i].max_upload_size = data[j].max_upload_size;
                                    $scope.tempMpsData[i].lv_to_exp = data[j].lv_to_exp;
                                }
                            }
                        }
                        internalAdminService.getRoleList(item.mfr).then(function (response) {
                            var data = response.data.Data;
                            var mpsList = [];
                            var mpsRetList = [];
                            for(i=0;i<$scope.tempMpsData.length;i++){
                                mpsList.push($scope.mfr+":"+$scope.tempMpsData[i].prod+":"+$scope.tempMpsData[i].sch);
                            }
                            for(i=0;i<data.length;i++){
                                data[i].count = 0;
                                for(key in data[i].domains){
                                    data[i].count++;
                                    for(j=0;j<mpsList.length;j++){
                                        if(mpsList[j].indexOf(data[i].domains[key])>=0){
                                            if(data[i].features[mpsList[j]].indexOf("admin")>=0){
                                                data[i].count--;
                                            }
                                        }
                                    }
                                }
                                if(data[i].count == 0){
                                    $scope.step5FormDefRoleNameDis = data[i].name.split("_").splice(3,1).join(".");
                                    $scope.step5FormDefRoleName = data[i].name;

                                    $('#roleNameField').attr('readonly', true);
                                    for(key in data[i].domains){
                                        for(k=0;k<$scope.tempMpsData.length;k++){
                                            if($scope.mfr+":"+$scope.tempMpsData[k].prod+":"+$scope.tempMpsData[k].sch == data[i].domains[key]){
                                                $scope.tempMpsData[k].features = data[i].features[data[i].domains[key]];
                                                $scope.tempMpsData[k].prodName = key;
                                            }
                                        }
                                    }
                                }
                            }
                            internalAdminService.getUserList($scope.mfr).then(function (response) {
                                var data = response.data.Data;
                                for(i=0;i<data.length;i++){
                                    if(data[i].role == $scope.step5FormDefRoleName){
                                        for(j=0;j<$scope.tempMpsData.length;j++){
                                            if(data[i].mps_def == $scope.mfr+":"+$scope.tempMpsData[j].prod+":"+$scope.tempMpsData[j].sch)
                                                data[i].prodName = $scope.tempMpsData[j].prodName;
                                        }
                                        $scope.tempUserData.push(data[i]);
                                    }
                                }
                                $timeout(function() {
                                    $('#wizModal').modal("show"); 
                                    $scope.data_loading = false; 
                                    deferred.resolve();
                                }, 100);
                            });
                        });           
                    });                              
                });
            });
            return deferred.promise; 
        };
        $scope.showRealmTable = function () {
            if($(".realmConfigTab").is(":visible")){
                $(".realmConfigTab").fadeToggle('medium', function() {
                    $(".manTab").toggleClass("col-10");
                    $(".manTab").toggleClass("col-12");
                });
            }else {
                $(".manTab").toggleClass("col-10");
                $(".manTab").toggleClass("col-12");
                $(".realmConfigTab").fadeToggle('medium');
            }
        };
        $scope.addMpsRow = function (data) {
            $scope.step2FormProd = "";
            $scope.step2FormSch = "";
            $scope.step2FormRealm = "prod";
            $scope.step2FormEc = "";
            $scope.step2FormSsoId = "";
            $scope.step2FormSsoLoginUrl = "";
            $scope.step2FormSsoLogoutUrl = "";
            $scope.step2FormSsoRoles = "";
            $("#addMpsForm").slideDown();
            $("#addMoreMps").hide();
        };
        $scope.addMpsCancel = function () {
            $("#addMpsForm").slideUp();
            $("#addMoreMps").show();
        };
        $scope.enableRoleDoneButton = function () {
            if($scope.step5FormDefRoleNameDis.length != 0 && /^[a-zA-Z0-9- ]*$/.test($scope.step5FormDefRoleNameDis)){
                $("#freaseRoleBtn").fadeIn("medium");
            }else {
                $("#freaseRoleBtn").fadeOut("medium");
            }
        };
        $scope.freaseRoleName = function () {
            $('#roleNameField').attr('readonly', true);
            $("#freaseRoleBtn").fadeOut("medium");
            $(".step5 .card").fadeIn("medium");
        };
        $scope.mpsUiDone = function (row) {
            if(row.compound_rows.length == 0 || row.core_delimiter == "" || row.default_days == "" || row.exp_display_fields == "" || row.facet_limit == "" || row.is_stage_domain == "" || row.is_stage_keyspace == "" || row.iv_display_fields == "" || row.json_form == "" || row.max_day_range == "" || row.max_upload_size == ""){

            }else if(row.mpsAllowedExtension.length == 0) {
                $("#ext"+row.mpsId).show();
                $("#extSelect"+row.mpsId).css("border-color","#dc3545");
            }else if (!$scope.validateJson(row.json_form)){
                $("#json"+row.mpsId).show();
                $("#jsonText"+row.mpsId).css("border-color","#dc3545");
            }else {
                $scope.data_loading = true;
                var formData = {
                    "mfr" : row.mps.split(":")[0],
                    "prod" : row.mps.split(":")[1],
                    "sch" : row.mps.split(":")[2],
                    "allowed_extension" : row.mpsAllowedExtension.toString(),
                    "compound_rows" : row.compound_rows,
                    "core_delimiter" : row.core_delimiter,
                    "default_days" : row.default_days,
                    "default_exp_view" : row.default_exp_view,
                    "iv_display_fields" : row.iv_display_fields,
                    "exp_display_fields" : row.exp_display_fields,
                    "facet_limit" : row.facet_limit,
                    "is_stage_domain" : row.is_stage_domain,
                    "is_stage_keyspace" : row.is_stage_keyspace,
                    "json_form" : row.json_form,
                    "max_day_range" : row.max_day_range,
                    "max_upload_size" : row.max_upload_size,
                    "lv_to_exp" : row.lv_to_exp  
                };
                internalAdminService.addUiFeatStep4(formData).then(function (response) {
                    $("#"+row.mpsId+"Uibadge").removeClass("badge-danger");
                    $("#"+row.mpsId+"Uibadge").addClass("badge-success");
                    $("#"+row.mpsId+"Uibadge").html("Done");
                    $('#collapseUi'+row.mpsId).collapse("hide");
                    row.uiDone = true;
                    $scope.data_loading = false;
                },function(error){
                  $scope.data_loading = false;
                });
            }
        };
        $scope.validateJson = function (json){
            try {
                JSON.parse(json);
              } catch (e) {
                return false;
              }
            return true;
        };
        $scope.roleMpsDone = function (row) {  
            var featuresData = $filter('filter')(row.defRoleFeature, {checked: true});
            var tempFeatures = [];
            for(i=0;i<featuresData.length;i++){
              tempFeatures.push(featuresData[i].value);
            }        
            if(row.domain==""){

            }else if(featuresData.length == 0){
                $("#alert"+row.defRoleMpsId).show();
            }else {
                tempFeatures.push('admin');
                var tempRealm = [];
                tempRealm.push(row.realm);
                var tempMPS = row.defRoleMps.split(':');
                var formData = {
                  "name":$scope.step5FormDefRoleNameDis,
                  "is_super":false,
                  "domain":row.domain,
                  "mfr":tempMPS[0],
                  "prod":tempMPS[1],
                  "sch":tempMPS[2],
                  "realm":tempRealm,
                  "features":tempFeatures
                };
                internalAdminService.addNewRole(formData).then(function (response) {
                    $("#alert"+row.defRoleMpsId).hide();
                    for(i=0;i<$scope.tempMpsData.length;i++){
                        if($scope.tempMpsData[i].mpsName == tempMPS[0]+":"+tempMPS[1]+":"+tempMPS[2]){
                            $scope.tempMpsData[i].domainName = row.domain;
                        }
                    }
                    $("#"+row.defRoleMpsId+"RoleBadge").removeClass("badge-danger");
                    $("#"+row.defRoleMpsId+"RoleBadge").addClass("badge-success");
                    $("#"+row.defRoleMpsId+"RoleBadge").html("Done");
                    $('#collapseRole'+row.defRoleMpsId).collapse("hide");
                    row.roleDone = true;
                },function(error){
                  $scope.data_loading = false;
                });
            }
        };
        $scope.mpsConfigDone = function (row) {
            if(row.logo=="" || row.logo_url == ""){

            }else {
                $scope.data_loading = true;
                var formData = {
                    "mfr" : row.Mps.split(":")[0],
                    "prod" : row.Mps.split(":")[1],
                    "sch" : row.Mps.split(":")[2],
                    "ec" : row.Mps.split(":")[0],
                    "active" : row.active,
                    "nsr_enabled" : row.nsr_enabled,
                    "default_feature_internal" : row.default_feature_internal,
                    "default_feature_external" : row.default_feature_external,
                    "logo" : row.logo,
                    "logo_url" : row.logo_url
                }
                internalAdminService.addDefaultFeatStep3(formData).then(function (response) {
                    $("#"+row.mpsId+"badge").removeClass("badge-danger");
                    $("#"+row.mpsId+"badge").addClass("badge-success");
                    $("#"+row.mpsId+"badge").html("Done");
                    $('#collapse'+row.mpsId).collapse("hide");
                    row.done = true;
                    $scope.data_loading = false;
                },function(error){
                  $scope.data_loading = false;
                });
            }
        };
        $scope.deleteRowTempMps = function (data) {
            for(i=0;i<$scope.tempMpsData.length;i++){
                if($scope.tempMpsData[i].prod == data.prod && $scope.tempMpsData[i].sch == data.sch && $scope.tempMpsData[i].realm == data.realm){
                    $scope.tempMpsData.splice(i,1);
                    $scope.tempMpsTable.reload();
                }
            }
            if($scope.tempMpsData.length==0){
                $scope.step2FormProd = "";
                $scope.step2FormSch = "";
                $scope.step2FormRealm = "prod";
                $scope.step2FormEc = "";
                $scope.step2FormSsoId = "";
                $scope.step2FormSsoLoginUrl = "";
                $scope.step2FormSsoLogoutUrl = "";
                $scope.step2FormSsoRoles = "";
                $("#addMpsForm").slideDown();
                $("#addMoreMps").hide();
            }
        };
        $scope.prodAddBtn = function () {
            if($scope.step2FormProd == "" || $scope.step2FormSch == ""){

            }else {
                var formData = {
                    "mfr" : $scope.mfr,
                    "prod" : $scope.step2FormProd,
                    "sch" : $scope.step2FormSch,
                    "ec" : $scope.mfr,
                    "realm" : $scope.step2FormRealm,
                    "sso_login_url" : (($scope.step2FormSsoLoginUrl.length == 0) ? '' : $scope.step2FormSsoLoginUrl),
                    "sso_logout_url" : (($scope.step2FormSsoLogoutUrl.length == 0) ? '' : $scope.step2FormSsoLogoutUrl),
                    "sso_idp_id" : (($scope.step2FormSsoId.length == 0) ? '' : $scope.step2FormSsoId),
                    "sso_roles" : (($scope.step2FormSsoRoles.length == 0) ? '' : $scope.step2FormSsoRoles),
                };
                internalAdminService.addMpsStep2(formData).then(function (response) {
                    var tempObj = {};
                    tempObj.prod = $scope.step2FormProd;
                    tempObj.sch = $scope.step2FormSch;
                    tempObj.realm = $scope.step2FormRealm;
                    tempObj.ec = $scope.mfr;
                    tempObj.ssoId = (($scope.step2FormSsoId.length == 0) ? '' : $scope.step2FormSsoId);
                    tempObj.ssoLoginUrl = (($scope.step2FormSsoLoginUrl.length == 0) ? '' : $scope.step2FormSsoLoginUrl);
                    tempObj.ssoLogoutUrl = (($scope.step2FormSsoLogoutUrl.length == 0) ? '' : $scope.step2FormSsoLogoutUrl);
                    tempObj.ssoRole = (($scope.step2FormSsoRoles.length == 0) ? '' : $scope.step2FormSsoRoles);
                    $scope.tempMpsData.push(tempObj);
                    $scope.tempMpsTable = new ngTableParams({
                        reload: $scope.tempMpsTable
                      }, {
                        getData: function ($defer, params) {
                          if (params.settings().$scope == null) {
                            params.settings().$scope = $scope;
                          }
                          $scope.tempMpsTabledata = $scope.tempMpsData;
                          $defer.resolve($scope.tempMpsTabledata);
                        }
                      });
                    $scope.tempMpsTable.reload();
                    $("#addMpsForm").slideUp();
                    $("#addMoreMps").show();
                    $scope.data_loading = false;
                },function(error){
                  $scope.data_loading = false;
                });
            }
        };   
        $scope.wizStep1Next = function () {
            if($scope.mfr.length == 0 || $scope.maxUsers.length == 0 || $scope.MaxLic.length ==  0){
            }else {
                var deferred = $q.defer();
                $scope.data_loading = true;
                var formData = {
                    "mfr" : $scope.mfr,
                    "name" : $scope.mfr,
                    "max_licensed_users" : $scope.MaxLic,
                    "max_users" : $scope.maxUsers,
                    "t" : $scope.mfrType,
                    "config_status" : (($scope.wizEditMode && !$scope.contMode) ? "complete" : "add_mps_pending")
                };
                internalAdminService.addManStep1(formData).then(function (response) {
                    if($scope.wizEditMode){
                        $("#wizStep1").removeClass("btn-primary");
                        $("#wizStep1").addClass("btn-success");
                        $("#wizStep2").removeClass("btn-success");
                        $("#wizStep2").addClass("btn-primary");
                    }else {
                        $("#wizStep1").removeClass("btn-primary");
                        $("#wizStep1").addClass("btn-success");
                        $("#wizStep2").removeClass("btn-secondary");
                        $("#wizStep2").addClass("btn-primary");
                    }
                    $scope.mfrName = $scope.mfr;
                    $("#wizModal .modal-title").html($scope.wizStep2Title);
                    $(".step1").hide();
                    $(".step2").show("slow", function() {
                        if($scope.tempMpsTable != undefined && !$scope.contMode){                    
                            $scope.tempMpsTable.reload();
                            $("#addMpsForm").hide();
                            $("#addMoreMps").show();
                        }else if($scope.contMode){
                            $("#addMpsForm").show();
                            $("#addMoreMps").hide();
                        } else {
                            $("#addMpsForm").show();
                            $("#addMoreMps").hide();
                        }
                    });
                    $timeout(function() {
                        $scope.data_loading = false;
                        deferred.resolve();
                    }, 100);
                },function(error){
                  $scope.data_loading = false;
                });
            }
            return deferred.promise;
        };
        $scope.wizStep2Next = function () {
            if($scope.tempMpsData.length == 0){
                $("#wizStep2Info").removeClass('alert-primary');
                $("#wizStep2Info").addClass('alert-danger');
                $("#wizStep2Info #info").hide();
                $("#wizStep2Info #error").show();
            }else {                
                var deferred = $q.defer();
                $scope.mpsConfigData = [];
                $scope.data_loading = true;
                var formData = {
                    "mfr" : $scope.mfr,
                    "name" : $scope.mfr,
                    "max_licensed_users" : $scope.MaxLic,
                    "max_users" : $scope.maxUsers,
                    "t" : $scope.mfrType,
                    "config_status" : ($scope.wizEditMode && !$scope.contMode) ? "complete" : "default_feature_pending"
                };
                internalAdminService.addManStep1(formData).then(function (response) {
                },function(error){
                  $scope.data_loading = false;
                });
                if($scope.wizEditMode){
                    $("#wizStep2").removeClass("btn-primary");
                    $("#wizStep2").addClass("btn-success");
                    $("#wizStep3").removeClass("btn-success");
                    $("#wizStep3").addClass("btn-primary");
                }else {
                    $("#wizStep2").removeClass("btn-primary");
                    $("#wizStep2").addClass("btn-success");
                    $("#wizStep3").removeClass("btn-secondary");
                    $("#wizStep3").addClass("btn-primary");
                }
                $("#wizModal .modal-title").html($scope.wizStep3Title);
                $(".step2").hide();
                $(".step3").show();
                var tempObj = {};
                for(i=0;i<$scope.tempMpsData.length;i++){
                    if($scope.wizEditMode || $scope.contMode){
                        tempObj = {};
                        tempObj.mpsId = $scope.mfr+"_"+$scope.tempMpsData[i].prod+"_"+$scope.tempMpsData[i].sch;
                        tempObj.Mps = $scope.mfr+":"+$scope.tempMpsData[i].prod+":"+$scope.tempMpsData[i].sch;
                        tempObj.active = $scope.tempMpsData[i].active;
                        tempObj.default_feature_external = $scope.tempMpsData[i].default_feature_external;
                        tempObj.default_feature_internal = $scope.tempMpsData[i].default_feature_internal;
                        tempObj.logo = $scope.tempMpsData[i].logo;
                        tempObj.logo_url = $scope.tempMpsData[i].logo_url;
                        tempObj.nsr_enabled = $scope.tempMpsData[i].nsr_enabled;
                        tempObj.done = true;
                        $scope.mpsConfigData.push(tempObj);
                        $scope.mfsConfigFlag = 0;                        
                        $timeout(function() {
                            $scope.data_loading = false;
                            deferred.resolve();
                        }, 100);
                    }else {
                        tempObj = {};
                        tempObj.mpsId = $scope.mfr+"_"+$scope.tempMpsData[i].prod+"_"+$scope.tempMpsData[i].sch;
                        tempObj.Mps = $scope.mfr+":"+$scope.tempMpsData[i].prod+":"+$scope.tempMpsData[i].sch;
                        tempObj.active = true;
                        tempObj.default_feature_external = "explorer";
                        tempObj.default_feature_internal = "explorer";
                        tempObj.logo = "";
                        tempObj.logo_url = "";
                        tempObj.nsr_enabled = true;
                        tempObj.done = false;
                        $scope.mpsConfigData.push(tempObj);
                        $scope.mfsConfigFlag = 0;                        
                        $timeout(function() {
                            $scope.data_loading = false;
                            deferred.resolve();
                        }, 100);
                    }
                }
            }
            return deferred.promise;
        };
        $scope.wizStep3Next = function () {
            for(i=0;i<$scope.mpsConfigData.length;i++){
                if($scope.mpsConfigData[i].done){
                    $scope.mfsConfigFlag++;
                }
            }
            if($scope.mfsConfigFlag != $scope.tempMpsData.length){
                $("#wizStep3Info").removeClass('alert-primary');
                $("#wizStep3Info").addClass('alert-danger');
                $("#wizStep3Info").html("<strong>"+$scope.wizStepInfoError+"</strong>"+ $scope.defFeatError);
            }else {
                $scope.data_loading = true;
                var deferred = $q.defer();
                var formData = {
                    "mfr" : $scope.mfr,
                    "name" : $scope.mfr,
                    "max_licensed_users" : $scope.MaxLic,
                    "max_users" : $scope.maxUsers,
                    "t" : $scope.mfrType,
                    "config_status" : ($scope.wizEditMode && !$scope.contMode) ? "complete" : "ui_configration_pending"
                };
                internalAdminService.addManStep1(formData).then(function (response) {
                },function(error){
                  $scope.data_loading = false;
                });
                if($scope.wizEditMode){
                    $("#wizStep3").removeClass("btn-primary");
                    $("#wizStep3").addClass("btn-success");
                    $("#wizStep4").removeClass("btn-success");
                    $("#wizStep4").addClass("btn-primary");
                }else {
                    $("#wizStep3").removeClass("btn-primary");
                    $("#wizStep3").addClass("btn-success");
                    $("#wizStep4").removeClass("btn-secondary");
                    $("#wizStep4").addClass("btn-primary");
                }
                $("#wizModal .modal-title").html($scope.wizStep4Title);
                $(".step3").hide();
                $(".step4").show();
                var tempObj = {};
                for(i=0;i<$scope.tempMpsData.length;i++){
                    $scope.tempMpsData[i].mpsName = $scope.mfr+":"+$scope.tempMpsData[i].prod+":"+$scope.tempMpsData[i].sch;
                    if($scope.wizEditMode){
                        tempObj={};
                        tempObj.allowed_extension = $scope.tempMpsData[i].allowed_extension.split(",");
                        tempObj.mpsId = $scope.mfr+"_"+$scope.tempMpsData[i].prod+"_"+$scope.tempMpsData[i].sch;
                        tempObj.mps = $scope.mfr+":"+$scope.tempMpsData[i].prod+":"+$scope.tempMpsData[i].sch;
                        tempObj.default_days = $scope.tempMpsData[i].default_days;
                        tempObj.compound_rows = $scope.tempMpsData[i].compound_rows;
                        tempObj.core_delimiter = $scope.tempMpsData[i].core_delimiter;
                        tempObj.exp_display_fields = $scope.tempMpsData[i].exp_display_fields;
                        tempObj.facet_limit = $scope.tempMpsData[i].facet_limit;
                        tempObj.default_exp_view = $scope.tempMpsData[i].default_exp_view;
                        tempObj.iv_display_fields = $scope.tempMpsData[i].iv_display_fields;
                        tempObj.is_stage_domain = $scope.tempMpsData[i].is_stage_domain;
                        tempObj.is_stage_keyspace = $scope.tempMpsData[i].is_stage_keyspace;
                        tempObj.max_day_range = $scope.tempMpsData[i].max_day_range;
                        tempObj.max_upload_size = $scope.tempMpsData[i].max_upload_size;
                        tempObj.lv_to_exp = $scope.tempMpsData[i].lv_to_exp;
                        tempObj.json_form = $scope.tempMpsData[i].json_form;
                        tempObj.dayRangeUnit = "days";
                        tempObj.upldSizeUnit = "mb";
                        tempObj.uiDone = true;
                        $scope.mpsUiData.push(tempObj);                        
                        $timeout(function() {
                            $scope.data_loading = false;
                            deferred.resolve();
                        }, 100);
                    }else if($scope.contMode){
                        if($scope.tempMpsData[i].allowed_extension == undefined){
                            tempObj={};
                            tempObj.mpsId = $scope.mfr+"_"+$scope.tempMpsData[i].prod+"_"+$scope.tempMpsData[i].sch;
                            tempObj.mps = $scope.mfr+":"+$scope.tempMpsData[i].prod+":"+$scope.tempMpsData[i].sch;
                            tempObj.default_days = "";
                            tempObj.compound_rows = "";
                            tempObj.core_delimiter = "";
                            tempObj.exp_display_fields = "";
                            tempObj.facet_limit = "";
                            tempObj.default_exp_view = $scope.default_exp_view[0].value;
                            tempObj.iv_display_fields = "";
                            tempObj.is_stage_domain = "";
                            tempObj.is_stage_keyspace = "";
                            tempObj.max_day_range = "";
                            tempObj.max_upload_size = "";
                            tempObj.lv_to_exp = false;
                            tempObj.json_form = "";
                            tempObj.mpsAllowedExtension = [];
                            tempObj.dayRangeUnit = "days";
                            tempObj.upldSizeUnit = "mb";
                            $scope.mpsUiData.push(tempObj);
                            $timeout(function() {
                                $scope.data_loading = false;
                                deferred.resolve();
                            }, 100);
                        }else {
                            tempObj={};
                            tempObj.allowed_extension = $scope.tempMpsData[i].allowed_extension.split(",");
                            tempObj.mpsId = $scope.mfr+"_"+$scope.tempMpsData[i].prod+"_"+$scope.tempMpsData[i].sch;
                            tempObj.mps = $scope.mfr+":"+$scope.tempMpsData[i].prod+":"+$scope.tempMpsData[i].sch;
                            tempObj.default_days = $scope.tempMpsData[i].default_days;
                            tempObj.compound_rows = $scope.tempMpsData[i].compound_rows;
                            tempObj.core_delimiter = $scope.tempMpsData[i].core_delimiter;
                            tempObj.exp_display_fields = $scope.tempMpsData[i].exp_display_fields;
                            tempObj.facet_limit = $scope.tempMpsData[i].facet_limit;
                            tempObj.default_exp_view = $scope.tempMpsData[i].default_exp_view;
                            tempObj.iv_display_fields = $scope.tempMpsData[i].iv_display_fields;
                            tempObj.is_stage_domain = $scope.tempMpsData[i].is_stage_domain;
                            tempObj.is_stage_keyspace = $scope.tempMpsData[i].is_stage_keyspace;
                            tempObj.max_day_range = $scope.tempMpsData[i].max_day_range;
                            tempObj.max_upload_size = $scope.tempMpsData[i].max_upload_size;
                            tempObj.lv_to_exp = $scope.tempMpsData[i].lv_to_exp;
                            tempObj.json_form = $scope.tempMpsData[i].json_form;
                            tempObj.dayRangeUnit = "days";
                            tempObj.upldSizeUnit = "mb";
                            tempObj.uiDone = true;
                            $scope.mpsUiData.push(tempObj);                        
                            $timeout(function() {
                                $scope.data_loading = false;
                                deferred.resolve();
                            }, 100);
                        }
                    }else{
                        tempObj={};
                        tempObj.mpsId = $scope.mfr+"_"+$scope.tempMpsData[i].prod+"_"+$scope.tempMpsData[i].sch;
                        tempObj.mps = $scope.mfr+":"+$scope.tempMpsData[i].prod+":"+$scope.tempMpsData[i].sch;
                        tempObj.default_days = "";
                        tempObj.compound_rows = "";
                        tempObj.core_delimiter = "";
                        tempObj.exp_display_fields = "";
                        tempObj.facet_limit = "";
                        tempObj.default_exp_view = $scope.default_exp_view[0].value;
                        tempObj.iv_display_fields = "";
                        tempObj.is_stage_domain = "";
                        tempObj.is_stage_keyspace = "";
                        tempObj.max_day_range = "";
                        tempObj.max_upload_size = "";
                        tempObj.lv_to_exp = false;
                        tempObj.json_form = "";
                        tempObj.mpsAllowedExtension = [];
                        tempObj.dayRangeUnit = "days";
                        tempObj.upldSizeUnit = "mb";
                        $scope.mpsUiData.push(tempObj);
                        $timeout(function() {
                            $scope.data_loading = false;
                            deferred.resolve();
                        }, 100);
                    }
                }
                $scope.mfsUiFlag = 0;
            }
            return deferred.promise;
        };
        $scope.wizStep4Next = function () {
            for(i=0;i<$scope.mpsUiData.length;i++){
                if($scope.mpsUiData[i].uiDone){
                    $scope.mfsUiFlag++;
                }
            }
            if($scope.mfsUiFlag != $scope.tempMpsData.length){
                $("#wizStep4Info").removeClass('alert-primary');
                $("#wizStep4Info").addClass('alert-danger');
                $("#wizStep4Info").html("<strong>Error!</strong> Please configure all the MPS added.")
            }else {
                $scope.data_loading = true;
                var deferred = $q.defer();
                var formData = {
                    "mfr" : $scope.mfr,
                    "name" : $scope.mfr,
                    "max_licensed_users" : $scope.MaxLic,
                    "max_users" : $scope.maxUsers,
                    "t" : $scope.mfrType,
                    "config_status" : ($scope.wizEditMode && !$scope.contMode) ? "complete" : "default_role_pending"
                };
                internalAdminService.addManStep1(formData).then(function (response) {
                },function(error){
                  $scope.data_loading = false;
                });
                if($scope.wizEditMode){
                    $("#wizStep4").removeClass("btn-primary");
                    $("#wizStep4").addClass("btn-success");
                    $("#wizStep5").removeClass("btn-success");
                    $("#wizStep5").addClass("btn-primary");
                }else {
                    $("#wizStep4").removeClass("btn-primary");
                    $("#wizStep4").addClass("btn-success");
                    $("#wizStep5").removeClass("btn-secondary");
                    $("#wizStep5").addClass("btn-primary");
                }
                $("#wizModal .modal-title").html($scope.wizStep5Title);
                $(".step4").hide();
                $(".step5").show();
                var tempObj = {};
                for(i=0;i<$scope.tempMpsData.length;i++){
                    if($scope.wizEditMode){
                        tempObj = {};
                        tempObj.defRoleMpsId = $scope.mfr+"_"+$scope.tempMpsData[i].prod+"_"+$scope.tempMpsData[i].sch;
                        tempObj.defRoleMps = $scope.mfr+":"+$scope.tempMpsData[i].prod+":"+$scope.tempMpsData[i].sch;                        
                        tempObj.defRoleFeature = $scope.roleFeatures;
                        tempObj.domain = $scope.tempMpsData[i].prodName;
                        var tempCheckedfeatures = $scope.tempMpsData[i].features.split(',');
                        for(j=0;j<tempObj.defRoleFeature.length;j++){
                            for(k=0;k<tempCheckedfeatures.length;k++){
                                if(tempObj.defRoleFeature[j].value == tempCheckedfeatures[k]){
                                    tempObj.defRoleFeature[j].checked = true;
                                }
                            }
                        }
                        tempObj.roleDone = true;
                        $scope.tempMpsData[i].domainName = tempObj.domain;
                        tempObj.realm = $scope.tempMpsData[i].realm;
                        $scope.defRoleData.push(tempObj);
                        $scope.defRoleFlag = 0;
                        $timeout(function() {
                            $scope.data_loading = false;
                            deferred.resolve();
                        }, 100);
                    }else if($scope.contMode) {
                        if($scope.tempMpsData[i].prodName == undefined){
                            tempObj = {};
                            tempObj.defRoleMpsId = $scope.mfr+"_"+$scope.tempMpsData[i].prod+"_"+$scope.tempMpsData[i].sch;
                            tempObj.defRoleMps = $scope.mfr+":"+$scope.tempMpsData[i].prod+":"+$scope.tempMpsData[i].sch;                        
                            tempObj.defRoleFeature = $scope.roleFeatures;
                            tempObj.roleDone = false;
                            $scope.tempMpsData[i].domainName = tempObj.domain;
                            tempObj.realm = $scope.tempMpsData[i].realm;
                            $scope.defRoleData.push(tempObj);
                            $scope.defRoleFlag = 0;
                            $timeout(function() {
                                $scope.data_loading = false;
                                deferred.resolve();
                            }, 100);
                        }else {
                            tempObj = {};
                            tempObj.defRoleMpsId = $scope.mfr+"_"+$scope.tempMpsData[i].prod+"_"+$scope.tempMpsData[i].sch;
                            tempObj.defRoleMps = $scope.mfr+":"+$scope.tempMpsData[i].prod+":"+$scope.tempMpsData[i].sch;                        
                            tempObj.defRoleFeature = $scope.roleFeatures;
                            tempObj.domain = $scope.tempMpsData[i].prodName;
                            var tempCheckedfeatures = $scope.tempMpsData[i].features.split(',');
                            for(j=0;j<tempObj.defRoleFeature.length;j++){
                                for(k=0;k<tempCheckedfeatures.length;k++){
                                    if(tempObj.defRoleFeature[j].value == tempCheckedfeatures[k]){
                                        tempObj.defRoleFeature[j].checked = true;
                                    }
                                }
                            }
                            tempObj.roleDone = true;
                            $scope.tempMpsData[i].domainName = tempObj.domain;
                            tempObj.realm = $scope.tempMpsData[i].realm;
                            $scope.defRoleData.push(tempObj);
                            $scope.defRoleFlag = 0;
                            $timeout(function() {
                                $scope.data_loading = false;
                                deferred.resolve();
                            }, 100);
                        }
                    }else {
                        tempObj = {};
                        tempObj.defRoleMpsId = $scope.mfr+"_"+$scope.tempMpsData[i].prod+"_"+$scope.tempMpsData[i].sch;
                        tempObj.defRoleMps = $scope.mfr+":"+$scope.tempMpsData[i].prod+":"+$scope.tempMpsData[i].sch;                        
                        tempObj.defRoleFeature = $scope.roleFeatures;
                        tempObj.roleDone = false;
                        $scope.tempMpsData[i].domainName = tempObj.domain;
                        tempObj.realm = $scope.tempMpsData[i].realm;
                        $scope.defRoleData.push(tempObj);
                        $scope.defRoleFlag = 0;
                        $timeout(function() {
                            $scope.data_loading = false;
                            deferred.resolve();
                        }, 100);
                    }
                }
                if($scope.wizEditMode){
                    if($("#roleNameField").prop("readonly")){
                        setTimeout(function(){$(".step5 .card").fadeIn("medium");}, 100);
                    }
                }
                if($scope.contMode && $scope.step5FormDefRoleNameDis == ""){
                    if($("#roleNameField").removeProp("readonly")){
                        setTimeout(function(){$(".step5 .card").fadeOut("medium");}, 100);
                    }
                }else {
                    if($("#roleNameField").prop("readonly")){
                        setTimeout(function(){$(".step5 .card").fadeIn("medium");}, 100);
                    }
                }
            }
            return deferred.promise;
        };
        $scope.wizStep5Next = function () {
            for(i=0;i<$scope.defRoleData.length;i++){
                if($scope.defRoleData[i].roleDone){
                    $scope.defRoleFlag++;
                }
            }
            if($scope.step5FormDefRoleNameDis == ""){
                $("#step5Alert").removeClass("alert-primary");
                $("#step5Alert").addClass("alert-danger");
                $("#step5Alert").html("<strong>Error!</strong> Please enter role name.");
            }else if($scope.defRoleFlag != $scope.tempMpsData.length) {
                $("#step5Alert").removeClass("alert-primary");
                $("#step5Alert").addClass("alert-danger");
                $("#step5Alert").html("<strong>Error!</strong> Please complete pending items.");
            }else {
                var deferred = $q.defer();
                $scope.data_loading = true;
                var formData = {
                    "mfr" : $scope.mfr,
                    "name" : $scope.mfr,
                    "max_licensed_users" : $scope.MaxLic,
                    "max_users" : $scope.maxUsers,
                    "t" : $scope.mfrType,
                    "config_status" : ($scope.wizEditMode && !$scope.contMode) ? "complete" : "default_user_pending"
                };
                internalAdminService.addManStep1(formData).then(function (response) {
                },function(error){
                  $scope.data_loading = false;
                });
                if($scope.wizEditMode){
                    $("#wizStep5").removeClass("btn-primary");
                    $("#wizStep5").addClass("btn-success");
                    $("#wizStep6").removeClass("btn-success");
                    $("#wizStep6").addClass("btn-primary");
                }else {
                    $("#wizStep5").removeClass("btn-primary");
                    $("#wizStep5").addClass("btn-success");
                    $("#wizStep6").removeClass("btn-secondary");
                    $("#wizStep6").addClass("btn-primary");
                }
                $("#step5Alert").addClass("alert-primary");
                $("#step5Alert").removeClass("alert-danger");
                $("#step5Alert").html("<strong>Almost Done!</strong> Lets configure default role.");
                $("#wizModal .modal-title").html($scope.wizStep6Title);
                $(".step5").hide();
                $(".step6").show();
                internalAdminService.getRoleList($scope.mfr).then(function (response) {
                    var data = response.data.Data;
                    var mpsList = [];
                    var mpsRetList = [];
                    for(i=0;i<$scope.tempMpsData.length;i++){
                        mpsList.push($scope.mfr+":"+$scope.tempMpsData[i].prod+":"+$scope.tempMpsData[i].sch);
                    }
                    for(i=0;i<data.length;i++){
                        data[i].count = 0;
                        for(key in data[i].domains){
                            data[i].count++;
                            for(j=0;j<mpsList.length;j++){
                                if(mpsList[j].indexOf(data[i].domains[key])>=0){
                                    if(data[i].features[mpsList[j]].indexOf("admin")>=0){
                                        data[i].count--;
                                    }
                                }
                            }
                        }
                        if(data[i].count == 0){
                            $scope.step5FormDefRoleNameDis = data[i].name.split("_").splice(3,1).join('.');
                            $scope.step5FormDefRoleName = data[i].name;
                            $('#roleNameField').attr('readonly', true);
                            for(key in data[i].domains){
                                for(k=0;k<$scope.tempMpsData.length;k++){
                                    if($scope.mfr+":"+$scope.tempMpsData[k].prod+":"+$scope.tempMpsData[k].sch == data[i].domains[key]){
                                        $scope.tempMpsData[k].features = data[i].features[data[i].domains[key]];
                                        $scope.tempMpsData[k].prodName = key;
                                    }
                                }
                            }
                        }
                    }
                    $scope.step6FormProd = $scope.tempMpsData[0].prodName;
                    if($scope.wizEditMode){
                        $scope.tempUserTable = new ngTableParams({
                            reload: $scope.tempUserTable
                          }, {
                            getData: function ($defer, params) {
                              if (params.settings().$scope == null) {
                                params.settings().$scope = $scope;
                              }
                              $scope.tempUserTabledata = $scope.tempUserData;
                              $defer.resolve($scope.tempUserTabledata);
                            }
                          });
                        $scope.tempUserTable.reload();
                        $("#addUserForm").hide();
                        $("#addMoreUser").show();
                    }else {
                        $("#addUserForm").slideDown();
                        $("#addMoreUser").slideUp();
                    }
                    $timeout(function() {
                        $scope.data_loading = false;
                        deferred.resolve();
                    }, 100);
                });
                return deferred.promise;
            }
        };
        $scope.addUser = function () {
            if($scope.step6FormuserfName == "" || $scope.step6FormuserlName == "" || $scope.step6FormuserEmail == "" || $scope.step6FormuserPhone == "" || $scope.step6FormuserDept == "" || $scope.step6FormuserState == "" || $scope.step6FormuserCity == "" || $scope.step6FormuserCountry == ""){
            }else {
                var tempWbUser = "";
                var tempRealm = "";
                var FormMps = "";
                for(i=0;i<$scope.tempMpsData.length;i++){
                    if($scope.step6FormProd == $scope.tempMpsData[i].domainName){
                        if($scope.tempMpsData[i].features.indexOf("workbench")){
                            tempWbUser = $scope.step6FormuserEmail;
                        }
                        else{
                            tempWbUser = "Generic";
                        }
                        tempRealm = $scope.tempMpsData[i].realm;
                        FormMps = $scope.tempMpsData[i].mpsName;
                    }
                }
                var formData = {
                    "mfr":$scope.mfr,
                    "prodName":$scope.step6FormProd,
                    "first_name":$scope.step6FormuserfName,
                    "last_name":$scope.step6FormuserlName,
                    "department":$scope.step6FormuserDept,
                    "state":$scope.step6FormuserState,
                    "city":$scope.step6FormuserCity,
                    "country":$scope.step6FormuserCountry,
                    "sso":false,
                    "wb_user_name":tempWbUser,
                    "report_usage":$scope.step6FormuserReportUsage ? true : false,
                    "email":$scope.step6FormuserEmail,
                    "phone":$scope.step6FormuserPhone,
                    "org":$scope.mfr,
                    "role":$scope.step5FormDefRoleName,
                    "realm_def":tempRealm,
                    "url_def":GlobalService.getVal("url_def"),
                    "mps_def":FormMps,
                    "is_prospect":false,
                    "dashboard_admin":$scope.step6FormuserDashboard_Admin ? true : false,
                    "is_external":false,
                    "active":true
            };
            internalAdminService.addNewUser(formData).then(function (response) {
                $scope.addUserError = true;
                $scope.step6FormProd = $scope.tempMpsData[0].domainName;
                $("#addUserForm").hide();
                $("#addMoreUser").show();
                $scope.tempUserData.push(formData);
                $scope.tempUserTable = new ngTableParams({
                    reload: $scope.tempUserTable
                  }, {
                    getData: function ($defer, params) {
                      if (params.settings().$scope == null) {
                        params.settings().$scope = $scope;
                      }
                      $scope.tempUserTabledata = $scope.tempUserData;
                      $defer.resolve($scope.tempUserTabledata);
                    }
                  });
                $scope.tempUserTable.reload();                
                formdata = {};                
                $scope.step6FormuserfName = "";
                $scope.step6FormuserlName = "";
                $scope.step6FormuserEmail = "";
                $scope.step6FormuserPhone = "";
                $scope.step6FormuserDept = "";
                $scope.step6FormuserState = "";
                $scope.step6FormuserCity = "";
                $scope.step6FormuserCountry = "";
            },function(error){
              $scope.data_loading = false;
            });
            }
        };
        $scope.addUserRow = function () {
            $("#addUserForm").slideDown();
            $("#addMoreUser").slideUp();
        };
        $scope.addUserCancel = function () {
            $scope.step6FormuserfName = "";
            $scope.step6FormuserlName = "";
            $scope.step6FormuserEmail = "";
            $scope.step6FormuserPhone = "";
            $scope.step6FormuserDept = "";
            $scope.step6FormuserState = "";
            $scope.step6FormuserCity = "";
            $scope.step6FormuserCountry = "";
            $scope.step6FormProd = $scope.tempMpsData[0].domainName;
            $("#addUserForm").slideUp();
            $("#addMoreUser").slideDown();
        };
        $scope.edituser = function (row) {
            $scope.step6FormuserfName = row.first_name;
            $scope.step6FormuserlName = row.last_name;
            $scope.step6FormuserEmail = row.email;
            $scope.step6FormuserPhone = row.phone;
            $scope.step6FormuserDept = row.department;
            $scope.step6FormuserState = row.state;
            $scope.step6FormuserCity = row.city;
            $scope.step6FormuserCountry = row.country;
            $scope.step6FormProd = row.prodName;
            $("#addUserForm").slideDown();
            $("#addMoreUser").slideUp();
        };   
        $scope.wizFinish = function () {
            $scope.data_loading = true;
            var formData = {
                "mfr" : $scope.mfr,
                "name" : $scope.mfr,
                "max_licensed_users" : $scope.MaxLic,
                "max_users" : $scope.maxUsers,
                "t" : $scope.mfrType,
                "config_status" : "complete"
            };
            internalAdminService.addManStep1(formData).then(function (response) {
                $("#wizModal").modal("hide");
                $scope.resetWizard();
                $scope.getManTable();
                $scope.data_loading = false;
            },function(error){
              $scope.data_loading = false;
            });
        };        
        $scope.resetWizard = function () {
            $("#wizStep1").addClass("btn-primary");
            $("#wizStep1").removeClass("btn-success");                
            $("#wizStep2").addClass("btn-secondary");
            $("#wizStep2").removeClass("btn-success");                                
            $("#wizStep3").addClass("btn-secondary");
            $("#wizStep3").removeClass("btn-success");                
            $("#wizStep4").addClass("btn-secondary");
            $("#wizStep4").removeClass("btn-success");                
            $("#wizStep5").addClass("btn-secondary");
            $("#wizStep5").removeClass("btn-success");
            if($scope.wizEditMode){                
                $("#wizStep6").addClass("btn-secondary");
                $("#wizStep6").removeClass("btn-success");
            }else {                
                $("#wizStep6").addClass("btn-secondary");
                $("#wizStep6").removeClass("btn-primary");
            }
            $(".step2").hide();
            $(".step3").hide();
            $(".step4").hide();
            $(".step5").hide();
            $(".step6").hide();
            $(".step1").show();
            $('#roleNameField').attr('readonly', false);
            $("#wizModalClose").show();
            $scope.mfrName = "";
            $scope.mfr = "";
            $scope.desc = "";
            $scope.maxUsers = "";
            $scope.MaxLic = "";
            $scope.tempMpsData = [];
            $scope.mpsConfigData = [];
            $scope.mpsUiData = [];
            $scope.defRoleData = [];
            $scope.mfsUiFlag = 0;
            $scope.defRoleFlag = 0;
            $scope.mfsConfigFlag = 0;
            $scope.step2FormProd = "";
            $scope.step2FormSch = "";
            $scope.step2FormSsoId = "";
            $scope.step2FormSsoLoginUrl = "";
            $scope.step2FormSsoLogoutUrl = "";
            $scope.step2FormSsoRoles = "";
            $scope.step6FormuserfName = "";
            $scope.step6FormuserlName = "";
            $scope.step6FormuserEmail = "";
            $scope.step6FormuserPhone = "";
            $scope.step6FormuserDept = "";
            $scope.step6FormuserState = "";
            $scope.step6FormuserCity = "";
            $scope.step6FormuserCountry = "";
            $scope.step5FormDefRoleName = "";
            $("#wizModal .modal-title").html($scope.wizardSlideTitle);
            $('#wizModal').modal('toggle');
            $scope.wizEditMode = false;
            $scope.contMode = true;
        };
        $scope.wizStep2Back = function () {
            $(".step2").hide();
            $(".step1").show();
            if($scope.wizEditMode){
                $("#wizStep1").addClass("btn-primary");
                $("#wizStep1").removeClass("btn-success");
                $("#wizStep2").addClass("btn-success");
                $("#wizStep2").removeClass("btn-primary");
            }else {
                $("#wizStep1").addClass("btn-primary");
                $("#wizStep1").removeClass("btn-success");
                $("#wizStep2").addClass("btn-secondary");
                $("#wizStep2").removeClass("btn-primary");
                $scope.tempMpsData = [];
                $scope.step2FormProd = "";
                $scope.step2FormSch = "";
                $scope.step2FormSsoId = "";
                $scope.step2FormSsoLoginUrl = "";
                $scope.step2FormSsoLogoutUrl = "";
                $scope.step2FormSsoRoles = "";
                $scope.tempMpsTable.reload();
            }
            $("#wizModal .modal-title").html($scope.wizardSlideTitle);
            $("#addMpsForm").show();
            $("#addMoreMps").hide();
            if($scope.wizEditMode){
                $("#wizModalClose").show();    
            }else {
                $("#wizModalClose").hide();
            }
        };
        $scope.wizStep3Back = function () {
            $(".step3").hide();
            $(".step2").show();
            if($scope.wizEditMode){
                $("#wizStep2").addClass("btn-primary");
                $("#wizStep2").removeClass("btn-success");
                $("#wizStep3").addClass("btn-success");
                $("#wizStep3").removeClass("btn-primary");

            }else {
                $("#wizStep2").addClass("btn-primary");
                $("#wizStep2").removeClass("btn-success");
                $("#wizStep3").addClass("btn-secondary");
                $("#wizStep3").removeClass("btn-primary");
            }
            $("#wizModal .modal-title").html($scope.wizStep2Title);
            $scope.mpsConfigData = [];
        };
        $scope.wizStep4Back = function () {
            $(".step4").hide();
            $(".step3").show();
            if($scope.wizEditMode){                
                $("#wizStep3").addClass("btn-primary");
                $("#wizStep3").removeClass("btn-success");
                $("#wizStep4").addClass("btn-success");
                $("#wizStep4").removeClass("btn-primary");
            }else {
                $("#wizStep3").addClass("btn-primary");
                $("#wizStep3").removeClass("btn-success");
                $("#wizStep4").addClass("btn-secondary");
                $("#wizStep4").removeClass("btn-primary");
            }
            $("#wizModal .modal-title").html($scope.wizStep3Title);
            $scope.mpsUiData = [];
            $scope.mfsConfigFlag = 0;
        };
        $scope.wizStep5Back = function () {
            $(".step5").hide();
            $(".step4").show();
            $("#wizStep4").addClass("btn-primary");
            $("#wizStep4").removeClass("btn-success");
            $("#wizStep5").addClass("btn-secondary");
            $("#wizStep5").removeClass("btn-primary");
            $("#wizModal .modal-title").html($scope.wizStep4Title);
            $scope.defRoleData = [];
            $scope.mfsUiFlag = 0;
        };
        $scope.wizStep6Back = function () {
            $(".step6").hide();
            $(".step5").show();
            $("#wizStep5").addClass("btn-primary");
            $("#wizStep5").removeClass("btn-success");
            $("#wizStep6").addClass("btn-secondary");
            $("#wizStep6").removeClass("btn-primary");
            $("#wizModal .modal-title").html($scope.wizStep5Title);
            $scope.step6FormuserfName = "";
            $scope.step6FormuserlName = "";
            $scope.step6FormuserEmail = "";
            $scope.step6FormuserPhone = "";
            $scope.step6FormuserDept = "";
            $scope.step6FormuserState = "";
            $scope.step6FormuserCity = "";
            $scope.step6FormuserCountry = "";
            $scope.defRoleFlag = 0;
        };
        $scope.getManTable = function () {
            $scope.data_loading = true;
            internalAdminService.getManDetails().then(function (response) {
            $scope.data_loading = false;
            var data = response.data.Data;
            $scope.manTableData = data;
          },function(error){
            $scope.MsgModelHeader = GlobalService.getVal('errorHeader');
            $scope.MsgModelMessage = GlobalService.getVal('ServerErrorMsg');
            $('#msgModal').modal('show');
          });
        };
        $scope.showContinue = function (step) {
            if(step=="complete"){
                return false;
            }else {
                return true;
            }
        };
        $scope.selectedOption = function (item,prod) {
            var tempList = [];
            for(i=0;i<$scope.tempMpsData.length;i++){
                if($scope.tempMpsData[i].mpsName == prod.mps){
                    if($scope.tempMpsData[i].allowed_extension != undefined){
                        tempList = $scope.tempMpsData[i].allowed_extension.split(',');
                        for(j=0;j<tempList.length;j++){
                            if(tempList[j]==item){
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                }
            }
        };
        $scope.getRealmTable = function () {
            $scope.data_loading = true;
            internalAdminService.getRealmDetails().then(function (response) {
            $scope.data_loading = false;
            var data = response.data.Data;
            $scope.realmTableData = data;
            $scope.realmCount = $scope.realmTableData.length;
            if($scope.realmCount > 0){
                $(".realmConfigTab").hide(function() {
                    $(".manTab").toggleClass("col-10");
                    $(".manTab").toggleClass("col-12");
                });
            } 
          },function(error){
          });
        };
        $scope.editRealmPopup = function (realm) {
            $scope.formNewRealmName = realm.name;
            $scope.formNewRealmAppVersion = realm.apps_version;
            $scope.formNewRealmIsUrl = realm.is_url;
            $scope.formNewRealmUiUrl = realm.ui_url;
            $scope.realmEditMode = true;
        };
        $scope.editRealmPopupCancel = function (realm) {
            $scope.formNewRealmName = "";
            $scope.formNewRealmAppVersion = "";
            $scope.formNewRealmIsUrl = "";
            $scope.formNewRealmUiUrl = "";
            $scope.realmEditMode = false;            
        };
        $scope.realmDelConf = function (realm) {
            $scope.realmDelConfItem = realm.name;          
        };
        $scope.showTooltip = function (element) {
            $('.'+element).tooltip("show");    
        };
        $scope.manDelConf = function (man) {
            $scope.manDelConfItem = man.mfr;          
        };
        $scope.getLoginDetails = function(param){
          $scope.loggedInUsername = getCookie('adminUserName');
        };
        $scope.goLogin = function(param){
          $window.location.href = "/apps/app/admin/logininternal.html";
        };
        $scope.continueWiz = function (item) {
            $scope.data_loading = true;
            $scope.editManEntry(item,"cont").then(function() {
                $scope.contMode = true;
                $('#wizModal').modal("hide");
                $('#wizModal').hide();
                var configStatus = item.config_status;
                switch(configStatus) {
                    case "add_mps_pending":
                        $scope.data_loading = true;
                        $scope.wizStep1Next().then(function() {
                            $('#wizModal').modal('show');
                        });
                        $scope.data_loading = false;
                        break;
                    case "default_feature_pending":
                        $scope.data_loading = true;
                        $scope.wizStep1Next().then(function() {
                            $scope.wizStep2Next().then(function() {
                                $('#wizModal').modal('show');
                            });
                        });
                        $scope.data_loading = false;
                        break;
                    case "ui_configration_pending":
                        $scope.wizStep1Next().then(function() {
                            $scope.wizStep2Next().then(function() {
                                $scope.wizStep3Next().then(function() {
                                    $('#wizModal').modal('show');
                                });
                            });
                        });
                        break;
                    case "default_role_pending":
                        $scope.wizStep1Next().then(function() {
                            $scope.wizStep2Next().then(function() {
                                $scope.wizStep3Next().then(function() {
                                    $scope.wizStep4Next().then(function() {
                                        $('#wizModal').modal('show');
                                    });
                                });
                            });
                        });
                        break;
                    case "default_user_pending":
                        $scope.wizStep1Next().then(function() {
                            $scope.wizStep2Next().then(function() {
                                $scope.wizStep3Next().then(function() {
                                    $scope.wizStep4Next().then(function() {
                                        $scope.wizStep5Next().then(function() {
                                            $('#wizModal').modal('show');
                                        });
                                    });
                                });
                            });
                        });
                        break;
                }
            });
        };
        $scope.logoutUser = function(){
            var theCookies = document.cookie.split(';');
            var cookiesList = [],
                cookiesNameValue,
                cookiesName;
            for (var i=1 ; i <= theCookies.length ; i++) {

                cookiesNameValue = theCookies[i-1];
                cookiesName = cookiesNameValue.split("=")[0];
                cookiesName = cookiesName.trim();
                cookiesList.push(cookiesName);
            }
            for (var i=0 ; i < cookiesList.length ; i++) {
                cookiesName = cookiesList[i];
                document.cookie = cookiesName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=" + $scope.currentDomain + ";path=/";
            }
            $window.location.href = "/apps/app/admin/logininternal.html";        	
        };
    }
])
.controller('MessageCtrl', ['$scope',
    function($scope) {

    }
])
