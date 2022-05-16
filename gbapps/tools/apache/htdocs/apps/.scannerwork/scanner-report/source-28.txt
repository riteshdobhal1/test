'use strict';

/* jasmine specs for Log Status */

describe('gbLogStatusApp : ', function() {

  var module;
  beforeEach(function() {
    module = angular.module('gbLogStatusApp');
  });
  it("Is gbAdminApp module exists ??", function() {
		expect(module).not.toBeNull();
	});
});
