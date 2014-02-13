module.exports = function(grunt) {

	"use strict";

	// Display the execution time when tasks are run:
	require('time-grunt')(grunt);

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

		concat: {
			options: {
				separator: ';\n',
			},
			vendor: {
				src: [
					SRC + 'js/vendor/jquery.js',
					SRC + 'js/vendor/foundation.min.js'
				],
				dest: DIST + 'js/vendor.js',
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
			},
			javascript: {
				files: [
					{
						expand: true,
						src: [SRC + 'js/vendor/modernizr.js'],
						flatten: true,
						dest: DIST + 'js'
					}
				]
			}
		},

		imagemin: {
			dynamic: {
				files: [
					{
						expand: true,
						cwd: SRC,
						src: ['img/*.{png,jpg,gif}'],
						dest: DIST
					}
				]
			}
		},

		sass: {
			dist: {
				files: [{
					src : ['**/*.scss', '!**/_*.scss'],
					cwd : SRC + 'scss',
					dest : DIST + 'css',
					ext : '.css',
					expand : true
				}],
				options: {
					style: 'expanded'
				}
			}
		},

		jshint: {
			options: {
				'-W099': true // ignore warning about mixed spaces and tabs
			},
			files: {
				src: [SRC + 'js/*.js']
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
					'style-disabled': true
				},
				src: [DIST + '**/*.html']
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
				tasks: ['jshint', 'uglify']
			},
			html: {
				files: [SRC + 'templates/**/*.html', SRC + 'data/*.{json, yml}'],
				tasks: ['clean', 'assemble', 'htmlhint']
			},
			images: {
				files: [SRC + 'img/*.{png,jpg,gif}'],
				tasks: ['newer:imagemin']
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
				layout: 'layout.html',
				data: [SRC + "data/*.{json, yml}"],
				partials: [
					SRC + 'templates/pages/*.html',
					SRC + 'templates/parts/*.html'
				]
			},
			pages: {
				files: {
					'dist': ['src/templates/pages/{,*/}*.html']
				}
			}
		}
	});

	// Load Tasks:
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
	grunt.loadNpmTasks('assemble');

	// Register Tasks:
	grunt.registerTask('default', ['connect', 'watch']);
	grunt.registerTask('build', [
		'clean',
		'newer:copy',
		'newer:sass',
		'concat',
		'jshint',
		'uglify',
		'assemble', // not newer because we ran clean
		'htmlhint',
		'newer:imagemin'
	]);
};
