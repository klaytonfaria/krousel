/*global module:false */
module.exports = function(grunt) {
	"use strict";
	// Project configuration.
  var options = grunt.file.readJSON("options.json");

	grunt.initConfig({

		// Compass compile
		compass: {
			dist: {
				options: {
					sassDir: "src/styles/",
					cssDir: "static/build/css/",
					raw: "preferred_syntax = :scss\n"
				}
			}
		},


		// Compress CSS files
		cssmin: {
			minify: {
				expand: true,
				cwd: "static/build/css/",
				src: ["*.css", "!*.min.css"],
				dest: "static/build/css/",
				ext: ".min.css"
			}
		},


		// Lint definitions
		jshint: {
			options: options.jshint,
      files: ["Gruntfile.js", "static/src/js/**/*.js"]
		},

		// Concat definitions
		concat: {
			build: {
				src: ["src/js/jquery.krousel.js"],
        dest: "static/build/js/jquery.krousel.js"
			}
		},

		// Minify definitions
		uglify: {
			uglify: {
				src: ["static/build/js/jquery.krousel.js"],
				dest: "static/build/js/jquery.krousel.min.js"
			}
		},

		// Complexity analysis reports
		plato: {
			analysis: {
				files: {
					"static/report/output/directory": [
						"src/**/*.js",
						"test/**/*.js"
					]
				}
			}
		},

		// Watching...
		watch: {
			styles: {
				files: ["src/styles/*.scss"],
				tasks: [
					"compass",
					"cssmin"
				]
			},
			scripts: {
				files: ["src/js/**/*.js"],
				tasks: [
					"concat",
					"uglify",
					"plato"
				]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-plato");

	// Register tasks
	grunt.registerTask("styles-tasks", ["compass", "cssmin"]);
	grunt.registerTask("scripts-tasks", ["concat", "uglify", "jshint", "plato"]);

};
