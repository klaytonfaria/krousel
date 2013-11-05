(function ( $, window, document, undefined ) {
	"use strict";

	var pluginName = "krousel",
		defaults = {
			itemsPage	: 1,			// Total of items for page
			steps			: 1,			// Total of steps for pagination
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

	/* Pagination ***************************************************************/

	function createPagination (element) {
		var totalItems = element.find("li").size(),
			items = "";
		if (totalItems > 1) {
			element.append("<ul class='pagination'></ul>");
			for (var i = 0; i < totalItems; i++) {
				if (i === 0) {
					items += "<li class='pagination-item first'><a href='#'></a></li>";
				} else if (i === totalItems) {
					items += "<li class='pagination-item last'><a href='#'></a></li>";
				} else {
					items += "<li class='pagination-item'><a href='#'></a></li>";
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
		element = $(element);
		if (options.controls.pager) {
			createPager(element);
		}
		if (options.controls.pagination) {
			createPagination(element);
		}
	}


	Plugin.prototype = {
		init: function () {
			mountControls(this.element, this.options);
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
