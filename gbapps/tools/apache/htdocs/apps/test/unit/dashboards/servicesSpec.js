describe('dashboards service : ', function() {
    
    var manufacturer, product, schema;
    
	beforeEach(module('gbApp.services.analytics', 'gbApp.services.dashboards', 'ui.bootstrap', 'gbApp.globals', 'ngCookies', 'ngTable', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('adminEmail', 'support@glassbeam.com');
		$provide.value('useLocal', true);
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
	}));

	describe('Dashboards : ', function() {
		it('allDetails', inject(function(Dashboards, $httpBackend, infoserverDomain) {
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond([1, 2, 3]);
			expect(Dashboards).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			Dashboards.allDetails().then(function(response) {
				data = response.data;
			}, function(response) {
				data = reponse.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('getEndCustomers', inject(function(Dashboards, $httpBackend, infoserverDomain) {
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', infoserverDomain + '/healthcheck/ec/details/' + manufacturer + '/' + product + '/' + schema).respond([1, 2, 3]);
			expect(Dashboards).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			Dashboards.getEndCustomers().then(function(response) {
				data = response.data;
			}, function(response) {
				data = reponse.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));
		
		it('getEndCustomers user', inject(function(Dashboards, $httpBackend, infoserverDomain) {
            expect($httpBackend).toBeDefined();
            $httpBackend.expect('GET', infoserverDomain + '/healthcheck/ec/details/' + manufacturer + '/' + product + '/' + schema + '?user=user').respond([1, 2, 3]);
            expect(Dashboards).not.toBeNull();
            var data;
            expect(data).toBeUndefined();
            Dashboards.getEndCustomers('user').then(function(response) {
                data = response.data;
            }, function(response) {
                data = reponse.data;
            });
            expect(data).toBeUndefined();
            $httpBackend.flush();
            expect(data).toBeDefined();
            expect(data).toEqual([1, 2, 3]);
        }));
	});

}); 