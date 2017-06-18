var UI = function() {
	
	this.populateMenu = function()
	{
		$("#menu_categories li").remove();
		
		this.categories = app.getCategories();
		
		var element;
		for(var c in categories)
		{
			console.log(categories[c]);
			if(categories[c].active)
			{
				element = $("\
					<li class='selectable'><label key='" + categories[c].key + "'/>\
						<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1.5em' height='1em' viewBox='0 0 150 100' class='image selected'>\
							<use xlink:href='#img_filter_active'/>\
						</svg>\
						<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1.5em' height='1em' viewBox='0 0 150 100' class='image not_selected'>\
							<use xlink:href='#img_filter_inactive'/>\
						</svg>\
					</li>");
				if(categories[c].selected)
					element.addClass("selected");
				element.click(function(ui, i, e) {
					return function(event) {
						ui.categories[i].selected = !ui.categories[i].selected;						
						if(ui.categories[i].selected)
							e.addClass("selected");
						else
							e.removeClass("selected");
					};
				}(this, c, element));
				$("#menu_categories_list").append(element);
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
		$("menu_categories").click(function(event) {});
		$("menu_profiles").click(function(event) {});
		$("menu_settings").click(function(event) {});
		$("#menu_exit").click(function(event) { app.exit(); });
		
		/* update locale dependent labels */
		this.labelManager = new LabelManager(app, app.getString);
		this.labelManager.updateLabels(document);
		
	};	
	
	return this;
}();

