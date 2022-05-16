/* Controllers */
$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};
window.gbTour =(function(){
    var dom=[], gbtourIframeId="gbtour-iframe", 
    msgBodyId="gbtourBodyMsg", msgBoxId="gbtour";
    var targetPosition = {
        "left"      : 0,
        "top"       : 0,
        "height"    : 0,
        "width"     : 0
    };
    var info = {
        "index"             : -1,
        "started"           : false,
        "finished"          : false,
        "selectedElement"   : null
    }
    this.getIndex = function(){
        return info.index;
    };
    this.setIndex = function(num){
        info.index = num;
    };
    this.reset = function(){
        info = {
            "index"             : -1,
            "started"           : false,
            "finished"          : false,
            "selectedElement"   : null
        }
    };
    this.started = function(){
        info.started = true;
    };
    this.finished = function(){
        info.finished = true;
    };
    this.getTarget = function(){
        return info.selectedElement;
    };
    this.setDOM = function(data){
        dom = data;
    };
    this.resetDOM = function(){
        dom = [];
    };
    this.getDOM = function(index){
        if(index){
            return dom[index];
        }
        return dom;
    };
    this.getDOMMessege = function(){
        return dom[info.index]["msg"];
    }
    this.show = function(){        
        var htmlcontent = $("#"+gbtourIframeId);
        htmlcontent.removeClass('hide');
        $("body").addClass('gbtour-hide-scroll');
        this.updateMessege();
    };
    this.hide = function(){
         var htmlcontent = $("#"+gbtourIframeId);
        if(!htmlcontent.hasClass('hide')){
            htmlcontent.addClass('hide');
        };        
        $("body").removeClass('gbtour-hide-scroll');
    };

    this.startTour = function(){
        info.started = true;
        info.index++
        if(!$scope.getTarget()){info.index--; return;}        
        this.updateMessege();
        this.process();
    };
    this.endTour = function(){
        this.reset();
        this.hide();
        $('gbtour').removeAttr('style');
        if(!$('#gbtour').hasClass('center')){
            $('#gbtour').addClass('center');
        }   
        if(!$('#gbtour-iframe').hasClass('gbtourMaskFullscreen')){
            $('#gbtour-iframe').addClass('gbtourMaskFullscreen');
        }   
        $('#gbtourExposeDiv').removeAttr('style');
        $('#gbtourMaskLeftDiv').removeAttr('style');
        $('#gbtourMaskRightDiv').removeAttr('style');
        $('#gbtourMaskTopDiv').removeAttr('style');
        $('#gbtourMaskBottomDiv').removeAttr('style');
    };
    this.updateMessege = function(){        
        if(info.started && (info.index == -1)){
            //$scope.title = $scope.welcome.title;
            //$scope.body = $scope.welcome.msg;
            //$('#gbtourBodyMsg').html($scope.body);
        }else{
            if(info.index == -1) return;
            //$scope.title = $scope.getCurrentElem().title;
            //$scope.body = $scope.getCurrentElem().msg;
            $('#gbtourBodyMsg').html(this.getDOMMessege());
        }
    };
    this.process = function(dir){
        if(this.getTarget()){
            var id = this.getTarget["selector"];
            if(id){
                var elementObj = $(id);
                if(elementObj.hasClass('ng-hide') || elementObj.hasClass('hide') || elementObj.hasClass('gb-hide')){
                    if(dir === 'next'){
                        this.next();
                    }else{
                        this.back(); 
                    }
                    return;
                }
                if(elementObj){
                    $scope.exposeElement(elementObj,id, function(){
                        var offset = $scope.getElementPostion();
                        if(offset){
                            $scope.repositionMessageBox(offset);
                            $scope.mask(offset);
                        }
                    });
                    
                }
            }            
        }
    };
    this.next = function(){
        info.index++;
        if(this.getTarget() && this.getTarget()['hidden']){
            info.index++;
        }
        if(!this.getTarget()){info.index--; info.finished = true;return;}
        info.finished = false;
        this.updateMessage();
        this.process('next');
    };
    this.back = function(){
        info.index--;
        info.finished = false;
        if(this.getTarget() && this.getTarget()['hidden']){
            info.index--;
        }
        if(!this.getTarget()){info.index++; return;}
        this.updateMessage();
        this.process('back');
    };
    this.hightLightTarget = function(){

    };
    this.mask = function(){

    };
    this.messageBox = function(){

    };
    this.init = function(){

    };

    this.index = -1;
    return this;
})();

angular.module('gbApp.controllers.gbtour', [])
.service('GbTourServices', ['$http', 'GlobalService',
function ($http, GlobalService) { 
    var commonData = [], tourData=[];
    return {
        setCommonData: function(_data){
            commonData = _data;
        },
        gLength: function(){
            return tourData.length;
        },
        getData: function(){
            var _data = commonData.concat(tourData);
            return _data;
        },
        updateData: function(_data){
            tourData = _data;
        },
        getBasicData: function () {
            var url = 'gbtour/dom.json';
            return $http.get(url);
        },        
        getlogvault: function () {
            var url = 'gbtour/data/logvault.json';
            return $http.get(url);
        },        
        getexplorer: function () {
            var url = 'gbtour/data/explorer.json';
            return $http.get(url);
        },        
        getdashboard: function () {
            var url = 'gbtour/data/dashboards.json';
            return $http.get(url);
        },        
        getAddRules: function () {
            var url = 'gbtour/data/addrules.json';
            return $http.get(url);
        },
        getListRules: function () {
            var url = 'gbtour/data/listrules.json';
            return $http.get(url);
        },
        getApps: function () {
            var url = 'gbtour/data/apps.json';
            return $http.get(url);
        },
        getEventView: function () {
            var url = 'gbtour/data/eventview.json';
            return $http.get(url);
        },
        getworkbench: function(){
            var url = 'gbtour/data/workbench.json';
            return $http.get(url);            
        }
    }
}])
.controller('GbtourCtrl', ['$scope', '$cookies','GlobalService', 'ModalService', '$compile', '$http', 'metaDataService', 'GbTourServices', 'InstanceHandler',
function($scope, $cookies, GlobalService, ModalService, $compile, $http, metaDataService,GbTourServices, InstanceHandler) {
    $scope.info = {
        "index" : -1,
        "started" : false,
        "finished" : false,
        "selectedElm" : null,
        "direction" : 'next'
    };
    $scope.showIcon = function () {
        return GlobalService.getVal('show_gb_tour_icon');
    };
    gbTour.index = -1;
    $scope.welcome = {
        title : 'Welcome!',
        msg : "<p>Glassbeam Analytics helps your support teams troubleshoot faster, engineering teams build better products, and sales teams increase revenue.</p><p>Glassbeam Analytics delivers a suite of apps that include Explorer, Workbench, Dashboards, Health Check, Rules & Alerts, Log Vault, and File Upload.</p>"
    };
    GbTourServices.getBasicData()
    .then(function (response) {
        GbTourServices.setCommonData(response.data);
    }, function (response) {
       GbTourServices.setCommonData([]);
    });
    $scope.showTour = function(){
       //check criterial where not to show 
       // InstanceHandler.getInstances()
       //console.log("isVisible "+InstanceHandler.isVisible());
       //console.log("InstanceHandler.getInstances() :"+InstanceHandler.getInstances().length);
       //console.log(InstanceHandler.getInstances());
       if(InstanceHandler.getInstances() && InstanceHandler.getInstances().length && (InstanceHandler.getInstances().length > 0) && InstanceHandler.isVisible()){
            
            if(InstanceHandler.getInstances().length > 1){
                ModalService.alertBox({msg: "If you have more than one tab(apps), please close all but one."});
                return false;
            }else if(InstanceHandler.getInstances()[0]['type'] == 'apps'){
                GbTourServices.getApps()
                    .then($scope._responseSuccess,$scope._responseError);
                return;
            }else if(InstanceHandler.getInstances()[0]['type'] == 'event'){
                GbTourServices.getEventView()
                    .then($scope._responseSuccess,$scope._responseError);
                return;
            }else{
                ModalService.alertBox({msg: "The following page do not support help."});
                return false;
            }
       }
       if($('.modal-dialog').length > 1){
            ModalService.alertBox({msg: "The following page do not support help."});
            return false;
       }
        //scroll document to top
        // $(document.body).scrollTop(0);
        // $(window).scrollTop(0);
        $('html, body').animate({scrollTop: '0px'}, 300);
        //read correcponsing JSON for respective page       
        var currentPage = metaDataService.getCurrentPage();
        if(currentPage == 'logvault'){
            GbTourServices.getlogvault()
                .then($scope._responseSuccess,$scope._responseError);
            
        }else if(currentPage == 'explorer'){
            GbTourServices.getexplorer()
                .then($scope._responseSuccess,$scope._responseError);
            
        }else if(currentPage == 'dashboards'){
            var dType = metaDataService.getDashboardType();
            if(dType == 'other'){
                GbTourServices.getdashboard()
                .then($scope._responseSuccess,$scope._responseError);
            }else{
                ModalService.alertBox({msg: "This feature does not work in summary dashboard page"});
            }
            
        }else if(currentPage == 'workbench'){
            //do not show contextual help if it shows table page
            if(!$("#gb-workbench-datasource-cntr").length){
                ModalService.alertBox({msg: "The following page do not support help."});
                return false;
            }
            var dType = metaDataService.getDashboardType();
            GbTourServices.getworkbench()
                .then($scope._responseSuccess,$scope._responseError);
            
        }else if(currentPage == 'rules_and_alerts'){
            var currentPage = metaDataService.getRaACurrentPage();
            if(currentPage == 'rules_list'){
                //scroll grid container div to right
                var gridCntr = $('#gb-rules-table-list-cntr');
                if(gridCntr.length){
                    var gridCntrWidth = $(gridCntr[0]).width();
                    $(gridCntr[0]).scrollLeft(gridCntrWidth);
                }
                GbTourServices.getListRules()
                .then($scope._responseSuccess,$scope._responseError);

            }else if(currentPage == 'add_rule'){
                GbTourServices.getAddRules()
                .then($scope._responseSuccess,$scope._responseError);

            }else{
                ModalService.alertBox({msg: "This feature only works in add/edit rule page"});
            }
            
        }else{
            ModalService.alertBox({msg: "This feature does not work in "+currentPage+" page"});
        }
    };
    $scope._responseSuccess = function(response){
        //populate data array for only the elements currently present in dom.
        var newdata = response.data.filter(function(item){
            //checking for dom existance
            if ($(item.selector).length > 0) {
                return item;
            }
        })
        GbTourServices.updateData(newdata);
        $scope._start();        
    }
    $scope._responseError = function(response){
        GbTourServices.updateData([]);
        $scope._start();
    }
    $scope._start = function(){  
        var htmlcontent = $("#gbtour-iframe");
        htmlcontent.removeClass('hide');
        $("body").addClass('gbtour-hide-scroll');
        $scope.updateMessage();
    }
    $scope.updateMessage = function(){
        if(!$scope.info.started && (gbTour.index == -1)){
            $scope.title = $scope.welcome.title;
            $scope.body = $scope.welcome.msg;
            $('#gbtourBodyMsg').html($scope.body);
            $('#gbtourTitleMsg').html($scope.welcome.title);
            
        }else{
            if(gbTour.index == -1) return;
            $scope.title = $scope.getCurrentElem().title;
            $scope.body = $scope.getCurrentElem().msg;
            $('#gbtourBodyMsg').html($scope.body);
            $('#gbtourTitleMsg').html($scope.title);
        }
    };
    // hide tour. Next time when user opens. it should starts from where he left
    $scope.hideTour = function(){ 
        var htmlcontent = $("#gbtour-iframe");
        if(!htmlcontent.hasClass('hide')){
            htmlcontent.addClass('hide');
        };        
        $("body").removeClass('gbtour-hide-scroll');
    };
    $scope.start = function(){
        $scope.info.started = true;
        gbTour.index++
        if(!$scope.getCurrentElem()){gbTour.index--; return;}        
        $scope.updateMessage();
        $scope.gbtourEngine();
    };
    $scope.getCurrentElem = function(){
        var elm = GbTourServices.getData()[gbTour.index];
        if(elm){
            var id = elm["selector"];
            if(id){
                var elementObj = $(id);
                if(!$(elementObj).offset()){

                    if($scope.info.direction == 'next'){
                        $scope.next();
                    }else{
                        $scope.back();
                    }                    
                    return false;
                }
            }
            return elm;
        }else{
            return false;
        }
    };
    $scope.getNextElem = function(){
        return GbTourServices.getData()[gbTour.index + 1];
    };
    $scope.getPrevElem = function(){
        return GbTourServices.getData()[gbTour.index - 1];
    };
    $scope.done = function(){
        $scope.info = 
        {
            "index" : -1,
            "started" : false,
            "finished" : false,
            "selectedElm" : null
        };
        gbTour.index = -1
        $scope.hideTour();
        $('gbtour').removeAttr('style');
        if(!$('#gbtour').hasClass('center')){
            $('#gbtour').addClass('center');
        }   
        if(!$('#gbtour-iframe').hasClass('gbtourMaskFullscreen')){
            $('#gbtour-iframe').addClass('gbtourMaskFullscreen');
        }   
        $('#gbtourExposeDiv').removeAttr('style');
        $('#gbtourMaskLeftDiv').removeAttr('style');
        $('#gbtourMaskRightDiv').removeAttr('style');
        $('#gbtourMaskTopDiv').removeAttr('style');
        $('#gbtourMaskBottomDiv').removeAttr('style');
    };
    $scope.next = function(){   
        $scope.nextIsEnable();
        gbTour.index++;
        $scope.info.direction = 'next';
        if($scope.getCurrentElem() && $scope.getCurrentElem()['hidden']){
            $scope.next();
        }
        if(!$scope.getCurrentElem()){
            gbTour.index--; 
            $scope.info.finished = true;
            return;
        }
        $scope.finished = false;
        $scope.updateMessage();
        $scope.gbtourEngine('next');
    };
    $scope.nextIsEnable = function(){
        if($scope.info.finished == false && $scope.info.started == false){
            return true;
        }
        //GbTourServices.getData()[gbTour.index + 1];
        if($scope.info.finished){
            return false;
        }
        return($scope.getNextElem());
    };
    $scope.backIsEnable = function(){
        return((gbTour.index - 1) >= 0);
    };
    $scope.back = function(){
        gbTour.index--;
        $scope.info.direction = 'prev';
        $scope.info.finished = false;
        if($scope.getCurrentElem() && $scope.getCurrentElem()['hidden']){
           $scope.back();
        }
        if(!$scope.getCurrentElem()){gbTour.index++; return;}
    	$scope.updateMessage();
        $scope.gbtourEngine('back');
    };
    $scope.gbtourEngine = function(dir){
        if($scope.getCurrentElem()){
            var id = $scope.getCurrentElem()["selector"];
            if(id){
                var elementObj = $(id);
                if(elementObj.hasClass('ng-hide') || elementObj.hasClass('hide') || elementObj.hasClass('gb-hide')){
                    if(dir === 'next'){
                        $scope.next();
                    }else{
                       $scope.back();
                    }
                    return;
                }
                if(elementObj){
                    $scope.exposeElement(elementObj,id, function(){
                        var offset = $scope.getElementPostion();
                        if(offset){
                            $scope.mask(offset);
                            $scope.repositionMessageBox(offset);
                        }
                    });
                }
            }            
        }
    };
    $scope.exposeElement = function(obj,elem, callBack){ 
        $scope.info.selectedElm = obj;
        //obj.focus();
        var param = isScrolledIntoView(elem);
        if(!param.top){
            //scroll top
            window.scrollTo(0, 0);
            // For Safari
            document.body.scrollTop = 0;
            // For Chrome, Firefox, IE and Opera
            document.documentElement.scrollTop = 0;
        }
        // else if(!param.bottom){
        //     //scroll bottom
        //     var ht = document.body.scrollHeight || document.documentElement.scrollHeight;
        //     window.scrollTo(0,ht);
        //     // For Safari
        //     document.body.scrollTop = ht;
        //     // For Chrome, Firefox, IE and Opera
        //     document.documentElement.scrollTop = ht;
        // }else{            
        //     //scroll top
        //     window.scrollTo(0, 0);
        //     // For Safari
        //     document.body.scrollTop = 0;
        //     // For Chrome, Firefox, IE and Opera
        //     document.documentElement.scrollTop = 0;
        // }
        if(!$(elem).isInViewport()){
            $(window).scrollTop($(elem).offset().top);
        }

        callBack();
    };
    function isScrolledIntoView(elem)
    {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();
        var param = {top: (elemTop >= docViewTop), bottom: (elemBottom <= docViewBottom)};
        return param;
    }
    //should return positon attribute of the selected element
    $scope.getElementPostion = function(){
        var offset = $($scope.info.selectedElm).offset();
        offset.height = $($scope.info.selectedElm).innerHeight();
        offset.width = $($scope.info.selectedElm).innerWidth();
       /* var windowBPosition = ($(window).scrollTop() + $(window).height());
        if((windowBPosition - 200) < offset.top){
            var topscrollOffset = offset.top - (windowBPosition - 200);
            topscrollOffset = topscrollOffset + 100 + "px";
            $('html, body').animate({scrollTop: topscrollOffset}, 300);
        }*/
        
        return offset;
    };
    $scope.repositionMessageBox = function(offset) {
        offset = angular.copy(offset);
        offset.top = $('#gbtourExposeDiv').offset().top - $(document).scrollTop();
        offset.left = $('#gbtourExposeDiv').offset().left;
        $scope.messageBox = $('#gbtour');
        var messageBoxWidth = $scope.messageBox.innerWidth();
        var newOffset = null; 
        $scope.heightOffset = 12;
        $scope.widthOffset = 5;       
        var messageBoxLayout = $scope.getCurrentElem()['direction'];
        switch (messageBoxLayout){          
            case 'right>center':
                newOffset = {top: (offset.top), left: (offset.left+offset.width+$scope.widthOffset)};
                break;            
            case 'down>right':
                newOffset = {top: (offset.top+offset.height+$scope.heightOffset), left: offset.left};
                break;           
            case 'down>left':
                newOffset = {top: (offset.top+offset.height+$scope.heightOffset), left: (offset.left + offset.width - messageBoxWidth)};
                break;
            case 'up>left':
                break;
            case 'up>right':
                break;
            case 'top>left':
                newOffset = {top: (offset.top-(offset.height*2)-$scope.heightOffset - 70), left: (offset.left + offset.width - messageBoxWidth)};
                break;
            case 'top>right':
                newOffset = {top: (offset.top-(offset.height*2)-$scope.heightOffset - 70), left: (offset.left + offset.width)};
                break;
        }
        var str = 'translate3d('+Math.ceil(newOffset.left)+'px ,'+ Math.ceil(newOffset.top)+'px , 0px)';
        $scope.messageBox.css({"transform" : str});
    };
    $scope.mask = function(offset){
        //removeCurrentMask: full screen mask
        $('#gbtour-iframe').removeClass('gbtourMaskFullscreen');
        $('#gbtour').removeClass('center');
        $scope.leftMask(offset);
        $scope.rightMask(offset);
        $scope.topMask(offset);
        $scope.bottomMask(offset);
        $scope.gbtourExposeDiv(offset);        
    }
    $scope.gbtourExposeDiv = function(offset){    
        var top,left;
        top = Math.floor(offset.top - 5);
        left = offset.left - 5;
        $('#gbtourExposeDiv').offset({'top': top, 'left':left});
        $('#gbtourExposeDiv').width(offset.width + 10);
        $('#gbtourExposeDiv').css({'height': offset.height+$scope.heightOffset, 'border': '5px solid #fff', 'opacity':1,});
    }
    $scope.leftMask = function(offset){   
        var top,left;
        top = Math.floor(offset.top - 5);
        left = 0;
        $('#gbtourMaskLeftDiv').offset({'top': top, 'left':left});
        $('#gbtourMaskLeftDiv').width(offset.left - 5);
        $('#gbtourMaskLeftDiv').css({'right':offset.left, 'height': offset.height+$scope.heightOffset, 'opacity': 0.7, 'background-color': '#000'});
    };
    $scope.rightMask = function(offset){           
        var top,left;
        top = Math.floor(offset.top - 5);
        left = (offset.left+offset.width+$scope.widthOffset + 5);
        $('#gbtourMaskRightDiv').offset({'top': top, 'left':left});       
        $('#gbtourMaskRightDiv').css({'right':0, 'height': offset.height+$scope.heightOffset, 'opacity': 0.7,'background-color': '#000'});
    };
    $scope.topMask = function(offset){   
        var top,left;
        top = 0;
        left = 0;
        $('#gbtourMaskTopDiv').offset({'top':top, 'left':left});
        $('#gbtourMaskTopDiv').css({'right':0, 'height': (offset.top - 5), 'opacity': 0.7, 'background-color': '#000'});
    };
    $scope.bottomMask = function(offset){   
        var top,left;
        top = (offset.top+offset.height+$scope.heightOffset-5.5);
        left = 0;
        $('#gbtourMaskBottomDiv').offset({'top': top, 'left':left});
        $('#gbtourMaskBottomDiv').css({'right':0, 'bottom': 0, 'opacity': 0.7, 'background-color': '#000'});
    }; 

    window.t1 = (new Date()).getTime();
    window.t2 = (new Date()).getTime();
    document.addEventListener('keyup', function (event) {
        if (event.defaultPrevented) {
            return;
        }

        if (!$("body").hasClass('gbtour-hide-scroll')) {
            return false;
        }
        var key = event.key || event.keyCode;
        window.t2 = (new Date()).getTime();

        if ((window.t2 - window.t1) < 50) {

            return;
        }
        window.t1 = window.t2;
        if (key === 'ArrowRight' || key === 39) {
            if($scope.info.started){
                $scope.next();
            }
            else{
                $scope.start();
            }
           
        } else if (key === 'ArrowLeft' || key === 37) {
            $scope.back();

        } else
            if (key === 'Escape' || key === 'Esc' || key === 27) {
                $scope.done();
            }

    });

     

}]);

