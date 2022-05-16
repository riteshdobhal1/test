'use strict';

describe("Application Test : ", function() {

	var module;
	beforeEach(function() {
		module = angular.module('gbApp');
	});

	it("Is gbApp module exists ??", function() {
		expect(module).not.toBeNull();
	});

	describe("Testing dependecies : ", function() {
		var deps;
		var hasModule = function(m) {
			return deps.indexOf(m) >= 0;
		};

		beforeEach(function() {
			deps = module.value("gbApp").requires;
		});

		it("Should have gbApp.filters", function() {
			expect(hasModule("gbApp.filters")).toBeTruthy();
		});

		it("Should have gbApp.services", function() {
			expect(hasModule("gbApp.services")).toBeTruthy();
		});

		it("Should have gbApp.services.explorer", function() {
			expect(hasModule("gbApp.services.explorer")).toBeTruthy();
		});

		it("Should have gbApp.services.analytics", function() {
			expect(hasModule("gbApp.services.analytics")).toBeTruthy();
		});

		it("Should have gbApp.services.dashboards", function() {
			expect(hasModule("gbApp.services.dashboards")).toBeTruthy();
		});

		it("Should have gbApp.services.logvault", function() {
			expect(hasModule("gbApp.services.logvault")).toBeTruthy();
		});

		it("Should have gbApp.controllers", function() {
			expect(hasModule("gbApp.controllers")).toBeTruthy();
		});

		it("Should have gbApp.controllers.explorer", function() {
			expect(hasModule("gbApp.controllers.explorer")).toBeTruthy();
		});
		
		it("Should have gbApp.controllers.analytics", function() {
			expect(hasModule("gbApp.controllers.analytics")).toBeTruthy();
		});

		it("Should have gbApp.controllers.dashboards", function() {
			expect(hasModule("gbApp.controllers.dashboards")).toBeTruthy();
		});

		it("Should have gbApp.controllers.logvault", function() {
			expect(hasModule("gbApp.controllers.logvault")).toBeTruthy();
		});

		it("Should have gbApp.directives", function() {
			expect(hasModule("gbApp.directives")).toBeTruthy();
		});

		it("Should have gbApp.globals", function() {
			expect(hasModule("gbApp.globals")).toBeTruthy();
		});
		
		it("Should have ui.bootstrap", function() {
			expect(hasModule("ui.bootstrap")).toBeTruthy();
		});
		
		it("Should have ngCookies", function() {
			expect(hasModule("ngCookies")).toBeTruthy();
		});
		
		it("Should have ngTable", function() {
			expect(hasModule("ngTable")).toBeTruthy();
		});
		
		it("Should have ngAnimate", function() {
			expect(hasModule("ngAnimate")).toBeTruthy();
		});
		
		it("Should have ui.slider", function() {
			expect(hasModule("ui.slider")).toBeTruthy();
		});
	});
});
