var AutoHide = function(element, hideAfter, delayOn, debug)
{	
	this.hideAfter = hideAfter;
	this.element = element;
	this.timeout = null;
	this.debug = debug;
	
	this.showInput = function() {
		if(this.debug)
			console.log("AutoHide[" + element.attr("id") + "].showInput()");
		element.removeClass("hidden");
		element.focus();
		this.autoHide();
	};	
	
	this.hideInput = function() {			
		if(this.debug)
			console.log("AutoHide[" + element.attr("id") + "].hideInput()");
		element.addClass("hidden");
	};
	
	this.autoHide = function() {
		if(this.debug)
			console.log("AutoHide[" + element.attr("id") + "].autoHide()");
		if(this.timeout)
			return;
		this.timeout = setTimeout(function(a) {
			return function() {
				a.hideInput();
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