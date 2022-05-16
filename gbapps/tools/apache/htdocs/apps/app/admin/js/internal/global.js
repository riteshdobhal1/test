angular.module('internalAdminApp.globalservices', [])
.factory('GlobalService', ['$http', '$location',
	function($http, $location) {
		var info = {};
		info.umsDomain = getCookie('umsDomain');
		info.httpProtocol = "http";
		var globalObj = {};
		globalObj.debug = 1;
		globalObj.umsDomain = getCookie('umsDomain');
		globalObj.mainTitle = "Glassbeam - Product Intelligence on Demand";
		globalObj.timeoutDelay = 15000;//10 seconds
        globalObj.oldStackMessage = "We are in the process of migrating all glassbeam users to our new login portal. Your account is yet to be moved. Please use the following <link> to login";
        globalObj.ibmNewStackMessage = "We have migrated your Glassbeam application to on premise (IBM's Data Centre). Please use the following <link> to access Glassbeam";
        globalObj.oldLoginMessage = "Click <here> to go to the Old login Portal";
        globalObj.timeoutMessage = "Session timed out. Please login again";
        globalObj.sendingLink = "Mailing link to your email id";
        globalObj.settingPassword = "Setting your password...";
        globalObj.settingPasswordSuccess = 'User registered successfuly.';
        globalObj.passwordUpdatedSuccess = 'Password updated successfully';
        globalObj.errorHeader = "Error!";
        globalObj.ServerErrorMsg = "There was problem authenticating user. Please login again!";
        globalObj.wizContinueMsg = "Adding manufacturer wizard for this entry was not completed. Continue pending steps?"
        globalObj.roleFeatures = [
			{'name' : 'Dashboards', 'value':'dashboards', 'checked':false},
			{'name' : 'Explorer', 'value':'explorer', 'checked':false},
			{'name' : 'Logvault', 'value':'logvault', 'checked':false},
			{'name' : 'File Upload', 'value':'file_upload', 'checked':false},
			//{'name' : 'Health Check', 'value':'health_check', 'checked':false},
			//{'name' : 'Apps', 'value':'apps', 'checked':false},
			{'name' : 'Workbench *', 'value':'workbench', 'checked':false},
			{'name' : 'Rules & Alerts *', 'value':'rules_and_alerts', 'checked':false}
		];
        globalObj.default_exp_view = [
            {'name' : 'Section', 'value':'SECTION'},
            {'name' : 'Event', 'value':'EVENT'}
        ];
        globalObj.max_day_rangeunit = [
            {'name' : 'Sec', 'value':'sec'},
            {'name' : 'Min', 'value':'min'},
            {'name' : 'Hrs', 'value':'hours'},
            {'name' : 'Days', 'value':'days'}
        ];
        globalObj.max_upload_sizeunit = [
            {'name' : 'MB', 'value':'mb'},
            {'name' : 'GB', 'value':'gb'},
            {'name' : 'TB', 'value':'tb'}
        ];
		globalObj.roleFeaturesNoAdmin = [
			{'name' : 'Dashboards', 'value':'dashboards'},
			{'name' : 'Explorer', 'value':'explorer'},
			{'name' : 'Logvault', 'value':'logvault'},
			{'name' : 'File Upload', 'value':'file_upload'},
			//{'name' : 'Health Check', 'value':'health_check'},
			//{'name' : 'Apps', 'value':'apps'},
			{'name' : 'Workbench', 'value':'workbench'},
			{'name' : 'Rules & Alerts', 'value':'rules_and_alerts'}
		];
		globalObj.extensions = [
        	{'name' : '.zip', 'value':'.zip'},
			{'name' : '.gz', 'value':'.gz'},
			{'name' : '.rar', 'value':'.rar'},
			{'name' : '.tar.gzip', 'value':'.tar.gzip'},
			{'name' : '.dat', 'value':'.dat'},
			{'name' : '.tgz', 'value':'.tgz'}
		]
		globalObj.errorMsgs = {
            '101' : 'Infoserver is down',
            '102' : 'H2 is down',
            '103' : 'LCP is down',
            '104' : 'Tableau server is down',
            '105' : 'Logi server is down',
            '106' : 'GBStudio server is down'
        };
        //Max Items Per Page        
        globalObj.maxTableItems = 5;
        globalObj.wizardSlideTitle = 'Manufacturer Details';
        globalObj.AddRealmModalTitle = "Add realm";
        globalObj.realmTableTitle = "Realm Name";
        globalObj.editBtnText = "Edit";
        globalObj.deleteBtnText = "Delete";
        globalObj.addRealmBtnTitle = "Add Realm";
        globalObj.ManTableManName = "Manufacturer Name";
        globalObj.ManTableMPSList = "MPS List";
        globalObj.ManTableMaxLic = "Max License";
        globalObj.ManTableMaxUsr = "Max Users";
        globalObj.ManTableRealm = "Realm";
        globalObj.ManTableStatus = "Status";
        globalObj.ManTableAction = "Action";
        globalObj.realmConfigBtnTitle = "Realm Config";
        globalObj.AddManBtnTitle = "Add Manufacturer Wizard";
        globalObj.realmAppVer = "App Version";
        globalObj.realmUiUrl = "UI URL";
        globalObj.realmInfoUrl = "Infoserver URL";
        globalObj.wizStep2Title = "Add Product";
        globalObj.wizStep3Title = "Default Feature";
        globalObj.wizStep4Title = "UI Configrations";
        globalObj.wizStep5Title = "Default Role";
        globalObj.wizStep6Title = "Default User";
        globalObj.wizStep1Info = "Add basic Manufacturer details here";
        globalObj.wizStep1MfrTitle = "MFR";
        globalObj.wizStep1DescTitle = "Description";
        globalObj.wizStep1MaxUsrTitle ="Max Users";
        globalObj.wizStep1MaxLicTitle = "Max License";
        globalObj.wizStep2Info1 = "Manufacturer added!";
        globalObj.wizStep2Info2 = " Add your products here.";
        globalObj.wizStepInfoError = "Error!";
        globalObj.wizStep2Error = " No Products added.";
        globalObj.allowedExtLblTooltip = "Select at least one allowed extention."
        globalObj.wizStep2TabProd = "Product";
        globalObj.wizStep2TabSch = "Schema";
        globalObj.wizStep2TabRealm = "Realm";
        globalObj.wizStep2TabEc = "End Customer";
        globalObj.wizStep2TabSsoId = "SSO ID";
        globalObj.wizStep2TabSsoLoginUrl = "SSO Login URL";
        globalObj.wizStep2TabSsoLogoutUrl = "SSO Logout URL";
        globalObj.wizStep2TabSsoRoles = "SSO Role";
        globalObj.wizStep3Info1 = "Excellent!";
        globalObj.wizStep3Info2 = " All the MPSs are added. Add their configrations here.";
        globalObj.wizStep3DefFeatureExt = "Default Feature External";
        globalObj.wizStep3DefFeatureInt = "Default Feature Internal";
        globalObj.wizStep3Logo = "Logo";
        globalObj.wizStep3LogoUrl = "Logo URL";
        globalObj.wizStep3Nsr = "NSR Enabled";
        globalObj.wizStep3Active = "Enabled";
        globalObj.wizStep4Info2 = " Add UI Configrations Here.";
        globalObj.wizStep4Info1 = "Great!";
        globalObj.wizStep5Info2 = "Lets configure default role.";
        globalObj.wizStep5Info1 = "Almost Done!";
        globalObj.wizStep5RoleName = "Default Role Name";
        globalObj.wizStep5Error = "Please select atleast one feature per domain.";
        globalObj.wizStep5DomName = "Domain/Product Name";
        globalObj.wizStep5FeatPer = "Feature Permission";
        globalObj.RoleReadOnlyHelp = "Role name once set can't be changed."
        globalObj.wizStep5PowUserInfo = "* Power User Feature";
        globalObj.wizStep6Info1 = "Last Step!";
        globalObj.wizStep6Info2 = "Add User to this manufacturer.";
        globalObj.wizStep6Fname = "First Name";
        globalObj.wizStep6Lname = "Last Name";
        globalObj.wizStep6Email = "Email";
        globalObj.wizStep6Phone = "Phone";
        globalObj.wizStep6Dept = "Department";
        globalObj.wizStep6State = "State";
        globalObj.wizStep6City = "City";
        globalObj.wizStep6Country = "Country";
        globalObj.realmDelConfHead = "Delete Realm";
        globalObj.wizStep6TabName = "Name";
        globalObj.wizStep6TabProd = "Product";
        globalObj.step6FormuserDashboard_AdminLbl = "Dashboard Admin";
        globalObj.step6FormuserReportUsageLbl = "Report Usage";
        globalObj.realmDeleteConfBody = "Do you want to delete realm :";
        globalObj.manDelConfHead = "Delete Manufacturer";
        globalObj.manDeleteConfBody = "Do you want to delete manufacturer :";
        globalObj.defFeatError = " Please configure all the MPS added.";
        //Step 4 Form Field Labels
        globalObj.allowedExtLbl = "Allowed Extensions";
        globalObj.compound_rowsLbl = "Compound Rows";
        globalObj.core_delimiterLbl = "Core Delimiter";
        globalObj.default_daysLbl = "Default Days";
        globalObj.default_exp_viewLbl = "Default Explorer View";
        globalObj.exp_display_fieldsLbl = "Explorer Display Fields";
        globalObj.facet_limitLbl = "Facet Limit";
        globalObj.iv_display_fieldsLbl = "Instance Viewer Display Fields";
        globalObj.is_stage_domainLbl = "Infoserver Stage Domain";
        globalObj.is_stage_keyspaceLbl = "Infoserver Stage Keyspace";
        globalObj.max_day_rangeLbl = "Max Day Range";
        globalObj.max_upload_sizeLbl = "Max Upload Size";
        globalObj.lv_to_expLbl = "Logvault to Explorer";
        globalObj.json_formLbl = "JSON Form";
        globalObj.mfrType = "10";
        //Add Realm Help Texts
        globalObj.formNewRealmNameHelp = {"text":"Input Realm Name","flag":true};
        globalObj.formNewRealmAppVersionHelp = {"text":"Input Realm App Version To Be Used","flag":true};
        globalObj.formNewRealmIsUrlHelp = {"text":"Input Realm Infoserver URL","flag":true};
        globalObj.formNewRealmUiUrlHelp = {"text":"Input Realm UI URL","flag":true};
        //Add Realm Help Texts Ends
        //Add Manufacturer Help Texts
        globalObj.MfrReadOnlyHelp = {"text":"Enter manufacturer name here. Once manufacturer name is set it can't be changed.","flag":true};
        globalObj.wizStep1MaxUsrTitleHelp = {"text":"Input maximum users allowed for this manufacturer. This field will take only numbers.","flag":true};
        globalObj.wizStep1MaxLicTitleHelp = {"text":"input maximum number of power users for this manufacturer. This field will take only numbers.","flag":true};
        globalObj.wizStep2TabProdHelp = {"text":"Input Product","flag":true};
        globalObj.wizStep2TabSchHelp = {"text":"Input Schema","flag":true};
        globalObj.step2FormRealmHelp = {"text":"Select Realm for this product.","flag":true};
        globalObj.wizStep2TabEcHelp = {"text":"End Customer field can't be changed. it is same as that of manufacturer.","flag":true};
        globalObj.wizStep2TabSsoIdHelp = {"text":"Enter SSO ID","flag":true};
        globalObj.wizStep2TabSsoLoginUrlHelp = {"text":"Enter SSO Login URL.","flag":true};
        globalObj.wizStep2TabSsoLogoutUrlHelp = {"text":"Enter SSO Logout URL.","flag":true};
        globalObj.wizStep2TabSsoRolesHelp = {"text":"Enter SSO Role Name.","flag":true};
        globalObj.wizStep3DefFeatureExtHelp = {"text":"Select Default Feature External.","flag":true};
        globalObj.wizStep3DefFeatureIntHelp = {"text":"Select Default Feature Internal.","flag":true};
        globalObj.wizStep3LogoHelp = {"text":"Input Logo Name.","flag":true};
        globalObj.wizStep3LogoUrlHelp = {"text":"input location of logo file.","flag":true};
        globalObj.compound_rowsLblHelp = {"text":"Input Compound Rows","flag":true};
        globalObj.core_delimiterLblHelp = {"text":"Input Core Delimiter","flag":true};
        globalObj.default_exp_viewLblHelp = {"text":"Select Default Explorer View","flag":true};
        globalObj.default_daysLblHelp = {"text":"Input Default Days","flag":true};
        globalObj.allowedExtLblHelp = {"text":"Select allowed extention for this customer. Use CTRL to select multiple items.","flag":true};
        globalObj.exp_display_fieldsLblHelp = {"text":"Input Explorer Display Fields.","flag":true};
        globalObj.facet_limitLblHelp = {"text":"Input Facet Limit. This field takes only numbers.","flag":true};
        globalObj.iv_display_fieldsLblHelp = {"text":"Input instance Viewer Display Fields.","flag":true};
        globalObj.is_stage_domainLblHelp = {"text":"Input Infoserver Stage Domain.","flag":true};
        globalObj.is_stage_keyspaceLblHelp = {"text":"Input Infoserver Stage Keyspace.","flag":true};
        globalObj.max_day_rangeLblHelp = {"text":"Input Max Day Range.","flag":true};
        globalObj.wizardOpenHelp = {"text":"Click this button to start adding new manufacturer","flag":true};
        globalObj.max_upload_sizeLblHelp = {"text":"Input Max upload file size.","flag":true};
        globalObj.json_formLblHelp = {"text":"Enter a valid JSON form in this field.","flag":true};
        globalObj.addRealmHelp = {"text":"Add new realm using this button.","flag":true};
        globalObj.jsonErrorMsg = "There is error on this JSON form. Please validate the JSON before submiting.";
        //Add Manufacturer Help Texts Ends
        globalObj.url_def = "apps/app/index.html";
		return {
		    setGlobals : function(adminEmail) {
                globalObj.infoserverDown =  "Error-" + Object.keys(globalObj.errorMsgs)[0] +".Please contact <a href='mailto:" + adminEmail + "'>" + adminEmail + "</a>";
                globalObj.AUTHFAILED = "Authentication server not available. Please contact <a href='mailto:" + adminEmail + "'>" + adminEmail + "</a>";
		    },
			getUmsDomain : function() {
				if(!info.umsDomain) {
					info.umsDomain = getCookie('umsDomain');
				}
				return info.umsDomain;
			},
			gethttpProtocol : function() {
				return info.httpProtocol;
			},
			setUmsDomain : function(domainName) {
				info.umsDomain = domainName;
			},
			showLoading : function(msg){
				if(msg){
					document.getElementById('gb-loader-msg').innerHTML = msg;
				}
		        var loader = document.getElementById('gb-first-time-loader');
		        loader.className = "gb-first-time-loader gb-show";
			},
			hideLoading : function(){
		        var loader = document.getElementById('gb-first-time-loader');
		        loader.className = "gb-first-time-loader gb-hide";
			},
			setSessionCookies : function(token) {

	            //get domain name from url
	            var domain = $location.host().split(/\.(.+)?/)[1];
				//Retrive infoserver domain
				//if(info.infoserverDomain) {
					/*var infoD = info.infoserverDomain.split(":");
					var infoserverName = infoD[1];*/
					document.cookie = token+";domain="+domain+";path=/";
				//}
			},
			getVal : function(key) {
                return globalObj[key];
			},
			setVal : function(key, value) {
				globalObj[key] = value;
			},
			logError : function(errMsg){
				if(globalObj.debug)
				{
					console.error(errMsg);
				}
			}
		}
	}
])
