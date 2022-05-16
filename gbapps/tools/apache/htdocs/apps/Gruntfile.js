
/*  This file will be used to run all the tasks defined such as minification of css , js and images and creating distribution code */


module.exports = function (grunt) { /// import all the modules defined in package.json


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),  /// Read the package.json for config variables and loading grunt modules
	banner: '<!-- <%= pkg.name %> - Build version is  <%= pkg.version %> -->',   ///// Will put the Build number at the top of index.html (Landing page)

    usebanner: {
    dist: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      files: {
        src: [ 'dist/index.html']
      }
    }
  	},

	clean: {
		start:
		{
            		src: ['dist/**/','dist/*.*']  /// Remove the temporary file created during build process
		},
		end:
		{

	    		src: ['dist/js/*.js','!dist/js/*.ver*.js','dist/js/rulesAndAlerts/directives.js','dist/css/error.css','dist/css/login.css','dist/css/maintenance.css','dist/css/tableau_10.css','dist/css/tableau_9.css','dist/admin/js/*.js','!dist/admin/js/*.ver*.js','dist/admin/js/admin/*.js','!dist/admin/js/admin/*.ver*.js','dist/logstatus/js/*.js','!dist/logstatus/js/*.ver*.js','dist/gbtour/*.js','!dist/gbtour/*.ver*js','dist/logstatus/css/*.css','!dist/logstatus/css/*.ver*.css','dist/admin/css/admin/*.css','!dist/admin/css/admin/*.ver*.css']
		}	

	},	

	useminPrepare: {                  /// look for the block of the files in index.html which needs minification and creating dynamic configuration in Gruntfile.js

	main:
    	{
        	dest: 'dist',
        	src: ['app/index.html']
    	},
    	admin:
    	{
        	dest: 'dist/admin',
        	src: ['app/admin/manageuser.html']
    	}
		/* logstatus:
		{
			dest: 'dist/logstatus',
            src: ['app/logstatus/index.html']
		} */
	
	},
	
	 imagemin: {					/// compress the images to reduce the size of the image
      options: {
        cache: false
      },

      dist: {
        files: [{
          expand: true,
          cwd: 'app/',
          src: ['img/*.{png,gif}'],
          dest: 'dist/'
        }]
      }
    },
	usemin: {						/// replace the actual files with minified version created after concatenation and uglification of files (js and css) 
		main:
		{
			options:
			{
				assetsDirs : ['dist'],
				type:'html'

			},
			files:{src:['dist/index.html']}

		},
		admin:
		{
			options:
            		{
                		assetsDirs : ['dist'],
                		type:'html'

            		},
            		files:{src:['dist/admin/manageuser.html']}

		}
		/* logstatus:
        {
            options:
            {
                assetsDirs : ['dist'],
                type:'html'

            },
            files:{src:['dist/logstatus/index.html']}

        } */

    },
	replacer: {
    	index1: {
        	options : {
            	replace: {
                '<script src="admin/js/main.js"></script>' : '<script src="js/main.ver<%= pkg.version %>.js"></script>',
		'/apps/app/admin/js/admin/apps.js' : '/apps/dist/admin/js/admin/apps.ver<%= pkg.version %>.js',
                '/apps/app/admin/js/admin/global.js' : '/apps/dist/admin/js/admin/global.ver<%= pkg.version %>.js',
		'/apps/app/admin/css/admin/style.css' : '/apps/dist/admin/css/admin/style.ver<%= pkg.version %>.css'	
            	}
        	},
        	files : [
            	{src: ['dist/admin/manageuser.html'], dest: 'dist/admin/manageuser.html'}
        	]
    	},
	index2: {
                options : {
                replace: {
                'js/main.js' : 'js/main.ver<%= pkg.version %>.js',
		'js/app.js' : 'js/app.ver<%= pkg.version %>.js',
		'js/globals.js' : 'js/globals.ver<%= pkg.version %>.js',
		'js/directives.js' : 'js/directives.ver<%= pkg.version %>.js',
		'js/rulesAndAlerts/directives.js' : 'js/rulesAndAlerts/directives.ver<%= pkg.version %>.js',
                'js/workbench/controllers.js' : 'js/workbench/controllers.ver<%= pkg.version %>.js',
                'js/workbench/services.js' : 'js/workbench/services.ver<%= pkg.version %>.js',
		'css/main.css' : 'css/main.ver<%= pkg.version %>.css',
		'gbtour/controllers.js' : 'gbtour/controllers.ver<%= pkg.version %>.js',
		'gbtour/lib/tour.js' : 'gbtour/lib/tour.ver<%= pkg.version %>.js'
	
                }
                },
                files : [
                {src: ['dist/index.html'], dest: 'dist/index.html'}
                ]
        },
	index3: {
		options : {
                replace: {

		'/apps/app/logstatus/js/services.js' : '/apps/dist/logstatus/js/services.ver<%= pkg.version %>.js',
		'/apps/app/logstatus/js/controller.js' : '/apps/dist/logstatus/js/controller.ver<%= pkg.version %>.js',

                '/apps/app/logstatus/js/app.js' : '/apps/dist/logstatus/js/app.ver<%= pkg.version %>.js',
                '/apps/app/logstatus/js/globals.js' : '/apps/dist/logstatus/js/globals.ver<%= pkg.version %>.js',
		'/apps/app/logstatus/js/filter.js' : '/apps/dist/logstatus/js/filter.ver<%= pkg.version %>.js',
		'/apps/app/logstatus/js/logstatusDirective.js' : '/apps/dist/logstatus/js/logstatusDirective.ver<%= pkg.version %>.js',

		'/apps/app/logstatus/css/style.css' : '/apps/dist/logstatus/css/style.ver<%= pkg.version %>.css'
                }
                },
                files : [
                {src: ['dist/logstatus/index.html'], dest: 'dist/logstatus/index.html'}
                ]

	}
	

	},
    htmlmin: {                      /// Task to minify all html files                
    dist: {                                       
      options: {                                  
        removeComments: true,
        collapseWhitespace: true
      },
      files:[{                                    
        expand: true,
        cwd: 'dist', 
        src: '**/*.html',
        dest: 'dist/'
      }]
    }
	},
	copy :{							/// Task to copy source code from dev folder to production folder for distribution
		main:{
		  files: [
          { expand: true, cwd: 'app', src: ['*.html'], dest: 'dist/' },
          { expand: true, cwd: 'app/lib', src: ['**'], dest: 'dist/lib/' },
		  { expand: true, cwd: 'app/js', src: ['app.js'], dest: 'dist/js/' },
		  { expand: true, cwd: 'app/js', src: ['globals.js'], dest: 'dist/js/' },
		  { expand: true, cwd: 'app/js', src: ['directives.js'], dest: 'dist/js/' },
		  { expand: true, cwd: 'app/js/rulesAndAlerts', src: ['directives.js'], dest: 'dist/js/rulesAndAlerts/' },
		  { expand: true, cwd: 'app/js/workbench', src: ['controllers.js','services.js'], dest: 'dist/js/workbench/' },
		  { expand: true, cwd: 'app/partials', src: ['**'], dest: 'dist/partials/' },
		  { expand: true, cwd: 'app/login', src: ['**'], dest: 'dist/login/' },
		  { expand: true, cwd: 'app/maintenance', src: ['**'], dest: 'dist/maintenance/' },
		  { expand: true, cwd: 'app/stat', src: ['**'], dest: 'dist/stat/' },
		  { expand: true, cwd: 'app/css', src: ['*.css'], dest: 'dist/css/' },
		  { expand: true, cwd: 'app/error', src: ['*.js'], dest: 'dist/error/' },
		  { expand: true, cwd: 'app/admin', src: ['**'], dest: 'dist/admin/' },
		  { expand: true, cwd: 'app/logstatus', src: ['**'], dest: 'dist/logstatus/' },
		  { expand: true, cwd: 'app/gbtour', src: ['**'], dest: 'dist/gbtour/' },
		  { expand: true, cwd: 'app/dashboard', src: ['**'], dest: 'dist/dashboard/' },
		  { expand: true, cwd: 'app/MDViz', src: ['**'], dest: 'dist/MDViz/' }	  
        ],
	},
	copy_single:{                         /// Task to overwrite the minified file with source code
          files: [
          { expand: true, cwd: 'app/partials', src: ['dashboards.html'], dest: 'dist/partials/' },
	  { expand: true, cwd: 'dist/js' , src:['main.js','app.js','directives.js','globals.js','rulesAndAlerts/directives.js','workbench/controllers.js','workbench/services.js'],dest: 'dist/js/',rename: function(dest,src){
		return dest + src.replace('.js','.ver<%= pkg.version %>.js');
	  },
		
         },

	{ expand: true, cwd: 'dist/css' , src:['main.css'],dest: 'dist/css/',rename: function(dest,src){
                return dest + src.replace('.css','.ver<%= pkg.version %>.css');
        },
	},
	{ expand: true, cwd: 'dist/gbtour' , src:['controllers.js','lib/tour.js'],dest: 'dist/gbtour/',rename: function(dest,src){
                return dest + src.replace('.js','.ver<%= pkg.version %>.js');
        },
        },
	{ expand: true, cwd: 'dist/admin' , src:['js/main.js','js/admin/apps.js','js/admin/global.js'],dest: 'dist/admin/',rename: function(dest,src){
                return dest + src.replace('.js','.ver<%= pkg.version %>.js');
        },
        },
	
	{ expand: true, cwd: 'dist/logstatus' , src:['js/app.js','js/globals.js','js/filter.js','js/logstatusDirective.js','js/services.js','js/controller.js'],dest: 'dist/logstatus/',rename: function(dest,src){
                return dest + src.replace('.js','.ver<%= pkg.version %>.js');
        },
        },
	
	{ expand: true, cwd: 'dist/logstatus' , src:['css/style.css'],dest: 'dist/logstatus/',rename: function(dest,src){
                return dest + src.replace('.css','.ver<%= pkg.version %>.css');
        },
        },
	
	 { expand: true, cwd: 'dist/admin' , src:['css/admin/style.css'],dest: 'dist/admin/',rename: function(dest,src){
                return dest + src.replace('.css','.ver<%= pkg.version %>.css');
        },
        },
	{ expand: true, cwd: 'dist/gbtour' , src:['controllers.js'],dest: 'dist/gbtour/',rename: function(dest,src){
                return dest + src.replace('.js','.ver<%= pkg.version %>.js');
        },
        },


		
        ],
	}
    },
       

  });

/* Load the below grunt modules to perform tasks defined */
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-replacer');
  // grunt.loadNpmTasks('grunt-string-replace');
/* execute all the tasks defined below in order of placement */
  grunt.registerTask('default', ['clean:start','copy:main','useminPrepare','concat','uglify','cssmin','usemin','imagemin','htmlmin','usebanner','copy:copy_single','replacer','clean:end']);


};
