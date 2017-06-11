var UI = function() {
	
	this.initialize = function()
	{
		this.searchInput = new AutoHide($("#search_textfield"), 5000, "keydown keypressed keyup click mousedown mouseup");
		$("#search_button").click(function(event) { UI.searchInput.show(); });
		
		this.menu = new Hideable($("#menu"), false);
		$("#menu_button").click(function(event) { UI.menu.toggle(); event.stopPropagation(); });
		$("#main").click(function(event) { if(!event.isPropagationStopped()) UI.menu.hide(); });
	};	
	
	return this;
}();

