var UI = function() {
	
	this.constants = {
		CATEGORIES_LIST_LINE_HEIGHT: 2,
	};
	
	this.populateMenu = function()
	{
		$("#menu_categories_list li").remove();
		
		this.categories = app.getCategories();
		
		var element;
		for(var c = 0; c < this.categories.length; c++)
		{
			console.log(this.categories[c]);
			// populate menu
			if(this.categories[c].favorite)
			{
				element = $("\
					<li class='selectable'><label key='" + this.categories[c].category.key + "'/>\
						<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 150 100' class='image active'>\
							<use xlink:href='#img_filter_active'/>\
						</svg>\
						<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 150 100' class='image not_active'>\
							<use xlink:href='#img_filter_inactive'/>\
						</svg>\
					</li>");
				if(this.categories[c].active)
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
		}
		this.labelManager.updateLabels($("#menu_categories_list"));
	};	
	
	this.swapManageCategories = function(element, fromIndex, toIndex)
	{
		console.log("swap " + fromIndex + "->" + toIndex);
		var tmp = this.categories[fromIndex];
		this.categories[fromIndex] = this.categories[toIndex];
		this.categories[toIndex] = tmp
		
		this.categories[fromIndex].position = fromIndex;
		this.categories[toIndex].position = toIndex;
		
		var other = element.siblings(".position" + (toIndex));
		
		other.addClass("position" + fromIndex);
		other.removeClass("position" + toIndex);
		
		element.addClass("position" + toIndex);
		element.removeClass("position" + fromIndex);
		
		// update "first" and "last" tag
		if(fromIndex == 1 && toIndex == 0)
		{
			element.addClass("first");
			other.removeClass("first");
		}
		else if(fromIndex == 0 && toIndex == 1)
		{
			other.addClass("first");
			element.removeClass("first");
		}
		// no else here, in case list length is 2
		if(fromIndex == this.categories.length-1 && toIndex == this.categories.length-2)
		{
			other.addClass("last");
			element.removeClass("last");
		}
		else if(fromIndex == this.categories.length-2 && toIndex == this.categories.length-1)
		{
			element.addClass("last");
			other.removeClass("last");
		}
	};			
	
	this.populateManageCategories = function()
	{
		$("#manage_categories_list li").remove();
		
		this.categories = app.getCategories();
		
		var element;
		for(var c = 0; c < this.categories.length; c++)
		{
		// populate manage categories	
			var posClasses = "position" + this.categories[c].position;
			if(c == 0)
				posClasses += " first";
			else if(c == this.categories.length-1)
				posClasses += " last";
			element = $("\
				<li class='draggable selectable " + posClasses + "'><label key='" + this.categories[c].category.key + "'/>\
					<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 100 100' class='image star favorite'>\
						<use xlink:href='#img_star_active'/>\
					</svg>\
					<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 100 100' class='image star no_favorite'>\
						<use xlink:href='#img_star_inactive'/>\
					</svg>\
					<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 100 100' class='image down'>\
						<use xlink:href='#img_arrow_down'/>\
					</svg>\
					<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 100 100' class='image up'>\
						<use xlink:href='#img_arrow_up'/>\
					</svg>\
				</li>");
			if(this.categories[c].favorite)
				element.addClass("favorite");
			element.children(".star").click(function(ui, category, e) {
				return function(event) {
					var i = category.position;
					console.log("click star " + ui.categories[i].category.key + " @ pos=" + i);
					ui.categories[i].favorite = !ui.categories[i].favorite;						
					if(ui.categories[i].favorite)
						e.addClass("favorite");
					else
						e.removeClass("favorite");
					app.setCategories(ui.categories);
				};
			}(this, this.categories[c], element));
			element.children(".up").click(function(ui, category, e) {
				return function(event) {
					var i = category.position;
					console.log("click up " + ui.categories[i].category.key + " @ pos=" + i);
					if(i > 0)
					{
						ui.swapManageCategories(e, i, i-1);
					}
					app.setCategories(ui.categories);
				};
			}(this, this.categories[c], element));
			element.children(".down").click(function(ui, category, e) {
				return function(event) {
					var i = category.position;
					console.log("click down " + ui.categories[i].category.key + " @ pos=" + i);
					if(i < ui.categories.length-1)
					{
						ui.swapManageCategories(e, i, i+1);
					}
					app.setCategories(ui.categories);
				};
			}(this, this.categories[c], element));
			
			$("#manage_categories_list").append(element);
		}
		
		$("#manage_categories_list").css("height", (this.categories.length * this.constants.CATEGORIES_LIST_LINE_HEIGHT) + "em");
		this.labelManager.updateLabels($("#manage_categories_list"));
	};
	
	this.initialize = function()
	{		
		/* create LabelManager for updating locale dependent labels */
		this.labelManager = new LabelManager(app, app.getString);
		
		/* initialize top bar */
		this.searchInput = new AutoHide($("#search"), 5000, "keydown keypressed keyup click mousedown mouseup");
		$("#search_button").click(function(event) { UI.searchInput.show(); });
		
		/* initialize menu */
		this.menu = new Hideable($("#menu"), false);
		this.populateMenu();
		$("#menu_button").click(function(event) { UI.menu.toggle(); event.stopPropagation(); });
		$("#main").click(function(event) { if(!event.isPropagationStopped()) UI.menu.hide(); });
		/* menu elements */
		$("#menu_categories").click(function(event) { console.log("click menu_categories"); UI.menu.hide(); $("#manage_categories").removeClass("hidden"); });
		$("#menu_profile").click(   function(event) { console.log("click menu_profile"); 	UI.menu.hide(); });
		$("#menu_settings").click(  function(event) { console.log("click menu_settings"); 	UI.menu.hide(); });
		$("#menu_exit").click(      function(event) { console.log("click menu_exit"); 		UI.menu.hide(); app.exit(); });
		
		/* initialize windows */
		$(".close").click(function(event) {	$(event.target).closest(".window").addClass("hidden"); });
		/* close window on any click outside window // interferes with hide menu, because window is still in front */
		$(".frame").click(function(event) { console.log("a"); event.stopPropagation(); });
		$("#main").click(function(event) { console.log("b"); if(!event.isPropagationStopped()) $(".window").addClass("hidden"); });
		

		/* manage categories */
		this.populateManageCategories();
		$("#manage_categories .close").click(function(event) { UI.populateMenu(); UI.populateManageCategories(); });
		
		/* update locale dependent labels */
		this.labelManager.updateLabels();
	};	
	
	return this;
}();

