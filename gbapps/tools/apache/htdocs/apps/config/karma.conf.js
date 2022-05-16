module.exports = function(config) {
	config.set({
		basePath : '../',

		files : ['app/lib/angular/angular-1.3.19.js', 'app/lib/angular/angular-*.js', 'test/lib/angular/angular-mocks-1.3.19.js',
			'app/lib/d3/d3.min.js', 'app/lib/x2js/xml2json.min.js', 'app/lib/**/**/*.js', 'app/gbtour/controllers.js',
			'app/js/**/*.js', 'app/admin/js/*.js', 'test/unit/**/*.js'],

		exclude : ['app/lib/angular/angular.js', 'app/lib/dashboard-to-apps/*.js', 
		'app/lib/dashboard-tracking/*.js', 'app/lib/bootstrap-3.3.6/js/bootstrap.js', 
		'app/lib/bootstrap-3.3.6/js/bootstrap.min.js', 'app/lib/bootstrap-3.3.6/js/npm.js', 
		'app/lib/bootstrap-3.1/js/bootstrap.js', 'app/lib/bootstrap-3.1/js/bootstrap.min.js', 
		'app/lib/angular/angular-loader.js', 'app/lib/angular/*.min.js', 
		'app/lib/angular/angular-scenario.js', 'app/lib/file-upload/es5-sham.min.js', 
		'app/js/logvault/logvault.js', 'app/js/explorer/explorer.js', 
		'app/js/uns-rules-and-alert/*.js', 'app/js/fileupload/*.js', 'app/logstatus/js/**/*.js','test/unit/logstatus/*.js'
		],

		autoWatch : true,

		singleRun : true,

		frameworks : ['jasmine'],

		plugins : ['karma-junit-reporter', 'karma-jasmine', 'karma-phantomjs-launcher', 'karma-coverage'],

		browsers : ['PhantomJS'],

		reporters : ['dots', 'junit', 'progress', 'coverage'],

		preprocessors : {
			'app/js/**/*.js' : ['coverage'],
			'app/logstatus/js/*.js' : ['coverage'],
			'app/admin/js/*.js' : ['coverage']
		},
		junitReporter : {
			outputFile : 'test-results.xml'
		},

		coverageReporter : {
			dir : 'test/coverage/',
			reporters : [{
				type : 'html',
				subdir : 'report-html'
			}, {
				type : 'cobertura',
				subdir : '.',
				file : 'cobertura.xml'
			}]
		},
		browserNoActivityTimeout : 60000
	});
};
