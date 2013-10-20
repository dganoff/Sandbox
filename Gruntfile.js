module.exports = function(grunt) {

	"use strict";

	// Configuration:
	var THEME = "sandbox",
		SRC = "./src/",
		DIST = "./dist/",
		SERVER_PORT = "7777";

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			options: {
		    	banner: '/*! <%= pkg.name %> ver. <%= pkg.version %> <%= grunt.template.today("mm-dd-yyyy") %> */\n'
		    },
			dist: {
				files: {
					'dist/js/app.min.js': ['src/js/one.js', 'src/js/two.js']
				}
		    }
		},

		sass: {
			dist: {
				files: [{
					src : ['**/*.scss', '!**/_*.scss'],
		            cwd : 'src/scss',
		            dest : 'dist/css',
		            ext : '.css',
		            expand : true
				}],
				options: {
					style: 'compressed'
				}
			}
		},
		connect: {
			server: {
				options: {
					hostname: 'localhost',
					port: SERVER_PORT,
					base: DIST,
					livereload: true
				}
			}
		},

		watch: {
			options: {
				livereload: true
			},
			scss: {
				files: ['src/scss/**/*.scss'],
				tasks: 'sass'
			},
			css: {
			    files: 'dist/css/*.css'
			},
			scripts: {
				files: ['src/js/*.js'],
				tasks: ['uglify']
			},
			html: {
				files: [SRC + 'templates/**/*.hbs'],
				tasks: ['assemble']
			}
		},

		jshint: {
			files: {
				src: ['src/js/*.js', 'dist/js/*.js']
			}
		},

		assemble: {
			options: {
				flatten: true,
				// assets: "path/to/assets",
        		layoutdir: 'src/templates/layouts',
				layout: 'layout.hbs',
				data: [SRC + "data/*.{json, yml}"],
				partials: ['src/templates/pages/*.hbs', 'src/templates/parts/*.hbs'],
				ext: '.html',
				theme: THEME
			},
			pages: {
				files: {
		        	DIST: ['src/templates/pages/*.hbs']
		        }
			}
		}
	});

	// Load Tasks:
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-newer');

	// Register Tasks:
	grunt.registerTask('default', ['assemble']);
	grunt.registerTask('dev', ['connect', 'watch', 'jshint']);
};
