var UI = function() {
	
	this.populateMenu = function()
	{
		$("#menu_categories li:not(:last)").remove();
		
		this.categories = app.getCategories();
		
		for(var c in categories)
		{
			console.log(categories[c]);
			if(categories[c].active)
			{
				$("<li><label key='" + categories[c].key + "'/></li>").insertBefore($("#menu_select_categories"));
			}
		}
	};
	
	this.initialize = function()
	{
		this.searchInput = new AutoHide($("#search"), 5000, "keydown keypressed keyup click mousedown mouseup");
		$("#search_button").click(function(event) { UI.searchInput.show(); });
		
		this.menu = new Hideable($("#menu"), false);
		$("#menu_button").click(function(event) { UI.menu.toggle(); event.stopPropagation(); });
		$("#main").click(function(event) { if(!event.isPropagationStopped()) UI.menu.hide(); });
		
		/* initialize menu */
		this.populateMenu();
		
		/* update locale dependent labels */
		this.labelManager = new LabelManager(app, app.getString);
		this.labelManager.updateLabels(document);
		
	};	
	
	return this;
}();

