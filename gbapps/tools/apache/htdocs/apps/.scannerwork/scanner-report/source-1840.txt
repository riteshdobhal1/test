// Controller to handle the change of page
angular.module('gbApp.controllers', ['ngDraggable','gbApp.globalsMsg'])
.controller('MainCtrl', ['$scope', '$location', 'session', '$window', 'GlobalServiceError', '$document',
    function($scope, $location, session, $window, GlobalServiceError, $document) { 
    session.then( function() {
	    var localScope = $scope;
	     localScope.info = {};
	     localScope.info.msg_title = GlobalServiceError.getVal('errorPageMsgHeader');
	     localScope.info.msg_page_title = GlobalServiceError.getVal('errorPageTitle');
	     localScope.info.support_email = GlobalServiceError.getVal('mailToGlassbeamSupport');
	     localScope.info.contact_msg = GlobalServiceError.getVal('errorContactMsg');
	     localScope.info.support_msg = GlobalServiceError.getVal('errorGlassbeamSupport');
	     localScope.info.glassbeamHomeUrl = GlobalServiceError.getVal('glassbeamHomeUrl');
	     localScope.info.dashboard_msg_title = GlobalServiceError.getVal('errorDashboardAuthentication');
	     angular.element(window.document)[0].title = localScope.info.msg_page_title;

	     function init() {
			var isAuth = readUrlPramValue('isAuth');
			var username = readUrlPramValue('user');
			var domain_name = readUrlPramValue('domain');
			var file_status = readUrlPramValue('file');

			status_message = "Login failed";
			user_msg = "";

			if(username) {
		        status_message += " for " + username;
		        user_msg += GlobalServiceError.getVal('errorPageUnauthorized', username);
		        if(!isAuth) {
	                user_msg = GlobalServiceError.getVal('errorPageNoDataFound', username);
	                status_message = GlobalServiceError.getVal('errorPageStatusNoData'); ;
		        }
			}
			if(domain_name) {
				status_message +=" for " +domain_name;
			}				
			
			document.getElementById("sendMailLink").href = localScope.info.support_email + status_message;
		}
		function update() {
			var userMsgEl = angular.element(document.querySelector('#userMsg'));
			if(userMsgEl) {
				if(!user_msg){
					userMsgEl.text(status_message);

				}else{
					userMsgEl.text(user_msg);
				}
				
			}
		}

		function readUrlPramValue(key) {
			var urlObj = urlObject();
			return urlObj.parameters[key];
		}

		function urlObject(options) {
		    "use strict";
		    /*global window, document*/

		    var url_search_arr,
		        option_key,
		        i,
		        urlObj,
		        get_param,
		        key,
		        val,
		        url_query,
		        url_get_params = {},
		        a = document.createElement('a'),
		        default_options = {
		            'url': $window.location.href,
		            'unescape': true,
		            'convert_num': true
		        };

		    if (typeof options !== "object") {
		        options = default_options;
		    } else {
		        for (option_key in default_options) {
		            if (default_options.hasOwnProperty(option_key)) {
		                if (options[option_key] === undefined) {
		                    options[option_key] = default_options[option_key];
		                }
		            }
		        }
		    }

		    a.href = options.url;
		    url_query = a.search.substring(1);
		    url_search_arr = url_query.split('&');

		    if (url_search_arr[0].length > 1) {
		        for (i = 0; i < url_search_arr.length; i += 1) {
		            get_param = url_search_arr[i].split("=");

		            if (options.unescape) {
		                key = decodeURI(get_param[0]);
		                val = decodeURI(get_param[1]);
		            } else {
		                key = get_param[0];
		                val = get_param[1];
		            }

		            if (options.convert_num) {
		                if (val.match(/^\d+$/)) {
		                    val = parseInt(val, 10);
		                } else if (val.match(/^\d+\.\d+$/)) {
		                    val = parseFloat(val);
		                }
		            }

		            if (url_get_params[key] === undefined) {
		                url_get_params[key] = val;
		            } else if (typeof url_get_params[key] === "string") {
		                url_get_params[key] = [url_get_params[key], val];
		            } else {
		                url_get_params[key].push(val);
		            }

		            get_param = [];
		        }
		    }

		    urlObj = {
		        protocol: a.protocol,
		        hostname: a.hostname,
		        host: a.host,
		        port: a.port,
		        hash: a.hash.substr(1),
		        pathname: a.pathname,
		        search: a.search,
		        parameters: url_get_params
		    };

		    return urlObj;
		}

	    init();
	    update();
	});


    }
])
