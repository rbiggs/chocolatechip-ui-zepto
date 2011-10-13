/*$.fn.CHUIVersion = "1.0";
	
$.fn.UIExpectedjQueryVersion = "1.6.4"; 

var UICheckChocolateChipJSVersion = function() {
	if ($.fn.jquery !== $.fn.UIExpectedjQueryVersion) {
		console.error("This version of ChocolateChip-UI requries jQuery version " + $.fn.UIExpectedjQueryVersion + "!");
		console.error("The version of jQuery which you are using is: " + $.fn.jquery);
	}
};
UICheckChocolateChipJSVersion();
*/
$(function() {
	$.body = $("body");
	$.app = $("app");
	$.main = $("#main");
	$.views = $("view");
	$.tablet = window.innerWidth > 600;
	$(window).bind("resize", function() {
		$.tablet = window.innerWidth > 600;
	});
});
$.extend($, {
	UINavigationHistory : ["#main"],
	UINavigateBack : function() {
		$($.UINavigationHistory[$.UINavigationHistory.length-1]).attr( "ui-navigation-status", "upcoming");
		$.UINavigationHistory.pop();
		$($.UINavigationHistory[$.UINavigationHistory.length-1])
		.attr("ui-navigation-status", "current");
		if ($.app.attr("ui-kind")==="navigation-with-one-navbar" && $.UINavigationHistory[$.UINavigationHistory.length-1] === "#main") {
			$("navbar > uibutton[ui-implements=back]", $.app).css("display","none");
		}
	},
	UIBackNavigation : function () {
		$.app.delegate("uibutton", "click", function() {
			if ($(this).attr("ui-implements") === "back") {
			   $.UINavigateBack();
			}
		});
	},
	
	UINavigationEvent : false,
	
    UINavigationList : function() {
		var navigateList = function(item) {
			if ($.app.attr("ui-kind")==="navigation-with-one-navbar") {
				$.app.find("navbar > uibutton[ui-implements=back]").css("display", "block");
			}
			$(item.attr("href")).attr("ui-navigation-status", "current");
			$($.UINavigationHistory[$.UINavigationHistory.length-1])
				.attr("ui-navigation-status", "traversed");
			if ($.main.attr("ui-navigation-status") !== "traversed") {
				$.main.attr("ui-navigation-status", "traversed");
			}
			$.UINavigationHistory.push(item.attr("href"));
		};
        $.app.delegate("tablecell", "click", function() {
            if ($(this).attr("href")) {
	            if ($.UINavigationEvent) {
	                return;
	            } else {
					$.UINavigationEvent = false;
	                navigateList($(this));
					$.UINavigationEvent = true;
	            }
            }
        });
	        $.app.delegate("tablecell", "touchStart", function() {
	            if ($(this).attr("href")) {
		            if ($.UINavigationEvent) {
		                return;
		            } else {
						$.UINavigationEvent = false;
		                navigateList($(this));
						$.UINavigationEvent = true;
		            }
	            }
	        });
	}
});
$(function() {
    $.UIBackNavigation();
    $.UINavigationList();
    $.app.delegate("view","webkitTransitionEnd", function() {
		//if (!document.querySelector("view[ui-navigation-status=current]")) {
		if (!$("view[ui-navigation-status=current]")[0]) {
			$($.UINavigationHistory[$.UINavigationHistory.length-1])     
                .attr("ui-navigation-status", "current");
            $.UINavigationHistory.pop();
		}
		$.UINavigationEvent = false;
    });    
});

$.fn.UIToggleButtonLabel = function ( label1, label2 ) {
	return this.each(function(){
    	var $this = $(this);
		if ($this.find("label").text() === label1) {
			$this.find("label").text(label2);
		} else {
			$this.find("label").text(label1);
		}
	});
};
$.extend($, {
	UIEnableScrolling : function ( options ) {
		try {
			$("scrollpanel").each(function() {
				if ($(this).data("ui-scroller")) {
					var whichScroller = $(this).data("ui-scroller");
					whichScroller.refresh();
				} else {
					var scroller = new iScroll($(this)[0].parentNode, options);
					$(this).data("ui-scroller", scroller);
				}
			});
		} catch(e) { }
	}
});
$(function() {
	$.UIEnableScrolling();
});