/* Directives */

angular.module('gbLogStatusApp.directives', [])
.directive('customTimeFilter', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl : 'customTimeFilter.html',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
})
