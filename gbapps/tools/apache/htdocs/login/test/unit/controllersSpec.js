describe('gbLoginApp : ', function() {
    
    var mps, manufacturer, product, schema, umsDomain;

	beforeEach(module('gbLoginApp.services', 'gbLoginApp.controllers', 'gbLoginApp.globalservices', 'ngCookies', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('adminEmail', 'support@glassbeam.com');
		$provide.value('umsDomain', 'undefined');
		
		mps = 'null';
		manufacturer = 'undefined';
		product = 'undefined';
		schema = 'undefined';
		umsDomain = 'undefined';
		
		var element = document.createElement("div");
        element.id = "gb-full-page-loader";
        document.body.appendChild(element);
        
        element = document.createElement("div");
        element.id = "gb-apps-body";
        document.body.appendChild(element);
	}));

    it('GlobalService: Should have GlobalService', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('LoginCtrl', {
			'$scope' : $scope
		});	
		
		var HTMLElements = {};
		spyOn(document, 'getElementById').and.callFake(function(ID) {
		   if(!HTMLElements[ID]) {
		      var newElement = document.createElement('div');
		      HTMLElements[ID] = newElement;
		   }
		   return HTMLElements[ID];
		});

		GlobalService.setGlobals('');
		GlobalService.getUmsDomain();
		GlobalService.gethttpProtocol();
		GlobalService.setUmsDomain('');
		GlobalService.showLoading();
		GlobalService.hideLoading();
	}));
    it('GlobalService: Should have GlobalService : showLoading', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('LoginCtrl', {
			'$scope' : $scope
		});	
		
		var HTMLElements = {};
		spyOn(document, 'getElementById').and.callFake(function(ID) {
		   if(!HTMLElements[ID]) {
		      var newElement = document.createElement('div');
		      HTMLElements[ID] = newElement;
		   }
		   return HTMLElements[ID];
		});

		GlobalService.showLoading('raja');
	}));

   it('Should have LoginCtrl controller', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout) {
		var $scope = $rootScope.$new();
		GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');

		$controller('LoginCtrl', {
			'$scope' : $scope
		});
	}));

   it('LoginCtrl: Should have requestLogin method', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('LoginCtrl', {
			'$scope' : $scope
		});

		spyOn($scope, "validateForm").and.callFake(function(){
	        return true;
	    });
	    spyOn($scope, "gbWatch");
	    spyOn(GlobalService, "showLoading");
	    spyOn(GlobalService, "hideLoading");
	    spyOn(LoginService, "windowFailed");

		$scope.requestLogin('local');

		$scope.user = {
			'username' : 'raja',
			'email' : 'raja@gb.com',
			'password' : 'demo'
		}
		$httpBackend.expect('POST', umsDomain + '/aa/uilogin').respond({});
        $httpBackend.flush();


		expect($scope.validateForm).toHaveBeenCalled();
		expect($scope.gbWatch).toHaveBeenCalled();
		expect(GlobalService.showLoading).toHaveBeenCalled();
		expect(GlobalService.hideLoading).toHaveBeenCalled();
		expect(LoginService.windowFailed).toHaveBeenCalled();
	}));

   it('LoginCtrl: Should have requestLogin method with ERROR', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('LoginCtrl', {
			'$scope' : $scope
		});

		spyOn($scope, "validateForm").and.callFake(function(){
	        return true;
	    });
	    spyOn($scope, "gbWatch");
	    spyOn(GlobalService, "showLoading");
	    spyOn(GlobalService, "hideLoading");
	    spyOn(LoginService, "windowFailed");

		$scope.requestLogin('');

		$scope.user = {
			'username' : 'raja',
			'email' : 'raja@gb.com',
			'password' : 'demo'
		}
		$httpBackend.expect('POST', umsDomain + '/aa/uilogin').respond(500, {});
        $httpBackend.flush();

		expect($scope.validateForm).toHaveBeenCalled();
		expect($scope.gbWatch).toHaveBeenCalled();
		expect(GlobalService.showLoading).toHaveBeenCalled();
		expect(GlobalService.hideLoading).toHaveBeenCalled();
		expect(LoginService.windowFailed).toHaveBeenCalled();
	}));

   it('LoginCtrl: Should have gbWatch method', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('LoginCtrl', {
			'$scope' : $scope
		});

		GlobalService.setVal('timeoutDelay', 100);
	    spyOn(GlobalService, "hideLoading");
	    spyOn(LoginService, "windowFailed");

	    $scope.loading = true;

		$scope.gbWatch();

		// flush timeout(s) for all code under test.
		$timeout.flush();

		// this will throw an exception if there are any pending timeouts.
		$timeout.verifyNoPendingTasks();

		expect(GlobalService.hideLoading).toHaveBeenCalled();
		expect(LoginService.windowFailed).toHaveBeenCalled();
	}));

   it('LoginCtrl: Should have validateForm method', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('LoginCtrl', {
			'$scope' : $scope
		});

		$scope.user = {
			username : 'raja',
			email : 'raja@gb.com',
			password : 'demo'
		}
		$scope.loginform = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}, 
			password: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}
		}

		$scope.validateForm();

	}));

   it('LoginCtrl: Should have validateForm method : email is empty', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('LoginCtrl', {
			'$scope' : $scope
		});

		$scope.user = {
			username : 'raja',
			password : 'demo'
		}
		$scope.loginform = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}, 
			password: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}
		}

		$scope.validateForm();

	}));
   it('LoginCtrl: Should have validateForm method : email is not valid', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('LoginCtrl', {
			'$scope' : $scope
		});

		$scope.user = {
			username : 'raja',
			email: 'asdfafsd',
			password : 'demo'
		}
		$scope.loginform = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}, 
			password: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}
		}

		$scope.validateForm();

	}));

   it('LoginCtrl: Should have validateForm method: password is empty', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('LoginCtrl', {
			'$scope' : $scope
		});

		$scope.user = {
			username : 'raja',
			email : 'raja@gb.com'
		}
		$scope.loginform = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}, 
			password: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}
		}

		$scope.validateForm();

	}));
   it('LoginCtrl: Should have validateForm method: password length is less than 4', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('LoginCtrl', {
			'$scope' : $scope
		});

		$scope.user = {
			username : 'raja',
			email : 'raja@gb.com',
			password : 'de'
		}
		$scope.loginform = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}, 
			password: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}
		}

		$scope.validateForm();

	}));
	
    it('LoginCtrl: Should have getValue method', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('LoginCtrl', {
			'$scope' : $scope
		});		

		$scope.getValue('EMPTYEMAIL');

	}));

    it('LoginCtrl: Should have checkEmailDomain method', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('LoginCtrl', {
			'$scope' : $scope
		});		

		$scope.checkEmailDomain();

	}));

    it('SelectDomainCtrl: Should have SelectDomainCtrl', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('SelectDomainCtrl', {
			'$scope' : $scope
		});	

	}));

    it('SelectDomainCtrl: Should have loadUi method', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('SelectDomainCtrl', {
			'$scope' : $scope
		});	
		$scope.loadUi();

	}));

    it('ForgotPasswordCtrl: Should have ForgotPasswordCtrl', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});	

	}));

    it('ForgotPasswordCtrl: Should have sendMailMsgReset', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});	
		$scope.sendMailMsgReset();

	}));

    it('ForgotPasswordCtrl: Should have sendMailSuccess', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});	
		$scope.sendMailSuccess();

	}));

    it('ForgotPasswordCtrl: Should have sendMailFailure', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});	
		$scope.sendMailFailure();

	}));

    it('ForgotPasswordCtrl: Should have forgotPasswordSendEmail with data', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});	
		spyOn($scope, "validateEmailForm").and.callFake(function(){
	        return true;
	    });
	    $scope.forgotpasswordform = {
	    	email : {
	    		$dirty : false
	    	}
	    }
	    spyOn($scope, "gbWatch");
	    spyOn(GlobalService, "showLoading");
	    spyOn(GlobalService, "hideLoading");
	    spyOn($scope, "sendMailSuccess");

		$scope.forgotPasswordSendEmail();

		$scope.user = {
			'username' : 'raja',
			'email' : 'raja@gb.com',
			'password' : 'demo'
		}
		$httpBackend.expect('POST', umsDomain + '/user/forgot/passwd/undefined').respond({});
        $httpBackend.flush();

		expect($scope.validateEmailForm).toHaveBeenCalled();
		expect($scope.gbWatch).toHaveBeenCalled();
		expect(GlobalService.showLoading).toHaveBeenCalled();
		expect(GlobalService.hideLoading).toHaveBeenCalled();
		expect($scope.sendMailSuccess).toHaveBeenCalled();

	}));

	
    it('ForgotPasswordCtrl: Should have forgotPasswordSendEmail with error', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});	
		spyOn($scope, "validateEmailForm").and.callFake(function(){
	        return true;
	    });
	    $scope.forgotpasswordform = {
	    	email : {
	    		$dirty : false
	    	}
	    }
	    spyOn($scope, "gbWatch");
	    spyOn(GlobalService, "showLoading");
	    spyOn(GlobalService, "hideLoading");
	    spyOn($scope, "sendMailFailure");

		$scope.forgotPasswordSendEmail();

		$scope.user = {
			'username' : 'raja',
			'email' : 'raja@gb.com',
			'password' : 'demo'
		}
		$httpBackend.expect('POST', umsDomain + '/user/forgot/passwd/undefined').respond(500);
        $httpBackend.flush();

		expect($scope.validateEmailForm).toHaveBeenCalled();
		expect($scope.gbWatch).toHaveBeenCalled();
		expect(GlobalService.showLoading).toHaveBeenCalled();
		expect(GlobalService.hideLoading).toHaveBeenCalled();
		expect($scope.sendMailFailure).toHaveBeenCalled();

	}));

    it('ForgotPasswordCtrl: Should have requestChangePassword with data', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});	
		spyOn($scope, "validateForm").and.callFake(function(){
	        return true;
	    });
	    $scope.gbForgotForm = {
	    	password : {
	    		$dirty : false,
	    		$setValidity: function(){}
	    	}
	    }
	    spyOn($scope, "gbWatch");
	    spyOn(GlobalService, "showLoading");
	    spyOn(GlobalService, "hideLoading");
	    spyOn(LoginService, "windowSuccess");
	    spyOn(LoginService, "windowFailed");

		$scope.requestChangePassword();

		$scope.user = {
			'username' : 'raja',
			'email' : 'raja@gb.com',
			'password' : 'demo'
		}
		$httpBackend.expect('POST', umsDomain + '/user/create/passwd').respond({});

        $httpBackend.flush();

		expect($scope.validateForm).toHaveBeenCalled();
		expect($scope.gbWatch).toHaveBeenCalled();
		expect(GlobalService.showLoading).toHaveBeenCalled();
		expect(GlobalService.hideLoading).toHaveBeenCalled();
		expect(LoginService.windowSuccess).toHaveBeenCalled();
		expect(LoginService.windowFailed).not.toHaveBeenCalled();

	}));
	
	it('ForgotPasswordCtrl: Should have requestChangePassword with error', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});	
		spyOn($scope, "validateForm").and.callFake(function(){
	        return true;
	    });
	    $scope.gbForgotForm = {
	    	password : {
	    		$dirty : false,
	    		$setValidity: function(){}
	    	}
	    }
	    spyOn($scope, "gbWatch");
	    spyOn(GlobalService, "showLoading");
	    spyOn(GlobalService, "hideLoading");
	    spyOn(LoginService, "windowSuccess");
	    spyOn(LoginService, "windowFailed");

		$scope.requestChangePassword();

		$scope.user = {
			'username' : 'raja',
			'email' : 'raja@gb.com',
			'password' : 'demo'
		}
		$httpBackend.expect('POST', umsDomain + '/user/create/passwd').respond(500);

        $httpBackend.flush();

		expect($scope.validateForm).toHaveBeenCalled();
		expect($scope.gbWatch).toHaveBeenCalled();
		expect(GlobalService.showLoading).toHaveBeenCalled();
		expect(GlobalService.hideLoading).toHaveBeenCalled();
		expect(LoginService.windowSuccess).not.toHaveBeenCalled();
		expect(LoginService.windowFailed).toHaveBeenCalled();

	}));


   it('ForgotPasswordCtrl: Should have gbWatch method', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});

		GlobalService.setVal('timeoutDelay', 100);
	    spyOn(GlobalService, "hideLoading");
	    spyOn(LoginService, "windowFailed");

	    $scope.loading = true;

		$scope.gbWatch();

		// flush timeout(s) for all code under test.
		$timeout.flush();

		// this will throw an exception if there are any pending timeouts.
		$timeout.verifyNoPendingTasks();

		expect(GlobalService.hideLoading).toHaveBeenCalled();
		expect(LoginService.windowFailed).toHaveBeenCalled();
	}));

   it('ForgotPasswordCtrl: Should have validateForm method', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});

		$scope.user = {
			username : 'raja',
			email : 'raja@gb.com',
			password : 'demo'
		}
		$scope.gbForgotForm = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}, 
			password: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}, 
			repassword: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}
		}

		$scope.validateForm();

	}));

   it('ForgotPasswordCtrl: Should have validateForm method : email is empty', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});

		$scope.user = {
			username : 'raja',
			password : 'demo'
		}
		$scope.gbForgotForm = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}, 
			password: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}, 
			repassword: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}
		}

		$scope.validateForm();

	}));
   it('ForgotPasswordCtrl: Should have validateForm method : email is not valid', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});

		$scope.user = {
			username : 'raja',
			email: 'asdfafsd',
			password : 'demo'
		}
		$scope.gbForgotForm = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}, 
			password: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}, 
			repassword: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}
		}

		$scope.validateForm();

	}));

   it('ForgotPasswordCtrl: Should have validateForm method: password is empty', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});

		$scope.user = {
			username : 'raja',
			email : 'raja@gb.com'
		}
		$scope.gbForgotForm = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}, 
			password: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}, 
			repassword: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}
		}

		$scope.validateForm();

	}));
   it('ForgotPasswordCtrl: Should have validateForm method: password length is less than 4', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});

		$scope.user = {
			username : 'raja',
			email : 'raja@gb.com',
			password : 'de',
		}
		$scope.gbForgotForm = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}, 
			password: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}, 
			repassword: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}
		}

		$scope.validateForm();

	}));
   it('ForgotPasswordCtrl: Should have validateForm method: repassword length is less than 4', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});

		$scope.user = {
			username : 'raja',
			email : 'raja@gb.com',
			password : 'demo',
			repassword : 'de'
		}
		$scope.gbForgotForm = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}, 
			password: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}, 
			repassword: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}
		}

		$scope.validateForm();

	}));

   it('ForgotPasswordCtrl: Should have validateForm method: repassword not matching', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});

		$scope.user = {
			username : 'raja',
			email : 'raja@gb.com',
			password : 'demo',
			repassword : 'deno'
		}
		$scope.gbForgotForm = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}, 
			password: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}, 
			repassword: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}
		}

		$scope.validateForm();

	})); 

   it('ForgotPasswordCtrl: Should have validateForm method: success', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});

		$scope.user = {
			username : 'raja',
			email : 'raja@gb.com',
			password : 'demo',
			repassword : 'demo'
		}
		$scope.gbForgotForm = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}, 
			password: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}, 
			repassword: {
				$dirty : false,
				$setValidity : function(){
					
				}
			}
		}

		$scope.validateForm();

	}));

   it('ForgotPasswordCtrl: Should have validateEmailForm method with valide data', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "sendMailMsgReset");
		spyOn(UtilityService, 'validateEmail').and.callFake(function(){
	        return true;
	    });
		$scope.user = {
			username : 'raja',
			email : 'raja@gb.com',
			password : 'demo',
			repassword : 'demo'
		}
		$scope.forgotpasswordform = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}
		}

		$scope.validateEmailForm();
		expect($scope.sendMailMsgReset).toHaveBeenCalled();
		expect(UtilityService.validateEmail).toHaveBeenCalled();
	}));
	
   it('ForgotPasswordCtrl: Should have validateEmailForm method with empty email', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "sendMailMsgReset");
		spyOn(UtilityService, 'validateEmail').and.callFake(function(){
	        return true;
	    });
		$scope.user = {
			username : 'raja'
		}
		$scope.forgotpasswordform = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}
		}

		$scope.validateEmailForm();
		expect($scope.sendMailMsgReset).toHaveBeenCalled();
		//expect(UtilityService.validateEmail).toHaveBeenCalled();
	}));

   it('ForgotPasswordCtrl: Should have validateEmailForm method with invalide email', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "sendMailMsgReset");
		spyOn(UtilityService, 'validateEmail').and.callFake(function(){
	        return false;
	    });
		$scope.user = {
			username : 'raja',
			email : 'rasdfsdfsd'
		}
		$scope.forgotpasswordform = {
			email: {
				$dirty : false,
				$setValidity : function(){

				}
			}
		}

		$scope.validateEmailForm();
		expect($scope.sendMailMsgReset).toHaveBeenCalled();
		expect(UtilityService.validateEmail).toHaveBeenCalled();
	}));

   it('ForgotPasswordCtrl: Should have updateEmailField method', inject(function($rootScope, $controller, $httpBackend, $location, LoginService, GlobalMessages, UtilityService, GlobalService, $window, $timeout, umsDomain) {
		var $scope = $rootScope.$new();

		$controller('ForgotPasswordCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "sendMailMsgReset");

		$scope.updateEmailField();
		expect($scope.sendMailMsgReset).toHaveBeenCalled();
	}));

});