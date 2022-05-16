/* Directives */

angular.module('gbApp.directives', [])

// Custom Directive for instance viewer
.directive('gbInstanceViewer', ['InstanceHandler', 'WorkbenchService', 'metaDataService', '$sce', 'GlobalService', '$location', '$timeout', '$filter',
function(InstanceHandler, WorkbenchService, metaDataService, $sce, GlobalService, $location, $timeout, $filter) {
	return {
		restrict : 'EA',
		templateUrl : 'partials/instance_viewer.html',
		link : function(scope) {
			scope.instances = InstanceHandler.getInstances();
			scope.loading = false;
			scope.timeoutinterval = GlobalService.getVal('intancecloseinterval');
			scope.showLoading = function(){
				scope.loading = true;
				$timeout(function(){
					scope.loading = false;
				}, scope.timeoutinterval);				
			}
			scope.toggle = function() {
				InstanceHandler.setVisible(!InstanceHandler.isVisible());
			};
			scope.isVisible = function() {
				return !!InstanceHandler.getNumberOfInstances();
			};
			scope.isViewerVisible = function() {
				return InstanceHandler.isVisible();
			};
			scope.setViewerVisible = function(bool) {
				return InstanceHandler.setVisible(bool);
			};
			scope.getInstances = function() {
				return InstanceHandler.getInstances();
			};
			scope.setInstances = function() {
				scope.instances = InstanceHandler.getInstances();
			};
			scope.refreshInstance = function(instance) {
            	if(instance.type == 'tableau') {
            		instance.type = 'unknown';
            		$timeout(function() {
            			instance.type = 'tableau';
            		}, 10);
            	}
				scope.setInstances();
			};
			scope.checkOwner = function(instance) {
				var domain = GlobalService.getVal('primaryDomain');
				if (instance.owner && instance.owner === WorkbenchService.getUserId()) {
					document.cookie = 'show_tableau_save_options=' + 1 + ";domain=." + domain + ";path=/";
				} else if (instance.owner && instance.owner != WorkbenchService.getUserId()) {
					document.cookie = 'show_tableau_save_options=' + 0 + ";domain=." + domain + ";path=/";
				}
			};
			scope.removeInstance = function(instance) {
				InstanceHandler.removeInstance(instance);
				$timeout(function() {
					var activeInstance = $filter('filter')(scope.getInstances(), {visible: true}) || [];
					if(activeInstance.length == 1) {
						scope.refreshInstance(activeInstance[0]);
					}
				}, 10);
			};
			scope.secureURL = function(url) {
				return $sce.trustAsResourceUrl(url);
			};
			scope.getRefreshCount = function() {
				return InstanceHandler.getRefreshCount();
			};
			// Checks whether logged in user owns the given dashboard.
			scope.isOwner = function(instance) {
				if(metaDataService.getFeatures().workbench){
					if(metaDataService.getUser().email === instance.owner || metaDataService.getUser().org_type == GlobalService.getVal('gbUserOrgType')){
						return "Edit";
					}else {
						return "Interact";
					}
				}else {
					return false;
				}
			};
			// Takes the user to edit mode of tableau within instance viewer
			scope.goToEdit = function(instance) {
				instance.data.mode = 'editor';
				instance.delay = false;
			};
			// Takes the user back to view mode within Instance Viewer
			scope.goToView = function(instance) {
				instance.data.mode = 'viewer';
				instance.delay = false;
			};
			scope.getURL = function(type) {
				if (type == "event") {
					return GlobalService.getVal('intanceviewer_event');
				}
				if (type == "section") {
					return GlobalService.getVal('intanceviewer_section');
				}
                if (type == "apps"){
                    return GlobalService.getVal('apps');
                }
			};
		}
	};
}])// .directive("scrollUpdateResults", [

// function() {
// return function(scope, element) {
// angular.element(element).bind("scroll", function() {
// if (element[0].scrollTop + element[0].offsetHeight >= element[0].scrollHeight && scope.info.attributeLimit < scope.info.attributes.length) {
// scope.info.attributeLimit += 10;
// scope.checkAllExpanded();
// }
// scope.$apply();
// });
// element.on('$destroy', function() {
// element.off();
// });
// };
// }])

//To implement drag event
.directive('gbDraggable', ['$document',
function($document) {
	return function(scope, element) {
		element.css({
			position : 'initial',
			width : '100%',
			height : '30px',
			cursor : 'move'
		});
		var startX = element.parent()[0].offsetLeft,
		    startY = Math.ceil($(window).height() / 2) - 150,
		    x = element.parent()[0].offsetLeft,
		    y = Math.ceil($(window).height() / 2) - 150;
		element.on('mousedown', function(event) {
			// Prevent default dragging of selected content
			event.preventDefault();
			angular.element(document.querySelectorAll(".gb-facet-chart-window")).css("z-index", "1050");
			element.parent().css("z-index", "1051");
			startX = event.pageX - x;
			startY = event.pageY - y;
			$document.on('mousemove', mousemove);
			$document.on('mouseup', mouseup);
		});
		function mousemove(event) {
			y = event.pageY - startY;
			x = event.pageX - startX;
			if (event.pageX > 0 && event.pageY > 0) {
				element.parent().css({
					position : 'absolute',
					top : y + 'px',
					left : x + 'px'
				});
			}
		}

		function mouseup() {
			$document.off('mousemove', mousemove);
			$document.off('mouseup', mouseup);
		}

	};
}])

//To manage the resize
.directive("gbResizable", ['$document',
function($document) {
	return function(scope, element) {
		var startX,
		    startY,
		    startLeft,
		    startTop,
		    startWidth,
		    startHeight;
		var startOffsetLeft = element[0].offsetLeft,
		    startOffsetTop = Math.ceil($(window).height() / 2) - 150;
		element.css({
			position : "absolute",
			left : startOffsetLeft + "px",
			top : startOffsetTop + "px",
			width : parseInt(element[0].clientWidth) + "px",
			height : parseInt(element[0].clientHeight) + "px"
		});
		//Function to initialize variables
		var init = function(event) {
			startX = event.pageX;
			startY = event.pageY;
			startLeft = parseInt(element.css('left').replace(/\D/g, ''));
			startTop = parseInt(element.css('top').replace(/\D/g, ''));
			startWidth = parseInt(element.css('width').replace(/\D/g, ''));
			startHeight = parseInt(element.css('height').replace(/\D/g, ''));
		};
		// Function to manage resize up event
		var resizeUp = function(event) {
			var height = startY - event.pageY;
			if ((startHeight + height) > 200) {
				element.css({
					top : (startTop - height) + "px",
					height : (startHeight + height) + "px"
				});
			}
		};
		// Function to manage resize right event
		var resizeRight = function(event) {
			var width = event.pageX - startX;
			if ((startWidth + width) > 400) {
				element.css({
					width : (startWidth + width) + "px"
				});
			} else {
				element.css({
					width : "400px"
				});
			}
		};
		// Function to manage resize down event
		var resizeDown = function(event) {
			var height = event.pageY - startY;
			if ((startHeight + height) > 200) {
				element.css({
					height : (startHeight + height) + "px"
				});
			} else {
				element.css({
					height : "200px"
				});
			}
		};
		// Function to manage resize left event
		var resizeLeft = function(event) {
			var width = startX - event.pageX;
			if ((startWidth + width) > 400) {
				element.css({
					left : (startLeft - width) + "px",
					width : (startWidth + width) + "px"
				});
			}
		};
		// Create a div to catch resize up event
		var newElement = angular.element('<div class="n-resize"></div>');
		element.append(newElement);
		newElement.on("mousedown", function(event) {
			init(event);
			$document.on("mousemove", mousemove);
			$document.on("mouseup", mouseup);
			function mousemove(event) {
				event.preventDefault();
				resizeUp(event);
			}

			function mouseup() {
				$document.off("mousemove", mousemove);
				$document.off("mouseup", mouseup);
			}

		});

		// Create a div to catch resize right event
		newElement = angular.element('<div class="e-resize"></div>');
		element.append(newElement);
		newElement.on("mousedown", function(event) {
			init(event);
			$document.on("mousemove", mousemove);
			$document.on("mouseup", mouseup);
			function mousemove(event) {
				event.preventDefault();
				resizeRight(event);
			}

			function mouseup() {
				$document.off("mousemove", mousemove);
				$document.off("mouseup", mouseup);
			}

		});
		// Create a div to catch resize down event
		newElement = angular.element('<div class="s-resize"></div>');
		element.append(newElement);
		newElement.on("mousedown", function(event) {
			init(event);
			$document.on("mousemove", mousemove);
			$document.on("mouseup", mouseup);
			function mousemove(event) {
				event.preventDefault();
				resizeDown(event);
			}

			function mouseup() {
				$document.off("mousemove", mousemove);
				$document.off("mouseup", mouseup);
			}

		});
		// Create a div to catch resize left event
		newElement = angular.element('<div class="w-resize"></div>');
		element.append(newElement);
		newElement.on("mousedown", function(event) {
			init(event);
			$document.on("mousemove", mousemove);
			$document.on("mouseup", mouseup);
			function mousemove(event) {
				event.preventDefault();
				resizeLeft(event);
			}

			function mouseup() {
				$document.off("mousemove", mousemove);
				$document.off("mouseup", mouseup);
			}

		});
		// Create a div to catch resize up left event
		newElement = angular.element('<div class="nw-resize"></div>');
		element.append(newElement);
		newElement.on("mousedown", function(event) {
			init(event);
			$document.on("mousemove", mousemove);
			$document.on("mouseup", mouseup);
			function mousemove(event) {
				event.preventDefault();
				resizeUp(event);
				resizeLeft(event);
			}

			function mouseup() {
				$document.off("mousemove", mousemove);
				$document.off("mouseup", mouseup);
			}

		});
		// Create a div to catch resize up right event
		newElement = angular.element('<div class="ne-resize"></div>');
		element.append(newElement);
		newElement.on("mousedown", function(event) {
			init(event);
			$document.on("mousemove", mousemove);
			$document.on("mouseup", mouseup);
			function mousemove(event) {
				event.preventDefault();
				resizeUp(event);
				resizeRight(event);
			}

			function mouseup() {
				$document.off("mousemove", mousemove);
				$document.off("mouseup", mouseup);
			}

		});
		// Create a div to catch resize down right event
		newElement = angular.element('<div class="se-resize"></div>');
		element.append(newElement);
		newElement.on("mousedown", function(event) {
			init(event);
			$document.on("mousemove", mousemove);
			$document.on("mouseup", mouseup);
			function mousemove(event) {
				event.preventDefault();
				resizeDown(event);
				resizeRight(event);
			}

			function mouseup() {
				$document.off("mousemove", mousemove);
				$document.off("mouseup", mouseup);
			}

		});
		// Create a div to catch resize down left event
		newElement = angular.element('<div class="sw-resize"></div>');
		element.append(newElement);
		newElement.on("mousedown", function(event) {
			init(event);
			$document.on("mousemove", mousemove);
			$document.on("mouseup", mouseup);
			function mousemove(event) {
				event.preventDefault();
				resizeDown(event);
				resizeLeft(event);
			}

			function mouseup() {
				$document.off("mousemove", mousemove);
				$document.off("mouseup", mouseup);
			}

		});
	};
}])

//Custom directive to handle click outside an element
.directive("gbOutsideClick", ['$document',
function($document) {
	return {
		link : function($scope, $element, $attributes) {
			var scopeExpression = $attributes.gbOutsideClick,
			    onDocumentClick = function(event) {
				var isChild = $element.find(event.target).length > 0;
				if (!isChild) {
					//check if digest cycle is already in progress
					if(!$scope.$$phase) {
						$scope.$apply(scopeExpression);
					  }
					
				}
			};
			$document.on("click", onDocumentClick);
		}
	};
}])

.directive("ngOnload", [
	function() {
		return {
			restrict: "A",
			scope: {
				callback: "&ngOnload"
			},
			link: (scope, element, attrs) => {
				element.on("load", (event) => scope.callback({ event: event }));
			}
		};
	}
])

// Custom Directive for fushion chart integration
// .directive('fchart', function() {
// return {
// restrict : 'EA',
// link : function(scope, element, attrs) {
// attrs.$observe('exportImage', function(value) {
// if (value > 0) {
// barChart1.exportChart();
// }
// });
// attrs.$observe('exportPdf', function(value) {
// if (value > 0) {
// barChart1.exportChart({
// "exportFormat" : "pdf"
// });
// }
// });
// attrs.$observe('cType', function(value) {
// barChart1.dispose();
// barChart1 = new FusionCharts(attrs['cType'], "myChartId1" + Math.random(), "100%", "99%", "0");
// barChart1.setJSONData({
// "chart" : {
// "caption" : attrs.fLabel == "" ? "" : "'" + attrs.fLabel + "'",
// "subcaption" : attrs.fDRange,
// "exportEnabled" : 1,
// "animation" : 0,
// "showBorder" : 0,
// "canvasBorderColor" : "000000",
// "canvasBorderThickness" : "1",
// "showAlternateVGridColor" : "0",
// "alternateVGridColor" : "FFFFFF",
// "bgcolor" : "FFFFFF",
// "canvasbgColor" : "FFFFFF",
// "canvasbgAlpha" : "100",
// "bgAlpha" : "100",
// "paletteColors" : "#51BBFD",
// "plotGradientColor" : "#4682B4",
// "plotFillAlpha" : "95,100",
// "plotFillRatio" : "20,80",
// "plotBorderColor" : "51BBFD",
// "plotSpacePercent" : "40",
// "showvalues" : "0",
// "decimals" : "0",
// "formatnumberscale" : "0",
// "numDivLines" : "5",
// "slantLabels" : "1",
// "shadowalpha" : "40",
// "labelstep" : "1",
// "numvdivlines" : "6",
// "legendposition" : "BOTTOM",
// "exportShowMenuItem" : 0,
// "exportHandler" : "/FusionChartExport_PHP/index.php",
// "exportAtClient" : 0,
// "exportAction" : "download",
// "exportTargetWindow" : "_self"
// },
// "data" : JSON.parse(attrs.cData)
// });
// barChart1.render(element[0]);
// });
// var barChart1 = new FusionCharts(attrs['cType'], "myChartId" + Math.random(), "100%", "99%", "0");
// barChart1.setJSONData({
// "chart" : {
// "caption" : attrs.cType
// },
// "data" : JSON.parse(attrs.cData)
// });
// barChart1.render(element[0]);
// }
// };
// })
// Custom Directive to capture the return or enter key press on the UI from the user
.directive('ngEnter', function() {//track return keypress
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if (event.keyCode === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	};
})
// XLS download directive for any given section
.directive('exportXls', ['SectionsMetaService', 'ConfigDiffService', 'UserTrackingService',
function(SectionsMetaService, ConfigDiffService, UserTrackingService) {
	return {
		restrict : "A",
		scope : {
			section : '&exportSection',
			type : '@exportType',
			info : '&exportInfo'
		},
		link : function(scope, element, attrs) {
			element.on("click", function() {
				var url = "",
				    iFrame;
				var section = scope.section();
				var cols_list = "";
				if (scope.type == "sectionview") {
					url = SectionsMetaService.exportXlsUrl(section);
					for (column in section.columns) {
						if (section.columns[column].selected) {
							if (cols_list == "") {
								cols_list += section.columnsMap[section.columns[column].title];
							} else {
								cols_list += "," + section.columnsMap[section.columns[column].title];
							}
						}
					}
					UserTrackingService.standard_user_tracking(scope.info().application, 'Section View', 'Export', "{\'" + section.label + "\':\'" + cols_list + "\'}").then(function() {
					}, function() {
					});
				} else if (scope.type == "configdiff") {
					url = ConfigDiffService.exportXlsUrl(scope.info().defaultEndCust, scope.info().defaultSysId, scope.info().defaultObservation, section);
					for (key in section.keys) {
						if (section.keys[key].visible) {
							if (cols_list == "") {
								cols_list += section.keys[key].col_name;
							} else {
								cols_list += "," + section.keys[key].col_name;
							}
						}
					}
					UserTrackingService.standard_user_tracking(scope.info().application, 'Config Diff', 'Export', "{\'" + section.label + "\':\'" + cols_list + "\'}").then(function() {
					}, function() {
					});
				} else {
					alert("Can only be used within section view or config diff.");
				}
				iFrame = element.find("iframe");
				if (!(iFrame && iFrame.length > 0)) {
					iFrame = angular.element("<iframe style='position:fixed;display:none;top:-1px;left:-1px;'/>");
					element.append(iFrame);
				}
				iFrame.attr("src", url);
			});
			element.on('$destroy', function() {
				element.off();
			});
		}
	};
}])// .directive('gbDownloadFile', ['GlobalService', 'LogVaultService', '$document', 'ModalService',

// function(GlobalService, LogVaultService, $document, ModalService) {
// return {
// restrict : 'A',
// scope : {
// param : '&downloadFile',
// obsDate : '&obsDate'
// },
// link : function(scope, element) {
// element.on('click', function() {
// var iFrame;
// element.removeClass('icon-download4').addClass('icon-spinner');
// iFrame = angular.element($document[0].body).find("iframe.downloadframe");
// if (!(iFrame && iFrame.length > 0)) {
// iFrame = angular.element("<iframe class='downloadframe' style='position:fixed;display:none;top:-1px;left:-1px;'/>");
// angular.element($document[0].body).append(iFrame);
// }
// var userParam = scope.param();
// var obsDate = scope.obsDate();
// if (userParam) {
// paramObject = JSON.parse(userParam);
// if (paramObject.bundles[0]) {
// paramObject.bundles[0]["obs_date"] = obsDate;
// }
// userParam = JSON.stringify(paramObject)
// }
// LogVaultService.getDownloadUrl(userParam).then(function(response) {
// if (response.data == 'ERR_5') {
// var logvault_scope = angular.element('.gb-logvault').scope();
// logvault_scope.msg = GlobalService.getVal('download_failed');
// logvault_scope.modal1 = ModalService.openModal('partials/alert_box_extra.html', logvault_scope, false, 'static');
// logvault_scope.info.fadeModal = true;
// element.removeClass('icon-spinner').addClass('icon-download4');
// } else {
// iFrame.attr("src", GlobalService.getVal('download_base_url') + response.data);
// element.removeClass('icon-spinner').addClass('icon-download4');
// }
// }, function(response) {
// var logvault_scope = angular.element('.gb-logvault').scope();
// logvault_scope.msg = GlobalService.getVal('download_failed');
// logvault_scope.modal1 = ModalService.openModal('partials/alert_box_extra.html', logvault_scope, false, 'static');
// logvault_scope.info.fadeModal = true;
// element.removeClass('icon-spinner').addClass('icon-download4');
// });
// });
// element.on('$destroy', function() {
// element.off();
// });
// }
// };
// }])

// Custom directive to download the bundle.
.directive('gbDownloadBundle', ['GlobalService', '$filter', 'LogVaultService', '$document', 'ModalService', 'UserTrackingService',
function(GlobalService, $filter, LogVaultService, $document, ModalService, UserTrackingService) {
	return {
		restrict : 'A',
		scope : {
			param : '&downloadFile',
			sysId1 : '&sysId1',
			sysId2 : '&sysId2',
			obsDate : '&obsDate',
			bundleId : '&bundleId',
			application : '&application',
			onDownloaded : '&onDownloaded',
			close : '@close'
		},
		link : function(scope, element) {
			element.on('click', function() {
				var application = scope.application();
				var obs_date = scope.obsDate().replace("IST", "");
				if(angular.isArray(scope.sysId2())){
					sysid2 = scope.sysId2()[0];
				}else{
					sysid2 = scope.sysId2();
				}
				var iFrame,
				    bundles = {
					'bundles' : [],
					'sys_id1' : scope.sysId1(),
					'sys_id2' : sysid2 || "NA",
					'bundle_id' : scope.bundleId(),
					'obs_date' : $filter('utcDateTZ')(new Date(obs_date)),
					'download_type' : 'single'
				};
				iFrame = angular.element($document[0].body).find("iframe.downloadframe");
				if (!(iFrame && iFrame.length > 0)) {
					iFrame = angular.element("<iframe class='downloadframe' style='position:fixed;display:none;top:-1px;left:-1px;'/>");
					angular.element($document[0].body).append(iFrame);
				}
				scope.param().split('&').map(function(item) {
					bundles['bundles'].push({
						'bundle_name' : item.substr(8)
					});
					return item.substr(8);
				});

				LogVaultService.getDownloadUrl(JSON.stringify(bundles)).then(function(response) {
					scope.$eval(scope.onDownloaded);
					if (response.data.Data.Status == 'Failure') {
						var modal_scope = application == GlobalService.getVal('navLog') ? angular.element('.gb-logvault').scope() : angular.element('.gb-idashboard-events').scope();
						ModalService.alertBox({
							msgKey : 'download_failed'
						});
						modal_scope.info.fadeModal = true;
					} else {
						iFrame.attr("src", GlobalService.getVal('download_base_url') + response.data.Data);
						if (scope.close) {
							angular.element($document[0].body.querySelector('.modal-backdrop')).remove();
							element.parent().parent().parent().parent().parent().remove();
						}
						var details = {
							'Bundle Names' : [bundles['bundles'][0].bundle_name]
						};
						UserTrackingService.standard_user_tracking(application, application === GlobalService.getVal('navLog') ? application : 'Section', 'Download', JSON.stringify(details)).then(function(response) {

						}, function(response) {
							var modal_scope = application == GlobalService.getVal('navLog') ? angular.element('.gb-logvault').scope() : angular.element('.gb-idashboard-events').scope();
							if (!modal_scope.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
								modal_scope.info.sessionTimedOut = true;
								ModalService.sessionTimeout();
							}
						});
					}
				}, function(response) {
					scope.$eval(scope.onDownloaded);
					var modal_scope = application == GlobalService.getVal('navLog') ? angular.element('.gb-logvault').scope() : angular.element('.gb-idashboard-events').scope();
					ModalService.alertBox({
						msgKey : 'download_failed'
					});
					modal_scope.info.fadeModal = true;
				});
			});
			element.on('$destroy', function() {
				element.off();
			});
		}
	};
}])

// Custom directive to download the bundle.
.directive('gbDownloadBundleGroup', ['GlobalService', '$filter', 'LogVaultService', '$document', 'ModalService', 'UserTrackingService',
function(GlobalService, $filter, LogVaultService, $document, ModalService, UserTrackingService) {
	return {
		restrict : 'A',
		scope : {
			param : '&downloadFile',
			close : '@close',
			onDownloaded : '&onDownloaded'
		},
		link : function(scope, element) {
			element.on('click', function() {
				var iFrame,
				    bundles = {
					'bundles' : [],
					'download_type' : 'multiple'
				};
				iFrame = angular.element($document[0].body).find("iframe.downloadframe");
				if (!(iFrame && iFrame.length > 0)) {
					iFrame = angular.element("<iframe class='downloadframe' style='position:fixed;display:none;top:-1px;left:-1px;'/>");
					angular.element($document[0].body).append(iFrame);
				}
				scope.param().split('&').map(function(item) {
					var name = item.substr(8).split('#-#')[0];
					var sysId1 = item.substr(8).split('#-#')[1];
					var sysId2 = item.substr(8).split('#-#')[2];
					var obsDate = item.substr(8).split('#-#')[3];
					var obs_date = obsDate.replace("IST", "");
					var bundleId = item.substr(8).split('#-#')[4];
					if(!sysId2){
						sysId2 = 'NA';
					}
					bundles['bundles'].push({
						'bundle_name' : name,
						'bundle_id' : bundleId,
						'sys_id1' : sysId1,
						'sys_id2' : sysId2,
						'obs_date' : $filter('utcDateTZ')(new Date(obs_date))
					});
					return item.substr(8);
				});
				if (scope.close) {
					angular.element($document[0].body.querySelector('.modal-backdrop')).remove();
					element.parent().parent().parent().parent().parent().remove();
				}
				LogVaultService.getDownloadUrl(JSON.stringify(bundles)).then(function(response) {
					scope.$eval(scope.onDownloaded);
					if (response.data == 'ERR_5') {
						ModalService.alertBox({
							msgKey : 'download_failed'
						});
					} else {
						iFrame.attr("src", GlobalService.getVal('download_base_url') + response.data.Data);

						var bundleNamesArray = [];
						for (var i = 0; i < bundles['bundles'].length; i++) {
							bundleNamesArray.push(bundles['bundles'][i].bundle_name);
						}
						var details = {
							'Bundle Names' : bundleNamesArray
						};
						UserTrackingService.standard_user_tracking(GlobalService.getVal('navLog'), GlobalService.getVal('navLog'), 'Download', JSON.stringify(details)).then(function(response) {

						}, function(response) {
							var modal_scope = angular.element('.gb-logvault').scope();
							if (!modal_scope.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
								modal_scope.modal.close();
								modal_scope.info.sessionTimedOut = true;
								ModalService.sessionTimeout();
							}
						});
					}
				}, function(response) {
					scope.$eval(scope.onDownloaded);
					var modal_scope = angular.element('.gb-logvault').scope();
					if (!modal_scope.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
						modal_scope.modal.close();
						modal_scope.info.sessionTimedOut = true;
						ModalService.sessionTimeout();
					} else {
						ModalService.alertBox({
							msgKey : 'download_failed'
						});
					}
				});
			});
			element.on('$destroy', function() {
				element.off();
			});
		}
	};
}]).directive('gbFrame', function() {
	return {
		restrict : 'E',
		require : '?ngModel',
		replace : true,
		transclude : true,
		template : '<iframe height="100%" width="100%" frameborder="0"></iframe>',
		link : function(scope, element, attrs) {
			element.attr('src', attrs.iframeSrc);
		}
	};
})
// Directive to convert json to html form
.directive('gbJsonForm', ['$compile',
function($compile) {
	return {
		restrict : "EA",
		scope : {
			jsonData : '=',
			uploadForm : '='
		},
		link : function(scope, element) {
			var myElem,
			    container,
			    node,
			    jsonData = scope.jsonData;
			myElem = angular.element('<div>');
			angular.forEach(jsonData, function(item) {
				container = angular.element('<div>').addClass('form-group').attr('ng-class', "{'has-error': uploadForm." + item.name + "['error']}");

				if(item.mandatory == true)
				container.append(angular.element('<label>').text(item.label + ' *').addClass('col-sm-4 control-label'));
				else
				container.append(angular.element('<label>').text(item.label).addClass('col-sm-4 control-label'));
				container.append(angular.element('<div>').addClass('col-sm-8'));
				if (item.type == 'text') {
					node = angular.element('<input>').prop('type', 'text').attr('ng-model', 'uploadForm.' + item.name + '.nodeVal');
				} else if (item.type == 'hidden') {
					node = angular.element('<input>').prop('type', 'hidden').attr('ng-model', 'uploadForm.' + item.name + '.nodeVal');
				} else {
					node = angular.element('<select>').attr('ng-model', 'uploadForm.' + item.name + '.nodeVal');
					angular.forEach(item.data, function(dataItem) {
						node.append(angular.element('<option>').prop('value', dataItem).text(dataItem));
					});
				}
				node.addClass('form-control');
				container.find('.col-sm-8').append(node);
				container.find('.col-sm-8').append(angular.element('<span>').text('Value required.').attr('ng-show', "uploadForm." + item.name + "['error']"));
				myElem.append(container);
			});
			element.append(myElem);
			$compile(myElem)(scope);
		}
	};
}]).directive('createRules', ['$rootScope', '$window', '$document', '$timeout', 'ExplorerService', 'metaDataService', 'InstanceHandler',
function($rootScope, $window, $document, $timeout, ExplorerService, metaDataService, InstanceHandler) {
	return {
		restrict : 'A',
		scope : {
			onSelect : '&onSelect',
			loadCtrl : '&loadCtrl'
		},
		link : function(scope, element) {
			function getSelectedText() {
				var text = "";
				if ( typeof $window.getSelection != "undefined") {
					text = $window.getSelection().toString();
				} else if ( typeof $document.selection != "undefined" && $document.selection.type == "Text") {
					text = $document.selection.createRange().text;
				}
				return text;
			}

			function doSomethingWithSelectedText(event) {
				if (event.target.id != "infoDiv") {
					if (metaDataService.getFeatures()['rules_and_alerts']) {
						if (element[0] == event.target) {
							$rootScope.evTarget = event.target;
							$document.on('mouseup', function(event) {
								if (element[0] == event.target && event.target == $rootScope.evTarget) {
									$rootScope.evTarget = null;
									var selectedText = getSelectedText();
									if (selectedText && !/^\s*$|^\t*$/.test(selectedText)) {
										$timeout(function() {
											selectedText = getSelectedText();
											if (selectedText && !/^\s*$|^\t*$/.test(selectedText)) {
												angular.element(document.getElementById('infoDiv')).css('display', 'block');
												angular.element(document.getElementById('infoDiv')).css('position', 'fixed');
												angular.element(document.getElementById('infoDiv')).css('left', (event.clientX - 24));
												angular.element(document.getElementById('infoDiv')).css('top', (event.clientY - 28));
												toolTipShown = true;
			
												ExplorerService.setRuleText(selectedText);
			
												scope.$eval(scope.onSelect);
											}
										}, 50);
									} else {
										angular.element(document.getElementById('infoDiv')).css('display', 'none');
										toolTipShown = false;
									}
								} else {
									angular.element(document.getElementById('infoDiv')).css('display', 'none');
									toolTipShown = false;
								}
								
							});

						} else {
							angular.element(document.getElementById('infoDiv')).css('display', 'none');
							toolTipShown = false;
						}
					}
				} else {
					if(!!toolTipShown) {
						toolTipShown = false;
						InstanceHandler.setVisible(false);
						if ($window.getSelection) $window.getSelection().removeAllRanges();
    					else if ($document.selection) $document.selection.empty();
						angular.element(document.getElementById('infoDiv')).css('display', 'none');
		        		scope.loadCtrl().createRuleFromText();
					}
				}
			}
			
			var toolTipShown = false;

			$document.on('mousedown', doSomethingWithSelectedText);
			$document.on('scroll', function() {
				angular.element('#infoDiv').css('display', 'none');
			});
		}
	}
}])

// To refresh the healthcheck dashboards on change of end customer.
.directive('refreshable', [
function() {
	return {
		restrict : 'A',
		scope : {
			refresh : "=refreshable"
		},
		link : function(scope, element) {
			var refreshMe = function() {
				element.attr('src', element.attr('src'));
			};
			var _unbindWatcher = scope.$watch('refresh', function(newVal, oldVal) {
				if (newVal != oldVal) {
					refreshMe();
				}
			});
			scope.$on('$destroy', function() {
				_unbindWatcher();
			});
		}
	};
}])

// Directive to display tableau report in instance viewer
.directive('tableauInstance', ['WorkbenchService', 'InstanceHandler', 'ModalService', 'GlobalService', 'UserTrackingService', 'GBDashboardService',
function(WorkbenchService, InstanceHandler, ModalService, GlobalService, UserTrackingService, GBDashboardService) {
	return {
		restrict : 'E',
		scope : {
			instance : "="
		},
		template : '<div ng-attr-id="{{instance.md5}}"></div>',
		replace : true,
		link : function(scope, element, attr) {
			var affix =  GlobalService.getVal('rLinkAffix');
			GBDashboardService.getTrustedAuthKey().then(function(response) {
				GBDashboardService.setTrustedKey(response.data.Data);
				if (GBDashboardService.getTrustedKey() != '-1') {
					var view = 'Sheet 2';
					// var url = WorkbenchService.getTableauDomain() + "/t/" + WorkbenchService.getSiteName() + '/views/' + scope.instance.data.book['name'].replace(/[\s()]/g, '') + '/' + view.replace(/[\s()]/g, '');
					var url = GBDashboardService.getTableauDomain() + '/trusted/' + GBDashboardService.getTrustedKey() + scope.instance.data.view['url'];
					var placeholderDiv = element[0];
					var options = {
						width : '100%',
						height : '400px',
						hideTabs : true,
						hideToolbar : false,
						toolbarPosition : 'top',
						// onFirstInteractive : function() {
						// 	scope.$apply(function() {
						// 		scope.instance.delay = true;
						// 	});
						// }
					};
					var viz = new tableau.Viz(placeholderDiv, url, options);
					//BO -- IFRAMELINK HACK: THIS HACK NEEDS TO BE REMOVED.
					viz._impl.$19.src = viz._impl.$19.src + affix;
					//EO -- IFRAMELINK HACK
					window.addEventListener('message', function(e) {
						if(e.data.message === "gb_dom_content_loaded_from_tableau"){
							scope.instance.delay = true;
						}
					});
					// setTimeout(function(){
					// 	scope.instance.loading = false;
					// },23000);
					WorkbenchService.addTableauEventListeners(viz, GlobalService.getVal("navDashboards"), UserTrackingService);
				} else {
					InstanceHandler.removeInstance(scope.instance);
					InstanceHandler.setVisible(false);
					ModalService.alertBox({
						msgKey : 'tableau_auth_failed'
					});
				}
			}, function(response) {

			});

		}
	};
}])

// Tableau tabbed instance
.directive('tableauTabbedInstance', ['WorkbenchService', 'InstanceHandler', 'ModalService', 'GlobalService', 'UserTrackingService', 'GBDashboardService',
function(WorkbenchService, InstanceHandler, ModalService, GlobalService, UserTrackingService, GBDashboardService) {
	return {
		restrict : 'E',
		scope : {
			instance : "="
		},
		template : '<div ng-attr-id="{{instance.md5}}"></div>',
		replace : true,
		link : function(scope, element, attr) {
			GBDashboardService.getTrustedAuthKey().then(function(response) {
				GBDashboardService.setTrustedKey(response.data.Data);
				if (GBDashboardService.getTrustedKey() != '-1') {
					var view = 'Sheet 2';
					var url = GBDashboardService.getTableauDomain() + "/trusted/" + GBDashboardService.getTrustedKey() + "/t/" + GBDashboardService.getSiteName() + '/views/' + scope.instance.data.book['name'].replace(/[\s\~\!\@\#\$\%\^\&\*\(\)\`\+\=\[\]\{\}\\\|\:\;\"\'\<\>\,\?\/]/g, '').replace(/\./g, '_') + '/' + scope.instance.data.book.reports[0]['name'].replace(/[\s\~\!\@\#\$\%\^\&\*\(\)\`\+\=\[\]\{\}\\\|\:\;\"\'\<\>\,\?\/]/g, '').replace(/\./g, '_');
					var placeholderDiv = element[0];
					var options = {
						width : '100%',
						height : '400px',
						hideTabs : false,
						hideToolbar : false,
						toolbarPosition : 'top',
						onFirstInteractive : function() {
							scope.$apply(function() {
								scope.instance.delay = true;
							});
						}
					};
					var viz = new tableau.Viz(placeholderDiv, url, options);
					WorkbenchService.addTableauEventListeners(viz, GlobalService.getVal("navDashboards"), UserTrackingService);
				} else {
					InstanceHandler.removeInstance(scope.instance);
					InstanceHandler.setVisible(false);
					ModalService.alertBox({
						msgKey : 'tableau_auth_failed'
					});
				}
			}, function(response) {

			});
		}
	};
}])

// Directive to display tableau report in instance viewer
.directive('tableauEditor', ['WorkbenchService', 'InstanceHandler', 'ModalService', 'GlobalService', 'UserTrackingService', 'GBDashboardService',
function(WorkbenchService, InstanceHandler, ModalService, GlobalService, UserTrackingService, GBDashboardService) {
	return {
		restrict : 'E',
		scope : {
			instance : "="
		},
		template : '<div ng-attr-id="{{instance.md5}}"></div>',
		replace : true,
		link : function(scope, element, attr) {
			GBDashboardService.getTrustedAuthKey().then(function(response) {
				GBDashboardService.setTrustedKey(response.data.Data);
				if (GBDashboardService.getTrustedKey() != '-1') {
					var view = 'Sheet 2';
					if (scope.instance.data.view && !isArray(scope.instance.data.view )) {
						var url = GBDashboardService.getTableauDomain() + '/trusted/' + GBDashboardService.getTrustedKey() + scope.instance.data.view['url'].replace('views', 'authoring');
					} else {
						var url = GBDashboardService.getTableauDomain() + '/trusted/' + GBDashboardService.getTrustedKey() + "/t/" + GBDashboardService.getSiteName() + '/authoring/' + scope.instance.data.view[0]['name'].replace(/[\s\~\!\@\#\$\%\^\&\*\(\)\`\+\=\[\]\{\}\\\|\:\;\"\'\<\>\,\?\/]/g, '').replace(/\./g, '_') + '/' + scope.instance.data['views'][0]['name'].replace(/[\s\~\!\@\#\$\%\^\&\*\(\)\`\+\=\[\]\{\}\\\|\:\;\"\'\<\>\,\?\/]/g, '').replace(/\./g, '_');
					}
					var placeholderDiv = element[0];
					var options = {
						width : '100%',
						height : '600px',
						hideTabs : true,
						hideToolbar : false,
						toolbarPosition : 'top',
						onFirstInteractive : function() {
							scope.$apply(function() {
								scope.instance.delay = true;
							});
						}
					};
					var viz = new tableau.Viz(placeholderDiv, url, options);
					GBDashboardService.addTableauEventListeners(viz, GlobalService.getVal("navDashboards"), UserTrackingService);
				} else {
					InstanceHandler.removeInstance(scope.instance);
					InstanceHandler.setVisible(false);
					ModalService.alertBox({
						msgKey : 'tableau_auth_failed'
					});
				}
			}, function(response) {

			});

		}
	};
}])

// Directive to display tableau report in instance viewer
.directive('tableauPermissions', ['WorkbenchService', 'GlobalService', 'UserTrackingService',
function(WorkbenchService, GlobalService, UserTrackingService) {
	return {
		restrict : 'E',
		scope : {
			instance : "="
		},
		template : '<div ng-attr-id="{{instance.md5}}"></div>',
		replace : true,
		link : function(scope, element) {
			var url = WorkbenchService.getTableauDomain() + "/t/" + WorkbenchService.getSiteName() + '/workbooks';
			var placeholderDiv = element[0];
			var options = {
				width : '100%',
				height : '600px',
				hideTabs : true,
				hideToolbar : false,
				toolbarPosition : 'top',
				onFirstInteractive : function() {

				}
			};
			var viz = new tableau.Viz(placeholderDiv, url, options);
			WorkbenchService.addTableauEventListeners(viz, GlobalService.getVal("navDashboards"), UserTrackingService);
		}
	};
}]).directive('iframeOnload', [
function() {
	return {
		scope : {
			callBack : '&iframeOnload'
		},
		link : function(scope, element, attrs) {
			element.on('load', function() {
				return scope.callBack();
			})
		}
	}
}]).directive('tooltip', function(){
    return {
        restrict: 'A',
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
}).directive('customTimeFilter', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl : 'partials/instance-viewer/customTimeFilter.html',
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
}).directive('summeryDashboard', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl : 'partials/dashboards/summery.html',
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
}).directive('scrolly', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];                
            element.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    //console.log("I am at the bottom");
                    scope.$apply(attrs.scrolldown);
                }
                if(raw.scrollTop <= 0){
                	scope.$apply(attrs.scrollup);
                	//console.log("I am at the top");
                }
            });
        }
    };
}).directive('dashboardListView', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl : 'partials/dashboards/listview.html',
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
}).directive('dashboardTileView', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl : 'partials/dashboards/tileview.html',
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
}).directive('dashboardTileDetailsView', function(){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl : 'partials/dashboards/tileviewdetails.html',
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
}).directive('othersDashboards', function($timeout){
    return {
        restrict: 'EA',
        scope: false,
        templateUrl : 'partials/dashboards/othersdashboards.html',
        link: function(scope, element, attrs){
			$(element).hover(function(){
				// on mouseenter
                $(element).tooltip('show');
            }, function(){
				// on mouseleave
                $(element).tooltip('hide');
            });
			$timeout(function() { 
				if(attrs.iscontexthelpenabled === 'true'){
					gbInlineHelp.showContextualIcon();
				}
			});
        }
    };
}).directive('savedViewPopup', function(){
    return {
        restrict: 'AE',
        templateUrl: 'partials/apps/saved-filter-list.html',
        link: function(scope, element, attrs){
            
        }
    };
}).directive('appsParsedView', function(){
    return {
        restrict: 'AE',
        templateUrl: 'partials/apps/pview.html',
        link: function(scope, element, attrs){
            
        }
    };
}).directive('appsLogView', function(){
    return {
        restrict: 'AE',
        templateUrl: 'partials/apps/lview.html',
        link: function(scope, element, attrs){
            
        }
    };
}).directive('appsDiffView', function(){
    return {
        restrict: 'AE',
        templateUrl: 'partials/apps/dview.html',
        link: function(scope, element, attrs){
            
        }
    };
}).directive('appsView', function(){
    return {
        restrict: 'AE',
        scope: {
        	instance: '@instance',
        	instancedata: '@instancedata'
        },
        templateUrl: 'partials/apps/main.html',
        controller: function($scope,$interval, $timeout, $sce, $modal, $element, $attrs, $filter, GlobalService, ModalService, ExplorerService,SectionsMetaService, metaDataService, LogVaultService, AppService, UserTrackingService){
			var configData = JSON.parse($scope.instancedata);
			$scope.fromDateForDiffViewApi = GlobalService.getVal('fromDateForDiffViewApi');
        	$scope.activeMenu = 'pview';
        	$scope.sectionFilter = "";
        	$scope.activeMenuFuture = '';
        	$scope.selectAllSection = false;
        	$scope.noSectionFound = false;
        	$scope.loading = true;
            $scope.sysId2List = [];
            $scope.sysId2 = 'NA';
        	$scope.sections = [];
        	$scope.saveView = null;
        	$scope.selectAtleastOneSectionMsg = GlobalService.getVal('select_section');
        	$scope.loggedInUser = metaDataService.getUser()['email'];
        	$scope.navConfirmMsg = GlobalService.getVal('nav_confirm');
        	$scope.clearViewConfirmMsg = GlobalService.getVal('clear_view_confirm');        	
        	$scope.config = function(key){
        		if(configData[key]){
        			return configData[key];
        		}
        		return null;
        	}
        	$scope.bundleType = configData.result.bundle_type;
        	$scope.bundleSerialNumber = $scope.config('sysId');
        	$scope.bundleSysId2 = $scope.config('sysId2');
        	$scope.bundleName = $scope.config('bundle');
        	$scope.bundleObservation = $scope.config('observation');
        	$scope.defaultViewFromDashboard = $scope.config('view');
        	$scope.source = $scope.config('source');
        	if($scope.source && $scope.source == 'explorer'){
        		$scope.activeMenu = 'lview';
        		$scope.defaultSectionNamespace = null;
        		$scope.defaultSectionNamespace = configData.result['namespace'];
        		$scope.application = 'Explorer';
        	}else{
        		$scope.application = 'Log Vault';
        	}
        	$scope.module = "Apps";

            $scope.getSysId2Label = function() {
                var manufacturer = GlobalService.getVal('manufacturer');
                var sysId2 = GlobalService.getVal('systemId2');
                if(sysId2.customer.hasOwnProperty(manufacturer)) {
                    return sysId2.customer[manufacturer];
                } else {
                    return sysId2.common;
                }
            };
            $scope.changeView = function(menu){
        		if(menu == $scope.activeMenu) return;
        		//reset secton selection, if select but not applied
				$scope.resetSectionSelection();
				var nomnerOfSectionSelected = $scope.sectionsCommon.getSelectedSections();
				var maxSectionSelectedLimit = GlobalService.getVal('instance_selected_sections_limit');
	        	/*
	        	if you are in "log view" tab ; select all option is not applicable to other view
	        	*/
        		if(($scope.sections.length > maxSectionSelectedLimit) && $scope.activeMenu == 'lview'){
        			if(menu == 'dview'){
        				$scope.modal = ModalService.alertBox({msgKey: 'instance_view_max_section_diff'});
        			}else{
        				$scope.modal = ModalService.alertBox({msgKey: 'instance_view_changes_disabled_msg'});	
					}					
	        		return;
	        	}
	        	/*
	        	if you are in "log view" tab ; limit max sction selection
	        	*/
	        	if($scope.activeMenu == 'lview' && menu == 'dview'){
	        		if($scope.sections.length > maxSectionSelectedLimit){
	        			$scope.modal = ModalService.alertBox({msgKey: 'instance_view_max_section_diff'});
	        			return;
	        		}
	        	}
	        	/*
	        	if you are in "parsed view" tab ; limit max sction selection to diff view
	        	we can not see diff of any nuber of section
	        	*/
	        	if($scope.activeMenu == 'pview' && menu == 'dview'){
	        		if($scope.sections.length > maxSectionSelectedLimit){
	        			$scope.modal = ModalService.alertBox({msgKey: 'instance_view_max_section_diff'});
	        			return;
	        		}
	        	}
    			$scope.activeMenu = menu;
        		$scope.selectAllSection = false;
    			$scope.applySectionSelection();

        		var tab = "";
        		if(menu == 'pview') tab = "Table View";
        		else if(menu == 'lview') tab = "Log View";
        		else tab = "Diff";
        		UserTrackingService.standard_user_tracking($scope.application, $scope.module, tab, JSON.stringify($scope.sectionsCommon.getSelectedSections())).then(userTrackingSuccess, handleSessionTimeout);
        	}
        	$scope.showTabChangeConfirm = function(modalParam){
        		$scope.modalInstance = $modal.open({
        			scope: $scope,
			      	templateUrl: 'partials/apps/confirmation_box.html'
			    });
        	};
        	$scope.showViewClearConfirm = function(modalParam){
        		if($scope.sectionsCommon.getSelectedSections().length > 0){        			
	        		$scope.modalInstance = $modal.open({
	        			scope: $scope,
				      	templateUrl: 'partials/apps/confirmation_clear.html'
				    });
        		}
        	};
        	$scope.YesChangeTab = function(){
        		$scope.activeMenu = $scope.activeMenuFuture;
    			$scope.applySectionSelection();
        		$scope.modalInstance.close();
        	};
        	$scope.YesClearViewTab = function(){
    			$scope.clear();
        		$scope.modalInstance.close();
        		UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Clear sections selection', JSON.stringify('{}')).then(userTrackingSuccess, handleSessionTimeout);
        	};
			$scope.renderHtml = function (html) {
			 	return $sce.trustAsHtml(html);
			};
            $scope.isSysId2Available = function () {
                if($scope.sysId2List == 'NA') return false;
                if($scope.sysId2List.length == 0) return false;
				if($scope.activeMenu == 'lview') return false;
                return true;
            };
            $scope.setSysId2 = function (s2) {
            	if($scope.sysId2 == s2) return false;
                $scope.sysId2 = s2;
                $scope.dview.loadBundles();
            };
        	$scope.closeModal = function(){
        		$scope.modalInstance.close();
        	}
        	$scope.menuIsActive = function(menu){
        		return $scope.activeMenu == menu;
        	}
        	$scope.isinParsedView = function(menu){
        		return ($scope.activeMenu == 'pview');
        	}
        	$scope.showFilterPanel = function(){ 
	        	if($scope.activeMenu == 'pview'){
		    		/*if($scope.source && $scope.source == 'explorer'){
		    			return false;
		    		}*/
		    		return true;
		    	}
		    	return false;
        	}
        	$scope.isinLogView = function(menu){
        		if($scope.activeMenu == 'lview'){
        			if(!$scope.noSectionFound){
        				return true;
        			}else{
        				return false;
        			}
        		}
        		return false;
        	}
        	$scope.isinDiffView = function(menu){
        		return ($scope.activeMenu == 'dview');
        	}

        	$scope.sectionsCommon = (function(){
        		var sectionsList = [];
        		var originalList = [];
        		var loading = true;
        		var defaultSection = null;
        		//get list fo section
        		//ExplorerService.getSectionViewerSections()
        		SectionsMetaService.getSectionsFilteredByByndleType($scope.bundleType)
                .then(function (response) {
                	var me = this;
                    var sections = $filter('filter')(response.data.Data, {namespace_type: 'SECTION'});
                    /*sections = $filter('filter')(response.data.Data, {namespace_type: '!SESSION'});
                    sections = $filter('filter')(sections, {namespace_type: '!UNPARSED'});*/
                    sections = $filter('orderBy')(sections, "label");
					//get sysid2
                    SectionsMetaService.getS2($scope.bundleSerialNumber).then(function(response) {
                        if(response.data.Data && response.data.Data.length && response.data.Data.length > 0){
                            $scope.sysId2List = response.data.Data;
                            if($scope.sysId2List.length > 0) {
                               if($scope.bundleSysId2){
                               		$scope.setSysId2($scope.bundleSysId2);
                               }else{
                               		$scope.setSysId2($scope.sysId2List[0]);
                               }
                               
                            }
                        }else{
                            $scope.sysId2List = [];
                        }
                        processSectionData(sections);
                    }, function (error) {
                        $scope.sysId2List = [];
                        processSectionData(sections);
                    }, me);
                }, function (response) {
                    console.log("Error:" + response);
                    loading = false;
                },$scope);
				//after getting section list process section and do as page loads
				var processSectionData = function (sections) {
                    if(sections.length == 0){
                        ExplorerService.getSectionViewerSections()
                            .then(function (response) {
                                var sections = $filter('filter')(response.data.Data, {namespace_type: 'SECTION'});
                                /*sections = $filter('filter')(sections, {namespace_type: '!SESSION'});
                                sections = $filter('filter')(sections, {namespace_type: '!UNPARSED'});
                                sections = $filter('filter')(sections, {namespace_type: '!STATS'});*/
                                sections = $filter('orderBy')(sections, "label");
                                sectionsList = sections;
                                originalList = sections;
                                loading = false;
                                if($scope.activeMenu == 'pview'){
                                    var defaultFilterChecker = $interval(function(){
                                        if(!$scope.filter.isLoading()){
                                            var defaultFilter = $scope.filter.hasDefaultView();
                                            if(defaultFilter){
                                                $scope.filter.applyFilter(defaultFilter);
                                            }
                                            $interval.cancel(defaultFilterChecker);
                                        }
                                    }, 100, 100000);

                                }else if($scope.activeMenu == 'lview'){
                                    defaultSection = $scope.defaultSectionNamespace;
                                    $scope.sectionsCommon.selectDefaultSection();

                                }
                            }, function (response) {
                                console.log("Error:" + response);
                                loading = false;
                            },$scope);

                        return;
                    }
                    sectionsList = sections;
                    originalList = sections;
                    loading = false;
                    if($scope.activeMenu == 'pview'){
                        var defaultFilterChecker = $interval(function(){
                            if(!$scope.filter.isLoading()){
                                var defaultFilter = $scope.filter.hasDefaultView();
                                if(defaultFilter){
                                    $scope.filter.applyFilter(defaultFilter);
                                }
                                $interval.cancel(defaultFilterChecker);
                            }
                        }, 100, 100000);
                    }else if($scope.activeMenu == 'lview'){
                        defaultSection = $scope.defaultSectionNamespace;
                        $scope.sectionsCommon.selectDefaultSection();
                        //$scope.lview.get();
                    }
                }
        		return{
        			isLoading: function(){
        				return loading;
        			},
        			getAll : function(){
        				for(var i=0;i<sectionsList.length;i++){
        					sectionsList[i]['provisionalSelected'] = false;
        					for(var j=0;j<$scope.sections.length;j++){
        						if(sectionsList[i]['label'] == $scope.sections[j]['label']){
        							sectionsList[i]['provisionalSelected'] = true;
        						}
        					}
        				}
        				return sectionsList;
        			},
        			selectDefaultSection: function(){
        				if(!defaultSection){return;};
        				$scope.sections = [];
        				var section;
        				for(j=0;j<sectionsList.length;j++){
        					section = sectionsList[j];
        					if(section['name'] == defaultSection){
        						sectionsList[j]['selected'] = true;
        						$scope.sections.push(section);
        						break;
    						}else{
    							sectionsList[j]['selected'] = false;
    						}
        				}
        				if($scope.activeMenu == 'pview'){
        					$scope.pview.loadSectionData();
        				}else if($scope.activeMenu == 'lview'){
        					$scope.lview.get();
        				}else{
        					$scope.dview.getFileDiffSection();
        				}
        				
        			},
        			getSelectedSections: function(){
        				var list = [],section;
        				for(j=0;j<sectionsList.length;j++){
        					section = sectionsList[j];
        					if(section.selected){
        						list.push(section);
    						}
        				}
        				return list;
        			},
        			getSelectedSectionLabelName: function(sectionFromCallee){
        				var section;
        				for(var j=0;j<sectionsList.length;j++){
        					section = sectionsList[j];
        					if(section.name == sectionFromCallee.section_name){
        						return section.label;
    						}
        				}
        			},
        			unSelectSection: function(item){
        				for(j=0;j<sectionsList.length;j++){
        					section = sectionsList[j];
        					if(item.label == section.label){
    							section.selected = false;
    							section.transpose = false;
    						}
        				}
        				$scope.sections = this.getSelectedSections();
        			},
        			selectSections: function(items){
        				if(items.length == 0){
        					this.reset();
        					return;
        				}
        				var item,section;
        				//reset section selection to false
        				for(var scount=0; scount < sectionsList.length; scount++){
    						sectionsList[scount]['selected'] = false;        					
        				}
        				for(var i=0;i<items.length;i++){
        					item = items[i];
	        				for(j=0;j<sectionsList.length;j++){
	        					if(item.label == sectionsList[j].label){
	    							sectionsList[j]['selected'] = true;
	    						}
	        				}
        				}
        			},
        			selectAllSections : function(){
        				angular.forEach(sectionsList, function(section){
        					angular.forEach(section, function(item){
        						section.selected = true;
        					})
        				})
        			},
        			isAllSectionsSelected : function(){
						for(var i=0;i<sectionsList.length;i++){
							if(!sectionsList[i]['selected']){
								return false;
							}
						}
						return true;
        			},
        			unSelectAllSections : function(){
        				angular.forEach(sectionsList, function(section){
        					angular.forEach(section, function(item){
        						section.selected = false;
        						section.transpose = false;
        					})
        				})
        			},
        			selectSectionsFromSavedFilter : function(view){
        				var section;
        				for(var j=0;j<sectionsList.length;j++){
        					section = sectionsList[j];
        					if(view[section['table_name']]){
    							section.selected = true;
    							if(view[section['table_name']]['transpose'] && view[section['table_name']]['transpose'][0]){
    								section.transpose = view[section['table_name']]['transpose'][0];
    							}
    						}else{
    							section.selected = false;
    						}
        				}
        				$scope.sections = this.getSelectedSections();
        			},
        			reset : function(){
        				this.unSelectAllSections();
        				sectionsList = originalList;
        			}
        		}
        	})();

        	$scope.filter = (function(){
        		var tabs = [
        		{'label':'All Views', 'active': true},
        		{'label':'My Views', 'active': false},
        		{'label':'others\' Views', 'active': false}];
        		var myViews = [];
        		var allViews = [];
        		var loading = true;
        		var owner = 'All Views';
        		var loggedInUser = metaDataService.getUser()['email'];

        		var getViews = function (){
        			loading = true;
	        		//get list of saved filter i.e my views and other public view
	        		SectionsMetaService.getAllSavedViews()
	                .then(function (response) {
	                    myViews = response.data.Data;
	                    myViews = $filter('orderBy')(myViews, 'view_name');
	                    loading = false;
	                }, function (response) {
	                    console.log("Error:" + response);
	                    loading = false;
	                });
        		};
        		var getAllViews = function (){
	        		//get list of saved filter i.e my views and other public view
	        		SectionsMetaService.getAllViews()
	                .then(function (response) {
	                    allViews = response.data.Data;
	                }, function (response) {
	                    console.log("Error:" + response);
	                });
        		};
        		getViews();
        		getAllViews();
        		return{
        			search: '',
        			appliedView: null,
        			viewTobeDeleted: {},
        			errorMsg: '',
        			deleteConfirmationMsg : GlobalService.getVal('view_delete_confirmation'),
        			showList : function(){
        				this.viewTobeDeleted = {};
        				UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'List Saved Views', JSON.stringify('{}')).then(userTrackingSuccess, handleSessionTimeout);
        			},
        			isLoading: function(){
        				return loading;
        			},
        			getTabs: function(){
        				return tabs;
        			},
        			openKblink: function(){
        				var me = this;
        				if(me.appliedView['kbase']){
        					window.open(me.appliedView['kbase'],"_blank");
        				}
        			},
        			showKbaseLink: function(){
        				var me = this;
        				if(!me.appliedView) return false;
        				me.appliedView['kbase'] = me.appliedView['kbase'].trim();
        				if(me.appliedView['kbase']){
        					if(me.appliedView['kbase'] == 'NA'){
        						return false;
        					}
        					return true;
        				}
        				return false;
        			},
        			isDuplicate: function(name){
        				var found = false;
        				for(var i=0;i<myViews.length;i++){
        					if(myViews[i]['created_by'] == $scope.loggedInUser){        						
	        					if((myViews[i]['view_name'].toLowerCase()) == (name.toLowerCase())) {
	        						found = true;
	        						break;
	        					}
        					}
        				}
        				return found;
        			},
        			isDefaultViewSelected: function(){
        				if(this.viewTobeDeleted['default'] && ((!!this.viewTobeDeleted['default']) == true)){
        					return true;
        				}
        				return false;
        			},
        			isCurrentLoggedInUser: function(item){
        				if(item.created_by == loggedInUser){
    						return true;
    					}
    					return false;
        			},
        			changeTab: function(tabName){
        				owner = tabName;
        				for(var i=0;i<tabs.length;i++){
        					if(tabName == tabs[i].label){
        						tabs[i].active = true;
        					}else{
        						tabs[i].active = false;
        					}
        				}
        			},
        			getViews: function(){
        				var list = [];
        				if(owner == 'All Views'){
        					list = myViews;
        				}else if(owner == 'My Views'){        					
	        				list = $filter('filter')(myViews, function(item){
	        					if(item.created_by == loggedInUser){
	        						return true;
	        					}else{
	        						return false;
	        					}
	        				})
        				}else if(owner == 'others\' Views'){        					
	        				list = $filter('filter')(myViews, function(item){
	        					if(item.created_by == loggedInUser){
	        						return false;
	        					}else{
	        						return true;
	        					}
	        				})
        				}
        				list = $filter('orderBy')(list, 'view_name');
        				if(this.search){
        					var str = this.search.toLowerCase();
	        				list = $filter('filter')(list, function(item){
	        					var label = item.view_name.toLowerCase();
	        					if(label.indexOf(str) != -1){
	        						return true;
	        					}else{
	        						return false;
	        					}
	        				})
        				}
        				return list;
        			},
        			toggleDefault: function(view){
        				loading = true;
        				if(!!view['default']){        					
	        				// XHR to unset the default view.
		                    SectionsMetaService.resetDefault(view)
	                        .then(function (response) {
	                           	getViews();
	                        }, function (response) {
	                            loading = false;
                            	me.viewTobeDeleted = {};
                        		me.showErrorMsg(GlobalService.getVal('instance_setDefault_view_fail'));
	                        });
                        }else{
	        				// XHR to unset the default view.
		                    SectionsMetaService.setDefault(view)
	                        .then(function (response) {
	                           	getViews();
	                        }, function (response) {
	                            loading = false;
                            	me.viewTobeDeleted = {};
                        		me.showErrorMsg(GlobalService.getVal('instance_setDefault_view_fail'));
	                        });
                        }
                        UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Toggle Default View', JSON.stringify(view)).then(userTrackingSuccess, handleSessionTimeout);
        			},
        			deleteView: function(view){
        				this.viewTobeDeleted = view;
        			},
        			closeDeleteModal : function(){
        				this.viewTobeDeleted = {};
        			},
        			showDeleteViewWindow: function(){
        				if(this.viewTobeDeleted.view_name){
        					if(!loading){
        						return true;
        					}
        				}
        				return false;
        			},
        			showErrorMsg: function(msg){
        				var me = this;
        				me.errorMsg = msg;
        				$timeout(function(){
        					me.errorMsg = '';
        				},5000,me);
        			},
        			deleteFilterSubmit: function(){
        				var me = this;
                        loading = true;
        				// XHR to unset the default view.
	                    SectionsMetaService.deleteView(me.viewTobeDeleted)
                        .then(function (response){
                        	me.closeDeleteModal();
                           	getViews();
                        },function (response){
                            loading = false;
                            me.viewTobeDeleted = {};
                        	me.showErrorMsg(GlobalService.getVal('instance_delete_view_fail'));
                        },me);
                        UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Delete Saved View', JSON.stringify(me.viewTobeDeleted)).then(userTrackingSuccess, handleSessionTimeout);
        			},
        			toggleVisibility: function(view){
        				loading = true;
        				// XHR to change the accessibility
		                SectionsMetaService.setAccessibility(view)
	                    .then(function (response) {
                           getViews();
                           UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Toggle Saved View Visibility', JSON.stringify(view)).then(userTrackingSuccess, handleSessionTimeout);
	                    }, function (response) {
                            loading = false;
                            me.viewTobeDeleted = {};
                        	me.showErrorMsg(GlobalService.getVal('instance_accessibility_view_fail'));
	                    });
        			},
        			gbUnescape: function(text){
        				return unescape(text);
        			},
					getViewOwnerName: function (viewName) {
						for(var i=0;i<myViews.length;i++){
							if(myViews[i]['view_name'] == viewName){
								return myViews[i]['created_by'];
							}
						}
						return '';
                    },
        			applyFilter: function(view){
        				if(!view.hasOwnProperty('created_by')){
        					if(!view['created_by']){
                                view['created_by'] = this.getViewOwnerName(view['view_name'])
							}
						}
        				var me = this, applyiedView = {}, applyiedViewColumn = {},applyiedViewFilter={},applyiedViewTranspose={};
	    				// XHR to unset the default view.
	                    SectionsMetaService.loadView(view)
	                    .then(function (response) {
	                       	var data = response.data.Data[0];
	                       	var column = data.cols[0];
	                       	applyiedViewColumn = me.parseStringToJSON(column,'columns');
	                       	var filters = data.filters[0];
	                       	applyiedViewFilter = me.parseStringToJSON(filters,'filters');
	                       	var transpose = data.transpose[0];
	                       	applyiedViewTranspose = me.parseStringToJSON(transpose,'transpose');
	                    	applyiedView = {
	                    		'name':  view['view_name'],
	                    		'public': data['public'],
	                    		'default': data['default'],
	                    		'desc': data['desc'],
	                    		'kbase': data['kbase']
	                    	};
	                    	var transpose,column,filter;
	                    	for(var key in applyiedViewColumn){
	                    		if(!applyiedView[key]){
	                    			applyiedView[key] = {}
	                    		}
	                    		column = applyiedViewColumn[key];
	                    		applyiedView[key][Object.keys(column)[0]] = column[Object.keys(column)[0]];
	                    		filter = applyiedViewFilter[key];
	                    		if(filter){
	                    			applyiedView[key][Object.keys(filter)[0]] = filter[Object.keys(filter)[0]];
	                    		}	                    		
	                    		transpose = applyiedViewTranspose[key];
	                    		if(transpose){
	                    			applyiedView[key][Object.keys(transpose)[0]] = transpose[Object.keys(transpose)[0]];
	                    		}
	                    	}
			    			me.appliedView = applyiedView;
			    			$scope.sectionsCommon.reset();
			        		$scope.sectionsCommon.selectSectionsFromSavedFilter(applyiedView);				        	
				    		$scope.pview.loadSectionData();
	                    }, function (response) {
	                    	console.log("Error:" + response);
	                    }, me);
						UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Apply View', JSON.stringify(view)).then(userTrackingSuccess, handleSessionTimeout);
        			},
        			parseStringToJSON: function(value, key){
        				var parsedData = value.replace("{\'","");
        				parsedData = parsedData.replace("\'}","");
        				var list = parsedData.split(",");
        				return(this.orderViewNameWithColumn(list, key));
        			},
        			orderViewNameWithColumn: function(list, key){
        				var tempObj = {}, item;
        				for(var i=0;i<list.length;i++){
        					item = list[i].split(":");
        					if(!tempObj[item[0]]){
        						tempObj[item[0]]= {};
        						tempObj[item[0]][key] = []
        					}
        					if(key == 'filters'){
        						tempObj[item[0]][key].push(item.splice(1,item.length).join(":"));
        					}else if(key == 'transpose'){
        						if(item[1] == "true"){
        							tempObj[item[0]][key].push(true);
        						}else{
        							tempObj[item[0]][key].push(false);
        						}
        					}else{
        						tempObj[item[0]][key].push(item[1]);
        					}
        				}
        				return tempObj;
        			},
        			clearView: function(){
        				this.appliedView = null;
        			},
        			clearAppliedView: function(){
        				this.appliedView = null;
        				$scope.sections.splice(0, $scope.sections.length);
        				$scope.sections = [];
        				$scope.sectionsCommon.unSelectAllSections();				        	
				    	$scope.pview.loadSectionData();
        			},
        			callViewListAPI: function(){
        				getViews();
        			},
        			hasDefaultView: function(){
        				if($scope.defaultViewFromDashboard){
        					return {'view_name': $scope.defaultViewFromDashboard};
        				}
        				var item; 
        				for(var i=0;i<myViews.length;i++){
        					item = myViews[i];
        					if(item.created_by == loggedInUser){
        						if(item['default'] == true || item['default'] == 'true'){
	        						return item;
	        					}
        					}
        				}
						return false;
        			}
        		};
        	})();

        	$scope.pview = (function(){
        		var sections = [];
        		return{
        			_sectionsList : [],
        			get: function(){
        				_sectionsList = sections;
        				return sections;
        			},
        			removeAllSections: function(){
        				var me = this;
        				me._sectionsList.splice(0,me._sectionsList.length);
        				sections.splice(0,sections.length);
        				me._sectionsList = [];
        				sections = [];
        			},
        			generateRuleLogic : function(section, column) {
		            	ExplorerService.setRuleSection(section.name);
		            	var logic = ExplorerService.getRuleText();
		            	if(column.type.toLowerCase() == 'string') {
		            		logic = "{" + section.label + "." + section.columnsMap[column.column_name] + "} LIKE '%" + logic + "%'";
		            	} else{
		            		logic = "{" + section.label + "." + section.columnsMap[column.column_name] + "} = " + logic;
		            	}
		            	ExplorerService.setRuleText(logic);
		            },
		            createRuleFromText : function(){
		            	AppService.setRequestFromApps(true);
		            },
        			loadSectionData: function(){
        				var section, sectionTempList = [], found=false;
        				sectionTempList = $scope.sections;
        				for(var i=0; i< sectionTempList.length;i++){
        					found = false;
        					//check
	        				/*for(var j=0;j<sections.length;j++){
	        					if(sections[j]['table_name'] == sectionTempList[i]['table_name']){
	        						found = true;
	        						break;
	        					}
	        				}*/
	        				if(!found){
	        					section = sectionTempList[i];
	        					section.loading = true;
	        					this.getSectionMetaData(section);
	        				}else if($scope.filter.appliedView){	        					
	        					section = sectionTempList[i];
	        					section.loading = true;
	        					this.getSectionMetaData(section);
	        				}
        				}
        				this._sectionsList = sectionTempList;
        				sections = sectionTempList;
        			},
        			removeSection: function(section){
        				$scope.sectionsCommon.unSelectSection(section);
        				this.loadSectionData();
        				UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Remove Section', JSON.stringify(section)).then(userTrackingSuccess, handleSessionTimeout);
        			},
        			getSectionMetaData : function(section){
        				var me = this;
        				//load section meta data
        				SectionsMetaService.getColumns(section['table_name']).then(function (response) {
		                    var j,gtg,k,elm, pos1, pos2;
		                    section.selectAllColumn = false;
		                    section.dataNotFound = false;
		                    
		                    if(section.transpose && ((section.transpose+"") == "true")){
		                    	section.transpose = true;
		                    }else{
		                    	section.transpose = false;
		                    }		                    
		                    section.filter = [];
		                    section.columnsMap = {};
		                    section.columnType = {};
		                    section.columnDesc = {};
		                    section.column = [];
		                    section.pagination = {
		                    	size: 10,
		                    	records: 0,
		                    	pages: 1,
		                    	page : 1

		                    };
		                    sections.columnSorting = null;
		                    me._sectionsList.columnSorting = null;
		                    response.data.Data = response.data.Data.sort(function(v1,v2){
							   for(k in v1) pos1 = v1[k]['position'];
							   for(k in v2) pos2 = v2[k]['position'];
							   return pos1 - pos2;
							});
		                    for (j in response.data.Data) {
		                        //Add attribute 'column_name' if its missing in the response
		                        gtg = response.data.Data[j];
		                        for (k in gtg) {
		                            response.data.Data[j][Object.keys(response.data.Data[j])[0]]['column_name'] = k;
		                            break;
		                        }
		                        elm = response.data.Data[j][Object.keys(response.data.Data[j])[0]];
		                        
		                        if(elm.attribute_label && elm.attribute_label != ""){
		                        	//column level filter
		                        	elm.filter = {'operator': '', 'value': ''};
		                        	if(elm['type'] == 'STRING'){
		                        		elm.filter.operator = 'like';
		                        	}else{
		                        		elm.filter.operator = '=';
		                        	}
		                        	section.column.push(elm);
			                        section.columnsMap[elm['column_name']] = response.data.Data[j][Object.keys(response.data.Data[j])[0]]['attribute_label'];
			                        section.columnType[elm['column_name']] = response.data.Data[j][Object.keys(response.data.Data[j])[0]]['solr_facet'];
			                        section.columnDesc[elm['column_name']] = response.data.Data[j][Object.keys(response.data.Data[j])[0]]['type'];		                        	
		                        }
		                    }
		                    //hide columns header
		                    for(var i=0;i<section.column.length;i++){
		                    	if(section.column[i]['solr_facet'] == 'G'){
		                    		section.column[i]['visible'] = false;
		                    	}else if(section.column[i]['attribute_label'].indexOf('obs') != -1){
		                    		section.column[i]['visible'] = false;
		                    	}else{
		                    		section.column[i]['visible'] = true;
		                    	}
			                    section.column[i].sorting = {
			                    	type: 'none'
			                    };
			                    //check if applied view, then show/hide column as per view
			                    if($scope.filter.appliedView){
			                    	if($scope.filter.appliedView[section['table_name']]){
			                    		section.column[i] = me.applyViewColumn(section, section.column[i]);
			                    	}
			                    }
		                    }
		                    section.columnOriginal = section.column;
        					me.getSectionData(section);
		                }, function (response) {
		                	section.loading = false;
		                },me);
        			},
        			applyViewColumn: function(section, column){
        				//check if applied view, then show/hide column as per view
	                    column['visible'] = this.compareWithSavedViewColumn($scope.filter.appliedView[section['table_name']], column);
	                    this.compareWithSavedViewFilter($scope.filter.appliedView[section['table_name']], column, section);	                   
	                    return column;
        			},
        			compareWithSavedViewColumn: function(view, column){
        				var columns = view.columns;
        				if(columns && columns.length && columns.length > 0){
        					for(var i=0;i<columns.length;i++){
        						if(column['column_name'] == columns[i]){
        							return true;
        						}
        					}
        				}
        				return false;
        			},
        			compareWithSavedViewFilter: function(view, column, section){
        				if(view.filters && view.filters.length && view.filters.length > 0){
	        				
	        				var filters = view.filters,str,columnName,operator,value;
	        				for(var i=0;i<filters.length;i++){
	        					str = filters[i].split(":");
	        					columnName = str[0];
	        					operator = str[1];
	        					value = str[2];
		        				if(columnName == column['column_name']){
		        					if(!value) continue;
		        					if(operator == '~'){
		        						operator = 'like'
		        					}else{
		        						value = parseInt(value, 10);
		        					}
		        					column['filter'] = {'column_name':column['column_name'], 'operator':operator, 'value':value};
		        					section.filter.push({'column_name':column['column_name'], 'operator':operator, 'value':value});
		        				}
	        				}
        				}
        			},
        			getSectionData : function(section){
        				var sid1, sid2, sid3, table_name, ts, sr, er, filters, ec, params={}, me = this;
        				table_name = section['table_name'];
        				ts = $scope.config('observation');
        				sr = "0";
        				er = "1000";
        				ec = GlobalService.getVal('manufacturer');
        				sid1 = $scope.config('sysId');
                        sid2 = $scope.config('sysId2');
                        if(!sid2 || sid2 == 'NA'){
                            sid2 = $scope.sysId2
                        }
        				if(!sid3){
	                    	sid3 = 'NA';
	                    }
						params['ns_id'] = $scope.config('result')['bundle_id'];
        				//load section parsed data
        				SectionsMetaService.getSectionParsedData(sid1, sid2, sid3, table_name, ts, sr, er, filters, ec, params).then(function (response) {
		                   //check if data are there or not
							if(response.data.Data.data){
								if(!response.data.Data.data[0] || !response.data.Data.data[0]['rows']){
									section.dataNotFound = true;
									section.loading = false;
									return;
								}
							}
		                   section.tot_count = response.data.Data['row_count'];
		                   section.rows = response.data.Data.data[0]['rows'];
		                   section.pagination.records = response.data.Data.data['row_count'];
		                   section.rowsOriginal = section.rows;
		                   me.mapGridheaderAndData(section);
		                   section.loading = false;
		                }, function (response) {
		                	section.loading = false;
		                }, me);
        			},
        			mapGridheaderAndData: function(section){        						                   
	                   var rows = [], columns = [], tmpRow, tmpColumn, pos1, pos2;
	                   for(var i=0;i<section.rows.length;i++){
	                   		tmpRow = section.rows[i];
	                   		tmpColumns = tmpRow.columns;
	                   		columns = [];
	                   		for(var j=0; j<section.column.length;j++){
		                   		columnName = section.column[j]["column_name"];
		                   		columns.push(this.mapColumn(tmpColumns, columnName, section.column[j]["visible"], section.column[j]["type"],section.column[j]["position"]));
		                   	}
		                   	section.rows[i].columns = columns;
	                   }
        			},
        			mapColumn : function(columns, columnName, visible, type, position){
        				var cell;
        				for(var i=0;i<columns.length;i++){
        					cell = columns[i];
        					if(cell.hasOwnProperty(columnName)){
        						return {'column_name': columnName, 'value' :cell[columnName], 'visible': visible, 'type': type, 'position': position} ;
        					}
        				}
        			},
        			showHideColumn: function(section, column,e){
        				var row;
        				for(var i=0;i<section.rows.length;i++){
        					row = section.rows[i];
        					for(var j=0;j<row.columns.length;j++){
        						//for single column selection
        						if(column){        							
		        					if(row.columns[j]['column_name'] == column['column_name']){
		        						row.columns[j].visible = column.visible;
		        					}
		        					if(!column.visible){
		        						section.selectAllColumn = false;
		        					}
        						}else{        							
	        						if(section.selectAllColumn){
	        							row.columns[j].visible = true;
	        							for(var k=0;k<section.column.length;k++){
	        								section.column[k]['visible'] = true;
	        							}
	        						}else{
	        							row.columns[j].visible = false;
	        							for(var k=0;k<section.column.length;k++){
	        								section.column[k]['visible'] = false;
	        							}
	        						}
        						}
	        				}
        				}
        				e.stopPropagation();
        				UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Show or Hide Columns', JSON.stringify(section)).then(userTrackingSuccess, handleSessionTimeout);
        			},
        			allColumnHidden: function(section){
        				var flag = true;
        				if(section && section.column && section.column.length){        					
	        				for(var k=0;k<section.column.length;k++){
								if(section.column[k]['visible'] == true){
									flag = false
									break;
								}
							}
							return flag;
        				}else{
        					return false;
        				}
        			},
        			getMessege: function(key){
        				return GlobalService.getVal(key);
        			},
        			getRows: function(section){
        				var rows = section.rowsOriginal;
        				//column filter
        				section.rows = $filter('filter')(rows, function(row){
        					var tmpStr = "";
    						var found = true;
    						for(var i=0;i<row.columns.length;i++){
    							for(var j=0;j<section.filter.length;j++){
    								var eachFilter = section.filter[j];
    								if(eachFilter['operator'] == 'like'){
		    							if(row.columns[i]['column_name'] == eachFilter['column_name']){
		    								tmpStr = row.columns[i]['value'].toString();
		    								if((tmpStr.toLowerCase()).indexOf((eachFilter['value']).toLowerCase()) == -1){
		    									found = false;
		    								}
		    							}
    								}else{
		    							if(row.columns[i]['column_name'] == eachFilter['column_name']){

		    								if(eachFilter['value'] == null || eachFilter['value'] == 'null' ||  eachFilter['value'] == undefined || eachFilter['value'] == 'undefined' || eachFilter['value'] == NaN || eachFilter['value'].toString() == "") return true;

											if(eachFilter['value'] && (typeof eachFilter['value'] == 'string') && (eachFilter['value'].indexOf(".") != -1)){
												eachFilter['value'] = parseFloat(eachFilter['value']).toFixed(2);
												tmpStr = parseFloat(row.columns[i]['value']).toFixed(2);
											}else{
												eachFilter['value'] = parseInt(eachFilter['value'], 10);
												tmpStr = parseInt(row.columns[i]['value'], 10);
											}
		    								operation = tmpStr + (eachFilter['operator']=='='?'==':eachFilter['operator']) + eachFilter['value'];

		    								if(!eval(operation)){
		    									found = false;
		    								}
		    							}
    								}
    							}
    						}
    						return found;
    					});
						//sorting
						section.rows = this.dataSorting(section.rows,section);
						//fetch pages of data
						section.currentPage = this.paginationParseRecords(section);
        				return section.currentPage;
        			},
        			dataSorting: function(rows,section){
        				if(rows && rows.length > 0){
        					var me = this;
        					if(section.columnSorting){
        						var column = section.columnSorting;
        						var columnName = column['column_name'];
        						var result = {};
        						if(column.sorting.type == 'asc'){
        							rows.sort(function(a, b){
        								result = me.dataSortingInternal(a.columns, b.columns, columnName);
        								if (result.v1 < result.v2)
										   return -1;
										 if (result.v1 > result.v2)
										   return 1;
										return 0;
        							}, me);
        						}else if(column.sorting.type == 'desc'){
        							rows.sort(function(a, b){
        								result = me.dataSortingInternal(a.columns, b.columns, columnName);
        								if (result.v1 > result.v2)
										   return -1;
										 if (result.v1 < result.v2)
										   return 1;
										return 0;
        							}, me);
        						}        						
        					}
        				}
        				return rows;
        			},
        			dataSortingInternal: function(row1, row2, columnName){
        				var result = {};
        				result.v1 = this.dataSortingInternalGetValue(row1, columnName);
        				result.v2 = this.dataSortingInternalGetValue(row2, columnName);
        				return result;
        			},
        			dataSortingInternalGetValue: function(row, columnName){
        				for(var i=0;i<row.length;i++){
        					if(row[i]['column_name'] == columnName){
        						return row[i]['value'];
        					}
        				}
        			},
        			paginationParseRecords : function(section){
        				if(!section.rows || section.rows.length==0){
        					return [];
        				}
        				var pageSize = section.pagination.size;
        				var totalPages = section.rows.length/pageSize;
        				section.pagination.pages = Math.ceil(totalPages);
        				var currentpage = section.pagination.page;
        				var sIndex = (currentpage-1) * pageSize;
        				var eIndex = sIndex + pageSize;
        				return (section.rows.slice(sIndex,eIndex));
        			},
        			changePageNo : function(section, no){
        				if(!section.rows || section.rows.length==0){
        					return [];
        				}
        				section.pagination.page = no;
        			},
        			hideFooter :  function(section){
        				if(section.currentPage){
        					if(section.currentPage.length == 0 || section.loading){
        						return true;
        					}
        				}
        				return false;
        			},
        			columnFilter : function(section, column, index){
        				if(column){
        					section.pagination.page = 1;
        					section.pagination.size = 10;
        					if(column.filter.value != null && column.filter.value != undefined && !isNaN(column.filter.value)){
        						column.filter.value = column.filter.value.toString();
        					}
        					//if multiple column filter for a section
	        				if(section.filter.length > 0){
	        					var found = false;
	        					for(var i=0;i<section.filter.length;i++){
	        						if(section.filter[i]['column_name'] == column['column_name']){        							
				        				found = true;
				        				section.filter[i] = column['filter'];
				        				break;
	        						}
	        					}
	        					if(!found){
	        						column['filter']['column_name'] = column['column_name'];
				        			section.filter.push(column['filter']); 
	        					}
	        				}else{        					
		        				column['filter']['column_name'] = column['column_name'];
		        				section.filter.push(column['filter']); 
	        				}
	        				//remove filter which have empty value
	    					for(var i=0;i<section.filter.length;i++){
	    						if(section.filter[i]['value'] == "" || section.filter[i]['value'] == 'null' || section.filter[i]['value'] == null || section.filter[i]['value'] == undefined || section.filter[i]['value'] == 'undefined'){
			        				section.filter.splice(i,1);
			        				break;
	    						}
	    					}
        				}
        				return true;
        			},
        			clearSectionFilter : function(section){
        				if(section.filter.length>0){        					
        					section.filter.splice(0,section.filter.length);
        					for(var i=0;i<section.column.length;i++){
        						if(section.column[i].filter['value']){
        							section.column[i].filter['value'] = "";
        						}
        						if(section.column[i].type != 'STRING'){
        							section.column[i].filter['operator'] = '=';
        							section.column[i].filter['value'] = "";
        						}
        						//clear column sorting
        						section.column[i].sorting = {
			                    	type: 'none'
			                    };
        					}
        				}
        				//clear column sorting
        				section.columnSorting = null;
        				//reset page size
        				section.pagination.size = 10;
        				//reset transpose
        				sections.transpose = false;
        				this._sectionsList.transpose = false;
        				this.columnFilter(section);
        			},
        			changePageSize: function(section,size){
        				if(section.rows.length > size){
        					section.pagination.size=size;
        					section.pagination.page = 1;
        				}
        			},
        			pageSizeIsDisabled: function(section,size){
        				if(!section.rows){
        					return false;
        				}
        				if(size > section.rows.length){
        					return true;
        				}
        				return false;
        			},
        			pageSizeIsActive: function(section, size){ 
        				if(!section.pagination){
        					return false;
        				}
        				return (section.pagination.size==size);
        			},
        			getTotalPages: function(section){
        				if(section.pagination){
        					if(section.pagination.pages == 1){
        						return [];
        					}
        					return new Array(section.pagination.pages);	
        				}else{
        					return [];
        				}        				
        			},
        			isNoDataFound: function(section){
        				if(section.loading) return false;
        				if(this.getRows(section).length == 0){
        					return true;
        				}
        				return false;
        			},
        			columnSorting: function(section, column){
        				if(column && column.sorting){
        					this.resetAllColumnSorting(section, column);
	        				if(column.sorting.type == 'none'){
	        					column.sorting.type = 'asc'
	        				} else if(column.sorting.type == 'asc'){
	        					column.sorting.type = 'desc'
	        				} else if(column.sorting.type == 'desc'){
	        					column.sorting.type = 'asc'
	        				}
	        				section.columnSorting = column;
	        			}	        			
        			},
        			getColumnSortingType: function(section,column, type){
        				if(column && column.sorting){
        					return (column.sorting.type == type);
        				}
        				return false;
        			},
        			resetAllColumnSorting: function(section, column){
        				for(var i=0;i<section.column.length;i++){
        					if(section.column[i]['column_name'] == column['column_name']){
        						continue;
        					}
        					section.column[i].sorting.type = "none";
        				}
        			},
        			isTranspose: function(section){
        				if(section.transpose === 'true' || section.transpose === true){
        					return true;
        				}
        				return false;
        			},
        			doTranspose: function(section){
        				if(section.transpose === 'true' || section.transpose === true){
        					section.transpose = false;
        				}else{
        					section.transpose = true;
        				}
        				UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Transpose', JSON.stringify(section)).then(userTrackingSuccess, handleSessionTimeout);
        			},
        			exportExl: function(section){
		                var infoserverDomain = GlobalService.getVal('infoserverDomain');
		                var filters = "", cols = "", filters, i, filter_keys,ec,sid3,obs,iFrame,url,docBody;
		               
		                for (i in section.column) {
		                    if (cols != "") {
		                        cols += "&";
		                    }
		                    if(section.column[i]['visible']){
		                    	cols += "col=" + section.column[i]['column_name'];
		                    }
		                }
		                /*filter_keys = Object.keys(section['filter']);
		                for (i in filter_keys) {
		                    if (filters != "") {
		                        filters += "&";
		                    }
		                    filters += "filter=" + filter_keys[i];
		                    if (section.filter[filter_keys[i]].type == 'number') {
		                        filters += section.filter[filter_keys[i]]['operator'];
		                    } else {
		                        filters += '=';
		                    }
		                    filters += section.filter[filter_keys[i]]['value'];
		                }*/

		                obs = $scope.config('observation');
        				ec = GlobalService.getVal('manufacturer');
        				sid1 = $scope.config('sysId');
        				sid2 = $scope.config('sysId2');		                
		                if(!sid2 || sid2 == 'NA'){
		                    sid2 = $scope.sysId2
		                }if(!sid3){
		                    sid3 = 'NA';
		                }
		                url = infoserverDomain + '/base/export/system/ts/named/time_range/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + ec + '/' + sid1 + '/' + sid2 + '/' + sid3 + '/' + section['table_name'] + '/' + obs.substr(0, 19) + '/' + obs.substr(0, 19) + '?' + cols; 
		                //create iframe and down load file
						iFrame = angular.element.find("#sectionXlsDownload").length;
						if (!(iFrame && iFrame.length > 0)) {
							iFrame = angular.element("<iframe style='position:fixed;display:none;top:-1px;left:-1px; id='sectionXlsDownload'/>");
							docBody = angular.element(document).find('body');
							docBody.append(iFrame);
						}
						iFrame.attr("src", url);
						UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Export', JSON.stringify(section)).then(userTrackingSuccess, handleSessionTimeout);
		        	},
		        	isLoading: function(){
		        		var me=this;
		        		for(var i=0;i<me._sectionsList.length;i++){
		        			if(me._sectionsList['loading']){
		        				return true;
		        			}
		        		}
		        		return false;
		        	}
        		}
        	})();


        	$scope.saveFilter = function(){
        		var selectedSections = $scope.pview._sectionsList;
        		var selectedColumns = [];
        		var activeSection = null;
        		var allowCharacter = /^[a-zA-Z0-9\s]*$/;
    			//get all selected sections
    			var sections = function(){
    				selectedSections = $scope.getSelectedSectionsFilteredWithNoColumnSelection(selectedSections);
    				return selectedSections;
    			};
    			//get column of first selected section
    			var columns = function(){
    				selectedColumns = [];
    				if(activeSection){
    					var column = activeSection.column;
    					if(column.length > 0){
    						for(var i=0;i<column.length;i++){
    							if(column[i]['visible']){
    								selectedColumns.push(column[i]);
    							}
    						}
    					}
    				}
    				return selectedColumns;
    			};
        		return{
        			name: '',
        			desc: '',
        			kbase: '',
        			default: false,
        			sections: sections(),
        			columns: columns(),
        			cols: "",
        			filter: "",
        			transpose: "",
        			loading: false,
        			error: "",
        			success: "",
        			commonAttribute: {},
        			selectSection: function(item){
        				var items = this.sections;
        				for(var i=0;i<items.length;i++){
        					var tmp = items[i];
        					if(tmp['table_name'] == item['table_name']){
        						tmp['active'] = true;
        						activeSection = tmp;
        					}else{
        						tmp['active'] = false;
        					}
        				}
        				//column
	    				if(activeSection){
	    					this.columns = this.getColumns(activeSection);
	    				}
        			},
        			getColumns: function(section){
        				var selectedColumns = [];
    					var column = section.column;
    					if(column.length > 0){
    						for(var i=0;i<column.length;i++){
    							if(column[i]['visible']){
    								selectedColumns.push(column[i]);
    							}
    						}
    					}
    					return selectedColumns;
        			},
        			getColumnFilter: function(column){
        				var msg = "";
        				var filter = column['filter'];
        				if(filter && filter.value){
        					if(filter['operator'] == 'like'){
        						msg = 'Search Text: '+ filter.value;
        					}else{
        						msg = 'Value ' + filter['operator'] + " " + filter.value;
        					}
        					return msg;
        				}
        				return false;
        			},
        			isTranspose: function(section){
        				if(section['transpose'] && (!!section['transpose'] == true)){
        					section['transpose'] = true;
        					return true;
        				}
        				return false;
        			},
        			apiParameter: function(){
        				var cols = [], filter=[],transpose=[], tmp, columns;
        				var sections = this.sections;
        				for(var i=0;i<sections.length;i++){
        					/* Transpose --START -- */
        					if(sections[i]['transpose']){
        						tmp = sections[i]['table_name']+":"+"true";
        					}else{
        						tmp = sections[i]['table_name']+":"+"false";
        					}
        					transpose.push(tmp)
        					/* Transpose -- END --*/
        					columns = sections[i]['column'];
        					for(var j=0;j<columns.length;j++){
        						/* Filter --START -- */
        						if(columns[j]['filter'] && columns[j]['filter']['value']){
        							if(columns[j]['filter']['value'] != ""){
        								tmp = sections[i]['table_name']+":"+columns[j]['column_name'] +":"+(columns[j]['filter']['operator'] == 'like'? '~':columns[j]['filter']['operator'])+":"+columns[j]['filter']['value'];
        								filter.push(tmp);
        							}
        						}
        						/* Filter -- END --*/
        						/* Column --START -- */
        						if(columns[j]['visible']){
    								tmp = sections[i]['table_name']+":"+columns[j]['column_name'];
    								cols.push(tmp);
    							}
        						/* column -- END --*/
        					}
        				}
        				var access = false;
        				if(this.accessPublic == "public"){
        					access = true;
        				}
        				this.kbase = this.kbase.trim();
        				if(this.kbase == 'http://'){
        					this.kbase = '';
        				}
        				var result = {
        					'name' : this.name,
        					'public' : access,
        					'default' : this.default,
        					'desc' : this.desc,
        					'kbase' : this.kbase,
        					'cols' : "{\'" + cols.join(",") + "\'}",
        					'filters' : "{\'" + filter.join(",") + "\'}",
        					'transpose' : "{\'" + transpose.join(",") + "\'}"
        				}

        				return result;
        			},
        			getSectionsList : function(){
        				return this.sections;
        			},
        			kbaseFocus: function(){
        				var me = this;
        				me.kbase = me.kbase.trim();
        				if(me.kbase == ''){
        					me.kbase = "http://";
        				}
        			},
        			kbaseBlur: function(){
        				var me = this;
        				me.kbase = me.kbase.trim();
        				if(me.kbase == "http://"){
        					me.kbase = '';
        				}
        			},
        			validate: function(){
        				//clear all validati9on msg
        				this.error = "";
        				this.validationName = "";
        				this.validationDesc = "";
        				this.duplicate = null;
        				if(!this.name || this.name == ""){
        					this.validationName= GlobalService.getVal('required_vname');
        					return false;
        				}else if(this.name.length < 3){
        					this.validationName= GlobalService.getVal('invalid_minlength');
        					return false;
        				}else if(!(new RegExp(allowCharacter).test(this.name))){        					
        					this.validationName= GlobalService.getVal('invalid_chars');
        					return false;
        				}else if(this.desc.length > 250){
        					this.validationDesc= GlobalService.getVal('invalid_maxlength_desc');
        					return false;
        				}
        				return true;
        			},
        			save: function(){
        				var me = this;
	        			//validate UI
	        			if(!me.validate()){
	        				return;
	        			}
	        			//check duplicate and overwrite
	        			if($scope.filter.isDuplicate(me.name)){
        					me.duplicate= GlobalService.getVal('overwrite_view');
        					return;
        				}
        				me.callSaveAPI();
        			},
        			callSaveAPI: function(){
        				var me = this;
        				var param = me.apiParameter();
        				me.duplicate = null;
        				me.loading = true;
        				//check if view name matches wiht he view name of others view name
        				//get list of saved filter i.e my views and other public view
		        		SectionsMetaService.getAllViews()
		                .then(function (response) {
		                    var allViews = response.data.Data;
		                    //loggedInUser
		                    for(var i=0;i<allViews.length;i++){
		                    	if(allViews[i]['created_by'] != $scope.loggedInUser){
		                    		if(allViews[i]['view_name'] == me.name){
		                    			me.validationName= GlobalService.getVal('duplicate_view');
		                    			me.loading = false;
		                    			return;
		                    		}
		                    	}
		                    }
		                    //call API to save view
			                SectionsMetaService.saveSelectedView(param, param)
		                    .then(function (response) {
	        					me.loading = false;
		                    	//get fresh copy of saved view list
		                    	$scope.filter.callViewListAPI();
		                    	me.success = GlobalService.getVal('save_view_success');
		                    	$timeout(function() {
		                    		$scope.closeSaveModal();
		                    	}, 2000);
		                        UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Save View', JSON.stringify(param)).then(userTrackingSuccess, handleSessionTimeout);
		                    }, function (response) {
	        					me.loading = false;
	        					me.error = "Error : " + GlobalService.getVal('save_view_failed');
		                    }, me);
		                }, function (response) {
	        					me.loading = false;
	        					me.error = "Error : " + GlobalService.getVal('save_view_failed');
		                }, me);
        			}
        		}
        	};

        	$scope.commonAttributeFilter = (function(){
        		return{
        			_sections: [],
        			_selectedSections: [],
        			_commonAttributes: [],
        			_sectionsWithSelectedColumns: [],
        			_result : {},
        			reset: function(){
        				var me = this;
        				for(var i=0;i<me._selectedSections.length;i++){
        					for(var j=0;j<me._selectedSections[i]['column'].length;j++){
        						me._selectedSections[i]['column'][j]['filter'] = {};
        						if(me._selectedSections[i]['column'][j]['type'] != "STRING"){
        							me._selectedSections[i]['column'][j]['filter']['operator'] = "=";
					        	}
					        	me._selectedSections[i]['column'][j]['filter']['value'] = "";
        					}
        				}
        				me._selectedSections = [];
        				me._commonAttributes = [];
        				me._sections = [];
        				me._sectionsWithSelectedColumns = [];
        			},
        			getSections: function(){
        				var me = this, sections = $scope.getSelectedSections(), selectedSections,commonAttributes, columns;
		        		me._sections = sections.filter(function(item){
		        			if(!item.rows) return false;
		        			if(item.rows && item.rows.length == 0) return false;
		        			return true;
		        		});
		        		selectedSections = ($scope.getSelectedSectionsFilteredWithNoColumnSelection(me._sections));
	    				commonAttributes = me.searchForCommonAttributes(selectedSections);
        				me._selectedSections = selectedSections;
        				me._commonAttributes = commonAttributes;
        				var haveCommonAttribute = function(list, item){
        					for(var i=0;i<list.length;i++){
        						if((list[i]['attribute_label'] == item['attribute_label'])) return true;
        					}
        					return false;
        				};
			            var isDuplicate = function(src, item, index){
			            	if(src.length == 0){
	                        	return false;
	                        }
	                        for(var i=0;i<src.length;i++){
	                        	if(src[i].label == item.label){
	                        		return true;
	                        	}
	                        }
	                        return false;
			            };
        				var removeDuplicate = function(list){
        					var temp = [];
        					for(var i=0;i<list.length;i++){
        						if(temp.length == 0){
        							temp.push(list[i]);
        						}else{
        							if(!isDuplicate(temp, list[i], i)){
        								temp.push(list[i]);
        							}
        						}
        					}
        					return temp;
        				}
	    				for(var i=0;i<commonAttributes.length;i++){
	    					tmp = {};
	    					tmp.sections = [];
	    					tmp.filter = {};
	    					for(var j=0;j<selectedSections.length;j++){
	    						columns = selectedSections[j]['column'];
	    						//clear filter if any
	    						$scope.pview.clearSectionFilter(selectedSections[j]);
	    						if(haveCommonAttribute(columns, commonAttributes[i])){
	    							tmp.label = commonAttributes[i]['attribute_label'];
	    							tmp.type = commonAttributes[i]['type'];	    							
	    							if(tmp.type != 'STRING'){
	    								tmp.filter.operator="=";
	    							}
	    							tmp.sections.push(selectedSections[j]);
	    							me._sectionsWithSelectedColumns.push(tmp);
	    						}
	    					}
	    				};
	    				me._sectionsWithSelectedColumns = removeDuplicate(me._sectionsWithSelectedColumns);
	    				return me._sectionsWithSelectedColumns;
        			},
        			changeColumn: function(sections,column,filter){
        				for(var i=0;i<sections.length;i++){
        					for(var j=0;j<sections[i]['column'].length;j++){
        						if(column.label == sections[i]['column'][j]['attribute_label']){
        							sections[i]['column'][j]['filter'] = angular.copy(filter);
        							break;
        						}
        					}
        				}
        			},
        			searchForCommonAttributes: function(sections){
        				var me = this, tmpSection,column, tmpArrya=[];
        				if(!sections.length) return [];
        				for(var i=0;i<sections.length;i++){
        					tmpSection = sections[i];
        					column =angular.copy(tmpSection.column);
	    					if(column.length > 0){
	    						for(var j=0;j<column.length;j++){
	    							if(column[j]['visible']){
	    								if(!column[j]['gbSectionName']){
	    									column[j]['gbSectionName'] = [];
	    								}
	    								column[j]['gbSectionName'].push(tmpSection['label']);
	    								tmpArrya.push(column[j]);
	    							}
	    						}
	    					}
        				}
        				//check for the attributes happens more than one
        				column = me.getColumnWhichHappendMoreThanOne(tmpArrya);
        				return column;        				
        			},
        			getColumnWhichHappendMoreThanOne: function(columnsList){
        				var temp = [], found=false, _tcolumn;
        				var addToTemp = function(item){
        					for(var i=0;i<temp.length;i++){
        						if(item['attribute_label'] == temp[i]['attribute_label']){
        							return;
        						}
        					}
        					temp.push(item);
        				};
        				if(columnsList.length == 0){
        					return [];
        				}else{
	        				for(var i=0;i<columnsList.length;i++){
	        					found = false;
	        					_tcolumn = columnsList[i];
	        					for(var j=i+1;j<columnsList.length;j++){
	        						if(columnsList[j]['attribute_label'] == columnsList[i]['attribute_label']){
	        							addToTemp(columnsList[i]);
	        						}
	        					}
	        				}
	        			}
        				return temp;
        			},
        			done: function(){
        				var me = this, _sections, _section, _column, _columns;
        				var sectionColumnFilter = [];
        				for(var i=0;i<me._sectionsWithSelectedColumns.length;i++){
        					_column = me._sectionsWithSelectedColumns[i];
        					_sections = me._sectionsWithSelectedColumns[i]['sections'];
    						for(var j=0;j<_sections.length;j++){
    							_section = _sections[j];
    							_columns = _section['column'];
    							for(var k=0;k<_columns.length;k++){
    								if(_column.label == _columns[k].attribute_label){
    									/*if(!_section.filter || !_section.filter.length){
    										_section.filter = [];
    									}else{
    										_filter = angular.copy(_columns[k].filter);
    										_filter.column_name = _columns[k].column_name;
    										_section.filter.push(_columns[k].filter)
    									}*/
    									sectionColumnFilter.push({'section':_section, 'column':_columns[k]});
    									break;
    								}
    							}
    						}
        				}
        				for(var i=0;i<sectionColumnFilter.length;i++){
        					$scope.pview.columnFilter(sectionColumnFilter[i]['section'],sectionColumnFilter[i]['column']);
        				}
        				$scope.closeMultipleAttributeFilter();
        				return;
        			},
        			doColumnfilter: function(section, attribute){
        				$scope.pview.columnFilter(section,angular.copy(attribute));
        			}
        		}
        	}());

        	$scope.lview = (function(){
        		var lviewSelectedSections = [];
        		var sectionsData = [];
        		var loadingState = false;
        		var infiniteLoadingState = false;

                var filterBatchPageSize = GlobalService.getVal('instance_filter_section_page_size');
                var filterBatchCurrentPageNo = 1;
                var filterBatchTotalCount = 0;
        		return{
        			get: function(){
        				lviewSelectedSections = $scope.sections;        				
                        if(lviewSelectedSections.length > 0){
	                        sectionsData.splice(0,sectionsData.length);
	                        sectionsData = [];
	        				filterBatchCurrentPageNo = 1;
	        				//get all selected section
	                        if (lviewSelectedSections.length == 0) {
	                            return;
	                        }
	                        filterBatchTotalCount = lviewSelectedSections.length;
	                        var startDate = $scope.config('start_time');
	                        var endDate = $scope.config('end_time');
	                        var params = {};
	                        params['ts'] = $scope.config('observation');
	                        params['bundle'] = $scope.config('bundle');
	                        params['ns'] = [];
	                        //get namespace for selected sections
	                        params['ns'] = this.getNamespaceOfSelectedSection();
	                        if(params['ns'].length == 0){
	                        	return;
	                        }
	                        loadingState = true;
	                        this.apiGetSectionsConten(params);
                        }else{
                        	this.clear();
                        }                        
        			},
        			getInstanceMD5: function(){
        				var localInstance = JSON.parse($scope.instance);
        				return localInstance['md5'];
        			},
        			getSectionsData: function(){
        				return sectionsData;
        			},
        			logviewDataNotFound: function(section){
        				if(section.content == GlobalService.getVal('logview_data_not_available')){
        					return true;
        				}
        				return false;
        			},
        			scrollInfinite: function(){
                        var elemId = this.getInstanceMD5() + '-section-container';
                        var scrollElm = angular.element(document.getElementById(elemId));
                        var maxScrollHeight = '';
                        if(scrollElm[0] && scrollElm[0].scrollHeight){
                            maxScrollHeight = scrollElm[0].scrollHeight - 1100;
                        }else{
                            return;
                        } 
                        if(scrollElm.scrollTop() < maxScrollHeight){
                            return;
                        }
                        //don't call API if it is loading data for the previouse request
                        if(loadingState || infiniteLoadingState){
                            return;
                        }
                        //get selected section
                        var selectedSections = lviewSelectedSections;
                        if(selectedSections.length == 0){
                        	return;
                        }
                        filterBatchTotalCount = lviewSelectedSections.length;
                        filterBatchCurrentPageNo++;

                        //instanceConfig.data.loading = true;
                        var startDate = $scope.config('start_time');
                        var endDate = $scope.config('end_time');
                        var params = {};
                        params['ts'] = $scope.config('observation');
                        params['bundle'] = $scope.config('bundle');
                        params['ns'] = [];
                        //get namespace for selected sections
                        params['ns'] = this.getNamespaceOfSelectedSection();
                        if(params['ns'].length == 0){
                        	return;
                        }
                        infiniteLoadingState = true;
                        this.apiGetSectionsConten(params);
                        UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Infinite Scroll', JSON.stringify("{}")).then(userTrackingSuccess, handleSessionTimeout);
                    },
                    getNamespaceOfSelectedSection: function(){
                    	var params = [], count, start=0,end, totalPages=0, me = this, section;
                        count = 0;
                        totalPages = Math.ceil(filterBatchTotalCount/filterBatchPageSize);
                        if(totalPages == 0){
                            return [];
                        }
                        if(filterBatchCurrentPageNo == 1){
                            start = 0;
                            if(filterBatchTotalCount < filterBatchPageSize){
                            	end = filterBatchTotalCount;
                            }else{
                            	end = filterBatchPageSize;
                            }                            
                        }else{
                            start = (filterBatchCurrentPageNo - 1)* filterBatchPageSize;

                            if(filterBatchCurrentPageNo > totalPages){
                                end = filterBatchTotalCount;
                            }else{
                                end = filterBatchCurrentPageNo * filterBatchPageSize;
                                if(end > filterBatchTotalCount) {
                                    end = filterBatchTotalCount;
                                }
                            }
                        }
                        for(var i=start;i<end;i++){
                            section = lviewSelectedSections[i];
                			if(!section){
                				break;
                			}
                			params.push(section.name);
                        }
                        params = jQuery.unique(params);
                    	return params;
                    },
                    apiGetSectionsConten: function(params){
                    	var me = this;
						params['ns_id'] = $scope.config('result')['bundle_id'];
                        ExplorerService.getSectionsContent(params).then(function (response) {
                            var sData = response.data.Data, tmp = [], found=false;
                            loadingState = false;
                            infiniteLoadingState = false;
                            //getNamespaceOfSelectedSection
                            //re-arrange response as per section selection
                            var ns = me.getNamespaceOfSelectedSection();
                            for(var i=0;i<ns.length;i++){
                            	found = false;
                            	for(var j=0;j<sData.length;j++){
	                            	if(ns[i] == sData[j]['section_name']){
	                            		tmp.push(sData[j]);
	                            		found = true;
	                            	}
	                            }
	                            if(!found){
	                            	tmp.push({'content':GlobalService.getVal('logview_data_not_available'),'section_name':ns[i]})
	                            }
                            }
                            sData = tmp;
                            if(sData){
                                sectionsData = sectionsData.concat(sData);    
                            }                                        
                            if(sectionsData && sectionsData.length && sectionsData.length == 0){
                                sectionsData = [];
                            }
                            angular.element('#'+me.getInstanceMD5()+'-section-container').scrollTop(50000);
                        }, function (response) {
                            console.log("Error:" + response);
                            loadingState = false;
                            infiniteLoadingState = false;
                        }, me);
                    },
                    clear: function(){
                    	if(sectionsData.length > 0){
                    		sectionsData.splice(0,sectionsData.length);
                    	}
                    	if(lviewSelectedSections.length > 0){
                    		lviewSelectedSections.splice(0, lviewSelectedSections.length);
                    	}
                    	filterBatchCurrentPageNo = 1;
                		filterBatchTotalCount = 0;
                    },
                    removeAllSections: function(){
                    	this.clear();
                    },
                    isLoading: function(){
                    	return loadingState;
                    },
                    isInfiniteLoading: function(){
                    	return infiniteLoadingState;
                    },
                    getSelectedSections: function(){
                    	return lviewSelectedSections;
                    }
        		}
        	})();

			$scope.dview=(function(){
				var me = this;
				var loading = false;
				var sectionsURL = [];
				var observationList = [], list=[];
				var sysid1 = $scope.config('sysId');
				var sysid2 = $scope.config('sysid2');
				var dataObs = $scope.config('observation');
				var fetchBundles = function () {
                    if(!sysid2 || sysid2 == 'NA'){
                        sysid2 = $scope.sysId2;
					}
					
					var endDate = dataObs;
					var ss = new Date(endDate);
					ss.setDate(ss.getDate() - $scope.fromDateForDiffViewApi);
					var startDate = ss.getFullYear() + "-" + parseInt(ss.getMonth() + 1) + "-" + ss.getDate() + "T" + ss.getUTCHours() + ":" + ss.getUTCMinutes() + ":" + ss.getUTCSeconds() + "Z";
					ExplorerService.getAllBundlesInRange(sysid1, sysid2, startDate, endDate).then(function (response) {
                        loading = false;
                        observationList = response.data.Data;
                        list=[]
                        if (observationList && observationList.length && observationList.length > 0) {
                            angular.forEach(observationList, function(obs) {
                                if($filter('utcDate')(obs.obs_ts) < $filter('utcDate')(dataObs)) {
                                    list.push(obs);
                                }
                            });
                            observationList = list;
                        }
                    }, function (response) {
                        console.log("Error:" + response);
                        loading = false;
                    });
                }
                fetchBundles();
				return{
					currentObs: "",
					observation: dataObs,
					sectionDiffError: false,
					noDiffSections: [],
					sectionDiffMsg: "",
					noDiffFoundLabel : GlobalService.getVal('no_diff_data_label'),
					clear: function(){
						sectionsURL.splice(0,sectionsURL.length);
						sectionsURL = [];
						this.noDiffSections.splice(0,this.noDiffSections.length);
						this.noDiffSections = [];
						this.sectionDiffError = false,
						this.sectionDiffMsg = "";
        				$scope.sections.splice(0,$scope.sections.length);
					},
					isLoading: function(){
						return loading;
					},
					loadBundles: function () {
                        sysid2 = $scope.sysId2;
                        fetchBundles();
                    },
					getObservationList : function(){
						if(!this.currentObs && observationList.length>0){
							this.currentObs = observationList[0];
						}
						return observationList;
					},
					changeObservation: function(obs){
						//load diff of section(s)
						this.getFileDiffSection();
						UserTrackingService.standard_user_tracking($scope.application, $scope.module, "Diff", JSON.stringify($scope.sectionsCommon.getSelectedSections())).then(userTrackingSuccess, handleSessionTimeout);
					},
					getSectionsURL: function(){
						return sectionsURL;
					},
		            getFileDiffSection : function(){
		                var checkDuplicateNs = function(ns) {
		                	for(var i=0;i<params.ns.length;i++){
		                		if(params.ns[i] == ns) return true;
		                	}
		                	return false;
		                };
		            	var me = this;
		                var infoserverDomain = GlobalService.getVal('infoserverDomain');
		                if (!(observationList && observationList.length > 0)) {
		                	me.sectionDiffError = true;
		                    me.sectionDiffMsg = GlobalService.getVal("section_ErrorMsg1");	                    
		                    return;
		                }
		                var srcts = this.currentObs.obs_ts;
		                var tgtts = $scope.config('observation');
		                var params = {
		                    srcbundle: $filter('bundleName')(this.currentObs['bundle_name']),
		                    tgtbundle: $scope.config('bundle'),
		                    ns: []
		                };
		                var sectionNameMap = {}, tmpObj={};
		                if($scope.sections.length == 0) {
		                    params.ns.push($scope.config('namespace'));
		                } else {
		                    angular.forEach($scope.sections, function(section) {
		                    	if(!checkDuplicateNs(section.name)){
			                        params.ns.push(section.name);
			                    }
			                    tmpObj[section.namespace_actual] = section.label;
			                    if(!sectionNameMap[section.name]){
			                    	sectionNameMap[section.name] = []
			                    }
		                        sectionNameMap[section.name].push(tmpObj);
		                        tmpObj={};
		                    });
		                }
		                if(!params.ns || params.ns.length == 0 || !params.ns[0]){ 
		                	return
		                };
						params['ns_id'] = $scope.config('result')['bundle_id'];
		                loading = true;
		                me.sectionDiffError = false;
		                me.noDiffSections = []
		                sectionsURL.splice(0,sectionsURL.length);
		                sectionsURL = [];
		                ExplorerService.getFileDiffSection(srcts, tgtts, params).then(function (response) {
		                    loading = false;
		                    var responseData = response.data.Data;
		                    if(responseData.hasOwnProperty('gb_error')) {
		                        switch(responseData.gb_error) {
		                            case 'ERR_9':
		                                me.sectionDiffMsg = GlobalService.getVal("section_ErrorMsg6");
		                                break;
		                        }
		                    } else {
		                        me.processDiffresponse(responseData, sectionNameMap);
		                    }
		                    /*var activity = "Section Viewer Changes";
		                    var details = {
		                        "Serial Number" : instanceConfig.data.sysId,
		                        "Bundle" : instanceConfig.data.bundle,
		                        "File" : instanceConfig.data.file,
		                        "Observation" : $filter('utcDate')(srcts) + " -- " + $filter('utcDate')(tgtts),
		                        "Sections Selected": params.ns
		                    };*/
		                    
		                }, function (response) {
		                	sectionsURL.splice(0,sectionsURL.length);
		                    sectionsURL = [];
		                    loading = false;
		                    me.sectionDiffError = false;
                            me.noDiffSections = [];
		                    me.sectionDiffMsg = GlobalService.getVal("section_ErrorMsg6");
		                    console.log("Error:" + response);
		                });
		            },
		            isDuplicate : function(src, item){
		            	if(src.length == 0){
                        	return false;
                        }
                        for(var i=0;i<src.length;i++){
                        	if(src[i].name == item.name){
                        		return true;
                        	}
                        }
                        return false;
		            },
		            processDiffresponse : function(responseData, sectionNameMap){
		            	var me = this;
		            	var infoserverDomain = GlobalService.getVal('infoserverDomain');
		            	
		            	angular.forEach(responseData, function(value, key) {
                        	
	                            var section = {}, tmpObj;
	                            var list = sectionNameMap[key];
	                            for(var i=0;i<sectionNameMap[key].length;i++){
	                            	section = {}, tmpObj={};
	                            	tmpObj = sectionNameMap[key][i];
	                            	angular.forEach(tmpObj, function(tmpvalue, tmpkey) {
	                            		section.name = tmpvalue;
	                            	});
	                            switch (value) {
	                                case 'MSG_1':
	                                    section.error = true;
	                                    me.noDiffSections.push(section);
	                                    section.errorMsg = GlobalService.getVal("section_ErrorMsg2");
	                                    break;
	                                case 'MSG_2':
	                                    section.error = true;
	                                    section.errorMsg = GlobalService.getVal("section_ErrorMsg3");
	                                    break;
	                                case 'MSG_3':
	                                    section.error = true;
	                                    section.errorMsg = GlobalService.getVal("section_ErrorMsg4");
	                                    break;
	                                case 'MSG_7':
	                                    section.error = true;
	                                    section.errorMsg = GlobalService.getVal("section_ErrorMsg5");
	                                    break;
	                                case 'ERR_1':
	                                    section.error = true;
	                                    section.errorMsg = GlobalService.getVal("section_ErrorMsg6");
	                                    break;
	                                case 'ERR_0':
	                                    section.error = true;
	                                    section.errorMsg = GlobalService.getVal("section_ErrorMsg7");
	                                    break;
	                                case 'ERR_7':
	                                    section.error = true;
	                                    section.errorMsg = GlobalService.getVal("section_ErrorMsg8");
	                                    break;
	                                default:
	                                    section.error = false;
	                                    section.URL = $sce.trustAsResourceUrl(infoserverDomain + '/explorer/sectiondiff/view/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + value);
	                            }
	                            sectionsURL.push(section);
	                        }
                        });
		            }
				}
			})();

        	$scope.isSectionsLoading = function(){
        		return $scope.sectionsCommon.isLoading();
        	}
        	$scope.isNoSectionsFound = function(){
        		if($scope.sectionsCommon.isLoading()) return false;
        		return ($scope.getAllSections().length == 0);
			}
			$scope.changeSelectionForFacet = function(n){
				n.selected = !n.selected;
				$scope.selectAllSection = false;
			}
        	$scope.showSections = function(){
        		$scope.filter.appliedView = '';
        		if($scope.activeMenu == 'dview'){
	            	if($scope.sectionsCommon.getSelectedSections().length > GlobalService.getVal('instance_selected_sections_limit')){
	        			$scope.modal = ModalService.alertBox({msgKey: 'instance_view_max_section_diff'});
	        			return;
	        		};
	        	}
        		$scope.sections = $scope.sectionsCommon.getSelectedSections();
        		if($scope.sections.length == 0){
        			$scope.sections.splice(0,$scope.sections.length);
        			$scope.sections = [];
        		}
        		$scope.applySectionSelection();
        		$scope.sectionFilter = "";
        		var sectionContent = $(".gb-apps-sections-list ul");
        		sectionContent.scrollTop(0);
        		var tab = "";
        		if($scope.activeMenu == 'pview') tab = 'Table View';
        		else if($scope.activeMenu == 'lview'){ 
        			tab = 'Log View';
        			if($scope.selectAllSection){
        				UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Select All Sections', JSON.stringify("{}")).then(userTrackingSuccess, handleSessionTimeout);
        				return;
        			}
        		}else tab = 'Diff';
        		UserTrackingService.standard_user_tracking($scope.application, $scope.module, tab, JSON.stringify($scope.sectionsCommon.getSelectedSections())).then(userTrackingSuccess, handleSessionTimeout);
        	}
        	$scope.resetSectionSelection = function(){
				$scope.sectionsCommon.selectSections($scope.sections);
				if(!$scope.sectionsCommon.isAllSectionsSelected()){
					$scope.selectAllSection = false;
				}
        	};
        	$scope.applySectionSelection = function(){
        		if($scope.sections.length==0){
        			//clear user selection's section
        			if($scope.activeMenu == 'pview'){
	        			$scope.pview.removeAllSections();
	        		}else if($scope.activeMenu == 'lview'){
	        			$scope.lview.removeAllSections();
	        		}else if($scope.activeMenu == 'dview'){
	        			$scope.dview.clear();
	        		}
	        		return;
        		}
        		if($scope.activeMenu == 'pview'){
	        		//clear applyied filter
	        		//if(!$scope.defaultSectionNamespace){
	        			//$scope.filter.clearView();
	        		//}
        			$scope.pview.loadSectionData();
        		}else if($scope.activeMenu == 'lview'){
        			$scope.lview.get();
        		}else if($scope.activeMenu == 'dview'){
        			$scope.dview.getFileDiffSection();
        		}
        	};
        	$scope.getAllSections = function(){
        		var sections = $scope.sectionsCommon.getAll(), tmp=[], tmpAll=[];
        		if($scope.sectionFilter){
        			var str = $scope.sectionFilter.toLowerCase();
        			var list = $filter('filter')(sections, function(item){
    					if((item.label.toLowerCase()).indexOf(str) != -1){
    						return true;
    					}else{
    						return false;
    					}
    				});
    				sections = list;
        		}
        		if(sections.length == 0){
        			$scope.noSectionFound = true;
        		}else{
        			$scope.noSectionFound = false;
        			//sort sections
        			for(var i=0;i<sections.length;i++){
        				if(sections[i].provisionalSelected){
        					tmp.push(sections[i]);
        				}else{
        					tmpAll.push(sections[i]);
        				}
        			}
        		}
        		if(tmp.length > 0){
        			sections = tmp.concat(tmpAll);
        		}
    			return sections;
        	};
        	//used for download as PDF: get selected section in parsed view
        	$scope.getSelectedSections= function(){
        		return($scope.pview._sectionsList);
        	};
        	$scope.getSelectedSectionsFilteredWithNoColumnSelection = function(selectedSections){        		
				var tmp, list = [];				
    			var getVisibleColumnsList = function(section){
    				var selectedColumns = [];
					var column = section.column;
					if(column.length > 0){
						for(var i=0;i<column.length;i++){
							if(column[i]['visible']){
								selectedColumns.push(column[i]);
							}
						}
					}
					return selectedColumns;
    			};
				if(selectedSections.length > 0){
					//filtered sections which have no column selected    					
    				for(var i=0;i<selectedSections.length;i++){
    					tmp = selectedSections[i];
    					if(getVisibleColumnsList(tmp).length > 0){
    						list.push(tmp);
    					}
    				}
    				if(list.length == 0){
    					selectedSections = [];
    					selectedColumns = [];
    					return [];
    				}

	        		selectedColumns = [];
	        		selectedColumns.push(list[0]);
	        		activeSection = list[0];
    				for(var i=0;i<list.length;i++){
    					tmp = list[i];
    					if(tmp['table_name'] == activeSection['table_name']){
    						tmp['active'] = true;
    					}else{
    						tmp['active'] = false;
    					}
    				}
    				selectedSections = list;
				}
				return selectedSections;
        	}
        	//user for download as PDF: get selected section data
        	$scope.getSectionRowData= function(section){
        		if(!section.rows) return [];
        		var result = [], eachRow=[], tmp, obj,key,value;
        		for(var i=0;i<section.rows.length;i++){
        			eachRow = {};
        			for(var j=0;j<section.rows[i]['columns'].length;j++){
        				tmp = section.rows[i]['columns'];
        				key = tmp[j]['column_name'];
        				value = tmp[j]['value'];
        				eachRow[key]=value;
        			}
        			result.push(eachRow);
        		}
        		return result;
        	};
        	$scope.clear = function(){
        		$scope.selectAllSection = false;
        		$scope.sectionFilter = "";
        		$scope.filter.appliedView = null;
        		if($scope.activeMenu == 'pview'){
        			$scope.filter.clearAppliedView();
        		}else if($scope.activeMenu == 'lview'){
        			$scope.sectionsCommon.unSelectAllSections()
        			$scope.lview.clear();
        		}else if($scope.activeMenu == 'dview'){
        			$scope.sectionsCommon.unSelectAllSections()
        			$scope.dview.clear();
        		}
        	};
        	$scope.isPageLoading = function(){
        		var flag = $scope.sectionsCommon.isLoading();
        		//var flag = $scope.filter.isLoading();
        		var flag = $scope.pview.isLoading();
        		var flag = $scope.lview.isLoading();
        	};
        	$scope.isLoadingApps = function(){
        		var flag = false;
				if($scope.sectionsCommon.isLoading()){
					flag = true;
				}
				/*if($scope.filter.isLoading()){
					flag = true;
				}*/
				if($scope.pview.isLoading()){
					flag = true;
				}
				if($scope.lview.isLoading()){
					flag = true;
				}
				return flag;
        	};
        	$scope.downloadBundle = function(){
        		var obs = $scope.config('observation');
        		var sysId1 = $scope.config('sysId');
        		var sysId2 = $scope.config('sysId2');
        		var bundleId = $scope.config('result')['bundle_id'];
                if(!sysId2 || sysId2 == 'NA'){
                    sysId2 = $scope.sysId2;
                }
        		var bundles = {
        			'bundles':[{'bundle_name':$scope.config('bundle')}],
					'download_type':'single',
					'obs_date':obs,
					'bundle_id':bundleId,
					'sys_id1':sysId1,
					'sys_id2':sysId2
				}, iFrame;
				//create iframe and down load file
				iFrame = angular.element.find("#sectionSingleBundleDownloadIfram").length;
				if (!(iFrame && iFrame.length > 0)) {
					iFrame = angular.element("<iframe style='position:fixed;display:none;top:-1px;left:-1px; id='sectionSingleBundleDownloadIfram'/>");
					docBody = angular.element(document).find('body');
					docBody.append(iFrame);
				}
				LogVaultService.getDownloadUrl(JSON.stringify(bundles)).then(function(response) {
					if (response.data.Data.Status == 'Failure') {
						//var modal_scope = application == GlobalService.getVal('navLog') ? angular.element('.gb-logvault').scope() : angular.element('.gb-idashboard-events').scope();
						ModalService.alertBox({
							msgKey : 'download_failed'
						});
						//modal_scope.info.fadeModal = true;
					} else {
						iFrame.attr("src", GlobalService.getVal('download_base_url') + response.data.Data);
						
						var details = {
							'Bundle Names' : [bundles['bundles'][0].bundle_name]
						};
						
					}
				},function(response) {
					//var modal_scope = application == GlobalService.getVal('navLog') ? angular.element('.gb-logvault').scope() : angular.element('.gb-idashboard-events').scope();
					ModalService.alertBox({
						msgKey : 'download_failed'
					});
				});
				UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Download Bundle', JSON.stringify(bundles)).then(userTrackingSuccess, handleSessionTimeout);
        	};
        	/* Select or unselect all sections */
        	$scope.selectAll = function(){
        		$scope.selectAllSection = !$scope.selectAllSection;
    			if($scope.selectAllSection){
    				$scope.sectionsCommon.selectAllSections()
    			}else{
    				$scope.sectionsCommon.unSelectAllSections()
    			}   
        	};
        	$scope.showSaveModal = function(){
        		if($scope.activeMenu != 'pview') return;
				$scope.saveView = $scope.saveFilter();
				if($scope.saveView.sections){
					$scope.saveView.selectSection($scope.saveView.sections[0]);
				}
        		if($scope.saveView.getSectionsList() == 0){        			
	        		ModalService.alertBox({msgKey: 'at_least_one_section'});
	        		return;
        		}
        		$scope.saveView.accessPublic = 'private';
               	$scope.modal = $modal.open({
                    templateUrl: 'partials/apps/save-filter.html',
                    backdrop: true,
                    scope: $scope
                });
        	};
        	$scope.closeSaveModal = function(){
        		$scope.saveView = null;
        		$scope.modal.close();
        	};
        	$scope.saveViewSubmit = function(){
        		if($scope.saveView){
        			$scope.saveView.save();
        		}
        	};
        	$scope.showMultipleAttributeFilter = function(){
        		if($scope.activeMenu != 'pview') return;
        		$scope.commonAttributeFilter.reset();
        		$scope.commonAttributeFilter.getSections();
        		if($scope.commonAttributeFilter._sections.length == 0){        			
	        		ModalService.alertBox({msgKey: 'at_least_one_section'});
	        		return;
        		}
        		if($scope.commonAttributeFilter._sections.length < 2){        			
	        		ModalService.alertBox({msgKey: 'at_least_two_section'});
	        		return;
        		}
        		if($scope.commonAttributeFilter._commonAttributes.length == 0){        			
	        		ModalService.alertBox({msgKey: 'no_common_column'});
	        		return;
        		}
               	$scope.modal = $modal.open({
                    templateUrl: 'partials/apps/sections-attribute-filter.html',
                    backdrop: true,
                    scope: $scope
                });
        	};
        	$scope.closeMultipleAttributeFilter = function(){
        		$scope.modal.close();
        	};
        	$scope.cancelMultipleAttributeFilter = function(){
        		$scope.commonAttributeFilter.reset();
        		$scope.modal.close();
        	};

        	$scope.exportAllPDF = function(){
        		if($scope.activeMenu != 'pview') return;
                var selectedSections = $scope.getSelectedSections() || [];
                if(selectedSections.length == 0){
                    ModalService.alertBox({msgKey: 'at_least_one_section'});
                    return;
                }
        		exportPDF();
        	};
        	$scope.getInstanceMD5 = function(){
        		var localInstance = JSON.parse($scope.instance);
        	    return localInstance['md5'];
        	}
			function exportPDF() {
				var selectedSections = $scope.getSelectedSections() || [];
				var sectionAdded = false;
				var pdf = new jsPDF('p', 'pt', 'a1');
				
				angular.forEach(selectedSections, function(section) {
					section.export_data = $scope.getSectionRowData(section);
				    if(Array.isArray(section.export_data) && !!section.export_data.length) {
				        var selectedCols = $filter('filter')(section.column, {'visible': true}) || [];
				        if(!!selectedCols.length) {
				            var pageAdded = false;
				            if(pdf.autoTableEndPosY() > 2250) {
				                pdf.addPage();
				                pageAdded = true;
				            }
				            
				            var startY = (!!sectionAdded && !pageAdded ? pdf.autoTableEndPosY() : 0) + 60;
				            pdf.text(section.label, 40, startY - 10);
				            pageAdded = false;
				            
				            var cols = [], rows = [], config = {};
				            
				            if(!section.transpose) {
				                angular.forEach(selectedCols, function(col) {
				                    cols.push({
				                        title: section.columnsMap[col['column_name']],
				                        key: col['column_name']
				                    });
				                });
				                rows = section.export_data;
				                config = {
				                    startY: startY,
				                    tableWidth: 'auto',
				                    columnWidth: 'auto',
				                    styles: {
				                        overflow: 'linebreak'
				                    }
				                };
				            } else {
				                for(n = 0; n < section.export_data.length; n+=20) {
				                    cols = [{
				                        title: "",
				                        key: "col_name"
				                    }];
				                    var rangeEnd = (n+20 <= section.export_data.length) ? (n+20) : section.export_data.length;
				                    for(var i = n; i < rangeEnd; i++) {
				                        cols.push({
				                            title: "",
				                            key: "col" + i
				                        });
				                    }
				                    rows = [];
				                    angular.forEach(selectedCols, function(col) {
				                        var tempRow = {};
				                        tempRow['col_name'] = section.columnsMap[col['column_name']];
				                        for(var i = n; i < rangeEnd; i++) {
				                            tempRow['col' + i] = section.export_data[i][col['column_name']];
				                        }
				                        rows.push(tempRow);
				                    });
				                    
				                    if(n != 0) {
				                        startY = pdf.autoTableEndPosY() + 15;
				                    }
				                    
				                    config = {
				                        startY: startY,
				                        tableWidth: 'auto',
				                        columnWidth: 'auto',
				                        styles: {
				                            overflow: 'linebreak'
				                        }, createdCell: function (cell, data) {
				                            if (data.column.dataKey === 'col_name') {
				                               cell.styles.fillColor = data.row.index % 2 == 0 ? [41, 128, 185] : [61, 148, 205];
				                               cell.styles.textColor = 255;
				                            } 
				                        }, createdHeaderCell: function (cell, data) {
				                            cell.styles.rowHeight = 0;
				                            cell.styles.fillColor = 255;
				                        }
				                    };
				                    
				                    if(rangeEnd != section.export_data.length) {
				                        pdf.autoTable(cols, rows, config);
				                        sectionAdded = true;
				                    }
				                }
				            }				            
				            pdf.autoTable(cols, rows, config);
				            sectionAdded = true;
				        }
				    }
				});
				if(!!sectionAdded) {
				    pdf.save("Sections.pdf");
				}
				UserTrackingService.standard_user_tracking($scope.application, $scope.module, 'Download all as PDF', JSON.stringify(selectedSections)).then(userTrackingSuccess, handleSessionTimeout);
			};			
			var loaderInterval = $interval(function(){
				if(!$scope.isLoadingApps()){
					$timeout(function() {
						$scope.loading = false;
					}, 1000);
					$interval.cancel(loaderInterval);
				}
			},100);
			var isResizing = false,lastDownX = 0;
			var localInstance = JSON.parse($scope.instance);
        	var myIdMd5 = localInstance['md5'];
			$(function () {
			    var container = $('#gb-apps-view-'+myIdMd5),
			        left = $('#gb-apps-sections-panel-'+myIdMd5),
			        right = $('#gb-apps-section-data-panel-'+myIdMd5),
			        tabs = $('#gb-apps-top-tabs-'+myIdMd5),
			        handle = $('#gb-apps-sections-panel-splitter-'+myIdMd5);

			    var appsSectonPanelResizerInterval = $interval(function(){
                    if(!container.length){
                    	container = $('#gb-apps-view-'+myIdMd5);
				        left = $('#gb-apps-sections-panel-'+myIdMd5);
				        right = $('#gb-apps-section-data-panel-'+myIdMd5);
				        tabs = $('#gb-apps-top-tabs-'+myIdMd5);
				        handle = $('#gb-apps-sections-panel-splitter-'+myIdMd5);
                    	
                    	handle.on('mousedown', function (e) {
					        isResizing = true;
					        lastDownX = e.clientX;
					    });
					    handle.on('container', function (e) {
					        isResizing = false;
					        lastDownX = e.clientX;
					    });

					    $(document).on('mousemove', function (e) {
					        // we don't want to do anything if we aren't resizing.
					        if (!isResizing) 
					            return;
					        
					        var offsetRight = container.width() - (e.clientX - container.offset().left);
					        //section panel's min-width should be 120px
					        if(e.clientX < 200){
					        	return;
					        }//contenr panel's min-width should be 200px
					        if(offsetRight < 280){
					        	return;
					        }
					        left.css('width', e.clientX);
					        right.css('width', (offsetRight+35));
					        tabs.css('width', (offsetRight+35));
					    }).on('mouseup', function (e) {
					        // stop resizing
					        isResizing = false;
					    });
                    }else{
                    	$interval.cancel(appsSectonPanelResizerInterval);
                    }
                }, 100);
				$(window).on('resize', function(){
					var myIdMd5 = localInstance['md5'];
					var container = $('#gb-apps-view-'+myIdMd5),
			        left = $('#gb-apps-sections-panel-'+myIdMd5),
			        right = $('#gb-apps-section-data-panel-'+myIdMd5),
			        tabs = $('#gb-apps-top-tabs-'+myIdMd5),
			        handle = $('#gb-apps-sections-panel-splitter-'+myIdMd5);
			        //remove style attributes
			        left.removeAttr("style");
			        right.removeAttr("style");
			        tabs.removeAttr("style");
				});
			    
			});
			
		    function userTrackingSuccess(response) {
		        
		    };

		    function handleSessionTimeout(response) {
		        if(!$scope.sessionTimedOut && response.data && response.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
		            $scope.sessionTimedOut = true;
		            ModalService.sessionTimeout();
		        }
		    };


        }
    };
}).directive('gbTourViewer',[function(){
	return {
		restrict : 'EA',
		transclude: 'true',
		bindToController: true,
		templateUrl : 'gbtour/templates/gbtour.html',
		controller: 'GbtourCtrl',
      	controllerAs: 'GbtourCtrl'
	}
}])
.directive('stringToNumber', function() {
  return {
	restrict : 'EA',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value);
      });
    }
  };
}).directive('gbExplorerEventsData',[function(){
	return {
        restrict: 'E',
        transclude: false,
		templateUrl : 'partials/explorer/events_data.html'
	}
}]).directive('gbExplorerEventsGroupData',[function(){
	return {
        restrict: 'E',
        transclude: false,
		templateUrl : 'partials/explorer/events_group_data.html'
	}
}])
.directive('appsEventGroup', function(){
    return {
        restrict: 'E',
        transclude: 'true',
        scope: {
        	instancedata: '=instancedata'
        },
        templateUrl: 'partials/explorer/event_group_instance.html',
        controller: function($scope,$interval, $timeout, $sce, $modal, $element, $attrs, $filter, GlobalService, ModalService, ExplorerService,SectionsMetaService, metaDataService,  AppService, UserTrackingService){
        	var configData = $scope.instancedata;
        	var cacheKey = configData.result.cacheKey;
        	var sIndex = 1;
        	var offset = GlobalService.getVal('event_group_instance_bucket_offset');
        	var totalPages = 0;
        	var direction = 'bottom';
        	$scope.result = [];
        	$scope.loading = true;
        	$scope.eglabel = GlobalService.getVal("event_group_tab_label");
        	$scope.eventType = configData.result.eventType;
        	$scope.pageInfo = "";
        	$scope.showMoreTop = false;
        	$scope.showMoreBottom = false;
        	$scope.totalRecs = configData.result.count;
        	if($scope.totalRecs < offset){
        		offset = $scope.totalRecs
			}
			$scope.$watch('instancedata', function() {
				bucket.clear();
				//console.log($scope.instancedata);
				configData = $scope.instancedata;
        	    cacheKey = configData.result.cacheKey;
				load();
			});
        	var bucket = (function(){
        		return{
        			blist: [],
        			bsize: GlobalService.getVal('event_group_instance_bucket_size'),
        			boffset : GlobalService.getVal('event_group_instance_bucket_offset'),
        			direction: '',
        			get: function(){
        				var me = this;
        				return me.blist;
        			},
        			add: function(data, dir){
        				var me = this;
        				me.direction = dir;
        				if(dir == 'bottom'){
        					me.addOnBottom(data);
        				}else{
        					me.addOnTop(data);
        				}
        			},
        			addOnTop: function(data){
        				var me = this;
        				me.blist = data.concat(me.blist);
        				me.checkBucketSize(me.direction);        				
        			},
        			addOnBottom: function(data){
        				var me = this;
        				me.blist= me.blist.concat(data);
        				me.checkBucketSize(me.direction);
        			},
        			checkBucketSize: function(){
        				var me = this;
        				if(me.blist.length > me.bsize){
        					if(me.direction == 'bottom'){
        						me.trimTop();
        					}else{
        						me.trimBottom();
        					}
        				}
        			},
        			trimBottom: function(){
        				var me = this;
        				var trimSize = me.blist.length - me.bsize; 
        				var sI = me.blist.length - trimSize;
        				if(sI <= me.bsize){
        					sI = me.bsize;
        				}
        				me.blist.splice(sI,me.blist.length);
        			},
        			trimTop: function(){
        				var me = this;
        				var trimSize = me.blist.length - me.bsize;
        				me.blist.splice(0,trimSize);
        			},
        			clear: function(){
        				var me = this;
        				me.blist.splice(0);
        				me.blist = [];
        			},
        			size: function(){
        				var me = this;
        				return me.blist.length;
        			}
        		}
        	})();
        	var load = function(){
        		$scope.loading = true;
	            ExplorerService.getEventGroupsData(cacheKey,sIndex,offset).then(function(response) {
		            var responseData = response.data.Data;
		            $scope.loading = false;
		            if(responseData){
		            	$scope.processData(responseData);
		            }
	            }, function(){
	            	$scope.loading = false;
		            $scope.processData([]);
	            });
            };
            //load();
            $scope.processData = function(data){
            	var me = this;
            	var map1 = data.map(function(item,index,arr,me){
            		item.gIndex = index + sIndex;
            		return item;
            	});
            	bucket.add(map1, direction);
            	$scope.result = bucket.get();
            	if($scope.result[$scope.result.length - 1]['gIndex'] < $scope.totalRecs){
            		$scope.showMoreBottom = true;
            	}else{
            		$scope.showMoreBottom = false;
            	}
            	if($scope.result[0]['gIndex'] > 1){
            		$scope.showMoreTop = true;
            	}else{
            		$scope.showMoreTop = false;
            	}
            	$scope.pageInfo = $scope.result[0]['gIndex']+" - "+($scope.result[$scope.result.length -1]['gIndex']) + " of " + $scope.totalRecs;
            };
            $scope.loadNextBatchOfRecords = function(){
            	direction = 'bottom';
            	offset = GlobalService.getVal('event_group_instance_bucket_offset');
            	sIndex = $scope.result[$scope.result.length -1]['gIndex'] + 1;
            	load();
            }
            $scope.loadLastBatchOfRecords = function(){
            	direction = 'top';
            	offset = GlobalService.getVal('event_group_instance_bucket_offset');
            	sIndex = $scope.result[0]['gIndex'] - offset;
            	if(sIndex < 1){
            		sIndex = 1;
            	}
            	if($scope.result[0]['gIndex']  < offset){            		
            		offset = offset - ($scope.result[0]['gIndex'] - 1);
            	}
            	load();
            }
        }
    }
})
.directive('inputMaxlength', function() {
  return {
    require: 'ngModel',
    restrict: "A",
    link: function (scope, element, attrs, ngModelCtrl) {
		var maxlength = Number(attrs.maxlength);
		var minlength = Number(attrs.minlen);
		var changed = false;
		maxlength = parseInt(maxlength);
		minlength = parseInt(minlength);
		function fromUser(text) {
          	text = parseInt(text);
          	changed = false;
          	if(text < minlength){          	
				var transformedInput =  minlength;
				ngModelCtrl.$setViewValue(transformedInput);
				ngModelCtrl.$render();
				changed = true;
			}
          	if (text > maxlength) {
	            var transformedInput =  Math.floor(text/10);
	            ngModelCtrl.$setViewValue(transformedInput);
	            ngModelCtrl.$render();
	            changed = true;
          	}
			if(changed){
				return transformedInput;
			}            
		return text;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  }; 
})
.directive('facetShowMore', function() {
	return {
		restrict : 'EA',
		transclude: 'true',
		bindToController: true,
		scope: {
			findex: '@findex',
			fname: '@fname'
		},
		controller: 'MoreFacetCtrl',
      	controllerAs: 'ctrl',
		template : '<span ng-click="ctrl.showMoreFacetWindow()"><i class="fa fa-plus" aria-hidden="true"></i><a>more...</a></span>',
	}
})
.directive('gbEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.gbEnter);
                });
                event.preventDefault();
            }
        });
    };
})
.directive('gbCustomDropdown', ['$document', function($document) {
	return {
	  restrict: 'A',
	  link: function(scope, el) {
		scope.clickedOnMe = false;
		// Switch dropdown visibility by clicking on 'target' element
		el.on('click', function(event) {
			scope.clickedOnMe = true;
		});
  
		// Hide dropdown if clicked somewhere 'outside'
		$document.on('click', function(event) {
			if(scope.clickedOnMe){
				scope.clickedOnMe = false;
			}else{
				scope.clickedOnMe = false;
				var el = $('#gbLogvaultBundleUploadNotification');
				if(el.hasClass('gb-slide-in-out-top')){
					scope.selectBundleNotification = true;
					scope.selectBundleNotification = false;
				}
				
			}
		  return $document.off('click', event);
		});
  
	  }
	};
  }])
.directive('restrictInput', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attr, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        var options = scope.$eval(attr.restrictInput);
        if (!options.regex && options.type) {
          switch (options.type) {
            case 'digitsOnly': options.regex = '^[0-9]*$'; break;
            case 'lettersOnly': options.regex = '^[a-zA-Z]*$'; break;
            case 'lowercaseLettersOnly': options.regex = '^[a-z]*$'; break;
            case 'uppercaseLettersOnly': options.regex = '^[A-Z]*$'; break;
            case 'lettersAndDigitsOnly': options.regex = '^[a-zA-Z0-9]*$'; break;
            case 'lettersAndDigitsSpaceOnly': options.regex = '^[a-zA-Z0-9\\s]*$'; break;
            case 'validPhoneCharsOnly': options.regex = '^[0-9 ()/-]*$'; break;
            default: options.regex = '';
          }
        }
        var reg = new RegExp(options.regex);
        if (reg.test(viewValue)) { //if valid view value, return it
          return viewValue;
        } else { //if not valid view value, use the model value (or empty string if that's also invalid)
          var overrideValue = (reg.test(ctrl.$modelValue) ? ctrl.$modelValue : '');
          element.val(overrideValue);
          return overrideValue;
        }
      });
    }
  };
})
