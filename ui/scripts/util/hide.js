var Hideable = function(element, visible, debug)
{	
	this.element = element;
	this.visible = visible;
	this.debug = debug;
	
	this.show = function() {
		if(this.debug)
			console.log("Hideable[" + element.attr("id") + "].show()");
		element.removeClass("hidden");
		element.focus();
		this.visible = true;
	};	
	
	this.hide = function() {			
		if(this.debug)
			console.log("Hideable[" + element.attr("id") + "].hide()");
		element.addClass("hidden");
		this.visible = false;
	};
	
	this.toggle = function() {
		if(this.visible)
			this.hide();
		else
			this.show();
	};
	
	if(this.visible)
		this.show();
	else
		this.hide();
};