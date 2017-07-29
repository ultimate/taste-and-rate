var Hideable = function(element, visible, debug)
{	
	if(typeof(element) == "string")
		element = document.getElementById(element);
	
	this.element = element;
	this.visible = visible;
	this.debug = debug;
	
	this.show = function(delay) {	
		if(this.debug)
			console.log("Hideable[" + element.id + "].show(" + (delay ? delay : "") + ")");	
		if(delay > 0)
		{
			setTimeout(function(h) { return function() { h.show(); }; }(this), delay);
			return;
		}
		element.classList.remove("hidden");
		element.focus();
		this.visible = true;
	};	
	
	this.hide = function(delay) {
		if(this.debug)
			console.log("Hideable[" + element.id + "].hide(" + (delay ? delay : "") + ")");			
		if(delay > 0)
		{
			setTimeout(function(h) { return function() { h.hide(); }; }(this), delay);
			return;
		}
		element.classList.add("hidden");
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