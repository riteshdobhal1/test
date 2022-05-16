module.exports = function(config) {
    config.set({
        basePath : '../',

        files : ['apps/app/lib/angular/angular-*.js', 
        'apps/test/lib/angular/angular-mocks-1.3.19.js', 
        'apps/app/lib/x2js/xml2json.min.js', 
        'apps/app/lib/**/**/*.js', 
        'apps/app/login/js/*.js', 
        'login/test/unit/*.js'],

        exclude : ['apps/app/lib/angular/angular.js', 
        'apps/app/lib/bootstrap-3.3.6/js/bootstrap.js', 
        'apps/app/lib/bootstrap-3.3.6/js/bootstrap.min.js', 
        'apps/app/lib/bootstrap-3.3.6/js/npm.js', 
        'apps/app/lib/bootstrap-3.1/js/bootstrap.js', 
        'apps/app/lib/bootstrap-3.1/js/bootstrap.min.js', 
        'apps/app/lib/angular/angular-loader.js', 
        'apps/app/lib/angular/*.min.js', 
        'apps/app/lib/angular/angular-scenario.js', 
        'apps/app/lib/file-upload/es5-sham.min.js'],

        autoWatch : true,

        singleRun : true,

        frameworks : ['jasmine'],

        plugins : ['karma-junit-reporter', 'karma-jasmine', 'karma-phantomjs-launcher', 'karma-coverage'],

        browsers : ['PhantomJS'],

        reporters : ['dots', 'junit', 'progress', 'coverage'],

        preprocessors : {
            'apps/app/login/js/*.js' : ['coverage']
        },
        junitReporter : {
            outputFile : 'login/test/test-results.xml'
        },

        coverageReporter : {
            dir : 'login/test/coverage/',
            reporters : [{
                type : 'html',
                subdir : 'report-html'
            }, {
                type : 'cobertura',
                subdir : '.',
                file : 'cobertura.xml'
            }]
        }
    });
};
