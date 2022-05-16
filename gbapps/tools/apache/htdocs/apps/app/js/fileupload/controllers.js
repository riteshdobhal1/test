// Controller to handle the change of page
angular.module('gbApp.controllers.fileupload', ['ngTable', 'ngDraggable'])
    .controller('FileuploadCtrl', ['$scope', '$location', '$sce', '$filter', 'UserTrackingService', 'AppService', 'GlobalService', 'ErrorService', 'FileUploader', 'session', 'metaDataService',
        function ($scope, $location, $sce, $filter, UserTrackingService, AppService, GlobalService, ErrorService, FileUploader, session, metaDataService) {
            var ctrl = this;
            // Holds application info
            
            session.then(function(response) {
                ctrl.info = {};
                ctrl.info.pageLoading = true;
                // Defines whether File Upload should be old or new
                ctrl.info.fileUploadType = 'new';
                // Holds the upload form data.
                ctrl.uploadForm = {};
                $scope.landing_page_details = "";
                $scope.fadeUploadModal = false;
                ctrl.info.url = "";
                if (ctrl.info.fileUploadType === 'old') {
                    //$scope.modal = ModalService.openModal('partials/old_upload.html', $scope, false, 'static');
                } else if (ctrl.info.fileUploadType === 'new') {
                    // Gets the data for file upload.
                    UserTrackingService.getAllConfig()
                        .then(function (response) {
                            ctrl.info.pageLoading = false;
                            ctrl.info.uploadData = response.data.Data.file_upload_config.json_form ? JSON.parse(response.data.Data.file_upload_config.json_form) : response.data.Data.file_upload_config.json_form;
                            ctrl.info.uploadDataMaxSize = response.data.Data.file_upload_config.max_upload_size;
                            ctrl.info.url = 'partials/file-upload/file_upload.html';
                            
                            for(var i = 0; i < ctrl.info.uploader.filters.length; i++) {
                                if(ctrl.info.uploader.filters[i].name == 'extensionFilter') {
                                    ctrl.info.uploader.filters[i] = {
                                        name : 'extensionFilter',
                                        fn : function(item) {
                                            var match = false, i, extList = response.data.Data.file_upload_config.allowed_extension.split(', ');
                                            for (i in extList) {
                                                if (item.name.endsWith(extList[i])) {
                                                    match = true;
                                                }
                                            }
                                            
                                            return match;
                                        }
                                    };
                                }
                            }
                            UserTrackingService.standard_user_tracking(GlobalService.getVal('navUpload'), GlobalService.getVal('navUpload'), 'View', "{\'\'}").then(function (response) {
                            }, function (response) {
                            });
                        }, function (response) {
                            ctrl.info.pageLoading = false;
                            if (response.data.Msg.match(/timeout/)) {
                                $window.location.href = GlobalService.getVal('logout_url');
                            }
                        });
                }
                // Returns the trusted compiled html template from the given html snippet.
                ctrl.renderHtml = function (html) {
                    return $sce.trustAsHtml(html);
                };
                // Gets the values from the globals based on the given key.
                ctrl.getValue = function (key) {
                    return GlobalService.getVal(key);
                };
                
                var manufacturer = GlobalService.getVal('manufacturer');
                var product = GlobalService.getVal('product');
                var schema = GlobalService.getVal('schema');
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                // Uploader object for file upload.
                ctrl.info.uploader = new FileUploader({
                    url: infoserverDomain + '/fileupload/uploadfile/' + manufacturer + '/' + product + '/' + schema,
                    queueLimit: GlobalService.getVal('file_upld_limit'),
                    filters: [{
                        name: 'extensionFilter',
                        fn: function (item) {
                            var match = false, i, extList = GlobalService.getVal('file_upld_suprtd_extns').split(', ');
                            for (i in extList) {
                                if (item.name.endsWith(extList[i])) {
                                    match = true;
                                }
                            }
                            return match;
                        }
                    }],
                    onAfterAddingFile: function (item) {
                        checkSizeLimit();
                    },
                    onWhenAddingFileFailed: function (item, filter, options) {
                        if (filter.name == 'queueLimit') {
                            ErrorService.setError('fileupload', GlobalService.getVal('file_upld_limit_exceeded'));
                        } else {
                            ErrorService.setError('fileupload', GlobalService.getVal('file_upld_unsupported'));
                        }
                    },
                    onBeforeUploadItem: function (item) {
                        var t_obj;
                        angular.forEach(ctrl.uploadForm, function (value, key) {
                            t_obj = {};
                            t_obj[key] = value.nodeVal;
                            item.formData.push(t_obj);
                        });
                        ctrl.info.uploadDone = false;
                    },
                    onCompleteAll: function () {
                        var i, success = false, failure = false, cancel = false, details;
                        details = {};
                        for (i in ctrl.uploadForm) if (ctrl.uploadForm.hasOwnProperty(i)) {
                            details[i] = ctrl.uploadForm[i]['nodeVal'];
                        }
                        details['files'] = [];
                        for (i in ctrl.info.uploader.queue) {
                            if (ctrl.info.uploader.queue[i].isSuccess) {
                                success = true;
                                details['files'].push(ctrl.info.uploader.queue[i]['file']['name']);
                            } else if (ctrl.info.uploader.queue[i].isCancel) {
                                cancel = true;
                            } else {
                                failure = true;
                            }
                        }
                        if (details['files'].length > 0) {
                            UserTrackingService.standard_user_tracking(GlobalService.getVal('navUpload'), GlobalService.getVal('navUpload'), 'Upload', "{\'" + JSON.stringify(details) + "\'}")
                                .then(function (response) {
                                }, function (response) {
                                    if (response.data.Msg.match(/timeout/)) {
                                        $window.location.href = GlobalService.getVal('logout_url');
                                    }
                                });
                        }
                        checkSizeLimit();
                        if ((success && cancel && failure) || (success && cancel && !failure)) {
                            ErrorService.setError('fileupload', GlobalService.getVal('file_upld_partial'));
                        } else if (!success && cancel && !failure) {
                            ErrorService.setError('fileupload', GlobalService.getVal('file_upld_cancel'));
                        } else if (success && !cancel && !failure) {
                            ctrl.info.uploadDone = true;
                        } else if ((!success && !cancel && failure) || (!success && cancel && failure) || (success && !cancel && failure)) {
                            ErrorService.setError('fileupload', GlobalService.getVal('file_upld_fail'));
                        } else {
                        }
                    }
                });
   
		//validate upload form
		ctrl.info.uploadData
		ctrl.validateUploadform = function(){
		var valid = true;
		for (i in ctrl.info.uploadData) {
			if (!!ctrl.info.uploadData[i]['required']) {
				if (!!ctrl.info.uploadData[i]['mandatory']){
					if (ctrl.uploadForm[ctrl.info.uploadData[i]['name']].nodeVal == "") {
					ctrl.uploadForm[ctrl.info.uploadData[i]['name']].error = true;
					$scope.info.disableUpload = false;
					$scope.info.bundlesList = [];
					valid = false;
					} else {
						ctrl.uploadForm[ctrl.info.uploadData[i]['name']].error = false;
					}	
				}
			}
		}
		return valid;
		}
                // Starts the upload
                ctrl.beginUpload = function () {
                    var i, upload = true;
		    if(ctrl.validateUploadform()){
                        return false;
	             }

                    checkSizeLimit();
                    // Ser value to hidden fields
                    var params = {};
                    if (location.search) {
                        var parts = location.search.substring(1).split('&');
                        for (var i = 0; i < parts.length; i++) {
                            var nv = parts[i].split('=');
                            if (!nv[0]) continue;
                            params[nv[0]] = nv[1] || true;
                        }
                    }
                    for (i in ctrl.info.uploadData) {
                        ctrl.uploadForm[ctrl.info.uploadData[i]['name']] = {};
                        ctrl.uploadForm[ctrl.info.uploadData[i]['name']].error = false;
                        upload = true;
                    }
                    if (ErrorService.getErrors('fileupload').length == 0 && upload) {
                        if(!ctrl.uploadForm.controller)
                            ctrl.uploadForm.controller = {};
                        ctrl.uploadForm.controller.nodeVal = params.controller;
                        if(!ctrl.uploadForm.epoch)
                            ctrl.uploadForm.epoch = {};
                        ctrl.uploadForm.epoch.nodeVal = params.epoch;
                        ctrl.uploadForm.to_email = {};
                        ctrl.uploadForm.to_email.nodeVal = metaDataService.getUser()['email'];
                        ctrl.info.uploader.uploadAll();
                    }
                };
                // Clears the upload queue
                ctrl.removeAll = function () {
                    ctrl.info.uploadDone = false;
                    ctrl.info.uploader.clearQueue();
                    ErrorService.clearErrors('fileupload');
                };
                // Removes the file from the queue.
                ctrl.removeFile = function (item) {
                    item.remove();
                    checkSizeLimit();
                    if (ctrl.info.uploader.queue.length == 0) {
                        ctrl.info.uploadDone = false;
                    }
                };
                // Returns all the file upload errors
                ctrl.getUploadErrors = function () {
                    return ErrorService.getErrors('fileupload');
                };
                // Checks the file size limit
                function checkSizeLimit () {
                    var i, sum = 0;
                    for (i in ctrl.info.uploader.queue) {
                        sum += ctrl.info.uploader.queue[i].file.size;
                    }
                    ErrorService.clearErrors('fileupload');
                    if (sum > ctrl.info.uploadDataMaxSize) {
                        ErrorService.setError('fileupload', GlobalService.getVal('file_upld_maxsize') + '<span title="' + ctrl.info.uploadDataMaxSize + ' B">' + $filter('fileSize')(ctrl.info.uploadDataMaxSize) + '</span>');
                    }
                }
            });
            
        }]);
