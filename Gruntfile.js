module.exports = function(grunt) {
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
		compass: {
			dist: {
				options: {
					sassDir: 'src/scss',
					cssDir: 'dist/css',
					outputStyle: 'compressed'
				}
			}
		},
		connect: {
			server: {
				options: {
					hostname: 'localhost',
					port: 7777,
					livereload: true
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			scss: {
				files: ['src/scss/**'],
				tasks: 'compass'
			},
			css: {
			    files: 'dist/css/*.css'
			},
			scripts: {
				files: ['src/js/*.js'],
				tasks: ['uglify']
			},
			html: {
				files: ['*.html']
			}
		},
		jshint: {
			files: {
				src: ['src/js/*.js', 'dist/js/*.js']
			}
		}
	});

	// Load Tasks:
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compass');

	// Register Tasks:
	grunt.registerTask('default', ['uglify']);
	grunt.registerTask('dev', ['connect', 'watch', 'jshint']);
};
