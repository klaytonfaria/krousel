(function ( $, window, document, undefined) {
	"use strict";

	var pluginName = "krousel",
		defaults = {
			initialPage		: 1,			// Initial page
			itemsPage			: 1,			// Total of items for page
			steps					: 1,			// Total of steps for pagination
			rewind				: true,		// Set pagination as infinite or rewind
			animationTime	: 300,		// Set animation time
			controls: {
				pager: true,				// <boolean> Enable / disable prev and next controls
				pagination: true		// <boolean> Enable / disable pagination control
			}
		};

	function Plugin (element, options) {
		this.element = element;
		this.options = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.initProperties();
		this.init();
	}

	/* Navigation ***************************************************************/

	function setActivePage (element, options, eq) {
		element.find(".pagination-item").removeClass("active").eq(eq)
			.addClass("active");
	}

	function navigateTo (element, options, eq) {
		if (options.rewind) {
			options.properties.currentSlide = eq;
			if (eq > options.properties.totalItems) {
				eq = 1;
				options.properties.currentSlide = eq;
			}
			if (eq <= 0) {
				eq = options.properties.totalItems;
				options.properties.currentSlide = eq;
			}
		} else {
			options.properties.currentSlide = eq;
			if (eq >= (options.properties.totalItems)) {
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

		var slideWidth = element.find(".krousel-item").width(),
			slideLeftPosition = (eq - 1) * (options.steps * slideWidth);

		element.find(".krousel-items").stop().animate({
			left: -slideLeftPosition
		}, options.animationTime);

		// Set active page
		setActivePage (element, options, (eq - 1));
	}

	/* Pagination ***************************************************************/

	function createPagination (element, options) {
		var totalItems = options.properties.totalItems,
			items = "";
		if (totalItems > 1) {
			element.append("<ul class='pagination'></ul>");
			for (var i = 0; i < totalItems; i++) {
				if (i === 0) {
					items += "<li class='pagination-item first' data-target='" + i +
						"'><a href='#'></a></li>";
				} else if (i === totalItems) {
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

	function createPager (element) {
		element.append("<div class='pager previous'><button class='pager-button'>" +
			"&nbsp;</button></div> " +
			"<div class='pager next'><button class='pager-button'>" +
			"&nbsp;</button></div>");
	}

	/* Mount controls ***********************************************************/

	function mountControls (element, options) {
		if (options.controls.pager) {
			createPager(element);
		}
		if (options.controls.pagination) {
			createPagination(element, options);
		}
		if (options.controls.pagination || options.controls.pager) {
			bindControlsEvents (element, options);
		}
	}

	/* Bind events **************************************************************/
	function bindControlsEvents (element, options) {
		// Pagination
		element.find(".pagination-item").click(function() {
			var eq = parseInt(this.getAttribute("data-target"), 10) + 1;
			navigateTo (element, options, eq);
		});
		// Pager
		element.find(".pager-button").click(function() {
			var eq = options.properties.currentSlide;
			if (this.parentNode.getAttribute("class").indexOf("next") >= 0) {
				navigateTo (element, options, (eq + 1));
			}
			if (this.parentNode.getAttribute("class").indexOf("previous") >= 0){
				navigateTo (element, options, (eq - 1));
			}
		});

		window.onresize = function() {
      if (options.itemsPage === 1) {
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

			mountControls(element, options);
			navigateTo(element, options, options.initialPage); // Setting initial page
		},
		initProperties: function () {
			var element = $(this.element),
				options = this.options;

			options.properties = {
				currentSlide: options.initialPage,
				totalItems: element.find("li").size()
			};
		}
	};

	$.fn[pluginName] = function (options) {
		return this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};

})($, window, document);
