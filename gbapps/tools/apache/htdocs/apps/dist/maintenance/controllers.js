// Controller to handle the change of page
angular.module('gbMaintenanceApp.controllers', ['ngDraggable'])
.controller('MaintenanceCtrl', ['$scope', 'MaintenanceService', 'GlobalService',
    function($scope, MaintenanceService, GlobalService) { 
     
      //set page title
	  $scope.windowTitle = angular.element(window.document)[0].title;
	  $scope.windowTitle = GlobalService.getVal('PAGE_TITLE');
    $scope.maintenance = {
      type: '',
      duration: GlobalService.getVal('downtime'),
      msg : []
    };
    $scope.email = GlobalService.getVal('EMAIL_ID');
    $scope.company = GlobalService.getVal('COMPANY');
    $scope.message = GlobalService.getVal('MESSAGE');

    
    }
])
