(function ( $, window, document, undefined ) {
	"use strict";

	var pluginName = "krousel",
		defaults = {
			itemsPage	:   1,		// Total of items for page
			steps			:   1,		// Total of steps for pagination
			initialPage:  1,		// Initial page
			controls: {
				pager: true,			// <boolean> Enable / disable prev and next controls
				pagination: true	// <boolean> Enable / disable pagination control
			}
		};

	function Plugin (element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}
	/* Navigation ***************************************************************/

	function setActivePage (element, eq) {
		element.attr("data-active-page", (eq + 1)).find(".pagination-item")
			.removeClass("active").eq(eq).addClass("active");
	}

	function navigateTo (element, options, eq) {
		var slideWidth = element.find(".krousel-item").width(),
			slideLeftPosition = (eq - 1) * (options.steps * slideWidth);
		element.find(".krousel-wrapper").animate({
			scrollLeft: slideLeftPosition
		});
		// Set active page
		setActivePage (element, (eq - 1));
	}

	/* Pagination ***************************************************************/

	function createPagination (element) {
		var totalItems = element.find("li").size(),
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
			createPagination(element);
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
			var eq = parseInt(element.attr("data-active-page"), 10);
			if (this.parentNode.getAttribute("class").indexOf("next") >= 0) {
				navigateTo (element, options, (eq + 1));
			}
			if (this.parentNode.getAttribute("class").indexOf("previous") >= 0){
				navigateTo (element, options, (eq - 1));
			}
		});
	}


	/* Instantiating plugin *****************************************************/

	Plugin.prototype = {
		init: function () {
			var element = $(this.element),
				options = this.options;
			mountControls(element, options);
			navigateTo(element, options, options.initialPage); // Setting initial page
		}
	};

	$.fn[pluginName] = function ( options ) {
		return this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});
	};
})($, window, document);
