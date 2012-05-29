/*
    pO\		
   6  /\
     /OO\
    /OOOO\
  /OOOOOOOO\
 ((OOOOOOOO))
  \:~=++=~:/   
 
ChocolateChip-UI for Zepto
Copyright 2011 Robert Biggs: www.chocolatechip-ui.com
License: BSD
Version: 1.0.1
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
	$.touchEnabled = ('ontouchstart' in window);
	if (!$.touchEnabled) {
		var stylesheet = $('head').find('link[rel=stylesheet]').attr('href');
		var stylesheet1 = stylesheet.replace(/chui\.css/, 'chui.desktop.css');
		$('head').append('<link rel="stylesheet" href="' + stylesheet1 + '">');
	}
});
$.fn.UIHandleTouchState = function(delay) {
	if ($.UIScrollingActive) return;
	delay = delay || 200;
	var $this = $(this);
	if ($.touchEnabled) {
		this.addClass('touched');
		setTimeout(function() {
			$this.removeClass('touched');
		}, delay);
	}
};
$(function() {
	$.app.delegate('uibutton', 'click', function() {
		if ($(this).hasClass('disabled')) {
			return false;
		} else {
			$(this).UIHandleTouchState();
		}
	});
});
$.extend($, {
	UIUuidSeed : function ( seed ) {
		if (seed) {
			return (((1 + Math.random()) * 0x10000) | 0).toString(seed).substring(1);
		} else {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
	},
	AlphaSeed : function ( ) {
		var text = "";
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		text += chars.charAt(Math.floor(Math.random() * chars.length));
		return text;
	},
	UIUuid : function() {
		return ($.AlphaSeed() + $.UIUuidSeed(20) + $.UIUuidSeed() + "-" + $.UIUuidSeed() + "-" + $.UIUuidSeed() + "-" + $.UIUuidSeed() + "-" + $.UIUuidSeed() + $.UIUuidSeed() + $.UIUuidSeed());
	},
	UINavigationHistory : ["#main"],
	UINavigateBack : function() {
		var parent = $.UINavigationHistory[$.UINavigationHistory.length-1];
		$.UINavigationHistory.pop();
		$($.UINavigationHistory[$.UINavigationHistory.length-1])
		.attr('ui-navigation-status', 'current');
		$(parent).attr('ui-navigation-status', 'upcoming');
		if ($.app.attr('ui-kind')==='navigation-with-one-navbar' && $.UINavigationHistory[$.UINavigationHistory.length-1] === '#main') {
			$('navbar > uibutton[ui-implements=back]', $.app).css('display','none');
		}
	},
	UIBackNavigation : function () {
		$.app.delegate("uibutton", "click", function() {
			if ($(this).attr("ui-implements") === "back") {
			   if ($.UINavigationListExits) {
			   	   $.UINavigateBack();
			   }
			}
		});
	},
	
	UINavigateToNextView : function(viewID) {
		$.UINavigationListExits = true;
		$($.UINavigationHistory[$.UINavigationHistory.length-1])
			.attr("ui-navigation-status","traversed");
		$(viewID).attr("ui-navigation-status","current");
		$.UINavigationHistory.push(viewID);
		if ($.app.attr("ui-kind") === "navigation-with-one-navbar") {
			$("navbar uibutton[ui-implements=back]").css("display","block");
		}
	},
	
	resetApp : function ( hard ) {
		if (hard === "hard") {
			window.location.reload(true);
		} else {
			$.views.attr("ui-navigation-status", "upcoming");
			$.main.attr("ui-navigation-status", "current");
			$.UINavigationHistory = ["#main"];
		}
	},
	
	UINavigationListExits : false,
	
	UINavigationEvent : false,
	
	UINavigationEnabled : false,
	
    UINavigationList : function() {
		var navigateList = function(item) {
			try {
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
			} catch(err) {}
		};
        $.app.delegate("tablecell", "click", function() {
            if ($(this).attr("href")) {
            	$.UINavigationListExits = true;
            	var $this = $(this);
            	setTimeout(function() {
            		$this.UIHandleTouchState();
					if ($.UINavigationEvent) {
						return;
					} else {
						$.UINavigationEnabled = true;
						$.UINavigationEvent = false;
						navigateList($this);
						$.UINavigationEvent = true;
					}
				}, 100);
            }
        });
	}
});
$.fn.UIHandleTouchState = function(delay) {
	if ($.UIScrollingActive) return;
	delay = delay || 200;
	var $this = $(this);
	if ($.touchEnabled) {
		$this.addClass('touched');
		setTimeout(function() {
			$this.removeClass('touched');
		}, delay);
	}
};
$(function() {
	if (!$.touchEnabled) {
		var stylesheet = $('head').find('link[rel=stylesheet]').attr('href');
		var stylesheet1 = stylesheet.replace(/chui\.css/, 'chui.desktop.css');
		$('head').append('<link rel="stylesheet" href="' + stylesheet1 + '">');
	}
    $.UIBackNavigation();
    $.UINavigationList();
    $.app.delegate("view","webkitTransitionEnd", function() {
		if (!$("view[ui-navigation-status=current]")[0]) {
			$($.UINavigationHistory[$.UINavigationHistory.length-1])     
                .attr("ui-navigation-status", "current");
            $.UINavigationHistory.pop();
		}
		$.UINavigationEvent = false;
    });    
});

$.extend($, {
	UIScrollers : {},
	UIEnableScrolling : function ( options ) {
		$("scrollpanel").each(function() {
			if ($(this).attr("ui-scroller")) {
				var whichScroller = $(this).attr("ui-scroller");
				$.UIScrollers[whichScroller].refresh();
			} else {
				$(this).attr("ui-scroller", $.UIUuid());
				whichScroller = $(this).attr("ui-scroller");
				$.UIScrollers[whichScroller] = new iScroll(this, options);
			}
		});
	}
});
$(function() {
	$.UIEnableScrolling();
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
$(function() {
	$.app.delegate('uibutton', 'touchstart', function() {
		if ($(this).hasClass('disabled')) {
			return false;
		} else {
			$(this).UIHandleTouchState();
		}
	});
});
$.fn.toggleClassName = function( firstClassName, secondClassName ) {
	if (!$(this).hasClass(firstClassName)) {
	   $(this).addClass(firstClassName);
	   $(this).removeClass(secondClassName);
	} else {
		$(this).removeClass(firstClassName);
		$(this).addClass(secondClassName);
	}
};
$.fn.UIIdentifyChildNodes = function ( ) {
	var kids = $(this).children();
	kids.each(function(idx, kid) {
		$(kid).attr("ui-child-position", idx);
	});
};
$.extend($, {
	UIPaging : function( selector, opts ) {
		var myPager = new iScroll( selector, opts );
		selector = $(selector);
		var stack = selector.find("stack");
		selector.parent().attr("ui-scroller","myPager");
		var panels = stack.children().length;
		var indicatorsWidth = selector.parent().css("width");
		var indicators = '<stack ui-implements="indicators" style="width:"' + indicatorsWidth + ';">';
		for (var i = 0; i < panels; i++) {
			if (i === 0) {
				indicators += '<indicator class="active"></indicator>';
			} else {
				indicators += "<indicator></indicator>";
			}
		}
		indicators += "</stack>";
		// The maximum number of indicators in portrait view is 17.
		selector.parent().parent().append(indicators);
		return this;
	}
});
$(function() {
	if ($("stack[ui-implements=paging]").length > 0) {
		$.UIPaging("stack[ui-implements=paging] > panel", {
			snap: true,
			momentum: false,
			hScrollbar: false,
			onScrollEnd: function () {
				$('stack[ui-implements="indicators"] > indicator.active').removeClass('active');
				$('stack[ui-implements="indicators"] > indicator:nth-child(' + (this.currPageX+1) + ')').addClass('active');
			} 
		});
	}
});
$.fn.UISegmentedPagingControl = function ( ) {
	var segmentedPager = $("segmentedcontrol[ui-implements=segmented-paging]");
	var pagingOrientation = segmentedPager.attr("ui-paging");
	segmentedPager.attr("ui-paged-subview", 0);
	segmentedPager.children().eq(0).addClass("disabled");
	var subviews = $(this).find("subview");
	segmentedPager.attr("ui-pagable-subviews", subviews.length);
	var childPosition = 0;
	subviews.each(function(idx) {
		$(this).attr("ui-navigation-status", "upcoming");
		$(this).attr("ui-child-position", childPosition);
		childPosition++;
		$(this).attr("ui-paging-orient", pagingOrientation);
	});
	subviews.eq(0).attr("ui-navigation-status", "current");
	segmentedPager.delegate("uibutton", "click", function() {
		if ($(this).hasClass("disabled")) {return;}
		var pager = $(this).closest("segmentedcontrol");
		if ($(this)[0].isSameNode($(this)[0].parentNode.firstElementChild)) {
			if (pager.attr("ui-paged-subview") === 1) {
				$(this).addClass("disabled");
				pager.attr("ui-paged-subview", 0);
				subviews[0].attr("ui-navigation-status", "current");
				subviews[1].attr("ui-navigation-status", "upcoming");
			} else {
				subviews.eq(pager.attr("ui-paged-subview") - 1 ).attr( "ui-navigation-status", "current");
				subviews.eq(pager.attr("ui-paged-subview")).attr("ui-navigation-status", "upcoming");
				pager.attr("ui-paged-subview", pager.attr("ui-paged-subview")-1);
				$(this).next().removeClass("disabled");
				if (pager.attr("ui-paged-subview") <= 0) {
					$(this).addClass("disabled");
				}
			}
		} else {
			var pagableSubviews = pager.attr("ui-pagable-subviews");
			var pagedSubview = pager.attr("ui-paged-subview");
			if (pager.attr("ui-paged-subview") == pagableSubviews-1) {
				$(this).addClass("disabled");
			} else {
				$(this).prev().removeClass("disabled");
				subviews.eq(pagedSubview).attr("ui-navigation-status", "traversed");
				subviews.eq(++pagedSubview).attr("ui-navigation-status", "current");
				pager.attr("ui-paged-subview", (pagedSubview));
				if (pager.attr("ui-paged-subview") == pagableSubviews-1) {
					$(this).addClass("disabled");
				}
			}
		}
	});
	return this;
};
$(function() {
	$("body").UISegmentedPagingControl();
});

$.extend($, {
	UIDeletableTableCells : [],
	UIDeleteTableCell : function( options ) {
		/* options = {
			selector: selector,
			editButton: [label1, label2],
			toolbar: toolbar,
			callback: callback
		} */

		var label1;
		if (options.editButton) {
			label1 = options.editButton[0];
		} else {
			label1 = "Edit";
		}
		var label2;
		if (options.editButton) {
			label2 = options.editButton[1];
		} else {
			label2 = "Done";
		}
		var label3;
		if (options.deleteButton) {
			label3 = options.deleteButton;
		} else {
			label3 = "Delete";
		}
		var selector = $(options.selector);
		this.deletionList = [];
		var listEl = $(options.selector);
		var toolbarEl = $(options.toolbar);
		if ((toolbarEl.children().eq(0)[0].nodeName) === "UIBUTTON") {
			toolbarEl.children().eq(0).attr("ui-contains","uibutton");
		}
		var deleteButtonTemp = '<uibutton ui-kind="deletionListDeleteButton" ui-bar-align="left" ui-implements="delete" class="disabled" style="display: none;"><label>' + label3 + '</label></uibutton>';
		var editButtonTemp = '<uibutton ui-kind="deletionListEditButton" ui-bar-align="right"  ui-implements="edit" ui-button-labels="' + label1 + ',' + label2 +  '"><label>' + label1 + '</label></uibutton>';
		toolbarEl.prepend(deleteButtonTemp);
		toolbarEl.append(editButtonTemp);
		var deleteDisclosure = '<deletedisclosure><span>&#x2713</span></deletedisclosure>';
		$(options.selector + " > tablecell").each(function() {
			$(this).prepend(deleteDisclosure);
		});

		listEl.attr("data-deletable-items", 0);
		var UIEditExecution = function() {
		   $(options.toolbar + " > uibutton[ui-implements=edit]").bind("click", function() {			   
		       
		   	   var labels = $(this).attr("ui-button-labels");
		   	   var buttonLabel = $(this).find("label");
			   if (buttonLabel.text() === label1) {
				   $(this).UIToggleButtonLabel(label1, label2);
				   $(this).attr("ui-implements", "done");
				   listEl.addClass("ui-show-delete-disclosures");
				   $(options.toolbar + " uibutton[ui-contains]").hide();
				   $(this).siblings("uibutton[ui-implements='delete']").css("display","-webkit-inline-box");
				   $("tablecell > img", listEl).each(function() {
						$(this).css("-webkit-transform","translate3d(40px, 0, 0)");
				   });
			   } else {
				   $(this).UIToggleButtonLabel(label1, label2);
				   $(this).removeAttr("ui-implements");
				   $(options.toolbar + " uibutton[ui-contains]").show();
				   $(this).siblings("uibutton[ui-implements='delete']").css("display","none");
				   listEl.removeClass("ui-show-delete-disclosures");
				   $("deletedisclosure").each(function() {
					   $(this).removeClass("checked");
					   $(this).closest("tablecell").removeClass("deletable");
				   });
				   $("uibutton[ui-implements=delete]").addClass("disabled");
		   
				   listEl.find("tablecell > img").css("-webkit-transform","translate3d(0, 0, 0)");
			   }
		   });
		};
		var UIDeleteDisclosureSelection = function() {
			$("deletedisclosure").bind("click", function() {
				$(this).toggleClass("checked");
				$(this).closest("tablecell").toggleClass("deletable");
				$("uibutton[ui-implements=delete]").removeClass("disabled");
				if (!$(this).closest("tablecell").hasClass("deletable")) {
					listEl.attr("data-deletable-items", parseInt(listEl.attr("data-deletable-items"), 10) - 1);
					if (parseInt(listEl.attr("data-deletable-items"), 10) === 0) {
						toolbarEl.find("uibutton[ui-implements=delete]").addClass("disabled");
					}
				} else {
					listEl.attr("data-deletable-items", parseInt(listEl.attr("data-deletable-items"), 10) + 1);
				}
			}); 
		};

		var UIDeletionExecution = function() {
		   $("uibutton[ui-implements=delete]").bind("click", function() {
			   if ($(this).hasClass("disabled")) {
				   return;
			   }
			   $(".deletable").each(function() {
				   listEl.data("deletable-items", parseInt(listEl.data("deletable-items"), 10) - 1);
				   $.UIDeletableTableCells.push($(this).id);
				   if (!!options.callback) {
					   options.callback.call($(this), this);
				   }
				   $(this).remove();
				   $.UIDeletableTableCells = [];
				   listEl.attr("data-deletable-items", 0);
			   });
			   $(this).addClass("disabled");
			
			var whichScroller = selector.closest("view").find("scrollpanel").attr("ui-scroller");
			$.UIScrollers[whichScroller].refresh();
		   });
		};
		UIEditExecution();
		UIDeleteDisclosureSelection();
		UIDeletionExecution(); 
	},
	
	UIResetDeletionList : function(node, toolbar) {
		node = $(node);
		toolbar = $(toolbar);
		if (node.hasClass("ui-show-delete-disclosures")) {
			node.attr("data-deletable-items", 0);
			node.find("deletedisclosure").removeClass("checked");
			node.removeClass("ui-show-delete-disclosures");
			var resetLabel = toolbar.find("uibutton[ui-kind=deletionListEditButton]").attr("ui-button-labels");
			resetLabel = resetLabel.split(",");
			resetLabel = resetLabel[0];
			toolbar.find("uibutton[ui-kind=deletionListEditButton] > label").text(resetLabel);
			toolbar.find("uibutton[ui-kind=deletionListEditButton]").attr("ui-implements", "edit");
			toolbar.find("uibutton[ui-kind=deletionListDeleteButton]").css("display", "none");
			toolbar.find("uibutton[ui-kind=deletionListDeleteButton]").toggleClass('disabled');
		}
		node.find('tablecell').removeClass('deletable');
	}
});
$.extend($, {
	/*
		option values:
		selector:
		name: 
		range: {start:, end:, values: }
		step:
		defaultValue:
		buttonClass:
		indicator:
	*/
	UISpinner : function (opts) {
		var spinner = $(opts.selector);
		var defaultValue = null;
		var range = null;
		var step = opts.step;
		if (opts.range.start >= 0) {
			var rangeStart = opts.range.start || "";
			var rangeEnd = opts.range.end || "";
			var tempNum = rangeEnd - rangeStart;
			tempNum++;
			range = [];
			if (step) {
				var mod = ((rangeEnd-rangeStart)/step);
				if (opts.range.start === 0) {
					range.push(0);
				} else {
					range.push(rangeStart);
				}
				for (var i = 1; i < mod; i++) {
					range.push(range[i-1] + step);
				}
				range.push(range[range.length-1] + step);
			} else {
				for (var j = 0; j < tempNum; j++) {
					range.push(rangeStart + j);				
				}
			}
		}
		var icon = (opts.indicator === "plus") ? "<icon class='indicator'></icon>" : "<icon></icon>";
		var buttonClass = opts.buttonClass ? " class='" + opts.buttonClass + "' " : "";
		var decreaseButton = "<uibutton " + buttonClass + "ui-implements='icon'>" + icon + "</uibutton>";
		var increaseButton = "<uibutton " + buttonClass + "ui-implements='icon'>" + icon + "</uibutton>";
		var spinnerTemp = decreaseButton + "<label ui-kind='spinner-label'></label><input type='text'/>" + increaseButton;
		spinner.append(spinnerTemp);
		if (opts.range.values) {
			spinner.data("range-value", opts.range.values.join(","));
		}
		if (!opts.defaultValue) {
			if (!!opts.range.start || opts.range.start === 0) {
				defaultValue = opts.range.start === 0 ? "0": opts.range.start;
			} else if (opts.range.values instanceof Array) {
				defaultValue = opts.range.values[0];
				$("uibutton:first-of-type", opts.selector).addClass("disabled");
			}
		} else {
			defaultValue = opts.defaultValue;
		}
		if (range) {
			spinner.data("range-value", range.join(","));
		}

		$("label[ui-kind=spinner-label]", spinner).text(defaultValue);
		$("input", spinner).value = defaultValue;
		if (opts.namePrefix) {
			var namePrefix = opts.namePrefix + "." + spinner.id;
			$("input", spinner).attr("name", namePrefix);
		} else {
			$("input", spinner).attr("name", spinner.id);
		}

		if (defaultValue === opts.range.start) {
			$("uibutton:first-of-type", spinner).addClass("disabled");
		}
		if (defaultValue == opts.range.end) {
			$("uibutton:last-of-type", spinner).addClass("disabled");
		}
		$("uibutton:first-of-type", opts.selector).bind("click", function(button) {
			$.decreaseSpinnerValue.call(this, opts.selector);
		});
		$("uibutton:last-of-type", opts.selector).bind("click", function(button) {
			$.increaseSpinnerValue.call(this, opts.selector);
		});
	},

	decreaseSpinnerValue : function(selector) {
		var values = $(selector).data("range-value");
		values = values.split(",");
		var defaultValue = $("label", selector).text().trim();
		var idx = values.indexOf(defaultValue);
		if (idx !== -1) {
			$("uibutton:last-of-type", selector).removeClass("disabled");
			$("[ui-kind=spinner-label]", selector).text(values[idx-1]);
			$("input", selector).value = values[idx-1];
			if (idx === 1) {
				$(this).addClass("disabled");
			} 
		}	
	},

	increaseSpinnerValue : function(selector) {
		var values = $(selector).data("range-value");
		values = values.split(",");
		var defaultValue = $("label", selector).text().trim();
		var idx = values.indexOf(defaultValue);
		if (idx !== -1) {
			$("uibutton:first-of-type", selector).removeClass("disabled");
			$("label[ui-kind=spinner-label]", selector).text(values[idx+1]);
			$("input", selector).value = values[idx+1];
			if (idx === values.length-2) {
				$(this).addClass("disabled");
			}
		}
	},
	
	resetSpinner : function(selector) {
		var value = $(selector).data("range-value")
		value = value[0]
		$(selector).find("label").text(value);
		$(selector).find("uibutton").eq(0).addClass("disabled");
		$(selector).find("uibutton").eq(1).removeClass("disabled");
		
	}	
});
$.extend($, {
	UIPopUpIsActive : null,
	UIPopUpIdentifier : null,

	UIPopUp : function( opts ) {
		var id = opts.id || $.UIUuid();
		var title = opts.title || "Alert!";
		var message = opts.message || "";
		var cancelUIButton = opts.cancelUIButton || "Cancel";
		var continueUIButton = opts.continueUIButton || "Continue";
		var callback = opts.callback || function() {};
		var popup = '<popup id=' + id + ' ui-visible-state="hidden">\
			<panel>\
				<toolbar ui-placement="top">\
					<h1>' + title + '</h1>\
				</toolbar>\
				<p>' + message + '</p>\
				<toolbar ui-placement="bottom">\
					<uibutton ui-kind="action" ui-implements="cancel">\
						<label>' + cancelUIButton + '</label>\
					</uibutton>\
					<uibutton ui-kind="action" ui-implements="continue">\
						<label>' + continueUIButton + '</label>\
					</uibutton>\
				</toolbar>\
			</panel>\
		</popup>';
		$.app.append(popup);
		var popupID = "#" + id;
		$.app.UIBlock("0.5");
		var popupBtn = "#" + id + " uibutton";
		$(popupBtn).bind("click", cancelClickPopup = function(e) {
			if ($(this).attr("ui-implements")==="continue") {
				callback.call(callback, this);
			}
			e.preventDefault();
			$.UIClosePopup("#" + id);
		});
		$.UIPopUpIsActive = false;
		$.UIPopUpIdentifier = null;
	} 
});

$.extend($, {
	UIPopUpIsActive : false,
	UIPopUpIdentifier : null,
	UIShowPopUp : function( options ) {
		$.UIPopUp(options);
		$.UIPopUpIsActive = true;
		$.UIPopUpIdentifier = "#" + options.id;
		var screenCover = $("mask");
		screenCover.bind("touchmove", function(e) {
			e.preventDefault();
		});
		$.UIPositionPopUp("#" + options.id);
		screenCover.attr("ui-visible-state", "visible");
		$("#" + options.id).attr("ui-visible-state", "visible");
	},
	UIPositionPopUp : function(selector) {
		$.UIPopUpIsActive = true;
		$.UIPopUpIdentifier = selector;
		var popup = $(selector);
		var pos = {};
		pos.top = ((window.innerHeight /2) + window.pageYOffset) - (popup[0].clientHeight /2);
		pos.left = (window.innerWidth / 2) - (popup[0].clientWidth / 2);
		popup.css(pos); 
	},
	UIRepositionPopupOnOrientationChange : function ( ) {
		$.body.bind("orientationchange", function() {
			if (window.orientation === 90 || window.orientation === -90) {
				if ($.UIPopUpIsActive) {
					$.UIPositionPopUp($.UIPopUpIdentifier);
				}
			} else {
				if ($.UIPopUpIsActive) {
					$.UIPositionPopUp($.UIPopUpIdentifier);
				}
			}
		});
		window.addEventListener("resize", function() {
			if ($.UIPopUpIsActive) {
				$.UIPositionPopUp($.UIPopUpIdentifier);
			}
		}, false);	
	},
	UIClosePopup : function ( selector ) {
		$(selector + " uibutton[ui-implements=cancel]").unbind("click", "cancelClickPopup");
			$(selector + " uibutton[ui-implements=continue]").unbind("click", "cancelTouchPopup");
		$(selector).UIUnblock();
		$(selector).remove();
		$.UIPopUpIdentifier = null;
		$.UIPopUpIsActive = false;
	}
});

$.fn.UIBlock = function ( opacity ) {
	opacity = opacity ? " style='opacity:" + opacity + "'" : "";
	$(this).before("<mask" + opacity + "></mask>");
	return this;
};
$.fn.UIUnblock = function ( ) {
	if ($("mask").length > 0) {
		$("mask").remove();
	}
	return this;
};
$(function() {
	$.UIRepositionPopupOnOrientationChange();
});
$.fn.UISelectionList = function ( callback ) {
	$(this).children().each( function(idx) {
		if (this.nodeName.toLowerCase() === "tablecell") {
			this.insertAdjacentHTML("afterBegin", "<checkmark>&#x2713</checkmark>");
			$(this).bind("click", function() {
				var $this = $(this);
				setTimeout(function() {
					if ($.UIScrollingActive) return;
					$this.siblings().removeClass("selected").removeClass('touched');
					$this.addClass("selected");
					$this.UIHandleTouchState();
					$this.find("input")[0].checked = true; 
					if (callback) {
						callback.call(callback, $this.find("input"));
					}
				}, 150);
			});
		}
	});
	return this;
};
$.fn.UISwitchControl = function (callback) {
	callback = callback || function() { return false; };
	if ($(this)[0].nodeName.toLowerCase()==="switchcontrol") {
		callback.call(callback, this);
		if ($(this).hasClass("off")) {
			$(this).toggleClassName("on", "off");
			$(this).find("input")[0].checked = true;
			$(this).find("thumb").focus();
		} else {
			$(this).toggleClassName("on", "off");
			$(this).find("input")[0].checked = false;
		}
	} else {
		return;
	}
};
$.fn.UIInitSwitchToggling = function() {
	$("switchcontrol", $(this)).each(function(idx) {
		if ($(this).hasClass("on")) {
			$(this).attr("checked","true");
			$(this).find("input[type='checkbox']").attr("checked","true");
		} else {
			$(this).attr("checked","false");
			$(this).find("input[type='checkbox']").attr("checked","false");
		}
		$(this).bind("click", function(e) {
			$(this).parent().css("backgroundImage","none");
			e.preventDefault();
			$(this).UISwitchControl();
		});
	});
	return this;
};
$(function() {
	$.app.UIInitSwitchToggling();
});
$.fn.UICreateSwitchControl = function( opts ) {
	/* opts:
	{
		id : "anID",
		namePrefix : "customer",
		customClass : "specials",
		status : "on",
		kind : "traditional",
		labelValue : ["on","off"],
		value : "$1000",
		callback : function() {console.log('This is great!');},	
	}
	*/
	var id = opts.id;
	var namePrefix = "";
	if (opts.namePrefix) {
		namePrefix = "name='" + opts.namePrefix + "." + opts.id + "'";
	} else {
		namePrefix = "name='" + id + "'";
	}
	var customClass = " ";
	customClass += opts.customClass ? opts.customClass : "";
	var status = opts.status || "off";
	var kind = opts.kind ? " ui-kind='" + opts.kind + "'" : "";
	var label1 = "ON";
	var label2 = "OFF";
	if (opts.kind === "traditional") {
		if (!!opts.labelValue) {
			label1 = opts.labelValue[0];
			label2 = opts.labelValue[1];
		}
	}
	var value = opts.value || "";
	var callback = opts.callback || function() { return false; };
	var label = (opts.kind === "traditional") ? '<label ui-implements="on">'+ label1 + '</label><thumb></thumb><label ui-implements="off">' + label2 + '</label>' : "<thumb></thumb>";
	var uiswitch = '<switchcontrol ' + kind + ' class="' + status + " " + customClass + '" id="' + id + '"' + '>' + label + '<input type="checkbox" ' + namePrefix + ' style="display: none;" value="' + value + '"></switchcontrol>';
	if ($(this).css("position")  !== "absolute") {
		this.css("position: relative;");
	}
	$(this).append(uiswitch);
	var newSwitchID = "#" + id;
	$(newSwitchID).find("input").attr("checked", (status === "on" ? true : false));
	$(newSwitchID).bind("click", function() {
		$(this).UISwitchControl(callback);
	});
};
$.fn.UISegmentedControl = function( container, callback ) {
	var that = $(this);
	var val = 0;
	callback = callback || function(){};
	var buttons = $(this).children();
	var container = $(container);
	if (!$(this).attr('ui-selected-segment')) {
		$(this).attr("ui-selected-segment", "");
	}
	if ($(this).attr("ui-selected-index")) {
		val = $(this).attr("ui-selected-index");
		var seg = this.children().eq(val);
		try {
			seg = seg.attr("id");
			$(this).attr("ui-selected-segment", seg);
			$(this).childred().eq(val).addClass("selected");
		} catch(e) {}
	} else {
		var checkChildNodesForAttr = -1;
		for (var i = 0, len = $(this).children().length; i < len; i++) {
			if ($(this).children().eq(i).hasClass("selected")) {
				$(this).attr("ui-selected-index", i);
			} else {
				checkChildNodesForAttr++;
			}
		}
		if (checkChildNodesForAttr === $(this).children().length-1) {
			$(this).attr("ui-selected-index", 0);
			$(this).children().eq(0).addClass("selected");
		}
	}
	if (container) {
		container = $(container);
		if (val) { 
			container.attr("ui-selected-index", val);
		} else {
			container.attr("ui-selected-index", 0);
		}
		container.children().css("display", "none");
		container.children().eq(val).css("display","block");
		that.attr("ui-segmented-container", ("#" + container.attr("id")));
		var selectedIndex = this.attr("ui-selected-index");
		var whichScroller = $(this).closest("scrollpanel").attr("ui-scroller");
					$.UIScrollers[whichScroller].refresh()
	}

	buttons.each(function() {
		var that = $(this).closest("segmentedcontrol");
		if (!$(this).attr("id")) {
			$(this).attr("id", $.UIUuid());
		}
		if (!that.attr("ui-selected-segment")) {
			if ($(this).hasClass("selected")) {
				that.attr("ui-selected-segment", $(this).attr("id"));
			}
		}
		$(this).bind("click", function() {
			if ($(this).hasClass('disabled')) return false;
			var selectedSegment = that.attr("ui-selected-segment");
			var selectedIndex = that.attr("ui-selected-index");
			var uicp = $(this).attr("ui-child-position");
			var container = null;
			var segmentedcontrol = $(this).closest("segmentedcontrol");
			if (segmentedcontrol.attr("ui-segmented-container")) {
				container = $(segmentedcontrol.attr("ui-segmented-container"));
			}
			var uisi = null;
			if (selectedSegment) {
				uisi = $(this).attr("ui-child-position");
				that.attr("ui-selected-index", uisi);
				var oldSelectedSegment = $(("#" + selectedSegment));
				oldSelectedSegment.removeClass("selected");
				that.attr("ui-selected-segment", $(this).attr("id"));
				$(this).addClass("selected");
				childPosition = $(this).attr("ui-child-position");
				container.attr("ui-selected-index", uicp);
				container.children().eq(selectedIndex).css("display", "none");						
				container.children().eq(uicp).css("display","-webkit-box");
				var whichScroller = $(this).closest("scrollpanel").attr("ui-scroller");
				$.UIScrollers[whichScroller].refresh()
			}
			$(this).addClass("selected");
				callback.call(callback, $(this));
		});
	});
	$(this).UIIdentifyChildNodes();
};
$(function() {	 
	$("segmentedcontrol").each(function(idx) {
		if ($(this).attr("ui-implements") !== "segmented-paging") {
			$(this).UISegmentedControl();
			var whichScroller = $(this).closest("scrollpanel").attr("ui-scroller");
			if (whichScroller) {
				$.UIScrollers[whichScroller].refresh()
			}
		}
	});
});
$.fn.UICreateSegmentedControl = function(opts) {
	var segmentedControl = "<segmentedcontrol";
	if (opts.id) {
		segmentedControl += " id='" + opts.id + "'";
	}
	if (opts.placement) {
		segmentedControl += " ui-bar-align='" + opts.placement + "'";
	}
	if (opts.selectedSegment) {
		segmentedControl += " ui-selected-index='" + opts.selectedSegment + "'";
	} else {
		segmentedControl += " ui-selected-index=''";
	}
	if (opts.container) {
		segmentedControl += " ui-segmented-container='#" + opts.container + "'";
	}
	var segClass = opts.cssClass || "";
	segmentedControl += ">";
	if (opts.numberOfSegments) {
		segments = opts.numberOfSegments;
		var count = 1;
		for (var i = 0; i < segments; i++) {
			segmentedControl += "<uibutton";
			segmentedControl += " id='" + $.UIUuid() + "'";
			segmentedControl += " class='" + segClass[count-1];
			if (opts.selectedSegment) {
				if (opts.selectedSegment === i) {
					segmentedControl += " selected'";
				}
			}
			if (opts.disabledSegment) {
				if (opts.disabledSegment === i) {
					segmentedControl += " disabled'";
				}
			}
			segmentedControl += "'";
	
			segmentedControl += " ui-kind='segmented'";
			if (opts.placementOfIcons) {
				segmentedControl += " ui-icon-alignment='" + opts.placementOfIcons[count-1] + "'";
			}
			segmentedControl += ">";
			if (opts.iconsOfSegments) {
				if (!!opts.iconsOfSegments[i]) {
				segmentedControl += "<icon ui-implements='icon-mask' style='-webkit-mask-box-image: url(icons/" + opts.iconsOfSegments[count-1] +"." + opts.fileExtension[count-1] + ")'  ui-implements='icon-mask'></icon>";
				}
			}
			if (opts.titlesOfSegments) {
				segmentedControl += "<label>" + opts.titlesOfSegments[count-1] + "</label>";
			}
			segmentedControl += "</uibutton>";
			count++;
		}
		segmentedControl += "</segmentedcontrol>";
	}	
	$(this).append(segmentedControl);
};
$.fn.UICreateTabBar = function ( opts ) {
	var id = opts.id || $.UIUuid();
	var imagePath = opts.imagePath || "icons\/";
	var numberOfTabs = opts.numberOfTabs || 1;
	var tabLabels = opts.tabLabels;
	var iconsOfTabs = opts.iconsOfTabs;
	var selectedTab = opts.selectedTab || 0;
	var disabledTab = opts.disabledTab || null;
	var tabbar = "<tabbar ui-selected-tab='" + selectedTab + "'>";
	$(this).attr("ui-tabbar-id", id);
	for (var i = 0; i < numberOfTabs; i++) {
		tabbar += "<uibutton ui-implements='tab' ";
		if (i === selectedTab || i === disabledTab) {
			tabbar += "class='";
			if (i === selectedTab) {
				tabbar += "selected";
			}
			if (i === disabledTab) {
				tabbar += "disabled";
			}
			tabbar += "'";
		}
		tabbar += "><icon style='-webkit-mask-box-image: url(" + imagePath;
		tabbar += iconsOfTabs[i] + ".svg);'></icon>";
		tabbar += "<label>" + tabLabels[i] + "</label></uibutton>";
	}
	tabbar += "</tabbar>";
	$(this).append(tabbar);
	var subviews = $("subview", $(this));
	subviews.eq(selectedTab).addClass("selected");
	this.UITabBar();
};
$.fn.UITabBar = function ( ) {
	var tabs = $("tabbar > uibutton[ui-implements=tab]", $(this));
	$("tabbar", $(this)).UIIdentifyChildNodes();
	var tabbar = $("tabbar", $(this));
	var subviews = $("subview", $(this));
	subviews.addClass("unselected");
	var selectedTab = tabbar.attr("ui-selected-tab") || 0;
	subviews.eq(selectedTab).toggleClassName("unselected","selected");
	tabs.eq(selectedTab).addClass("selected");
	tabs.each(function(idx) {
		$(this).bind("click", function() {
			if ($(this).hasClass("disabled") || $(this).hasClass("selected")) {
				return;
			}
			var whichTab = $(this).closest("tabbar").attr("ui-selected-tab");
			tabs.eq(whichTab).removeClass("selected");
			$(this).addClass("selected");
			subviews.eq(whichTab).removeClass("selected");
			subviews.eq(whichTab).addClass("unselected");
			subviews.eq($(this).attr("ui-child-position")).addClass("selected");
			subviews.eq($(this).attr("ui-child-position")).removeClass("unselected");
			tabbar.attr("ui-selected-tab", $(this).attr("ui-child-position"));
		});
	});
};
$.fn.UITabBarForViews = function ( ) {
	var tabs = $("tabbar > uibutton[ui-implements=tab]", $(this));
	$("tabbar", $(this)).UIIdentifyChildNodes();
	var tabbar = $("tabbar", $(this));
	var views = $("view[ui-implements=tabbar-panel]", $(this));
	views.attr("ui-navigation-status","upcoming");
	var selectedTab = tabbar.attr("ui-selected-tab") || 0;
	views.eq(selectedTab).attr("ui-navigation-status","current");
	tabs.eq(selectedTab).addClass("selected");
	tabs.each(function(idx) {
		$(this).bind("click", function() {
			if ($(this).hasClass("disabled") || $(this).hasClass("selected")) {
				return;
			}
			var whichTab = $(this).closest("tabbar").attr("ui-selected-tab");
			tabs.eq(whichTab).removeClass("selected");
			$(this).addClass("selected");
			views.eq(whichTab).attr("ui-navigation-status", "upcoming");
			views.eq($(this).attr("ui-child-position")).attr("ui-navigation-status", "current");
			tabbar.attr("ui-selected-tab", $(this).attr("ui-child-position"));
		});
	});
};

$.fn.UIActionSheet = function(opts) {
	var that = $(this);
	var actionSheetID = opts.id;
	var actionSheetColor =  opts.color;
	var actionSheetUuid = $.UIUuid();
	var title = "";
	if (opts.title) {
		title = "<p>" + opts.title + "</p>";
	}
	var createActionSheet = function() {
		var actionSheetStr = "<actionsheet id='" + actionSheetID + "' class='hidden' ui-contains='action-buttons'";
		if (actionSheetColor) {
			actionSheetStr += " ui-action-sheet-color='" + actionSheetColor + "'";
		}
		actionSheetStr += "><scrollpanel  ui-scroller='" + actionSheetUuid + "'><panel>";
		actionSheetStr += title;
		var uiButtons = "", uiButtonObj, uiButtonImplements, uiButtonTitle, uiButtonCallback;
		if (!!opts.uiButtons) {
			for (var i = 0, len = opts.uiButtons.length; i < len; i++) {
				uiButtonObj = opts.uiButtons[i];
				uiButtons += "<uibutton ui-kind='action' ";
				uiButtonTitle = uiButtonObj.title;
				uiButtonImplements = uiButtonObj.uiButtonImplements || "";
				uiButtonCallback = uiButtonObj.callback;
				actionSheetID.trim();
				uiButtons += ' ui-implements="' + uiButtonImplements + '" class="stretch" onclick="' + uiButtonCallback + '(\'#' + actionSheetID + '\')"><label>';
				uiButtons += uiButtonTitle;
				uiButtons +=	"</label></uibutton>"	;			
			}
		}
		actionSheetStr += uiButtons + "<uibutton ui-kind='action' ui-implements='cancel' class='stretch' onclick='$.UIHideActionSheet(\"#" + actionSheetID + "\")'><label>Cancel</label></uibutton></panel></scrollpanel></actionsheet>";
		var actionSheet = $(actionSheetStr);
		that.append(actionSheet);
		var scrollpanel = $('#'+actionSheetID).find('scrollpanel')[0];
		$.UIScrollers[actionSheetUuid] = new iScroll(scrollpanel);
	};
	createActionSheet();
	var actionSheetUIButtons = "#" + actionSheetID + " uibutton";
	$(actionSheetUIButtons).bind("click", function() {
		$.UIHideActionSheet();
	});
};
$.extend($, {
	UIShowActionSheet : function(actionSheetID) {
		$.app.data("ui-action-sheet-id", actionSheetID);
		$.app.UIBlock();
		var screenCover = $("mask");
		screenCover.css({width: window.innerWidth, height: window.innerHeight, opacity: ".5"});
		screenCover.attr("ui-visible-state", "visible");
		$(actionSheetID).removeClass("hidden");
		screenCover.bind("touchmove", function(e) {
			e.preventDefault();
		});
		var whichScroller = $(actionSheetID).find("scrollpanel").attr("ui-scroller");
		$.UIScrollers[whichScroller].refresh();
	},
	UIHideActionSheet : function() {
		var actionSheet = $.app.data("ui-action-sheet-id");
		$(actionSheet).addClass("hidden");
		$(actionSheet).UIUnblock();
		$.app.data("ui-action-sheet-id", null);
	},
	UIReadjustActionSheet : function() {
		if ($("actionsheet").length > 0) {
		var actionSheetID = "";
		if ($.app.data("ui-action-sheet-id")) {
			actionSheetID = $.app.data("ui-action-sheet-id");
			$(actionSheetID).css({right: 0, bottom: 0, left: 0});
			if ($.iphone || $.ipod) {
				if ($.standalone) {
					$(actionSheetID).css({right: 0, bottom: 0, left: 0});
				} else {
					if (window.innerWidth > window.innerHeight) {
					$(actionSheetID).css({right: 0, bottom: 0, left: 0, "-webkit-transform": "translate3d(0,70px,0)"});
					} else {
						$(actionSheetID).css({right: 0, bottom: 0, left: 0, "-webkit-transform": "translate3d(0,0,0)"});
					}
				}
			} else {
				$(actionSheetID).css({right: 0, bottom: 0, left: 0});
			}
		}
		$.UIPositionMask();
		}
	}
});
document.addEventListener("orientationchange", function() {
	$.UIReadjustActionSheet();
}, false);

$.fn.UIExpander = function ( opts ) {
	opts = opts || {};
	var status = opts.status || "expanded";
	var title = opts.title || "Open";
	var altTitle = opts.altTitle || "Close";
	var expander = this;
	var panel = $("panel", this);
	var header = "<header><label></label></header>";
	this.prepend(header);
	panel.attr("ui-height", panel.css("height"));
	if (status === "expanded") {
		expander.removeClass("ui-status-collapsed");
		expander.addClass("ui-status-expanded");
		$("label", this).text(altTitle);
		panel.height(panel.attr("ui-height"));
		panel.css(opacity, 1);
	} else {
		$("label", this).text(title);
		panel.css({height: 0, opacity: 0});
		expander.removeClass("ui-status-expanded");
		expander.addClass("ui-status-collapsed");
	}
	$("header", expander).bind("click", function() {
		if (panel.height() === 0) {
			panel.height(panel.attr("ui-height"));
			panel.css("opacity", 1);
			$("label", this).text(altTitle);
			expander.removeClass("ui-status-collapsed");
			expander.addClass("ui-status-expanded");
	
		} else {
			panel.css({height: 0, opacity: 0});
			$("label", this).text(title);
			expander.removeClass("ui-status-expanded");
			expander.addClass("ui-status-collapsed");
		}
	});
};
$.fn.UICalculateNumberOfLines = function () {
	var lineHeight = parseInt($(this).css("line-height"), 10);
	var height = parseInt($(this).css("height"), 10);
	var lineNums = Math.floor(height / lineHeight);
	return lineNums;
};
$.fn.UIParagraphEllipsis = function () {
	var lines = $(this).UICalculateNumberOfLines();
	$(this)[0].style.WebkitLineClamp = lines;
};
$.fn.UIProgressBar = function ( opts ) {
	opts = opts || {};
	var className = opts.className || false;
	var width = opts.width || 100;
	var speed = opts.speed || 5;
	var position = opts.position || "after";
	var margin = opts.margin || "10px auto";
	var bar = "<progressbar";
	if (className) {
		bar += " class='" + className + "'";
	}
	bar += " style='width: " + width + "px;";
	bar += " -webkit-animation-duration: " + speed +"s;";
	bar += " margin: " + margin + ";'";
	bar += "></progressbar>";
	$(this).append(bar);
};
$.fn.UIHideNavBarHeader = function ( ) {
	$(this).css({visibility: "hidden", position: "absolute"});
};
$.fn.UIShowNavBarHeader = function ( ) {
	$(this).css({visibility: "visible", position: "static"});
};
$.extend($, {
	UIAdjustToolBarTitle : function() {
		$("navbar h1").each(function(idx, title) {
			var title = $(title);
			var availableSpace = window.innerWidth - 20;
			var siblingLeftWidth = 0;
			var siblingRightWidth = 0;
			var subtractableWidth = 0;
			siblingLeftWidth = title.prev()[0] ? title.prev().width() : 0;
			siblingRightWidth = title.next()[0] ? title.next().width() : 0;
			if (siblingLeftWidth > siblingRightWidth) {
				subtractableWidth = siblingLeftWidth * 2;
			} else {
				subtractableWidth = siblingRightWidth * 2;
			}
			if((availableSpace - subtractableWidth) < 40) {
				title.css({display: "none"});
			} else {
				title.css({display: "block", width: availableSpace - subtractableWidth - 20});
			}
		});
	}
});
$(function() {
	if ($("splitview").length === 0) {
		$.UIAdjustToolBarTitle();
	}
});
$(document).bind("orientationchange", function() {
	if ($("splitview").length === 0) {
		$.UIAdjustToolBarTitle();
	}
});
$(window).bind("resize", function() {
	if ($("splitview").length === 0) {
		$.UIAdjustToolBarTitle();
	}
});
$.fn.UISetTranstionType = function( transtion ) {
	$(this).attr("ui-transition-type", transtion);
};
$.fn.UIFlipSubview = function ( direction ) {
	var view = $(this).closest("view");
	direction = direction || "left";
	view.UISetTranstionType("flip-" + direction);
	$(this).bind("click", function() {
		switch (direction) {
			case "right":
				view.find("subview:nth-of-type(1)").toggleClassName("flip-right-front-in", "flip-right-front-out");
				view.find("subview:nth-of-type(2)").toggleClassName("flip-right-back-in", "flip-right-back-out");
				break;
			case "left":
				view.find("subview:nth-of-type(1)").toggleClassName("flip-left-front-in","flip-left-front-out");
				view.find("subview:nth-of-type(2)").toggleClassName("flip-left-back-in","flip-left-back-out");
				break;
			case "top":
			view.find("subview:nth-of-type(2)").toggleClassName("flip-top-front-in","flip-top-front-out");
				view.find("subview:nth-of-type(1)").toggleClassName("flip-top-back-in","flip-top-back-out");
				break;
			case "bottom":
				view.find("subview:nth-of-type(2)").toggleClassName("flip-bottom-front-in","flip-bottom-front-out");
				view.find("subview:nth-of-type(1)").toggleClassName("flip-bottom-back-in","flip-bottom-back-out");
				break;
			default:
				view.find("subview:nth-of-type(1)").toggleClassName("flip-right-front-in","flip-right-front-out");
				view.find("subview:nth-of-type(2)").toggleClassName("flip-right-back-in","flip-right-back-out");
		}
	});
};
$.fn.UIPopSubview = function ( ) {
	var view = $(this).closest("view");
	view.UISetTranstionType("pop");
	$(this).bind("click", function() {
		$("subview:nth-of-type(2)", view).toggleClassName("pop-in","pop-out");	
	});
};

$.fn.UIFadeSubview = function ( ) {
	var view = $(this).closest("view");
	view.UISetTranstionType("fade");
	view.attr("ui-transition-type", "fade");
	$(this).bind("click", function() {
		$("subview:nth-of-type(2)", view).toggleClassName("fade-in", "fade-out");
	});
};
$.fn.UISpinSubview = function ( direction ) {
	var view = $(this).closest("view");
	view.UISetTranstionType("spin");
	if (!direction || direction === "left") {
		$(this).UISetTranstionType("left");
		$(this).bind("click", function() {
			$("subview:nth-of-type(2)", view).toggleClassName("spin-left-in", "spin-left-out");
		});
	} else if (direction === "right") {
		$(this).UISetTranstionType("right");
		$(this).bind("click", function() {
			$("subview:nth-of-type(2)", view).toggleClassName("spin-right-in", "spin-right-out");
		});
	} else {
		$(this).UISetTranstionType("left");
		$(this).bind("click", function() {
			$("subview:nth-of-type(2)", view).toggleClassName("spin-left-in", "spin-left-out");
		});
	}
};

$(function() {
	if ($("rootview").length === 0) {
		return;
	}
	$.extend($, {
		UICancelSplitViewToggle : function () {
			$.body.addClass("SplitViewFixed");
		},
		UISplitViewScroller1 : null,
		UISplitViewScroller2 : null,
		rootview : $("rootview"),
		resizeEvt : ('onorientationchange' in window ? 'orientationchange' : 'resize'),
		UISplitView : function ( ) {	
			if ($.body.hasClass("SplitViewFixed")) {
				return;
			}
			$.UISplitViewScroller1 = new iScroll('#scroller1 > scrollpanel');
			$.UISplitViewScroller2 = new iScroll('#scroller2 > scrollpanel');		
			var buttonLabel = $("rootview > panel > view[ui-navigation-status=current] > navbar").text();
			$("detailview > navbar").append("<uibutton id ='showRootView'  class='navigation' ui-bar-align='left'>"
			+ buttonLabel + "</uibutton>");
			if (window.innerWidth > window.innerHeight) {
				$.body.addClass("landscape");
				$.body.removeClass("portrait");
				$.rootview.css({display: "block", height: "100%", "margin-bottom": "1px"});
				$("#scroller1").css({overflow: "hidden", height: ($.rootview[0].innerHeight - 45)});
			} else {
				$.body.addClass("portrait");
				$.body.removeClass("landscape");
				$.rootview.css({display: "none", height: (window.innerHeight - 100)});
				$("#scroller1").css({overflow: "hidden", height:(window.innerHeight - 155)});
			}
			$("detailview navbar h1").text($("tableview[ui-implements=detail-menu] > tablecell").eq(0).text());
		},

		UISetSplitviewOrientation : function() {
			if ($.body.hasClass("SplitViewFixed")) {
				return;
			}
			if ($.resizeEvt) {
				if (window.innerWidth > window.innerHeight) {
					$.body.addClass("landscape");
					$.body.removeClass("portrait");
					$.rootview.css({display: "block", height: "100%", "margin-bottom": "1px"});
					$("#scroller1").css({overflow: "hidden", height: "100%"});
					$.app.UIUnblock();
				} else {
					$.app.UIUnblock();
					$.body.addClass("portrait");
					$.body.removeClass("landscape");
					$.rootview.css({display: "none", height: (window.innerHeight - 100)});
					$("#scroller1").css({overflow: "hidden", height:(window.innerHeight - 155)});
				}
				$.UIEnableScrolling();
			}
		},

		UIToggleRootView : function() {
			if ($.body.hasClass("SplitViewFixed")) {
				return;
			}
			if ($.rootview.css("display") === "none") {
				$.rootview.css("display", "block");
				$.app.UIBlock(".01");
				$.UISplitViewScroller1.refresh();
				$.UISplitViewScroller2.refresh();
			} else {
				$.rootview.css("display","none");
				$.app.UIUnblock();
				$.UISplitViewScroller1.refresh();
				$.UISplitViewScroller2.refresh();
			}
		},

		UICheckForSplitView : function ( ) {
			if ($.body.hasClass("SplitViewFixed")) {
				return;
			}
			if ($("splitview")) {
				$.UISplitView();
				$("#showRootView").bind("click", function() {
					$.UIToggleRootView();
				});
				$.body.bind("orientationchange", function(){
					$.UISetSplitviewOrientation();
				});
				$(window).bind("resize", function() {
					$.UISetSplitviewOrientation();
				});
			}
		},
		UICurrentSplitViewDetail : null
	});
	$.UICheckForSplitView();
	
	if ($("detailview > subview").length > 0) {
		$.UICurrentSplitViewDetail = "#";
		$.UICurrentSplitViewDetail += $("detailview > subview").eq(0).attr("id");
		$("tableview[ui-implements=detail-menu] > tablecell").bind("click", function() {
			var rootview = $(this).closest("rootview");
			if (rootview.css("position") === "absolute") {
				rootview.css("display","none");
				$.app.UIUnblock();
			} 
			var uiHref = $(this).attr("ui-href");
			uiHref = "#" + uiHref;
			if (uiHref === $.UICurrentSplitViewDetail) {
				return;
			} else {
				$($.UICurrentSplitViewDetail).css("display","none");
				$(uiHref).css("display","block");
				$.UICurrentSplitViewDetail = uiHref;
				$("detailview navbar h1").text($(this).text());
				$.UIEnableScrolling();
			}
		});
		$.app.delegate("mask", "click", function() {
			$.rootview.css("display","none");
			$.app.UIUnblock();
		});
	}
});

$(function() {
	$.app.delegate("mask", "click", function() {
		if ($.UIPopover.activePopover) {
			$.UIPopover.hide($("#"+$.UIPopover.activePopover));
			if ($("mask")) {
				$("mask").UIUnblock();
			}
		}
		if ($.rooview && $.rootview.css("position") === "absolute") {
			$.rootview.style.display = "none";
			$.rootview.UIUnblock();
		}
	});
});
$.fn.UIBlock = function ( opacity ) {
	opacity = opacity ? " style='opacity:" + opacity + "'" : "";
	$(this).prepend("<mask" + opacity + "></mask>");
};
$.fn.UIUnblock = function ( ) {
	if ($("mask").length > 0) {
		$("mask").remove();
	}
};
$.extend({
	UIPositionMask : function() {
		if ($("mask").length > 0) {
			$("mask").css({"height": + (window.innerHeight + window.pageYOffset), width : + window.innerWidth});
		}
	}
});
$.extend($, {
	determineMaxPopoverHeight : function() {
		var screenHeight = window.innerHeight;
		var toolbarHeight;
		if ($("navbar").length > 0) {
			toolbarHeight = $("navbar")[0].clientHeight;
		}
		if ($("toolbar").length > 0) {
			if (!$("toolbar").attr('ui-placement')) {
				toolbarHeight = $("toolbar")[0].clientHeight;
			}
		}
			screenHeight = screenHeight - toolbarHeight;
			return screenHeight; 
	},
	determinePopoverWidth : function() {
		var screenWidth = window.innerWidth;
	},
	adjustPopoverHeight : function( popover ) {
		var availableVerticalSpace = $.determineMaxPopoverHeight();
		$(popover + " > section").css({"max-height": (availableVerticalSpace - 100), overflow: "hidden"});
		var popoverID = popover.split("#");
		popoverID = popoverID[1];
	},
	determinePopoverPosition : function( triggerElement, popoverOrientation, pointerOrientation ) {

		popoverOrientation = popoverOrientation.toLowerCase();
		pointerOrientation = pointerOrientation.toLowerCase();
		var trigEl = $(triggerElement);
		var pos = "";
		var popoverPos = null;
		var offset = trigEl.offset();
		switch (popoverOrientation) {
			case "top" : 
				if (pointerOrientation === "left") {
					popoverPos = offset.left;
					popoverPos = "left: " + popoverPos;
				} else if (pointerOrientation === "center") {
					popoverPos = (offset.left + (trigEl[0].offsetWidth/2) - 160);
					popoverPos = "left: " + popoverPos;
				} else {
					popoverPos = (offset.left + trigEl[0].offsetWidth) - 320;
					popoverPos = "left: " + popoverPos;
				}
				pos = trigEl[0].offsetTop + trigEl[0].offsetHeight;
				pos += 20;
				pos =  popoverPos + "px; top: " + pos + "px;";
				break;
			case "right" :
				if (pointerOrientation === "top") {
					popoverPos = offset.top + 2;
					popoverPos = "top: " + popoverPos + "px;";
				} else if (pointerOrientation === "center") {
					popoverPos = (offset.top - (trigEl[0].offsetHeight/2) - 20);
					popoverPos = "top: " + popoverPos + "px;";
				} else {
					popoverPos = offset.top - trigEl[0].offsetHeight - 20;
					popoverPos = "top: " + popoverPos + "px;";
				}
				pos = offset.left - 330;
				pos -= 20;
				pos = popoverPos + " left: " + pos + "px";
				break;
			case "bottom" :
				if (pointerOrientation === "left") {
					popoverPos = offset.left;
					popoverPos = "left: " + popoverPos;
				} else if (pointerOrientation === "center") {
					popoverPos = (offset.left + (trigEl[0].offsetWidth/2) - 160);
					popoverPos = "left: " + popoverPos;
				} else {
					popoverPos = (offset.left + trigEl[0].offsetWidth) - 320;
					popoverPos = "left: " + popoverPos;
				}
				pos = trigEl[0].offsetTop + trigEl[0].offsetHeight;
				pos += 20;
				pos =  popoverPos + "px; bottom: " + pos + "px;";
				break;
				break;
			case "left" :
				if (pointerOrientation === "top") {
					popoverPos = offset.top + 2;
					popoverPos = "top: " + popoverPos + "px;";
				} else if (pointerOrientation === "center") {
					popoverPos = (offset.top - (trigEl[0].offsetHeight/2) - 20);
					popoverPos = "top: " + popoverPos + "px;";
				} else {
					popoverPos = offset.top - trigEl[0].offsetHeight - 20;
					popoverPos = "top: " + popoverPos + "px;";
				}
				pos = offset.left + trigEl[0].offsetWidth;
				pos += 20;
				pos = popoverPos + " left: " + pos + "px";
				break;
			default :
				pos = offset.top + trigEl[0].offsetHeight;
				popoverPos = "left: " + popoverPos;
				pos += 20;
				pos = popoverPos + "px; top: " + pos + "px;";
				break;
		}
		return pos;
	},
	UIPopover : function( opts ) {
		var title;
		var triggerElement = opts.triggerElement;
		var popoverOrientation = opts.popoverOrientation;
		var pointerOrientation = opts.pointerOrientation;
		var popoverID;
		if (opts) { 
			popoverID = 'id="' + opts.id + '"' || $.UIUuid();
			title = '<h3>'+ opts.title + '</h3>' || "";
		} else {
			popoverID = "";
			title = "";
		}
		var trigEl = $(triggerElement);
		var pos = this.determinePopoverPosition(triggerElement, popoverOrientation, pointerOrientation);
		pos = " style='" + pos + "'";
		var popoverShell = 
			'<popover ' + popoverID + ' ui-pointer-position="' + popoverOrientation + '-' + pointerOrientation + '"' 
			+ pos + ' data-popover-trigger="#' + trigEl.attr("id") + '" data-popover-orientation="' + popoverOrientation + '" data-popover-pointer-orientation="' + pointerOrientation + '">\n' + 
				'<header>'+ title 
		
				+ '</header>\n'
				+ '<section><scrollpanel class="popover-content"></scrollpanel></section>\n'
			+'</popover>';
		var newPopover = $(popoverShell);
		$.app.append(newPopover);
		// Adjust the left or bottom position of the popover if it is beyond the viewport:
		if (!!opts.id) {
			$.adjustPopoverHeight("#" + opts.id);
			$("#" + opts.id).adjustPopoverPosition();
		}
	},
	UICancelPopover : function (popover) {
		$.UIHidePopover(popover);
	},
	UIHidePopover : function (popover) {
		$.UIPopover.activePopover = null;
		$(popover).css("opacity: 0; -webkit-transform: scale(0);");
		popover.UIUnblock();
	},
	UIEnablePopoverScrollpanels : function ( options ) {
		try {
			var count = 0;
			$("popover scrollpanel").each(function(idx, item) {
				item.attr("ui-scroller", $.UIUuid());
				var whichScroller = item.attr("ui-scroller");
				$.UIScrollers[whichScroller] = new iScroll(item.parentNode);
			});
		} catch(e) { }
	}
});
$.fn.UIScroll = function() {
	var scrollpanel = $(this).find("section");
	if (scrollpanel.data("ui-scroller")) {
		scrollpanel.data("ui-scroller").refresh();
	} else {
		scrollpanel[0]
		var scroller = new iScroll(scrollpanel[0],{vScrollbar:false});
		scrollpanel.data("ui-scroller", scroller);
	}
};
$.extend($.UIPopover, {
	activePopover : null,
	show : function ( popover ) {
		if ($.UIPopover.activePopover === null) {
			$.app.UIBlock(".01");
			popover.repositionPopover();
			popover.css({"opacity": 1, "-webkit-transform": "scale(1)", "overflow":"visible"});
			$.UIPopover.activePopover = popover.attr("id");
	
			popover.UIScroll();
		} else {
			return;
		}
		$.UIEnablePopoverScrollpanels({ desktopCompatibility: true });
			$("popover").css({"overflow":"visible"});
	},
	hide : function ( popover ) {
		if ($.UIPopover.activePopover) {
			popover.css({"opacity": 0, "-webkit-transform": "scale(0)", "overflow":"visible"});
			$.UIPopover.activePopover = null;
		}
	}
});
$.fn.repositionPopover = function() {
	var triggerElement = $(this).attr("data-popover-trigger"); 
	var popoverOrientation = $(this).attr("data-popover-orientation");
	var pointerOrientation = $(this).attr("data-popover-pointer-orientation");
	var popoverPos = $.determinePopoverPosition(triggerElement, popoverOrientation, pointerOrientation);
	$(this)[0].style.cssText += popoverPos;
};
$.fn.adjustPopoverPosition = function() {
	var screenHeight = window.innerHeight;
	var screenWidth = window.innerWidth;
	var popoverHeight = this.offsetHeight;
	var popoverWidth = this.offsetWidth;
	var offset = $(this).offset();
	var popoverTop = offset.top;
	var popoverLeft = offset.left;
	var bottomLimit = popoverTop + popoverHeight;
	var rightLimit = popoverLeft + popoverWidth;
	if (bottomLimit > screenHeight) {
		this.style.top	= screenHeight - popoverHeight - 10 + "px";
	}
	if (rightLimit > screenWidth) {
		this.style.left = screenWidth - 10 + "px";
	}
};
// Reposition any visible popovers when orientation changes.
$(window).bind("orientationchange", function() {
	var availableVerticalSpace = $.determineMaxPopoverHeight();
	if ($("popover").length > 0) {
		$("popover").each(function(idx, popover) {
			$(popover).find("section").css({"max-height": (availableVerticalSpace - 100)});
			$(popover).repositionPopover();
			$.adjustPopoverHeight("#" + $(popover).attr("id"));
		});
		if ($("rootview").length > 0) {
			$("rootview").UIUnblock();
		}
	}
});

$.extend($, {
	form2JSON : function(rootNode, delimiter) {
		rootNode = typeof rootNode == 'string' ? $(rootNode)[0] : rootNode[0];
		delimiter = delimiter || '.';
		var formValues = getFormValues(rootNode);
		var result = {};
		var arrays = {};
		
		function getFormValues(rootNode) {
			var result = [];
			var currentNode = rootNode.firstChild;
			while (currentNode) {
				if (currentNode.nodeName.match(/INPUT|SELECT|TEXTAREA/i)) {
					result.push({ name: currentNode.name, value: getFieldValue(currentNode)});
				} else {
					var subresult = getFormValues(currentNode);
					result = result.concat(subresult);
				}
				currentNode = currentNode.nextSibling;
			}
			return result;
		}
		function getFieldValue(fieldNode) {
			if (fieldNode.nodeName === 'INPUT') {
				if (fieldNode.type.toLowerCase() === 'radio' || fieldNode.type.toLowerCase() === 'checkbox') {
					if (fieldNode.checked) {
						return fieldNode.value;
					}
				} else {
					if (!fieldNode.type.toLowerCase().match(/button|reset|submit|image/i)) {
						return fieldNode.value;
					}
				}
			} else {
				if (fieldNode.nodeName === 'TEXTAREA') {
					return fieldNode.value;
				} else {
					if (fieldNode.nodeName === 'SELECT') {
						return getSelectedOptionValue(fieldNode);
					}
				}
			}
			return '';
		}
		function getSelectedOptionValue(selectNode) {
			var multiple = selectNode.multiple;
			if (!multiple) {
				return selectNode.value;
			}
			if (selectNode.selectedIndex > -1) {
				var result = [];
				$$("option", selectNode).forEach(function(item) {
					if (item.selected) {
						result.push(item.value);
					}
				});
				return result;
			}
		}	  
		formValues.forEach(function(item) {
			var value = item.value;
			if (value !== '') {
				var name = item.name;
				var nameParts = name.split(delimiter);
				var currResult = result;
				for (var j = 0; j < nameParts.length; j++) {
					var namePart = nameParts[j];
					var arrName;
					if (namePart.indexOf('[]') > -1 && j == nameParts.length - 1) {
						arrName = namePart.substr(0, namePart.indexOf('['));
						if (!currResult[arrName]) currResult[arrName] = [];
						currResult[arrName].push(value);
					} else {
						if (namePart.indexOf('[') > -1) {
							arrName = namePart.substr(0, namePart.indexOf('['));
							var arrIdx = namePart.replace(/^[a-z]+\[|\]$/gi, '');
							if (!arrays[arrName]) {
								arrays[arrName] = {};
							}
							if (!currResult[arrName]) {
								currResult[arrName] = [];
							}
							if (j == nameParts.length - 1) {
								currResult[arrName].push(value);
							} else {
								if (!arrays[arrName][arrIdx]) {
									currResult[arrName].push({});
									arrays[arrName][arrIdx] = 
									currResult[arrName][currResult[arrName].length - 1];
								}
							}
							currResult = arrays[arrName][arrIdx];
						} else {
							if (j < nameParts.length - 1) { 
								if (!currResult[namePart]) {
									currResult[namePart] = {};
								}
								currResult = currResult[namePart];
							} else {
								currResult[namePart] = value;
							}
						}
					}
				}
			}
		});
		return result;
	}		
});
$.extend($, {
	templates : {},
	 
	template : function(str, data) {
		if ($.ajaxStatus === null || $.ajaxStatus === false) {
			return data;
		}
		if ($.templates[str]) {
			str = $.templates[str];
		} else {
			str = str;
		}
		var tmpl = 'var p=[],print=function(){p.push.apply(p,arguments);};with(obj||{}){p.push(\''; 
		var regex1; 
		var regex2;
		if (/\{\{/.test(str) || (/$\{/).test(str)) {
			regex1 = /\$\{([\s\S]+?)\}/g;
			regex2 = /\{\{([\s\S]+?)\}\}/g;
		} else if (/\[\[/.test(str) || (/$\[/).test(str)) {
			regex1 = /\$\[([\s\S]+?)\]/g;
			regex2 = /\[\[([\s\S]+?)\]\]/g;
		} else if (/<%=/.test(str) || (/<%/).test(str)) {
			regex1 = /<%=([\s\S]+?)%>/g;
			regex2 = /<%([\s\S]+?)%>/g;
		}	
		tmpl +=
		  str.replace(/\\/g, '\\\\')
			 .replace(/'/g, "\\'")
			 .replace(regex1, function(match, code) {
				return "'," + code.replace(/\\'/g, "'") + ",'";
			 })
			 .replace(regex2 || null, function(match, code) {
				return "');" + code.replace(/\\'/g, "'")
				.replace(/[\r\n\t]/g, ' ') + "p.push('";
			 })
			 .replace(/\r/g, '\\r')
			 .replace(/\n/g, '\\n')
			 .replace(/\t/g, '\\t') + "');} return p.join('');";
		var fn = new Function('obj', tmpl);
		return data ? fn(data) : fn;
	}
});