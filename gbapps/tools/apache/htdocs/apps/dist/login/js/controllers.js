// Controller to handle the change of page
angular.module('gbLoginApp.controllers', ['ngDraggable'])
.controller('MainCtrl', ['$scope', 'session', '$location', 'LoginService', 'GlobalMessages', 'GlobalService',
    function($scope, session, $location, LoginService, GlobalMessages, GlobalService) {   
        $scope.windowTitle = angular.element(window.document)[0].title;
        $scope.windowTitle = GlobalMessages.getValue('PAGE_TITLE');
        $scope.logo = "";
        $scope.logo_url = "";
        GlobalService.showLoading('Loading ...');

        session.then( function() {
             LoginService.getLogos().then(function(response) {                 
                 var info = response.data.Data;
                 if(info){
                    if(info.logo){
                        $scope.logo = '/apps/app/img/'+info.logo;
                    }
                    if(info.logo_url){
                        $scope.logo_url = 'https://' + info.logo_url;
                    }
                 }
                console.log($scope.logo_url);
                 GlobalService.hideLoading();
             },function(response) {
                GlobalService.hideLoading();
                LoginService.windowFailed(GlobalService.getVal('AUTHFAILED'));
            });
        })
    }
])
.controller('MainCtrlCommonLogin', ['$scope', '$timeout', 'session', '$location', 'LoginService', 'GlobalMessages', 'GlobalService', '$interval',
    function($scope, $timeout, session, $location, LoginService, GlobalMessages, GlobalService, $interval) {
        $scope.windowTitle = angular.element(window.document)[0].title;
        $scope.windowTitle = GlobalMessages.getValue('PAGE_TITLE');
    }
])
.controller('LoginCtrl', ['$scope', '$sce', '$window', '$timeout', '$location', 'LoginService', 'UserService', 'UtilityService', 'GlobalMessages', 'GlobalService', '$route',
    function($scope, $sce, $window,$timeout, $location, LoginService, UserService, UtilityService, GlobalMessages, GlobalService, $route) {
        $scope.user = {};
        $scope.isCaptchaEnabled = false;
        if (GlobalService.getVal('CaptchaFeature')) {
            if (angular.isDefined(localStorage.remainingAttempt)) {
                $scope.remainingAttempt = parseInt(localStorage.remainingAttempt);
                if ($scope.remainingAttempt <= GlobalService.getVal('MaxLoginAttemptForCaptcha')) {
                    $scope.isCaptchaEnabled = true;
                }
            }
        }
        $scope.captchaType = GlobalService.getVal('QaTestingCaptcha');
        $scope.gbReCaptchaKey = $scope.captchaType ?/*QAkey*/GlobalService.getVal('QaCaptchaKey') : /*DEV key*/ GlobalService.getVal('DevCaptchaKey');
        $scope.showCaptchaFailedAttempt = GlobalService.getVal('showCaptchaFailedAttempt');


        $scope.user.name = $scope.user.email;
        //$scope.user.email =  $scope.user.name;
        $scope.user.password = "";
        $scope.user.captcha = "";
        $scope.user.mobile = false;
        /* if(device.mobile()){
             $scope.isCaptchaEnabled = false;
             $scope.user.mobile = true;
        } */
        $scope.oldStackUser = false;
        var defaultMessage = '<span>' + GlobalService.getVal('oldLoginMessage').replace(/<([\w]+)>/g, '<a href="' + GlobalService.getVal('oldStackLoginUrl') + '">$1</a>') + '</span>';
        $scope.oldStackMessageBind = $sce.trustAsHtml(defaultMessage);

        $scope.loginform = {};
        $scope.loginform.email = {};
        $scope.loginform.password = {};
        $scope.loading = false;
        //commented this as angular validation is disabled
        // $scope.$watch('user.password', function(value) {
        //     $scope.loginform.password.$setValidity('minlength', true);
        // });

        //two factor authentication
        $scope.loginflags = {
            'userValidated': false
        }
        $scope.enableResend = false;
        $scope.showMobMsg = false;
        $scope.user.otp = '';
        $scope.timeleft = GlobalService.getVal('resendOtpTime');
        $scope.showResendAlert = false;
        $scope.resendAttempt = 0;
        $scope.resendAttemptLimit = GlobalService.getVal('resendAttemptLimit');
        

        $scope.requestLogin = function (fromLogin) {
            var globallogin = "";
            var dashLogin = "";
            if (fromLogin == 'local') {
                globallogin = "globalLogin=0";
            } else {
                globallogin = "globalLogin=1";
            }
            if (sessionStorage.getItem("dash_mode") == "true") {
                dashLogin = "dashModeLogin=1";
            } else {
                dashLogin = "dashModeLogin=0";
            }
            GlobalService.setSessionCookies(dashLogin);
            GlobalService.setSessionCookies(globallogin);
            if ($scope.validateForm()) {
                if ($scope.isCaptchaEnabled) {
                    grecaptcha.execute();
                }
                else {
                    $scope.submitLogin();
                }
                // $scope.loading = true;
                // $scope.gbWatch();
                // GlobalService.showLoading('Loading ...');
                // $scope.user.captcha = window.gbCaptchaResponse;
                // LoginService.login($scope.user).then(function(response) {
                //     $scope.loading = false;
                //     if(response.data.Data){
                // 		userDetails = response.data.Data.user_details;
                //         default_realm = userDetails.realm_def;
                //         default_mps = userDetails.mps_def;
                //         default_url = default_realm + "/" + userDetails.url_def;

                //         if(response.data.Session){
                //             UserService.setToken(response.data.Session);
                //             var loginApi = "loginurl=" +window.location.href;
                //            // GlobalService.setSessionCookies(UserService.getToken());
                //             GlobalService.setSessionCookies(loginApi);
                //         }
                // 		var mps = "mps=" + default_mps;
                //         GlobalService.setSessionCookies(mps);
                // 		LoginService.redirectPageToUI(default_url);

                //     }else{
                //         GlobalService.hideLoading();
                //         LoginService.windowFailed('No domain found', "DOMAIN NOT FOUND");
                //     }
                // }, function(response){
                //     $scope.loading = false;
                //     GlobalService.hideLoading();
                //     $scope.loginform.password.$setValidity('minlength', true);
                //     LoginService.windowFailed(response.data.Msg)
                //     window.resetcaptcha();
                // });
            } else  if($scope.isCaptchaEnabled) {
                grecaptcha.reset();
            }
        }
        $scope.submitLogin = function () {
            $scope.loading = true;
            $scope.gbWatch();
            GlobalService.showLoading('Loading ...');
            if ($scope.isCaptchaEnabled) {
                var gbCaptchaResponse = grecaptcha.getResponse();
                $scope.user.captcha = gbCaptchaResponse;
            }
            if(angular.isDefined(localStorage.remainingAttempt)){
                localStorage.removeItem('remainingAttempt');
                }
            LoginService.login($scope.user).then(function (response) {

                //tfa flag from bckend response
                if (response.data.TwoAuth) {
                    if(response.data.Data[0].phone){
                        $scope.user.mobileNum = response.data.Data[0].phone;
                        $scope.showMobMsg = true;
                    }
                    $scope.enableResend = false;
                    $scope.loginflags.userValidated = true;
                    $scope.loading = false;
                    GlobalService.hideLoading();

                    var secondsTimer = setInterval(function () {
                        angular.element(window.document)[0].getElementById('secondsTimer').innerHTML = $scope.timeleft;
                        $scope.timeleft -= 1;
                        if ($scope.timeleft < 0) {
                            $scope.enableResend = true;
                            $scope.$apply();
                            clearInterval(secondsTimer);
                            angular.element(window.document)[0].getElementById('secondsTimer').innerHTML = '';
                        }
                    }, 1000);
                }
                else {
                    $scope.loading = false;
                    if (response.data.Data) {
                        userDetails = response.data.Data.user_details;
                        default_realm = userDetails.realm_def;
                        default_mps = userDetails.mps_def;
                        default_url = default_realm + "/" + userDetails.url_def;

                        if (response.data.Session) {
                            UserService.setToken(response.data.Session);
                            var loginApi = "loginurl=" + window.location.href;
                            // GlobalService.setSessionCookies(UserService.getToken());
                            GlobalService.setSessionCookies(loginApi);
                        }
                        var mps = "mps=" + default_mps;
                        GlobalService.setSessionCookies(mps);
                        LoginService.redirectPageToUI(default_url);

                    } else {
                        GlobalService.hideLoading();
                        LoginService.windowFailed('No domain found', "DOMAIN NOT FOUND");
                    }
                }
            }, function (response) {
                $scope.loading = false;
                GlobalService.hideLoading();
                // $scope.loginform.password.$setValidity('minlength', true);
                LoginService.windowFailed(response.data.Msg)
                if($scope.isCaptchaEnabled){
                grecaptcha.reset();
                }
                if(response.data.hasOwnProperty('RemainingAttempt') && response.data.RemainingAttempt >-1){ 
                    $scope.remainingAttempt = response.data.RemainingAttempt;
                    localStorage.setItem("remainingAttempt", $scope.remainingAttempt);
                    if($scope.remainingAttempt <= GlobalService.getVal('MaxLoginAttemptForCaptcha')){
                        $scope.isCaptchaEnabled = GlobalService.getVal('CaptchaFeature') == true ? true:false;
                        $route.reload();
                        //$window.location.reload();
                     }

                }
            });
        }
        $scope.gbWatch = function(){
            $timeout(function(){
                if($scope.loading){
                    $scope.loading = false;
                    GlobalService.hideLoading();
                    LoginService.windowFailed(GlobalService.getVal('infoserverDown'), "ERROR");
                }
            }, GlobalService.getVal('timeoutDelay'))
        }
        $scope.validateForm = function() {
            //VALIDATE FORM
            // email field is empty
            if(!$scope.user.email){
                // $scope.loginform.email.$dirty = true;
                // $scope.loginform.email.$setValidity('required', false);
                return false;
            }
            //password field is empty
            if(!$scope.user.password) {
                // $scope.loginform.password.$dirty = true;
                // $scope.loginform.password.$setValidity('required', false);
                return false;
            }
            //invalid email
            if(!UtilityService.validateEmail($scope.user.email)) {
                // $scope.loginform.email.$dirty = true;                
                // $scope.loginform.email.$setValidity('validemail', false);
                return false;
            }
            //invalid password
            if($scope.user.password.length < 4) {
                // $scope.loginform.password.$dirty = true;
                // $scope.loginform.password.$setValidity('minlength', false);
                return false;
            }
            return true;
        }
        $scope.getValue = function(key) {
            return GlobalMessages.getValue(key);
        }
        $scope.checkEmailDomain = function() {
            var oldStackDomains = GlobalService.getVal('oldStackCustomers');
            var userEmail = angular.element(document.getElementById('username')).val() || '';
            var found = false;
            angular.forEach(oldStackDomains, function(domain) {
                var emailSplit = userEmail.split('@');
                var regex = new RegExp('^' + domain + '\\.|\\.' + domain + '\\.');
                if(emailSplit.length == 2 && regex.test(emailSplit[1])) {
                    found = true;
                }
            });
            if(!!found) {
                $scope.oldStackUser = true;
                var message = '<span>' + GlobalService.getVal('oldStackMessage').replace(/<([\w]+)>/g, '<a href="' + GlobalService.getVal('oldStackLoginUrl') + '">$1</a>') + '</span>';
                $scope.oldStackMessageBind = $sce.trustAsHtml(message);
            } else {
                $scope.oldStackUser = false;
                $scope.oldStackMessageBind = $sce.trustAsHtml(defaultMessage);
            }
        }

        $scope.validateOTP = function(){
            if(!$scope.user.otp.length) return;
            console.log($scope.user.otp);
            //call verify otp api
            var param ={"email":$scope.user.email,"otp": $scope.user.otp}
            LoginService.verifyOTP(param).then(function (response) {
                $scope.loading = false;
                    if (response.data.Data) {
                        userDetails = response.data.Data.user_details;
                        default_realm = userDetails.realm_def;
                        default_mps = userDetails.mps_def;
                        default_url = default_realm + "/" + userDetails.url_def;

                        if (response.data.Session) {
                            UserService.setToken(response.data.Session);
                            var loginApi = "loginurl=" + window.location.href;
                            // GlobalService.setSessionCookies(UserService.getToken());
                            GlobalService.setSessionCookies(loginApi);
                        }
                        var mps = "mps=" + default_mps;
                        GlobalService.setSessionCookies(mps);
                        LoginService.redirectPageToUI(default_url);

                    } else {
                        GlobalService.hideLoading();
                        LoginService.windowFailed('No domain found', "DOMAIN NOT FOUND");
                    }

            }, function (response) {
                $scope.loading = false;
                GlobalService.hideLoading();
                // $scope.loginform.password.$setValidity('minlength', true);
                LoginService.windowFailed(response.data.Msg)
               
                if(response.data.hasOwnProperty('RemainingAttempt') && response.data.RemainingAttempt >-1){ 
                    $scope.remainingAttempt = response.data.RemainingAttempt;
                    localStorage.setItem("remainingAttempt", $scope.remainingAttempt);
                    if($scope.remainingAttempt == 0){
                        $scope.isCaptchaEnabled = GlobalService.getVal('CaptchaFeature') == true ? true:false;
                        $scope.user.otp = '';
                        $route.reload();
                     }

                }
            });
        }
        //Resend Otp Functon
        $scope.resendOTP = function () {
            $scope.loading = true;
            //call resend otp api here
            $scope.enableResend = false;
            if ($scope.resendAttempt == $scope.resendAttemptLimit) {
                LoginService.windowFailed("Resend Limit Reached");
                $route.reload();
            }
            else {
                $scope.resendAttempt++;
            }
            $scope.timeleft = GlobalService.getVal('resendOtpTime');
            $scope.loading = false;
            var param = { "email": $scope.user.email }
            LoginService.resendOTP(param).then(function (response) {
                $scope.showResendAlert = true;
                setTimeout(function () {
                    $scope.showResendAlert = false;
                    $scope.$apply();
                }, 5000);
            }, function (response) {

            });
            var secondsTimer = setInterval(function () {
                angular.element(window.document)[0].getElementById('secondsTimer').innerHTML = $scope.timeleft;
                $scope.timeleft -= 1;
                if ($scope.timeleft < 0) {
                    $scope.enableResend = true;
                    $scope.$apply();
                    clearInterval(secondsTimer);
                    angular.element(window.document)[0].getElementById('secondsTimer').innerHTML = '';
                }
            }, 1000);

        }
    }
])
.controller('SelectDomainCtrl', ['$scope', '$location', 'LoginService', 'UserService', 'GlobalService', '$location', '$window',
    function($scope, $location, LoginService, UserService, GlobalService, $location, $window) {
        /*
        THIS CONTROLLER IS NO LONGER IN USE, WILL BE DELETED WITH PROPER CHECK
        */
        $scope.info = {};
        $scope.info.customer = "";
        $scope.info.domainNameList = [];

        $scope.user = UserService.getUser();

        var domainList = $scope.user.domains;
        $scope.info.domainNameList = [{'value' : '?', 'name' : 'select'}];
        for(var k in domainList){
            var tmp_domain = {'value' : k, 'name' : k};
            $scope.info.domainNameList.push(tmp_domain);
        }
        $scope.info.customer  = $scope.info.domainNameList[0].value;
        if($scope.info.domainNameList && $scope.info.domainNameList.length == 2) { 
            $scope.info.customer  = $scope.info.domainNameList[1].value;
           
            var loginApi = "loginurl=" + $window.location.href;
            //GlobalService.setSessionCookies(UserService.getToken());
            GlobalService.setSessionCookies(loginApi);

            //set MPS
            if($scope.user.domains[$scope.info.customer]) {
                var mps = "mps=" +$scope.user.domains[$scope.info.domainNameList[1].name];
                GlobalService.setSessionCookies(mps);
            }
            
            LoginService.redirectPageToUI($scope.info.domainNameList[1].name);
        }
        if($scope.info.domainNameList && $scope.info.domainNameList.length > 2) {
            $location.path('choose-domain');
        }
        
        $scope.loadUi = function (){
            if($scope.info.customer && $scope.info.customer!= "?"){
                //Get domain name
                var currentDomainName = $scope.info.customer;
                if(currentDomainName) { 
                    //set MPS
                    if($scope.user.domains[currentDomainName]) {
                        var mps = "mps=" +$scope.user.domains[currentDomainName];
                        GlobalService.setSessionCookies(mps);
                    } 
                    LoginService.redirectPageToUI(currentDomainName);
                }               
            }            
        }
    }
])

.controller('ForgotPasswordCtrl', ['$scope', '$location', '$timeout', 'LoginService', 'UserService', '$location', 'UtilityService', 'GlobalMessages', 'GlobalService',
    function($scope, $location, $timeout, LoginService, UserService, $location, UtilityService, GlobalMessages, GlobalService) {
        $scope.info = {};
        $scope.loading = false;
        $scope.user = {};
        var token = null;
        $scope.forgotpasswordform = {};
        $scope.gbForgotForm = {};
        // stores strength of password
        $scope.strength = "";

         //regex to test password instruction
        $scope.regex  = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/;

         //stores minimum length of password 
        $scope.minPassLen = GlobalService.getVal('minPassLen')
        if(!!$location.$$search.token_id){
            token = $location.$$search.token_id;
            token = unescape(token);
        }
        if(!!$location.$$search.email) {
            $scope.user.email = $location.$$search.email;
        }
        $scope.user.password = '';
        $scope.info.changepasswordwindow = {};
        $scope.info.changepasswordwindow.email = true;
        $scope.info.changepasswordwindow.success = false;
        $scope.info.changepasswordwindow.failure = false;

        $scope.sendMailMsgReset = function() {    
            $scope.info.changepasswordwindow.email = true;
            $scope.info.changepasswordwindow.success = false;
            $scope.info.changepasswordwindow.failure = false;
        }
        $scope.sendMailSuccess = function() {        
            $scope.info.changepasswordwindow.email = false;
            $scope.info.changepasswordwindow.success = true;
            $scope.info.changepasswordwindow.failure = false;
        }
        $scope.sendMailFailure = function() {        
            $scope.info.changepasswordwindow.email = true;
            $scope.info.changepasswordwindow.success = false;
            $scope.info.changepasswordwindow.failure = true;
            $scope.info.filureMsg = $scope.getValue('MAILSEND_FAILURE_MSG');
        }
        $scope.forgotPasswordSendEmail = function() {
            if($scope.validateEmailForm()){
                $scope.loading = true;
                $scope.gbWatch();
                GlobalService.showLoading(GlobalService.getVal('sendingLink'));
                LoginService.sendEmail($scope.user).then(
                    function() {
                        $scope.loading = false;
                        GlobalService.hideLoading();
                        $scope.sendMailSuccess();
                        $scope.forgotpasswordform.email.$dirty = false;
                    }, function() {
                        $scope.loading = false;
                        GlobalService.hideLoading();
                        $scope.sendMailFailure();
                        $scope.forgotpasswordform.email.$dirty = false;
                });
            }
        }
        $scope.requestChangePassword = function() {   
            if($scope.validateForm()) {
                $scope.loading = true;
                $scope.gbWatch();
                GlobalService.showLoading(GlobalService.getVal('settingPassword'));
                LoginService.changePassword($scope.user, token).then(
                    function(response) {
                        $scope.loading = false;
                        GlobalService.hideLoading();
                        $scope.gbForgotForm.password.$dirty = false;
                        LoginService.windowSuccess(GlobalService.getVal('passwordUpdatedSuccess'), 'SET PASSWORD');
                        // show success message and ask user to login again 
                        $location.path('/');
                    }, function(error) {
                        $scope.loading = false;
                        GlobalService.hideLoading();
                        if(error.data && error.data.Msg){
                            LoginService.windowFailed(error.data.Msg, 'SET PASSWORD');
                        }else{
                            LoginService.windowFailed('ERROR', 'SET PASSWORD');
                        }
                       
                    });
            }
        }        
        $scope.gbWatch = function(){
            $timeout(function(){
                if($scope.loading){
                    $scope.loading = false;
                    GlobalService.hideLoading();
                    LoginService.windowFailed(GlobalService.getVal('infoserverDown'), "ERROR");
                }
            }, GlobalService.getVal('timeoutDelay'))
        }
        $scope.validateForm = function() {
            var regex = /^(?=.*?[a-z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/

            //VALIDATE FORM
            // email field is empty
            if(!$scope.user.password){
                $scope.gbForgotForm.password.$dirty = true;
                $scope.gbForgotForm.password.$setValidity('required', false);
                $scope.gbForgotForm.password.$setValidity('minlength', true);
                return false;
            }
            //invalid password
            if($scope.user.password.length < GlobalService.getVal('minPassLen')) {
                $scope.gbForgotForm.password.$dirty = true;
                $scope.gbForgotForm.password.$setValidity('required', true);
                $scope.gbForgotForm.password.$setValidity('minlength', false);
                return false;
            }
            if(!$scope.user.repassword){
                $scope.gbForgotForm.repassword.$dirty = true;
                $scope.gbForgotForm.repassword.$setValidity('required', false);      
                $scope.gbForgotForm.repassword.$setValidity('minlength', true);
                $scope.gbForgotForm.repassword.$setValidity('missmatch', true);
                return false;
            }
            //invalid password
            if($scope.user.repassword.length < GlobalService.getVal('minPassLen')) {
                $scope.gbForgotForm.repassword.$dirty = true;
                $scope.gbForgotForm.repassword.$setValidity('required', true);         
                $scope.gbForgotForm.repassword.$setValidity('minlength', false);
                $scope.gbForgotForm.repassword.$setValidity('missmatch', true);
                return false;
            }
            // both password should be same
            if(!($scope.user.password  === $scope.user.repassword)) {
                $scope.gbForgotForm.repassword.$dirty = true;       
                $scope.gbForgotForm.repassword.$setValidity('required', true);         
                $scope.gbForgotForm.repassword.$setValidity('minlength', true);
                $scope.gbForgotForm.repassword.$setValidity('missmatch', false);
                return false;
            }
            
            //TEST WITH REGEX FOR VALIDITY
            if(!$scope.regex.test($scope.user.password)) {
                $scope.gbForgotForm.password.$dirty = true;
                $scope.gbForgotForm.password.$setValidity('required', true);
                $scope.gbForgotForm.password.$setValidity('invalid', false);
                return false;
            }

            return true;
        }
        $scope.validateEmailForm = function() {
            $scope.sendMailMsgReset();
            //VALIDATE FORM
            // email field is empty
            if(!$scope.user.email){
                $scope.forgotpasswordform.email.$dirty = true;
                $scope.forgotpasswordform.email.$setValidity('required', false);
                return false;
            }
            //invalid email
            if(!UtilityService.validateEmail($scope.user.email)) {
                $scope.forgotpasswordform.email.$dirty = true;                
                $scope.forgotpasswordform.email.$setValidity('validemail', false);
                return false;
            }
            return true;
        }
        $scope.updateEmailField = function() {
            $scope.sendMailMsgReset();
        }
        $scope.getValue = function(key) {
            if(key === 'MAILSEND_FAILURE_MSG') {
                var email =$scope.user.email;
                var msg = GlobalMessages.getValue(key)+ " \"" + email+ "\"";
                return msg;
            } else {
                return GlobalMessages.getValue(key);
            }            
        }
          //Password strength check
          $scope.checkStrength = function (param) {
            $scope.strength = param ? ($scope.regex.test(param) ? 'strong' : 'weak') : "";
            $scope.checkequality();
        }

         //Password equality check
        $scope.checkequality = function () {
          $scope.equality =  $scope.user.repassword ? (($scope.user.password  === $scope.user.repassword)? 'Matching':'Not Matching!') : "";

         }

    }
])
.controller('MessageCtrl', ['$scope', 
    function($scope) {
       
    }
])
