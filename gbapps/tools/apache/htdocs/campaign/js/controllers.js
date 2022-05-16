// Controller to handle the change of page
angular.module('gbCampaignApp.controllers', ['ngDraggable'])
.controller('MainCtrl', ['$scope', 'session', '$location', 'SigninService', 'GlobalService', 'UtilityService', '$timeout',
    function($scope, session, $location, SigninService, GlobalService, UtilityService, $timeout) {
        session.then( function() {
            $scope.windowTitle = GlobalService.getValue('PAGE_TITLE');   
            document.title =  $scope.windowTitle; 
            $scope.fieldArray = [];
            $scope.user = {};
            $scope.messageSuccess = null;
            $scope.messageFailed = null;
            $scope.resendVerificationMail = false;
            $scope.signinInProgress = false;
            $scope.resendVerificationMailMessage = null;
            $scope.loginUrl = GlobalService.getValue('LOGIN_URL');
            //read values from url
            $scope.user.product_id =  UtilityService.getQueryVariable('product_id') || 1; //"gbstudio";
            $scope.user.default_demo =  UtilityService.getQueryVariable('default_demo'); //"hiwi";
            $timeout(function(){
                SigninService.readFields().then(function(response){
                    if(response.data && Array.isArray(response.data)){
                        $scope.fieldArray = response.data;
                    }
                }, function(error) {

                });
            }, 1000);
            $scope.do = function(){
                if($scope.validateForm()) {
                    //validate final user ocject with respect to original field list
                    $scope.addNonMandatoryField();
                    delete ($scope.user.cnfpassword);
                    $scope.signinInProgress = true;
                    $timeout(function(){
                        SigninService.register($scope.user).then(function(response){
                            $scope.signinInProgress = false;
                            $scope.registerSuccess(response);
                        }, function(error) {
                            $scope.signinInProgress = false;
                            if(error.data && error.data.Msg){
                                $scope.registerFailed(error.data.Msg);
                            }else{
                                $scope.registerFailed(GlobalService.getValue('CONTACTADMIN'));
                            }
                            
                        });
                    }, 1000);
                } 
            }
            $scope.emailVerificationLinkAgain = function(){
                $scope.resendVerificationMail = true;
                $scope.signinInProgress = true;
                $scope.resendVerificationMailMessage = null;
                SigninService.mailVerification($scope.user["email"]).then(function(response){
                        $scope.signinInProgress = false;
                        $scope.resendVerificationMail = false;
                        $scope.registerSuccess(response);
                    }, function(error) {
                        $scope.signinInProgress = false;
                        $scope.resendVerificationMail = false;
                        if(error.data && error.data.Msg){
                            $scope.registerFailed(error.data.Msg);
                        }else{
                            $scope.registerFailed(GlobalService.getValue('CONTACTADMIN'));
                        }                 
                });                
            }
            $scope.addNonMandatoryField = function(){
                for(var i=0;i<$scope.fieldArray.length;i++){
                    if(!$scope.user[$scope.fieldArray[i]["name"]]){
                        $scope.user[$scope.fieldArray[i]["name"]] = '';
                    }
                }
            }
            $scope.registerSuccess = function(response) {
                if((response.status == 200) && (typeof response.data.Status == 'string') && (response.data.Status.toLowerCase() == 'success')) {                
                    var msg = response.data.Msg;
                    msg = msg.toUpperCase();
                    //show success messages
                    $scope.messageSuccess = GlobalService.getValue(msg, $scope.user["email"]);
                    //clear form data
                    for(var key in $scope.user){
                        $scope.user[key] = "";
                    }

                }else{
                    $scope.registerFailed(response.data.Msg);
                }
            }
            $scope.registerFailed = function(originalMsg) {
                originalMsg = originalMsg.toUpperCase();
                var msg = originalMsg +"_REG";
                msg = GlobalService.getValue(msg);
                if(!msg){
                    msg = GlobalService.getValue('OTHERERROR');
                }
                if(originalMsg.indexOf('PROSPECTEXISTS') != -1){
                    $scope.resendVerificationMailMessage = msg;
                }else{
                    $scope.messageFailed = msg ;
                }
                
            }
            $scope.createTooltips = function(elmId, msg){
                var mBody = document.createElement('div');
                mBody.className="gb-validation-message";
                var mText = document.createElement('span');
                mText.className = "gb-validation-message-text";
                mText.innerHTML = msg;
                mBody.appendChild(mText);
                var mIcon = document.createElement('span');
                mIcon.className = 'glyphicon glyphicon-exclamation-sign gb-validation-message-icon';
                mBody.appendChild(mIcon);

                var curElm = document.getElementById(elmId);
                if(curElm){
                    var parElm = curElm.parentNode;
                    if(parElm){
                        //check if already have tooltips
                        var isToolTips = parElm.getElementsByClassName('gb-validation-message');
                        if(isToolTips.length > 0) {
                            parElm.removeChild(isToolTips[0]); 
                        }
                        //add new tooltip container
                        parElm.appendChild(mBody);
                    }
                }
            }
            $scope.removeTooltips = function(elmId) {
                var curElm = document.getElementById(elmId);
                if(curElm){
                    var parElm = curElm.parentNode;
                    if(parElm){
                        //check if already have tooltips then remove it
                        var isToolTips = parElm.getElementsByClassName('gb-validation-message');
                        if(isToolTips.length > 0) {
                            parElm.removeChild(isToolTips[0]); 
                        }
                    }
                }
            }
            $scope.validateForm = function(){
                var valid = true;
                //check fields
                for(var i=0; i < $scope.fieldArray.length; i++) {
                    var fieldActualValue = $scope.fieldArray[i];
                    var fieldCurrentValue = $scope.user[fieldActualValue.name];
                    $scope.removeTooltips(fieldActualValue.name);
                    if(fieldCurrentValue){
                        if(fieldActualValue.minLength && fieldCurrentValue.length < fieldActualValue.minLength) {
                            $scope.createTooltips(fieldActualValue.name, "Minimum length should be "+fieldActualValue.minLength);
                            return false;
                        }
                        if(fieldActualValue.maxLength && fieldCurrentValue.length >= fieldActualValue.maxLength) {
                            $scope.createTooltips(fieldActualValue.name, "Maximum length should be "+fieldActualValue.maxLength);
                            return false;
                        }
                        //Validation for email
                        if(fieldActualValue.name == 'email') {
                            if(!UtilityService.validateEmail(fieldCurrentValue)){
                                $scope.createTooltips(fieldActualValue.name, GlobalService.getValue('INVALIDEMAIL') );
                                return false;
                            }
                        }
                        //validation for confirmed password match
                        if(fieldActualValue.name == 'cnfpassword') {
                            var passwordValue = $scope.user[$scope.fieldArray[$scope.fieldArray.length - 2]["name"]];
                            if(fieldCurrentValue != passwordValue){
                                $scope.createTooltips(fieldActualValue.name, GlobalService.getValue('PASSWORDMISSMATCH'));
                                return false;
                            }
                        }

                    }else{
                        if(!fieldActualValue.empty){
                            $scope.createTooltips(fieldActualValue.name, "Mandatory field should not be empty");
                            valid = false;
                        }                    
                    }
                }
                return valid;
            }
            $scope.reloadPage = function(){
                $scope.messageSuccess = null;
                $scope.messageFailed = null;
            }
            $scope.showPage = function() {
                if($scope.fieldArray.length > 0) {
                    if(!$scope.messageSuccess && !$scope.messageFailed && !$scope.resendVerificationMailMessage) {
                        return true;
                    }
                }
                return false
            }
        }); 
    }
])
