var UI = function() {
	
	this.populateCategories = function()
	{
		$("#menu_categories li").remove();
		
		this.categories = app.getCategories();
		
		var element;
		for(var c in categories)
		{
			console.log(categories[c]);
			// populate menu
			if(categories[c].favorite)
			{
				element = $("\
					<li class='selectable'><label key='" + categories[c].key + "'/>\
						<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1.5em' height='1em' viewBox='0 0 150 100' class='image active'>\
							<use xlink:href='#img_filter_active'/>\
						</svg>\
						<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1.5em' height='1em' viewBox='0 0 150 100' class='image not_active'>\
							<use xlink:href='#img_filter_inactive'/>\
						</svg>\
					</li>");
				if(categories[c].active)
					element.addClass("active");
				element.click(function(ui, i, e) {
					return function(event) {
						ui.categories[i].active = !ui.categories[i].active;						
						if(ui.categories[i].active)
							e.addClass("active");
						else
							e.removeClass("active");
						app.setCategories(ui.categories);
					};
				}(this, c, element));
				$("#menu_categories_list").append(element);
			}
			
			// populate manage categories	
			{
				element = $("\
					<li class='draggable selectable'><label key='" + categories[c].key + "'/>\
						<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1em' height='1em' viewBox='0 0 100 100' class='image star favorite'>\
							<use xlink:href='#img_star_active'/>\
						</svg>\
						<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1em' height='1em' viewBox='0 0 100 100' class='image star no_favorite'>\
							<use xlink:href='#img_star_inactive'/>\
						</svg>\
						<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1em' height='1em' viewBox='0 0 100 100' class='image up'>\
							<use xlink:href='#img_arrow_up'/>\
						</svg>\
						<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1em' height='1em' viewBox='0 0 100 100' class='image down'>\
							<use xlink:href='#img_arrow_down'/>\
						</svg>\
					</li>");
				if(categories[c].favorite)
					element.addClass("favorite");
				element.children(".star").click(function(ui, i, e) {
					return function(event) {
						console.log("click star");
						ui.categories[i].favorite = !ui.categories[i].favorite;						
						if(ui.categories[i].favorite)
							e.addClass("favorite");
						else
							e.removeClass("favorite");
						app.setCategories(ui.categories);
					};
				}(this, c, element));
				element.children(".up").click(function(ui, i, e) {
					return function(event) {
						console.log("click up");
						if(e.prev().length > 0)
							e.insertBefore(e.prev());
						app.setCategories(ui.categories);
					};
				}(this, c, element));
				element.children(".down").click(function(ui, i, e) {
					return function(event) {
						console.log("click down");
						if(e.next().length > 0)
							e.insertAfter(e.next());
						app.setCategories(ui.categories);
					};
				}(this, c, element));
				
				$("#manage_categories_list").append(element);
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
		this.populateCategories();
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

