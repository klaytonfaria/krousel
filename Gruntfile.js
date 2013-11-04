module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("boilerplate.jquery.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.licenses[0].type %> License\n" +
				" */\n"
		},

		// Compass compile
		compass: {
	    dist: {
	      options: {
	        sassDir: "src/styles/",
	        cssDir: "build/css/",
	        raw: "preferred_syntax = :scss\n"
	      }
	    }
	  },


		// Compress CSS files
		cssmin: {
		  minify: {
		    expand: true,
		    cwd: "build/css/",
		    src: ["*.css", "!*.min.css"],
		    dest: "build/css/",
		    ext: ".min.css"
		  }
		},

		// Concat definitions
		concat: {
			build: {
				src: ["src/jquery.boilerplate.js"],
				dest: "build/jquery.boilerplate.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/jquery.boilerplate.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["build/jquery.boilerplate.js"],
				dest: "build/jquery.boilerplate.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// CoffeeScript compilation
		coffee: {
			compile: {
				files: {
					"build/jquery.boilerplate.js": "src/jquery.boilerplate.coffee"
				}
			}
		},

		// Complexity analysis reports
		plato: {
	    analysis: {
	      files: {
	        "report/output/directory": ["src/**/*.js", "test/**/*.js"],
	      }
	    },
	  },

	  // Watching...
	  watch: {
		  scripts: {
		    files: ["src/scripts/*.js"],
		    tasks: ["jshint"]
		  },
		  css: {
	      files: ["src/styles/*.scss"],
	      tasks: ["compass", "cssmin"],
	    }
		},



	});

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-coffee");
	grunt.loadNpmTasks("grunt-plato");

	grunt.registerTask("default", ["jshint", "concat", "uglify"]);
	grunt.registerTask("travis", ["jshint"]);

};
