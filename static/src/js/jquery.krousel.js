(function ( $, window, document, undefined) {
	"use strict";

	var pluginName = "krousel",
		defaults = {
			initialPage		: 1,		// Initial page
			steps					: 1,		// Total of steps for pagination
			rewind				: true,	// Set pagination as infinite or rewind
			animationTime	: 300,	// Set animation time
			controls: {
				navigation: true,				// <boolean> Enable / disable prev and next controls
				pagination: true		// <boolean> Enable / disable pagination control
			},
			debug: false					// <boolean> Enable / disable console
		};

	function Plugin (element, options) {
		this.element = element;
		this.options = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
		if(this.options.debug) {
			this.showConsoleDetails(this.options);
		}
	}

	/* Navigation ***************************************************************/

	function setActivePage (element, options, eq) {
		element.find(".pagination-item").removeClass("active").eq(eq)
			.addClass("active");
	}

	function navigateTo (element, options, eq, event) {
		if(event) {
			console.log(toString(event.target));
		}
		if (options.rewind) {
			options.properties.currentSlide = eq;

			if (eq > Math.round(options.properties.totalPages)) {
				eq = 1;
				options.properties.currentSlide = eq;
			}
			if (eq <= 0) {
				eq = Math.round(options.properties.totalItems);
				options.properties.currentSlide = eq;
			}
		} else {
			toggleButtonNavigation(element, options, eq);
		}

		var slideWidth = element.find(".krousel-item").width(),
			slideLeftPosition = (eq - 1) * (options.steps * slideWidth),
			totalSlides = element.find(".krousel-item").size(),
			estimateTotalSlides = options.properties.itemsPage * options.properties.totalPages;

		if (eq > (Math.round(options.properties.totalItems))) {
			slideLeftPosition = slideLeftPosition - ((estimateTotalSlides - totalSlides) * slideWidth);
		}
		if (eq <= 1) {
			slideLeftPosition = slideLeftPosition + ((estimateTotalSlides - totalSlides) * slideWidth);
		}


		element.find(".krousel-items").stop().animate({
			left: -slideLeftPosition
		}, options.animationTime);

		// Set active page
		setActivePage (element, options, (eq - 1));
	}


	/* Pagination ***************************************************************/

	function toggleButtonNavigation (element, options, eq) {
		options.properties.currentSlide = eq;
			if (eq > (Math.round(options.properties.totalPages))) {
				element.find(".next .pager-button").addClass("hide");
			} else {
				element.find(".next .pager-button").removeClass("hide");
			}
			if (eq <= 1) {
				element.find(".previous .pager-button").addClass("hide");
			} else {
				element.find(".previous .pager-button").removeClass("hide");
			}
	}

	function createPagination (element, options) {

		options.properties.totalPages = options.properties.totalItems /
			options.properties.itemsPage;

		var totalPages = options.properties.totalPages,
			items = "";

		if (totalPages > 1) {
			element.append("<ul class='pagination'></ul>");
			for (var i = 0; i < totalPages; i++) {
				if (i === 0) {
					items += "<li class='pagination-item first' data-target='" + i +
						"'><a href='#'></a></li>";
				} else if (i === totalPages) {
					items += "<li class='pagination-item last' data-target='" + i +
						"'><a href='#'></a></li>";
				} else {
					items += "<li class='pagination-item' data-target='" + i +
						"'><a href='#'></a></li>";
				}
			}
			element.find(".pagination").append(items);
		}
	}

	function createNavigationControl (element) {
		element.append("<div class='pager previous'><button class='pager-button'>" +
			"&nbsp;</button></div> " +
			"<div class='pager next'><button class='pager-button'>" +
			"&nbsp;</button></div>");
	}

	/* Mount controls ***********************************************************/

	function mountControls (element, options) {
		if (options.controls.navigation) {
			createNavigationControl(element);
		}
		if (options.controls.pagination) {
			createPagination(element, options);
		}
		if (options.controls.pagination || options.controls.navigation) {
			bindControlsEvents (element, options);
		}
	}

	/* Bind events **************************************************************/

	function bindControlsEvents (element, options) {
		// Pagination
		element.find(".pagination-item").click(function(event) {
			var eq = parseInt(this.getAttribute("data-target"), 10) + 1;
			navigateTo (element, options, eq, event);
		});
		// Navigation
		element.find(".pager-button").click(function(event) {
			var eq = options.properties.currentSlide;
			if (this.parentNode.getAttribute("class").indexOf("next") >= 0) {
				navigateTo (element, options, (eq + 1), event);
			}
			if (this.parentNode.getAttribute("class").indexOf("previous") >= 0){
				navigateTo (element, options, (eq - 1)), event;
			}
		});

		window.onresize = function() {
      if (options.properties.itemsPage === 1) {
        options.properties.itemWidth = element
          .find(".krousel-item:eq(0)").width();

        var containerWidth = element.find(".krousel-items").width(),
          itemBacking = -(options.properties.itemWidth - containerWidth) / 2;


        element.find(".krousel-item").width();
        element.find(".krousel-item")
					.children().css("left", itemBacking + "px");
      }
    };

	}


	/* Instantiating plugin *****************************************************/

	Plugin.prototype = {
		init: function () {
			var element = $(this.element),
				options = this.options;

			this.initProperties(element, options); // setting plugin
			mountControls(element, options);
			navigateTo(element, options, options.initialPage); // Setting initial page
		},
		initProperties: function (element, options) {
			console.log(element.find(".krousel-item:eq(0)").width());
			options.properties = {
				currentSlide: options.initialPage,
				totalItems: element.find(".krousel-item").size(),
				itemsPage: (element.width() / element
					.find(".krousel-item:eq(0)").width())
			};
		},
		showConsoleDetails: function (options) {
		// Console output
			if(console) {
				console.group("krousel item");
					console.log("Total Items: ", options.properties.totalItems);
					console.log("Total Pages: ", Math.round(options.properties.totalPages));
					console.log("Seletor: %s", this.element);
					console.log("Element: %o", this.element);
					console.timeEnd("Time to build");
				console.groupEnd("krousel item");
			}
		}
	};

	$.fn[pluginName] = function (options) {
		return this.each(function(i) {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				if(console) { // Initialize timer when plugin initialize
					console.time("Time to build");
				}
				$.data( this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};

})($, window, document);
