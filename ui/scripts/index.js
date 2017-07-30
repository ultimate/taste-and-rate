var UI = function() {
	
	this.constants = {
		CATEGORIES_LIST_LINE_HEIGHT: 2,
		SVG_NAMESPACE: "http://www.w3.org/2000/svg",
		SVG_XML_NAMESPACE: "http://www.w3.org/2000/xmlns/",
		SVG_XLINK_NAMESPACE: "http://www.w3.org/1999/xlink",
	};
	
	this.createSVG = function(viewBox, classes, useID)
	{
		var svg = document.createElementNS(this.constants.SVG_NAMESPACE, "svg");
		svg.setAttribute("xmlns", this.constants.SVG_XML_NAMESPACE);
		svg.setAttributeNS(this.constants.SVG_XML_NAMESPACE, "xmlns:xlink", this.constants.SVG_XLINK_NAMESPACE);
		svg.setAttribute("viewBox", viewBox);
		svg.setAttribute("class", classes);
		
		var use = document.createElementNS(this.constants.SVG_NAMESPACE, "use");
		use.setAttributeNS(this.constants.SVG_XLINK_NAMESPACE, "xlink:href", useID);
		svg.append(use);
		
		console.log(svg);
		
		return svg;
	};
	
	this.populateMenu = function()
	{
		var menuCategories = document.getElementById("menu_categories_list")
		Elements.removeChildren(menuCategories);
				
		this.categories = app.getCategories();
		
		var element;
		for(var c = 0; c < this.categories.length; c++)
		{
			console.log(this.categories[c]);
			// populate menu
			if(this.categories[c].favorite)
			{
				element = Elements.fromString("<li class='selectable'><label key='" + this.categories[c].category.key + ".title'/></li>");
				element.append(this.createSVG("0 0 150 100", "image active", "#img_filter_active"));	
				element.append(this.createSVG("0 0 150 100", "image not_active", "#img_filter_inactive"));	
										
				if(this.categories[c].active)
					element.classList.add("active");
				Events.addEventListener(Events.CLICK, function(ui, i, e) {
					return function(event) {
						ui.categories[i].active = !ui.categories[i].active;						
						if(ui.categories[i].active)
							e.classList.add("active");
						else
							e.classList.remove("active");
						app.setCategories(ui.categories);
					};
				}(this, c, element), element);
				menuCategories.append(element);
			}
		}
		this.labelManager.updateLabels(menuCategories);
	};	
	
	this.swapManageCategories = function(element, fromIndex, toIndex)
	{
		console.log("swap " + fromIndex + "->" + toIndex);
		var tmp = this.categories[fromIndex];
		this.categories[fromIndex] = this.categories[toIndex];
		this.categories[toIndex] = tmp
		
		this.categories[fromIndex].position = fromIndex;
		this.categories[toIndex].position = toIndex;
		
		// TODO
		var other = element.parentElement.getElementsByClassName("position" + toIndex)[0];
		
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
		var manageCategories = document.getElementById("manage_categories_list")
		Elements.removeChildren(manageCategories);
		
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
			
			element = Elements.fromString("<li class='draggable selectable " + posClasses + "'><label key='" + this.categories[c].category.key + ".title'/></li>");
			element.append(this.createSVG("0 0 100 100", "image star favorite", "#img_star_active"));	
			element.append(this.createSVG("0 0 100 100", "image star no_favorite", "#img_star_inactive"));	
			element.append(this.createSVG("0 0 100 100", "image down", "#img_arrow_down"));	
			element.append(this.createSVG("0 0 100 100", "image up", "#img_arrow_up"));		
				
			console.log(element);
			if(this.categories[c].favorite)
				element.classList.add("favorite");
			Events.addEventListener(Events.CLICK, function(ui, category, e) {
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
			}(this, this.categories[c], element), element.getElementsByClassName("star"));
			Events.addEventListener(Events.CLICK, function(ui, category, e) {
				return function(event) {
					var i = category.position;
					console.log("click up " + ui.categories[i].category.key + " @ pos=" + i);
					if(i > 0)
					{
						ui.swapManageCategories(e, i, i-1);
					}
					app.setCategories(ui.categories);
				};
			}(this, this.categories[c], element), element.getElementsByClassName("up"));
			Events.addEventListener(Events.CLICK, function(ui, category, e) {
				return function(event) {
					var i = category.position;
					console.log("click down " + ui.categories[i].category.key + " @ pos=" + i);
					if(i < ui.categories.length-1)
					{
						ui.swapManageCategories(e, i, i+1);
					}
					app.setCategories(ui.categories);
				};
			}(this, this.categories[c], element), element.getElementsByClassName("down"));
			
			manageCategories.append(element);
		}
		
		manageCategories.style.height = (this.categories.length * this.constants.CATEGORIES_LIST_LINE_HEIGHT) + "em";
		this.labelManager.updateLabels(manageCategories);
	};
	
	this.initialize = function()
	{		
		/* create LabelManager for updating locale dependent labels */
		this.labelManager = new LabelManager(app, app.getString);
		
		/* initialize top bar */
		this.searchInput = new AutoHide("search", 5000, [Events.KEYDOWN, Events.KEYPRESSED, Events.KEYUP, Events.CLICK, Events.MOUSEDOWN, Events.MOUSEUP]);
		Events.addEventListener(Events.CLICK, function(event) { UI.searchInput.show(); }, document.getElementById("search_button"));
		
		/* initialize menu */
		this.menu = new Hideable("menu", false);
		this.populateMenu();
		Events.addEventListener(Events.CLICK, function(event) { UI.menu.toggle(); event.preventDefault(); }, document.getElementById("menu_button"));
		Events.addEventListener(Events.CLICK, function(event) { if(!event.defaultPrevented) UI.menu.hide(); }, document.getElementById("main"));
		/* menu elements */
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_categories"); 	UI.menu.hide(100); document.getElementById("manage_categories").classList.remove("hidden"); }, document.getElementById("menu_categories"));
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_profile"); 		UI.menu.hide(100); }, document.getElementById("menu_categories"));
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_settings"); 	UI.menu.hide(100); }, document.getElementById("menu_settings"));
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_exit"); 		UI.menu.hide(100); app.exit(); }, document.getElementById("menu_exit"));
		
		/* initialize windows */
		var closeButtons = document.getElementsByClassName("close");
		for(var i = 0; i < closeButtons.length; i++)
		{
			Events.addEventListener(Events.CLICK, function(event) {
				var element = event.target;
				while(element != null)
				{
					if(element.classList.contains("window"))
					{
						element.classList.add("hidden");
						break;
					}
					element = element.parentElement;
				}
			}, closeButtons[i]);
		}
		/* close window on any click outside window (only for non-modal windows!) */
		var frames = document.getElementsByClassName("frame");
		for(var i = 0; i < frames.length; i++)
		{
			Events.addEventListener(Events.CLICK, function(event) { event.preventDefault(); }, frames[i]);
		}
		Events.addEventListener(Events.CLICK, function(event) {
			if(!event.defaultPrevented)
			{
				// close all windows
				var windows = document.getElementsByClassName("window");
				for(var i = 0; i < windows.length; i++)
				{
					windows[i].classList.add("hidden");
				}
			}
		}, document.getElementById("main"));
		
		/* initialize calendar */
		this.calendar = new Calendar("calendar", 1, []);

		/* manage categories */
		this.populateManageCategories();
		var manageCategoriesCloseButton = document.getElementById("manage_categories").getElementsByClassName("close")[0];
		Events.addEventListener(Events.CLICK, function(event) { UI.populateMenu(); UI.populateManageCategories(); }, manageCategoriesCloseButton);
		
		/* update locale dependent labels */
		this.labelManager.updateLabels();
	};	
	
	return this;
}();

