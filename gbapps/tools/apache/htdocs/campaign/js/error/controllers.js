// Controller to handle the change of page
angular.module('gbCampaignApp.controllers', ['ngDraggable'])
.controller('MainCtrl', ['$scope', 'session', '$location', 'GlobalService', '$timeout', 'CommonService', '$window',
    function($scope, session, $location, GlobalService, $timeout, CommonService, $window) {
        session.then( function() {            
            $scope.windowTitle = GlobalService.getValue('PAGE_TITLE');   
            document.title =  $scope.windowTitle; 
            $scope.messages = {
                type: null,
                text: null
            };
            var msg;
            if(CommonService.getQueryVariable('error')){
                $scope.messages.type = 'error';
                msg = CommonService.getQueryVariable('error');
                msg = msg.toUpperCase();
                $scope.messages.text =GlobalService.getValue(msg);
            }else if(CommonService.getQueryVariable('success')){
                $scope.messages.type = 'success';
                msg = CommonService.getQueryVariable('success');
                msg = msg.toUpperCase();
                $scope.messages.text =GlobalService.getValue(msg);
            }
            //Redirect after 10 second to login page
            if(msg == 'USERVERIFIED' || msg == 'USERVERIFIEDALREADY') {
                $timeout(function () {
                    $window.location.href = GlobalService.getValue('LOGIN_URL');
                }, 10000);
            }
        });
    }
])
