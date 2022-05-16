angular.module('gbLogStatusApp.globalservices', [])
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
	globalObj.noLogsMsg = "No Logs Found";
	globalObj.data_not_available = "Data Not Available";
	globalObj.new_data = "New Data loaded";
	globalObj.changeAlert = "false";
	globalObj.changeAlertTitle = "Status Changed!";
	globalObj.changeAlertMsg = "Bundle status changed. Head to page 1";
		globalObj.pollingTime = 15000;
		globalObj.tabelRefreshRateTitle = "Refresh Rate";
		globalObj.sessionTimeOutHeader = "ERROR";
		globalObj.liveDataDisplayed = "Recent uploaded logs.";
		globalObj.logHistoryTitle = "Log History";
		globalObj.liveDataFailed = "Connection to server failled! Please contact support."
		globalObj.sessionTimeOutMessage = "Session Expired. Please login again";
    globalObj.logOutUrl = getCookie('logouturl');
		globalObj.timefilter = {
												    'currentValue' : '1 Week',
												    'quickFilters': [
												        '1 Week',
												        '2 Week',
												        'Custom time'
												    ],
												    'customFilter':{
												        'fromDate':{
												            'gDate' : new Date(),
												            'hr' : 00,
												            'min' : 00,
												            'sec' : 00
												        },
												        'toDate':{
												            'gDate' : new Date(),
												            'hr' : 00,
												            'min' : 00,
												            'sec' : 00
												        }
												    }
												};
		if(globalObj.logOutUrl != undefined) {
			localStorage.setItem("logOutUrl", globalObj.logOutUrl);
		}
    globalObj.logStatusColumn = [{
		        field : "bundle_name",
		        title : "Bundle Name",
		        enabled : true
		    }, {
		        field : "bundle_type",
		        title : "Bundle Type",
		        enabled : true
		    }, {
		        field : "received_time",
		        title : "Recieved Time",
		        enabled : true
		    }, {
		        field : "expected_time",
		        title : "Expected Time",
		        enabled : true
		    }, {
		        field : "ticket_number",
		        title : "Ticket Number",
		        enabled : true
		    }, {
		        field : "customer_name",
		        title : "Customer Name",
		        enabled : true
		    }, {
		        field : "sysid",
		        title : "Sysid",
		        enabled : true
		    }, {
		        field : "status",
		        title : "Status",
		        enabled : true
		    }];
				globalObj.logStatusHistoryColumn = [{
				        field : "bundle_name",
				        title : "Bundle Name",
				        enabled : true
				    }, {
				        field : "bundle_type",
				        title : "Bundle Type",
				        enabled : true
				    }, {
				        field : "received_time",
				        title : "Recieved Time",
				        enabled : true
				    }, {
				        field : "expected_time",
				        title : "Expected Time",
				        enabled : false
				    }, {
				        field : "ticket_number",
				        title : "Ticket Number",
				        enabled : true
				    }, {
				        field : "customer_name",
				        title : "Customer Name",
				        enabled : true
				    }, {
				        field : "sysid",
				        title : "Sysid",
				        enabled : true
				    }, {
				        field : "status",
				        title : "Status",
				        enabled : true
				    }];
        globalObj.page = 1;
				globalObj.count = 10;
		globalObj.errorMsgs = {
            '101' : 'Infoserver is down',
            '102' : 'H2 is down',
            '103' : 'LCP is down',
            '104' : 'Tableau server is down',
            '105' : 'Logi server is down',
            '106' : 'GBStudio server is down'
        };


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
	            var domain = GlobalService.getVal('primaryDomain');
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
