var AutoHide = function(element, hideAfter, delayOn, debug)
{	
	this.hideAfter = hideAfter;
	this.element = element;
	this.timeout = null;
	this.debug = debug;
	
	this.show = function() {
		if(this.debug)
			console.log("AutoHide[" + element.attr("id") + "].show()");
		element.removeClass("hidden");
		element.focus();
		this.autoHide();
	};	
	
	this.hide = function() {			
		if(this.debug)
			console.log("AutoHide[" + element.attr("id") + "].hide()");
		element.addClass("hidden");
	};
	
	this.autoHide = function() {
		if(this.debug)
			console.log("AutoHide[" + element.attr("id") + "].autoHide()");
		if(this.timeout)
			return;
		this.timeout = setTimeout(function(a) {
			return function() {
				a.hide();
				a.timeout = null;
			};
		}(this), this.hideAfter);
	};
	
	this.cancelAutoHide = function() {
		if(this.debug)
			console.log("AutoHide[" + element.attr("id") + "].cancelAutoHide()");
		if(this.timeout)
		{
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	};	
	
	this.delayAutoHide = function() {
		if(this.debug)
			console.log("AutoHide[" + element.attr("id") + "].delayAutoHide()");
		this.cancelAutoHide();
		this.autoHide();
	};			
	
	this.element.bind(delayOn, function(a) { return function() { a.delayAutoHide() }; }(this) );
};