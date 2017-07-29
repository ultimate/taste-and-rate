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
					<li class='selectable'><label key='" + this.categories[c].category.key + ".title'/>\
						<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 150 100' class='image active'>\
							<use xlink:href='#img_filter_active'/>\
						</svg>\
						<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 150 100' class='image not_active'>\
							<use xlink:href='#img_filter_inactive'/>\
						</svg>\
					</li>");
				if(this.categories[c].active)
					element.classList.add("active");
				element.click(function(ui, i, e) {
					return function(event) {
						ui.categories[i].active = !ui.categories[i].active;						
						if(ui.categories[i].active)
							e.classList.add("active");
						else
							e.classList.remove("active");
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
		
		other.classList.add("position" + fromIndex);
		other.classList.remove("position" + toIndex);
		
		element.classList.add("position" + toIndex);
		element.classList.remove("position" + fromIndex);
		
		// update "first" and "last" tag
		if(fromIndex == 1 && toIndex == 0)
		{
			element.classList.add("first");
			other.classList.remove("first");
		}
		else if(fromIndex == 0 && toIndex == 1)
		{
			other.classList.add("first");
			element.classList.remove("first");
		}
		// no else here, in case list length is 2
		if(fromIndex == this.categories.length-1 && toIndex == this.categories.length-2)
		{
			other.classList.add("last");
			element.classList.remove("last");
		}
		else if(fromIndex == this.categories.length-2 && toIndex == this.categories.length-1)
		{
			element.classList.add("last");
			other.classList.remove("last");
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
				<li class='draggable selectable " + posClasses + "'><label key='" + this.categories[c].category.key + ".title'/>\
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
				element.classList.add("favorite");
			element.children(".star").click(function(ui, category, e) {
				return function(event) {
					var i = category.position;
					console.log("click star " + ui.categories[i].category.key + " @ pos=" + i);
					ui.categories[i].favorite = !ui.categories[i].favorite;						
					if(ui.categories[i].favorite)
						e.classList.add("favorite");
					else
						e.classList.remove("favorite");
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
		$("#menu_categories").click(function(event) { console.log("click menu_categories"); UI.menu.hide(100); $("#manage_categories").classList.remove("hidden"); });
		$("#menu_profile").click(   function(event) { console.log("click menu_profile"); 	UI.menu.hide(100); });
		$("#menu_settings").click(  function(event) { console.log("click menu_settings"); 	UI.menu.hide(100); });
		$("#menu_exit").click(      function(event) { console.log("click menu_exit"); 		UI.menu.hide(100); app.exit(); });
		
		/* initialize windows */
		$(".close").click(function(event) {	$(event.target).closest(".window").classList.add("hidden"); });
		/* close window on any click outside window (only for non-modal windows!) */
		$(".frame").click(function(event) { event.stopPropagation(); });
		$("#main").click(function(event) { if(!event.isPropagationStopped()) $(".window").classList.add("hidden"); });
		
		/* initialize calendar */
		this.calendar = new Calendar($("#calendar"), 1, []);

		/* manage categories */
		this.populateManageCategories();
		$("#manage_categories .close").click(function(event) { UI.populateMenu(); UI.populateManageCategories(); });
		
		/* update locale dependent labels */
		this.labelManager.updateLabels();
	};	
	
	return this;
}();

