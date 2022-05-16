'use strict';

describe("Application Test : ", function() {
	var module;
	beforeEach(function() {
		module = angular.module('gbLoginApp');
	});

	it("Is gbLoginApp module exists ??", function() {
		expect(module).not.toBeNull();
	});

	describe("Testing dependecies : ", function() {
		var deps;
		var hasModule = function(m) {
			return deps.indexOf(m) >= 0;
		};

		beforeEach(function() {
			deps = module.value("gbLoginApp").requires;
		});

		it("Should have gbLoginApp.services", function() {
			expect(hasModule("gbLoginApp.services")).toBeTruthy();
		});

		it("Should have gbLoginApp.controllers", function() {
			expect(hasModule("gbLoginApp.controllers")).toBeTruthy();
		});	

		it("Should have gbLoginApp.globalservices", function() {
			expect(hasModule("gbLoginApp.globalservices")).toBeTruthy();
		});		

		it("Should have ngCookies", function() {
			expect(hasModule("ngCookies")).toBeTruthy();
		});

		it("Should have ngAnimate", function() {
			expect(hasModule("ngAnimate")).toBeTruthy();
		});		

		it("Should have ngDraggable", function() {
			expect(hasModule("ngDraggable")).toBeTruthy();
		});	

		it("Should have ngRoute", function() {
			expect(hasModule("ngRoute")).toBeTruthy();
		});
	});
	
});






