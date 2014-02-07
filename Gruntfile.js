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
		    	banner: '/*! <%= pkg.name %> ver. <%= pkg.version %> <%= grunt.template.today("mm-dd-yyyy, h:MM:ss TT") %> */\n'
		    },
			dist: {
				files: {
					'dist/js/app.min.js': [
						SRC + 'js/*.js'
					]
				}
		    }
		},

		copy: {
			fonts: {
				files: [
					{
						expand: true,
						src: [SRC + 'bower-components/font-awesome/font/*'], // apparently required for latest version of jQuery from bower
						flatten: true,
						dest: DIST + 'font'
					}
				]
			}
		},

		sass: {
			dist: {
				files: [{
					src : ['**/*.scss', '!**/_*.scss'],
		            cwd : 'src/scss',
		            dest : DIST + 'css',
		            ext : '.css',
		            expand : true
				}],
				options: {
					style: 'expanded'
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
				files: [SRC + 'scss/**/*.scss'],
				tasks: 'sass'
			},
			css: {
			    files: DIST + 'css/*.css'
			},
			scripts: {
				files: [SRC + 'js/*.js'],
				tasks: ['uglify', 'jshint']
			},
			html: {
				files: [SRC + 'templates/**/*.hbs', SRC + 'data/*.{json, yml}'],
				tasks: ['clean', 'assemble', 'htmlhint']
			}
		},

		jshint: {
			files: {
				src: [SRC + 'js/**/*.js']
			}
		},

		htmlhint: {
			build: {
				options: {
					'tag-pair': true,
					'tagname-lowercase': true,
					'attr-lowercase': true,
					'attr-value-double-quotes': true,
					'doctype-first': true,
					'spec-char-escape': true,
					'id-unique': true,
					'head-script-disabled': true,
					'style-disabled': true
				},
				src: [DIST + '**/*.html']
			}
		},

		clean: {
			build: [
				DIST + '**/*.html'
			]
		},

		assemble: {
			options: {
				flatten: true,
				// assets: "path/to/assets",
        		layoutdir: SRC + 'templates/layouts',
				layout: 'layout.hbs',
				data: [SRC + "data/*.{json, yml}"],
				partials: [
					SRC + 'templates/pages/*.hbs',
					SRC + 'templates/parts/*.hbs'
				]
			},
			pages: {
				files: {
		        	'dist': ['src/templates/pages/{,*/}*.hbs']
		        }
			}
		}
	});

	// Load Tasks:
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
	grunt.loadNpmTasks('assemble');

	// Register Tasks:
	grunt.registerTask('default', ['connect', 'watch']);
	grunt.registerTask('build', ['copy', 'sass', 'uglify', 'jshint', 'assemble', 'htmlhint']);
};
