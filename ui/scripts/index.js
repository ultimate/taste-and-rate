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
	this.defaultCategory = 0;
	
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
						UI.populateCategorySelects();
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
	
	this.populateCategorySelects = function() {
		var categorySelects = document.getElementsByClassName("category_select");
		var option, label;
		for(var i = 0; i < categorySelects.length; i++)
		{
			Elements.removeChildren(categorySelects[i]);
			
			for(var j = 0; j < UI.categories.length; j++)
			{
				if(UI.categories[j].favorite)
				{
					option = document.createElement("option");
					option.setAttribute("value", UI.categories[j].category.id);
					label = document.createElement("label");
					label.setAttribute("key", UI.categories[j].category.key + ".title");
					option.append(label);
					categorySelects[i].append(option);
				}
			}
			this.labelManager.updateLabels(categorySelects[i]);				
		}
		// calculate default value						
		var numberOfFavorites = 0;	
		var numberOfActives = 0;			
		var firstFavoriteValue = 0;		
		var firstActiveValue = 0;
		for(var j = 0; j < UI.categories.length; j++)
		{
			if(UI.categories[j].favorite)
			{
				numberOfFavorites++;
				if(firstFavoriteValue == 0)
					firstFavoriteValue = UI.categories[j].category.id;
			}	
			if(UI.categories[j].active)
			{
				numberOfActives++;
				if(firstActiveValue == 0)
					firstActiveValue = UI.categories[j].category.id;
			}					
		}
		if(numberOfFavorites == 1)
			this.defaultCategory = firstFavoriteValue;
		else if(numberOfActives == 1)
			this.defaultCategory = firstActiveValue;
		else
			this.defaultCategory = 0;
	};
	
	this.populateRatings = function(view) {
		var scope = 0;
		if(view == UI.constants.VIEW_PERSONAL_RATINGS)
			scope = UI.constants.SCOPE_PERSONAL;
		else if(view == UI.constants.VIEW_FRIENDS_RATINGS)
			scope = UI.constants.SCOPE_FRIENDS;
		if(view == UI.constants.VIEW_GLOBAL_RATINGS)
			scope = UI.constants.SCOPE_GLOBAL;	
		
		var container = document.getElementById(view);
		Elements.removeChildren(container);
		
		var list = document.createElement("ul");
		container.append(list);
		
		var ratings = app.getRatings(scope);
		var categories = app.getCategories();
		
		var li, div, div2, img, stars, perc;
		
		for(var r = 0; r < ratings.length; r++)
		{
			var percent = Math.round(ratings[r].stars*2)*10;
			var summary = app.getString("rating.no_text");
			if(ratings[r].summary != null && ratings[r].summary != "")
				summary = ratings[r].summary;
			
			/*
			list.append(Elements.fromString("<li>\
												<div class='image'><img src='" + ratings[r].image + "'/></div>\
												<div class='text'>\
													<div class='rating'><div class='stars'><div class='percent' style='width: " + percent + "%;'></div></div></div>\
													<div class='product'>" + ratings[r].product + "</div>\
													<div class='summary'>" + summary + "</div>\
												</div>\
											</li>"));
			*/
			// this is the same as above, but much faster!!! ~ factor 1000:
			// - above = several seconds (dependings on number of elements
			// - below = few milleseconds
			li = document.createElement("li");
				div = document.createElement("div");
				div.classList.add("image");
				div.style.backgroundImage = "url(" + ratings[r].image + ")" ; 
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
					div2.classList.add("summary");
					div2.append(document.createTextNode(summary));
					div.append(div2);
				div.classList.add("text");
				li.append(div)
				
				Events.addEventListener(Events.CLICK, function(rating) { return function(event) { UI.updateRatingForm(rating, true); }; }(ratings[r]), li);
			list.append(li);
			
			// create ellipsis
			Elements.addEllipsis(div2);
		}
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
			this.calendar.update(this.getCalendarItems());
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
		/*
		// @deprecated
		if(this.view == this.constants.VIEW_CALENDAR)
			this.updateEventForm(null, true);
		else if(this.view == this.constants.VIEW_PERSONAL_RATINGS)
			this.updateRatingForm(null, true);
		else if(this.view == this.constants.VIEW_FRIENDS_RATINGS)
			this.updateRatingForm(null, true);
		else if(this.view == this.constants.VIEW_GLOBAL_RATINGS)
			this.updateRatingForm(null, true);
		*/
		this.updateRatingForm(null, false);
		UI.menu.hide();
	};
	
	this.updateForm = function(form, object, viewmode)
	{
		form.object = object;
		createElements = form.getElementsByClassName("create");
		editElements = form.getElementsByClassName("edit");
		viewElements = form.getElementsByClassName("view");
		validatableElements = form.getElementsByClassName("validatable");
		if(viewmode)
		{
			// show/hide create/edit/view elements
			for(var i = 0; i < createElements.length; i++)
			{
				createElements[i].classList.add("hidden");
			}
			for(var i = 0; i < editElements.length; i++)
			{
				editElements[i].classList.add("hidden");
			}
			for(var i = 0; i < viewElements.length; i++)
			{
				viewElements[i].classList.remove("hidden");
			}
		}
		else if(object != null)
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
			for(var i = 0; i < viewElements.length; i++)
			{
				viewElements[i].classList.add("hidden");
			}
		}
		else
		{
			// show/hide create/edit elements
			for(var i = 0; i < createElements.length; i++)
			{
				createElements[i].classList.remove("hidden");
			}
			for(var i = 0; i < editElements.length; i++)
			{
				editElements[i].classList.add("hidden");
			}
			for(var i = 0; i < viewElements.length; i++)
			{
				viewElements[i].classList.add("hidden");
			}
		}
		// TODO disable form elements
		for(var i = 0; i < validatableElements.length; i++)
		{
			validatableElements[i].classList.remove("invalid");
		}
		form.classList.remove("hidden");
	};
	
	// @deprecated
	this.updateEventForm = function(event, viewmode)
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
		this.updateForm(form, event, viewmode);
	};
	
	// @deprecated
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
			calendar.update(this.getCalendarItems());
		}
		return valid;
	};
	
	this.updateRatingForm = function(rating, viewmode)
	{
		form = document.getElementById("form_rating");
		if(rating != null)
		{
			var percent = Math.round(rating.stars*2)*10;
			// populate all fields
			document.getElementById("rating_category").value = rating.category;
			document.getElementById("rating_product").value = rating.product;
			document.getElementById("rating_date").value = rating.date.toDatetimeLocal(); // convert date to datetimelocal ISO-string using lib first	
			document.getElementById("rating_event").value = rating.event;
			document.getElementById("rating_location").value = rating.location;
			// TODO image
			document.getElementById("rating_stars").style.width = percent + "%";
			document.getElementById("rating_summary").value = rating.summary;	
			// TODO spider
			
			document.getElementById("rating_nose_text").value = rating.noseText;	
			document.getElementById("rating_nose_tags").value = rating.noseTags; // TODO should be treated differently
			
			document.getElementById("rating_taste_text").value = rating.tasteText;	
			document.getElementById("rating_taste_tags").value = rating.tasteTags; // TODO should be treated differently
			
			document.getElementById("rating_finish_text").value = rating.finishText;	
			document.getElementById("rating_finish_tags").value = rating.finishTags; // TODO should be treated differently
		}
		else
		{
			// clear all fields
			document.getElementById("rating_category").value = this.defaultCategory; // calculated on update of categories
			document.getElementById("rating_product").value = "";
			document.getElementById("rating_date").value = null	;
			document.getElementById("rating_event").value = "";
			document.getElementById("rating_location").value = "";
			// TODO image
			document.getElementById("rating_stars").style.width = "0%";
			document.getElementById("rating_summary").value = "";	
			// TODO spider
			
			document.getElementById("rating_nose_text").value = "";	
			document.getElementById("rating_nose_tags").value = "";	
			
			document.getElementById("rating_taste_text").value = "";	
			document.getElementById("rating_taste_tags").value = "";
			
			document.getElementById("rating_finish_text").value = "";	
			document.getElementById("rating_finish_tags").value = "";
		}
		this.updateForm(form, rating, viewmode);
	};
	
	this.submitRatingForm = function(form)
	{
		// validate
		valid = true;
		// Note: use "&& valid" at end to ensure method call
		valid = UI.validateElement(document.getElementById("rating_category"),	 	"value", UI.constants.TYPE_RATING, "category") && valid;
		valid = UI.validateElement(document.getElementById("rating_product"), 		"value", UI.constants.TYPE_RATING, "product") && valid;
		valid = UI.validateElement(document.getElementById("rating_date"), 			"value", UI.constants.TYPE_RATING, "date") && valid;
		valid = UI.validateElement(document.getElementById("rating_event"), 		"value", UI.constants.TYPE_RATING, "event") && valid;
		valid = UI.validateElement(document.getElementById("rating_location"), 		"value", UI.constants.TYPE_RATING, "location") && valid;
			// TODO image
			// TODO stars
		valid = UI.validateElement(document.getElementById("rating_summary"), 		"value", UI.constants.TYPE_RATING, "summary") && valid;
			// TODO spider
		valid = UI.validateElement(document.getElementById("rating_nose_text"), 	"value", UI.constants.TYPE_RATING, "nose_text") && valid;
		valid = UI.validateElement(document.getElementById("rating_nose_tags"), 	"value", UI.constants.TYPE_RATING, "nose_tags") && valid;
		valid = UI.validateElement(document.getElementById("rating_taste_text"), 	"value", UI.constants.TYPE_RATING, "taste_text") && valid;
		valid = UI.validateElement(document.getElementById("rating_taste_tags"), 	"value", UI.constants.TYPE_RATING, "taste_tags") && valid;
		valid = UI.validateElement(document.getElementById("rating_finish_text"), 	"value", UI.constants.TYPE_RATING, "finish_text") && valid;
		valid = UI.validateElement(document.getElementById("rating_finish_tags"), 	"value", UI.constants.TYPE_RATING, "finish_tags") && valid;
		
		if(valid)
		{	
			rating = form.object;
			if(rating == null) rating = {};
			// get all fields
			rating.category = Number(document.getElementById("rating_category").value);
			rating.product = document.getElementById("rating_product").value;
			rating.date = new Date(document.getElementById("rating_date").value); // timezone is applied only, when using ISO-string constructor
			rating.event = document.getElementById("rating_event").value;
			rating.location = document.getElementById("rating_location").value;
			// TODO image
			// TODO stars
			rating.summary = document.getElementById("rating_summary").value;
			// TODO spider	
			rating.noseText = document.getElementById("rating_nose_text").value;	
			rating.noseTags = document.getElementById("rating_nose_tags").value;	
			rating.tasteText = document.getElementById("rating_taste_text").value;	
			rating.tasteText = document.getElementById("rating_taste_tags").value;	
			rating.finishText = document.getElementById("rating_finish_text").value;	
			rating.finishText = document.getElementById("rating_finish_tags").value;	
			app.saveRating(rating);
			// update personal view
			// TODO
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
	
	this.getCalendarItems = function() {
		var calendarItems = [];
		var events = app.getEvents();
		var ratings = app.getRatings(UI.constants.SCOPE_PERSONAL);
		
		for(var i = 0; i < events.length; i++)
		{
			console.log(events[i]);
			calendarItems.push({
				title: 		events[i].title,
				date: 		events[i].date,
				group: 		null,
				itemType: 	UI.constants.TYPE_EVENT,
				item: 		events[i],
			});
		}
		for(var i = 0; i < ratings.length; i++)
		{
			console.log(ratings[i]);
			calendarItems.push({
				title: 		ratings[i].product,
				date: 		ratings[i].date,
				group: 		ratings[i].event,
				itemType: 	UI.constants.TYPE_RATING,
				item: 		ratings[i],
			});
		}
		
		return calendarItems;
	};
	
	this.selectCalendarItem = function(items)
	{
		console.log("calendar select:");
		console.log(items);
		
		if(items.length == 1)
		{
			var item = items[0];
			if(item.itemType == UI.constants.TYPE_EVENT)
				UI.updateEventForm(item.item, true);
			else if(item.itemType == UI.constants.TYPE_RATING)
				UI.updateRatingForm(item.item, true);
		}
		else if(items.length > 1)
		{
			var list = document.getElementById("select_calendar_item_list");
			Elements.removeChildren(list);
			
			var element;
			for(var i = 0; i < items.length; i++)
			{
				element = Elements.fromString("<li class=''>" + items[i].title + "</li>");
				if(items[i].itemType == UI.constants.TYPE_EVENT)
					element.onclick = function(item) { return function() { UI.updateEventForm(item); document.getElementById("select_calendar_item").classList.add("hidden"); }; }(items[i].item);
				else if(items[i].itemType == UI.constants.TYPE_EVENT)
					element.onclick = function(item) { return function() { UI.updateRatingForm(item); document.getElementById("select_calendar_item").classList.add("hidden"); }; }(items[i].item);
				list.append(element);
			}
			
			document.getElementById("select_calendar_item").classList.remove("hidden");
		}
		else
		{
			// nothing to display
		}
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
		this.populateCategorySelects();
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
		this.calendar = new Calendar("calendar", true, 1, this.getCalendarItems());
		this.calendar.onUpdate = function() { UI.labelManager.updateLabels(); };
		this.calendar.onSelect = this.selectCalendarItem;
		
		/* initialize rating lists */

		/* manage categories */
		this.populateManageCategories();
		let manageCategoriesCloseButton = document.getElementById("manage_categories").getElementsByClassName("close")[0];
		Events.addEventListener(Events.CLICK, function(event) { UI.populateMenu(); UI.populateManageCategories(); UI.populateCategorySelects(); }, manageCategoriesCloseButton);
		
		/* select view */
		this.showView(this.constants.VIEW_PERSONAL_RATINGS);
		
		/* update locale dependent labels */
		this.labelManager.updateLabels();
	};	
	
	return this;
}();

