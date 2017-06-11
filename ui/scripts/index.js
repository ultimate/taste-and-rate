var UI = function() {
	
	this.initialize = function()
	{
		this.search = new AutoHide($("#search_textfield"), 5000, "keydown keypressed keyup click mousedown mouseup");
		
		this.menu = null;
	};	
	
	return this;
}();

