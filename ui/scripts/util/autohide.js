var AutoHide = function(element, hideAfter, delayOn, debug)
{	
	if(typeof(element) == "string")
		element = document.getElementById(element);
	
	this.hideAfter = hideAfter;
	this.element = element;
	this.timeout = null;
	this.debug = debug;
	
	this.show = function() {
		if(this.debug)
			console.log("AutoHide[" + element.id + "].show()");
		element.classList.remove("hidden");
		element.focus();
		this.autoHide();
	};	
	
	this.hide = function() {			
		if(this.debug)
			console.log("AutoHide[" + element.id + "].hide()");
		element.classList.add("hidden");
	};
	
	this.autoHide = function() {
		if(this.debug)
			console.log("AutoHide[" + element.id + "].autoHide()");
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
			console.log("AutoHide[" + element.id + "].cancelAutoHide()");
		if(this.timeout)
		{
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	};	
	
	this.delayAutoHide = function() {
		if(this.debug)
			console.log("AutoHide[" + element.id + "].delayAutoHide()");
		this.cancelAutoHide();
		this.show();
	};			
	
	if(delayOn != null)
	{
		for(var i = 0; i < delayOn.length; i++)
		{
			console.log("add listener for '" + delayOn[i] + "' to " + this.element);
			Events.addEventListener(delayOn[i], Events.wrapEventHandler(this, this.delayAutoHide), this.element);		
		}
	}	
};