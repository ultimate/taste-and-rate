var AutoHide = function(element, hideAfter, delayOn)
{	
	this.hideAfter = hideAfter;
	this.element = element;
	this.timeout = null;
	
	this.showInput = function() {
		//console.log("AutoHide[" + element.attr("id") + "].showInput()");
		element.removeClass("hidden");
		element.focus();
		this.autoHide();
	};	
	
	this.hideInput = function() {			
		//console.log("AutoHide[" + element.attr("id") + "].hideInput()");
		element.addClass("hidden");
	};
	
	this.autoHide = function() {
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
		console.log("AutoHide[" + element.attr("id") + "].cancelAutoHide()");
		if(this.timeout)
		{
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	};	
	
	this.delayAutoHide = function() {
		console.log("AutoHide[" + element.attr("id") + "].delayAutoHide()");
		this.cancelAutoHide();
		this.autoHide();
	};			
	
	this.element.bind(delayOn, function(a) { return function() { a.delayAutoHide() }; }(this) );
};