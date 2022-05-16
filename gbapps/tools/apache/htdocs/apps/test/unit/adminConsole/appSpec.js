'use strict';

/* jasmine specs for log vault controllers go here */

describe('gbAdminApp : ', function() {

  var module;
  beforeEach(function() {
    module = angular.module('gbAdminApp');
  });
  it("Is gbAdminApp module exists ??", function() {
		expect(module).not.toBeNull();
	});
});
