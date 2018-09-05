var UI = function() {
	
	this.constants = {
		CATEGORIES_LIST_LINE_HEIGHT: 2.5,
		TYPE_EVENT: "event",
		TYPE_RATING: "rating",
		VIEW_CALENDAR: "calendar", 
		VIEW_PERSONAL_RATINGS: "personal_ratings",
		VIEW_FRIENDS_RATINGS: "friends_ratings",
		VIEW_GLOBAL_RATINGS: "global_ratings",
		SCOPE_PERSONAL: 1,
		SCOPE_FRIENDS: 2,
		SCOPE_GLOBAL: 4,
	};
	
	this.view = this.constants.VIEW_CALENDAR;
	
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
				element.append(Elements.createSVG("0 0 150 100", "image active", "#img_filter_active"));	
				element.append(Elements.createSVG("0 0 150 100", "image not_active", "#img_filter_inactive"));	
										
				if(this.categories[c].active)
					element.classList.add("active");
				Events.addEventListener(Events.CLICK, function(i, e) {
					return function(event) {
						UI.categories[i].active = !UI.categories[i].active;						
						if(UI.categories[i].active)
							e.classList.add("active");
						else
							e.classList.remove("active");
						app.setCategories(UI.categories);
					};
				}(c, element), element);
				menuCategories.append(element);
			}
		}
		this.labelManager.updateLabels(menuCategories);
	};	
	
	this.swapManageCategories = function(element, fromIndex, toIndex)
	{
		console.log("swap " + fromIndex + "->" + toIndex);
		let tmp = this.categories[fromIndex];
		this.categories[fromIndex] = this.categories[toIndex];
		this.categories[toIndex] = tmp
		
		this.categories[fromIndex].position = fromIndex;
		this.categories[toIndex].position = toIndex;
		
		// TODO
		let other = element.parentElement.getElementsByClassName("position" + toIndex)[0];
		
		other.classList.add("position" + fromIndex);
		other.classList.remove("position" + toIndex);
		other.style.top = (this.constants.CATEGORIES_LIST_LINE_HEIGHT * fromIndex) + "em";
		
		element.classList.add("position" + toIndex);
		element.classList.remove("position" + fromIndex);
		element.style.top = (this.constants.CATEGORIES_LIST_LINE_HEIGHT * toIndex) + "em";
		
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
		let manageCategories = document.getElementById("manage_categories_list")
		Elements.removeChildren(manageCategories);
		
		this.categories = app.getCategories();
		
		let element;
		for(var c = 0; c < this.categories.length; c++)
		{
		// populate manage categories	
			var posClasses = "position" + this.categories[c].position;
			if(c == 0)
				posClasses += " first";
			else if(c == this.categories.length-1)
				posClasses += " last";
			
			element = Elements.fromString("<li class='draggable selectable " + posClasses + "'><label key='" + this.categories[c].category.key + ".title'/></li>");
			element.append(Elements.createSVG("0 0 100 100", "image star favorite", "#img_star_active"));	
			element.append(Elements.createSVG("0 0 100 100", "image star no_favorite", "#img_star_inactive"));	
			element.append(Elements.createSVG("0 0 100 100", "image down", "#img_arrow_down"));	
			element.append(Elements.createSVG("0 0 100 100", "image up", "#img_arrow_up"));	

			element.style.top = (this.constants.CATEGORIES_LIST_LINE_HEIGHT * c) + "em";
				
			console.log(element);
			if(this.categories[c].favorite)
				element.classList.add("favorite");
			Events.addEventListener(Events.CLICK, function(category, e) {
				return function(event) {
					var i = category.position;
					console.log("click star " + UI.categories[i].category.key + " @ pos=" + i);
					UI.categories[i].favorite = !UI.categories[i].favorite;						
					if(UI.categories[i].favorite)
						e.classList.add("favorite");
					else
						e.classList.remove("favorite");
					app.setCategories(UI.categories);
				};
			}(this.categories[c], element), element.getElementsByClassName("star"));
			Events.addEventListener(Events.CLICK, function(category, e) {
				return function(event) {
					var i = category.position;
					console.log("click up " + UI.categories[i].category.key + " @ pos=" + i);
					if(i > 0)
					{
						UI.swapManageCategories(e, i, i-1);
					}
					app.setCategories(UI.categories);
				};
			}(this.categories[c], element), element.getElementsByClassName("up"));
			Events.addEventListener(Events.CLICK, function(category, e) {
				return function(event) {
					var i = category.position;
					console.log("click down " + UI.categories[i].category.key + " @ pos=" + i);
					if(i < UI.categories.length-1)
					{
						UI.swapManageCategories(e, i, i+1);
					}
					app.setCategories(UI.categories);
				};
			}(this.categories[c], element), element.getElementsByClassName("down"));
			
			manageCategories.append(element);
		}
		
		manageCategories.style.height = (this.categories.length * this.constants.CATEGORIES_LIST_LINE_HEIGHT) + "em";
		this.labelManager.updateLabels(manageCategories);
	};
	
	this.populateRatings = function(view) {
		var scope = 0;
		if(view == UI.constants.VIEW_PERSONAL_RATINGS)
			scope = UI.constants.SCOPE_PERSONAL;
		else if(view == UI.constants.VIEW_FRIENDS_RATINGS)
			scope = UI.constants.SCOPE_FRIENDS;
		if(view == UI.constants.VIEW_GLOBAL_RATINGS)
			scope = UI.constants.SCOPE_GLOBAL;	
		
		console.log("start");
		var start = new Date().getTime();

		var container = document.getElementById(view);
		Elements.removeChildren(container);
		
		var list = document.createElement("ul");
		container.append(list);
		
		var ratings = app.getRatings(scope);
		var categories = app.getCategories();
		
		console.log("ratings & categories loaded @ " + (new Date().getTime()-start));
		
		var t0 = 0;
		var t1 = 0;
		var t2 = 0;
		var t3 = 0;
		var t4 = 0;
		var t5 = 0;
		var t6 = 0;
		var t7 = 0;
		var t8 = 0;
		var li, div, div2, img, stars, perc;
		
		for(var r = 0; r < ratings.length; r++)
		{
			t0 = new Date().getTime();
			var category = null;
			for(var c = 0; c < categories.length; c++)
			{
				if(ratings[r].category == categories[c].category.id)
					category = categories[c].category;
			}
			if(category == null)
				console.err("category not found");
			t1 += (new Date().getTime() - t0);
			
			t0 = new Date().getTime();
			var overallCriteria;
			for(var c = 0; c < ratings[r].criteria.length; c++)
			{
				if(ratings[r].criteria[c].ref == category.overallCriteria)
					overallCriteria = ratings[r].criteria[c];
			}
			t2 += (new Date().getTime() - t0);
				
			t0 = new Date().getTime();		
			var percent = 0;
			var details = app.getString("rating.no_text");
			if(overallCriteria != null)
			{
				percent = Math.round(overallCriteria.stars*2)*10;
				if(overallCriteria.text != null && overallCriteria.text != "")
					details = overallCriteria.text;
			}
			t3 += (new Date().getTime() - t0);			
			
			t0 = new Date().getTime();				
			list.append(Elements.fromString("<li>\
												<div class='image'><img src='" + ratings[r].image + "'/></div>\
												<div class='text'>\
													<div class='rating'><div class='stars'><div class='percent' style='width: " + percent + "%;'></div></div></div>\
													<div class='product'>" + ratings[r].product + "</div>\
													<div class='details'>" + details + "</div>\
												</div>\
											</li>"));				
			t4 += (new Date().getTime() - t0);
			t0 = new Date().getTime();		
			list.append(Elements.fromString("<li>\
												<div class='image'><img src=''/></div>\
												<div class='text'>\
													<div class='rating'><div class='stars'><div class='percent' style='width: %;'></div></div></div>\
													<div class='product'></div>\
													<div class='details'></div>\
												</div>\
											</li>"));				
			t5 += (new Date().getTime() - t0);
			t0 = new Date().getTime();		
			list.append(Elements.fromString(["<li>\
												<div class='image'><img src='", ratings[r].image, "'/></div>\
												<div class='text'>\
													<div class='rating'><div class='stars'><div class='percent' style='width: ", percent, "%;'></div></div></div>\
													<div class='product'>", ratings[r].product, "</div>\
													<div class='details'>", details, "</div>\
												</div>\
											</li>"].join()));		
			t6 += (new Date().getTime() - t0);	
			t0 = new Date().getTime();		
			list.append(Elements.fromString(["<li>\
												<div class='image'><img src='", ratings[r].image, "'/></div>\
												<div class='text'>\
													<div class='rating'><div class='stars'><div class='percent' style='width: ", percent, "%;'></div></div></div>\
													<div class='product'>", ratings[r].product, "</div>\
													<div class='details'>", details, "</div>\
												</div>\
											</li>"].join("")));		
			t7 += (new Date().getTime() - t0);	
			t0 = new Date().getTime();		
			li = document.createElement("li");
				div = document.createElement("div");
					img = document.createElement("div");
					img.setAttribute("src", ratings[r].image);
					div.append(img);
				div.classList.add("image");
				li.append(div);
				
				div = document.createElement("div");
					div2 = document.createElement("div");
					div2.classList.add("rating");
						stars = perc = document.createElement("div");
						stars.classList.add("stars");
							perc = document.createElement("div");
							perc.classList.add("percent");
							perc.style.width = percent + "%";
							stars.append(perc);
						div2.append(stars);						
					div.append(div2);
					
					div2 = document.createElement("div");
					div2.classList.add("product");
					div2.append(document.createTextNode(ratings[r].product));
					div.append(div2);
					
					div2 = document.createElement("div");
					div2.classList.add("details");
					div2.append(document.createTextNode(details));
					div.append(div2);
				div.classList.add("text");
				li.append(div)
			list.append(li);
			t8 += (new Date().getTime() - t0);	
		}
		console.log("elements created @ " + (new Date().getTime()-start));
		console.log("t1 = " + t1);
		console.log("t2 = " + t2);
		console.log("t3 = " + t3);
		console.log("t4 = " + t4);
		console.log("t5 = " + t5);
		console.log("t6 = " + t6);
		console.log("t7 = " + t7);
		console.log("t8 = " + t8);
	};
	
	this.showView = function(view) {
		var frame = document.getElementById("content_frame");
		this.view = view;		
		
		var child;
		for(var i = 0; i < frame.children.length; i++)
		{
			child = frame.children[i];
			if(child.id == "content_" + view)
			{
				child.classList.remove("hidden");
			}
			else
			{
				child.classList.add("hidden");
			}				
		}	
		
		// TODO show load screen if it takes longer
		
		// TODO only refresh, if last refresh is 
		// refresh view
		if(this.view == this.constants.VIEW_CALENDAR)
		{
			this.calendar.update(app.getEvents());
		}
		else if(this.view == this.constants.VIEW_PERSONAL_RATINGS)
		{
			this.populateRatings(this.view);
		}
		else if(this.view == this.constants.VIEW_FRIENDS_RATINGS)
		{
			this.populateRatings(this.view);
		}
		else if(this.view == this.constants.VIEW_GLOBAL_RATINGS)
		{
			this.populateRatings(this.view);
		}
		
		// TODO remove load screen
	};
	
	this.showAdd = function()
	{
		console.log("showAdd called for '" + this.view + "'");
		if(this.view == this.constants.VIEW_CALENDAR)
			this.updateEventForm(null);
		else if(this.view == this.constants.VIEW_PERSONAL_RATINGS)
			this.updateRatingForm(null, true);
		else if(this.view == this.constants.VIEW_FRIENDS_RATINGS)
			this.updateRatingForm(null, true);
		else if(this.view == this.constants.VIEW_GLOBAL_RATINGS)
			this.updateRatingForm(null, true);
		UI.menu.hide();
	};
	
	this.updateForm = function(form, object)
	{
		form.object = object;
		createElements = form.getElementsByClassName("create");
		editElements = form.getElementsByClassName("edit");
		validatableElements = form.getElementsByClassName("validatable");
		if(object != null)
		{
			// show/hide create/edit elements
			for(var i = 0; i < createElements.length; i++)
			{
				createElements[i].classList.add("hidden");
			}
			for(var i = 0; i < editElements.length; i++)
			{
				editElements[i].classList.remove("hidden");
			}
		}
		else
		{
			// show/hide create/edit elements
			for(var i = 0; i < editElements.length; i++)
			{
				editElements[i].classList.add("hidden");
			}
			for(var i = 0; i < createElements.length; i++)
			{
				createElements[i].classList.remove("hidden");
			}
		}
		for(var i = 0; i < validatableElements.length; i++)
		{
			validatableElements[i].classList.remove("invalid");
		}
		form.classList.remove("hidden");
	};
	
	this.updateEventForm = function(event)
	{
		form = document.getElementById("form_event");	
		if(event != null)
		{
			// populate all fields
			document.getElementById("event_title").value = event.title;
			document.getElementById("event_date").value = event.date.toDatetimeLocal(); // convert date to datetimelocal ISO-string using lib first	
			document.getElementById("event_location").value = event.location;
			document.getElementById("event_description").value = event.description;			
		}
		else
		{
			// clear all fields
			document.getElementById("event_title").value = "";
			document.getElementById("event_date").value = null;
			document.getElementById("event_location").value = "";
			document.getElementById("event_description").value = "";	
		}
		this.updateForm(form, event);
	};
	
	this.submitEventForm = function(form)
	{
		// validate
		valid = true;
		// Note: use "&& valid" at end to ensure method call
		valid = UI.validateElement(document.getElementById("event_title"),	 		"value", UI.constants.TYPE_EVENT, "title") && valid;
		valid = UI.validateElement(document.getElementById("event_date"), 			"value", UI.constants.TYPE_EVENT, "date") && valid;
		valid = UI.validateElement(document.getElementById("event_location"), 		"value", UI.constants.TYPE_EVENT, "location") && valid;
		valid = UI.validateElement(document.getElementById("event_description"), 	"value", UI.constants.TYPE_EVENT, "description") && valid;
		console.log("from valid ? " + valid);
		if(valid)
		{		
			event = form.object;
			if(event == null) event = {};
			// get all fields
			event.title = document.getElementById("event_title").value;
			event.date = new Date(document.getElementById("event_date").value); // timezone is applied only, when using ISO-string constructor
			event.location = document.getElementById("event_location").value;
			event.description = document.getElementById("event_description").value;		
			app.saveEvent(event);	
			// update calendar
			calendar.update(app.getEvents());
		}
		return valid;
	};
	
	this.updateRatingForm = function(rating)
	{
		form = document.getElementById("form_rating");
		if(rating != null)
		{
			// populate all fields
		}
		else
		{
			// clear all fields
		}
		this.updateForm(form, rating);
	};
	
	this.submitRatingForm = function(form)
	{
		// validate
		valid = true;
		// TODO
		
		if(valid)
		{	
			rating = form.object;
			if(rating == null) rating = {};
			// get all fields
			app.saveRating(rating);
		}
		return valid;
	};
	
	this.submitForm = function(form)
	{
		if(form.getAttribute("type") == this.constants.TYPE_EVENT)
			return this.submitEventForm(form);
		else if(form.getAttribute("type") == this.constants.TYPE_RATING)
			return this.submitRatingForm(form);
	};
	
	this.validateElement = function(element, property, type, field)
	{
		var valid = app.validate(type, field, element[property]);
		if(valid)
			element.classList.remove("invalid");
		else
			element.classList.add("invalid");
		return valid;
	};
	
	this.initialize = function()
	{		
		/* create LabelManager for updating locale dependent labels */
		this.labelManager = new LabelManager(app, app.getString);
		
		/* initialize top bar */
		this.searchInput = new AutoHide("search", 5000, [Events.KEYDOWN, Events.KEYPRESSED, Events.KEYUP, Events.CLICK, Events.MOUSEDOWN, Events.MOUSEUP]);
		Events.addEventListener(Events.CLICK, function(event) { UI.searchInput.show(); 							}, document.getElementById("search_button"));
		Events.addEventListener(Events.CLICK, function(event) { UI.showAdd(); 			event.preventDefault(); }, document.getElementById("add_button"));
		
		/* initialize menu */
		this.menu = new Hideable("menu", false);
		this.populateMenu();
		Events.addEventListener(Events.CLICK, function(event) { UI.menu.toggle(); 		event.preventDefault(); }, document.getElementById("menu_button"));
		Events.addEventListener(Events.CLICK, function(event) { if(!event.defaultPrevented) UI.menu.hide(); 	}, document.getElementById("main"));
		/* menu elements */
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_categories"); 	UI.menu.hide(100); document.getElementById("manage_categories").classList.remove("hidden"); }, document.getElementById("menu_categories"));
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_profile"); 		UI.menu.hide(100); /* TODO */			}, document.getElementById("menu_profile"));
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_settings"); 	UI.menu.hide(100); /* TODO */			}, document.getElementById("menu_settings"));
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_help"); 		UI.menu.hide(100); /* TODO */ app.clearDatabase(); }, document.getElementById("menu_help"));
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_about"); 		UI.menu.hide(100); /* TODO */			}, document.getElementById("menu_about"));
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_exit"); 		UI.menu.hide(100); app.exit(); 			}, document.getElementById("menu_exit"));
		
		/* initialize bottom bar */
		Events.addEventListener(Events.CLICK, function(event) { UI.showView(UI.constants.VIEW_CALENDAR); 			}, document.getElementById(UI.constants.VIEW_CALENDAR 			+ "_button"));
		Events.addEventListener(Events.CLICK, function(event) { UI.showView(UI.constants.VIEW_PERSONAL_RATINGS); 	}, document.getElementById(UI.constants.VIEW_PERSONAL_RATINGS 	+ "_button"));
		Events.addEventListener(Events.CLICK, function(event) { UI.showView(UI.constants.VIEW_FRIENDS_RATINGS); 	}, document.getElementById(UI.constants.VIEW_FRIENDS_RATINGS 	+ "_button"));
		Events.addEventListener(Events.CLICK, function(event) { UI.showView(UI.constants.VIEW_GLOBAL_RATINGS); 		}, document.getElementById(UI.constants.VIEW_GLOBAL_RATINGS 	+ "_button"));
		
				
		/* initialize windows */
		/* close cancel buttons */
		//let closeButtons = document.getElementsByClassName("close");
		let closeButtons = document.querySelectorAll(".window .close, .window .cancel");
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
		/* save buttons controls */
		let okButtons = document.querySelectorAll(".window .ok");
		for(var i = 0; i < okButtons.length; i++)
		{
			Events.addEventListener(Events.CLICK, function(event) {
				var element = event.target;
				while(element != null)
				{
					if(element.classList.contains("form"))
					{
						if(UI.submitForm(element))
							element.classList.add("hidden");
						break;
					}
					element = element.parentElement;
				}
			}, okButtons[i]);
		}		
		/* close window on any click outside window (only for non-modal windows!) */
		/*
		let frames = document.getElementsByClassName("frame");
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
				// hide menu
				UI.menu.hide();
			}
		}, document.getElementById("main"));
		*/
		
		/* initialize calendar */
		this.calendar = new Calendar("calendar", true, 1, app.getEvents());
		this.calendar.onUpdate = function() { UI.labelManager.updateLabels(); };
		this.calendar.onSelect = function(event) { UI.updateEventForm(event); };
		
		/* initialize rating lists */

		/* manage categories */
		this.populateManageCategories();
		let manageCategoriesCloseButton = document.getElementById("manage_categories").getElementsByClassName("close")[0];
		Events.addEventListener(Events.CLICK, function(event) { UI.populateMenu(); UI.populateManageCategories(); }, manageCategoriesCloseButton);
		
		/* select view */
		this.showView(this.constants.VIEW_PERSONAL_RATINGS);
		
		/* update locale dependent labels */
		this.labelManager.updateLabels();
	};	
	
	return this;
}();

