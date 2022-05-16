'use strict';

/* jasmine specs for filters go here */

describe('filter : ', function() {
	beforeEach(module('gbApp.filters'));
	it('numberFilter', inject(function($filter) {
		var input,
		    filter,
		    filtered_data,
		    numFilter = $filter('numberFilter');
		input = [{
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 2000,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 10,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 20,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 10,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 20,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 10,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 20,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 10,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 20,
			"c12" : 20
		}, {
			"c11" : "c11.1",
			"c13" : 10,
			"c12" : 10
		}, {
			"c11" : "c11.2",
			"c13" : 20,
			"c12" : 20
		}];
		filtered_data = [{
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}, {
			"c11" : "c11.1",
			"c13" : 1000,
			"c12" : 10
		}];
		filter = {};
		expect(numFilter(null, null)).toBeNull();
		expect(numFilter(input, filter)).toEqual(input);
		filter = {
			"c11" : {
				"field" : "c11",
				"type" : "string",
				"value" : "1.1"
			},
			"c13" : {
				"field" : "c13",
				"type" : "number",
				"value" : 100,
				"operator" : ">"
			}
		};
		expect(numFilter(input, filter)).toEqual(filtered_data);
		filter = {
			"c11" : {
				"field" : "c11",
				"type" : "string",
				"value" : "1.1"
			},
			"c13" : {
				"field" : "c13",
				"type" : "number",
				"value" : 100,
				"operator" : "<"
			}
		};
		filtered_data = [{
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}];
		expect(numFilter(input, filter)).toEqual(filtered_data);
		filter = {
			"c11" : {
				"field" : "c11",
				"type" : "string",
				"value" : "1.1"
			},
			"c13" : {
				"field" : "c13",
				"type" : "number",
				"value" : 1000,
				"operator" : "="
			}
		};
		filtered_data = [{
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}];
		expect(numFilter(input, filter)).toEqual(filtered_data);
		filter = {
			"c11" : {
				"field" : "c11",
				"type" : "string",
				"value" : "1.1"
			},
			"c13" : {
				"field" : "c13",
				"type" : "boolean",
				"value" : false,
			}
		};
		filtered_data = [{
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}];
		expect(numFilter(input, filter)).toEqual(filtered_data);
		filter = {
			"c11" : {
				"field" : "c11",
				"type" : "string",
				"value" : "1.1"
			},
			"c13" : {
				"field" : "c13",
				"type" : "number",
				"value" : null,
			}
		};
		filtered_data = [{
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 1000,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}, {
			c11 : 'c11.1',
			c13 : 10,
			c12 : 10
		}];
		expect(numFilter(input, filter)).toEqual(filtered_data);
	}));

	/*xit('filterRules', inject(function($filter) {
		expect($filter('filterRules')([{}], {})).toEqual([{}]);
		var data = [{
			"id" : "1",
			"category" : "zategory1",
			"label" : "ategory1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Draft"
		}, {
			"id" : "2",
			"category" : "Category1",
			"label" : "zategory1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Draft"
		}, {
			"id" : "3",
			"category" : "Category1",
			"label" : "Label1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Enabled"
		}, {
			"id" : "4",
			"category" : "Category1",
			"label" : "Label1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Enabled"
		}, {
			"id" : "5",
			"category" : "Category1",
			"label" : "Label1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Disabled"
		}, {
			"id" : "6",
			"category" : "Category1",
			"label" : "Label1",
			"description" : "Label2",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Disabled"
		}];

		var filter = {
			label : "lab",
			status : ['Enabled']
		};

		expect($filter('filterRules')(data, filter)).toEqual([{
			id : '3',
			category : 'Category1',
			label : 'Label1',
			description : 'Description1',
			author : 'Author1',
			priority : 'Priority1',
			severity : 'Severity1',
			action : 'Action1',
			status : 'Enabled'
		}, {
			id : '4',
			category : 'Category1',
			label : 'Label1',
			description : 'Description1',
			author : 'Author1',
			priority : 'Priority1',
			severity : 'Severity1',
			action : 'Action1',
			status : 'Enabled'
		}]);
	}));*/

	it('filterTemplates', inject(function($filter) {
		expect($filter('filterTemplates')([{}], {})).toEqual([{}]);
		var data = [{
			"id" : "1",
			"category" : "zategory1",
			"label" : "ategory1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Draft"
		}, {
			"id" : "2",
			"category" : "Category1",
			"label" : "zategory1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Draft"
		}, {
			"id" : "3",
			"category" : "Category1",
			"label" : "Label1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Enabled"
		}, {
			"id" : "4",
			"category" : "Category1",
			"label" : "Label1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Enabled"
		}, {
			"id" : "5",
			"category" : "Category1",
			"label" : "Label1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Disabled"
		}, {
			"id" : "6",
			"category" : "Category1",
			"label" : "Label1",
			"description" : "Label2",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Disabled"
		}];

		var filter = {
			label : "lab",
			status : 'Enabled'
		};

		expect($filter('filterTemplates')(data, filter)).toEqual([{
			id : '3',
			category : 'Category1',
			label : 'Label1',
			description : 'Description1',
			author : 'Author1',
			priority : 'Priority1',
			severity : 'Severity1',
			action : 'Action1',
			status : 'Enabled'
		}, {
			id : '4',
			category : 'Category1',
			label : 'Label1',
			description : 'Description1',
			author : 'Author1',
			priority : 'Priority1',
			severity : 'Severity1',
			action : 'Action1',
			status : 'Enabled'
		}]);
	}));
	
	/*xit('filterBooks', inject(function($filter) {
        var data = [{key: 'value'}];
        expect($filter('filterBooks')(data, '')).toEqual(data);
        data = [{name: 'just', tags: ['test', 'unit']}, {name: 'hit', tags: ['ashwin']}];
        expect($filter('filterBooks')(data, 'a')).toEqual([{name: 'hit', tags: ['ashwin']}]);
    }));*/
	
	it('filterMultiples', inject(function($filter) {
	    var data = [{key: 'value'}];
        expect($filter('filterMultiples')(data, {})).toEqual(data);
    }));

	it('svFileName', inject(function($filter) {
		expect($filter('svFileName')('NA')).toEqual("");
		expect($filter('svFileName')('unit/test/test1.tar.gz')).toEqual('test1.tar');
		expect($filter('svFileName')('s3:/test/test1.tar.gz')).toEqual('test1.tar.gz');
	}));

	it('cut', inject(function($filter) {
		expect($filter('cut')('Most recent log uploaded by me', true, 20, '...')).toBe('Most recent log...');
		expect($filter('cut')('defaultfilter', true, 20, '...')).toBe('defaultfilter');
		expect($filter('cut')(null)).toEqual('');
		expect($filter('cut')('This is a very long filter name with no max value', true, false, '...')).toEqual('This is a very long filter name with no max value');
		expect($filter('cut')('Most recent log uploaded by me', true, 20)).toBe('Most recent log…');
		expect($filter('cut')('Most recent log uploaded by me', false, 20, '...')).toBe('Most recent log uplo...');
		expect($filter('cut')('saved-filter-without-space', true, 20, '...')).toBe('saved-filter-without...');
	}));

	it('bundleName', inject(function($filter) {
		expect($filter('bundleName')(null)).toEqual("");
		expect($filter('bundleName')('unit/test/abcd.log')).toEqual('abcd.log');
	}));

	it('bundleLessExt', inject(function($filter) {
		expect($filter('bundleLessExt')(null)).toEqual("");
		expect($filter('bundleLessExt')('unit/test/abcd.tar.gz')).toEqual('abcd');
		expect($filter('bundleLessExt')('unit/test/abcd.zip')).toEqual('abcd');
	}));

	it('toTimeStr', inject(function($filter) {
		expect($filter('toTimeStr')('2015-01-12T23:39:32Z')).toEqual('2015-01-12 23:39:32');
		expect($filter('toTimeStr')(null)).toEqual('');
	}));

	it('fileSize', inject(function($filter) {
		expect($filter('fileSize')(1048577)).toEqual('1.00 MB (Approx.)');
		expect($filter('fileSize')(1025)).toEqual('1.00 KB (Approx.)');
	}));

	it('numberFixedLen', inject(function($filter) {
		expect($filter('numberFixedLen')(1234, 34)).toEqual('11234');
	}));

	it('subStringToX', inject(function($filter) {
		expect($filter('subStringToX')('unit testing', 4)).toEqual('unit...');
		expect($filter('subStringToX')('unit testing', 24)).toEqual('unit testing');
	}));

	it('utcDate', inject(function($filter) {
		expect($filter('utcDate')(null)).toBeNull();
		$filter('utcDate')('Fri Feb 06 2015 11:35:19 GMT+0530 (India Standard Time)');
	}));

	it('utcDateTZ', inject(function($filter) {
		expect($filter('utcDateTZ')(null)).toBeNull();
		expect($filter('utcDateTZ')('Fri Feb 06 2015 11:35:19 GMT+0530 (India Standard Time)')).toEqual('2015-2-6T6:5:19Z');
	}));

	it('tags', inject(function($filter) {
		expect($filter('tags')()).toEqual('');
		expect($filter('tags')({
			_label : 'unit'
		})).toEqual('unit');
		expect($filter('tags')([{
			_label : 'unit1'
		}, {
			_label : 'unit2'
		}, {
			_label : 'unit3'
		}])).toEqual('unit1, unit2, unit3');
	}));

	it('gbunescape', inject(function($filter) {
		expect($filter('gbunescape')('abcd efgh ijkl')).toEqual('abcd efgh ijkl');
		expect($filter('gbunescape')('Need%20tips%3F%20Visit%20W3Schools%21')).toEqual('Need tips? Visit W3Schools!');
	}));

	it('unixDateTime', inject(function($filter) {
		expect($filter('unixDateTime')('Fri Feb 06 2015 11:35:19 GMT+0530 (India Standard Time)')).toEqual(1423202719);
	}));

	it('unique', inject(function($filter) {
		var collection = [{
			"id" : "1",
			"category" : "zategory1",
			"label" : "ategory1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Draft"
		}, {
			"id" : "2",
			"category" : "Category1",
			"label" : "zategory1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Draft"
		}, {
			"id" : "3",
			"category" : "Category1",
			"label" : "Label1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Enabled"
		}, {
			"id" : "4",
			"category" : "Category1",
			"label" : "Label1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Enabled"
		}, {
			"id" : "5",
			"category" : "Category1",
			"label" : "Label1",
			"description" : "Description1",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Disabled"
		}, {
			"id" : "6",
			"category" : "Category1",
			"label" : "Label1",
			"description" : "Label2",
			"author" : "Author1",
			"priority" : "Priority1",
			"severity" : "Severity1",
			"action" : "Action1",
			"status" : "Disabled"
		}];
		expect($filter('unique')(collection, "status")).toEqual([{
			id : '1',
			category : 'zategory1',
			label : 'ategory1',
			description : 'Description1',
			author : 'Author1',
			priority : 'Priority1',
			severity : 'Severity1',
			action : 'Action1',
			status : 'Draft'
		}, {
			id : '3',
			category : 'Category1',
			label : 'Label1',
			description : 'Description1',
			author : 'Author1',
			priority : 'Priority1',
			severity : 'Severity1',
			action : 'Action1',
			status : 'Enabled'
		}, {
			id : '5',
			category : 'Category1',
			label : 'Label1',
			description : 'Description1',
			author : 'Author1',
			priority : 'Priority1',
			severity : 'Severity1',
			action : 'Action1',
			status : 'Disabled'
		}]);
	}));
});
