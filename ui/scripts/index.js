var UI = function() {
	var constants = {
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
		ADVANCED_ADD: true,
		ADVANCED_ADD_TIMEOUT: 1000,
		RATINGS_PAGE_SIZE: 12,
		CALENDAR_INIT_RANGE: 2,
	};
	
	var labelManager;
	
	var searchInput;
	var menu;
	var calendar;
	
	var categories;
	var defaultCategory = 0;
	
	var view;
	
	var ratingsRangeStart = 0;
	var ratingsRangeEnd = 0;
	var ratingsLoading = false;
	
	var calendarMonth = 0;
	var calendarYear = 0;
	var calendarRangeStart = 0;
	var calendarRangeEnd = 0;
	
	var timers = {};
	
	var populateMenu = function()
	{
		var menuCategories = document.getElementById("menu_categories_list")
		Elements.removeChildren(menuCategories);
				
		categories = app.getCategories();
		
		var element;
		for(var c = 0; c < categories.length; c++)
		{
			console.log(categories[c]);
			// populate menu
			if(categories[c].favorite)
			{
				element = Elements.fromString("<li class='selectable'><label key='" + categories[c].category.key + ".title'/></li>");
				element.append(Elements.createSVG("0 0 150 100", "image active", "#img_filter_active"));	
				element.append(Elements.createSVG("0 0 150 100", "image not_active", "#img_filter_inactive"));	
										
				if(categories[c].active)
					element.classList.add("active");
				Events.addEventListener(Events.CLICK, function(i, e) {
					return function(event) {
						categories[i].active = !categories[i].active;						
						if(categories[i].active)
							e.classList.add("active");
						else
							e.classList.remove("active");
						app.setCategories(categories);
						populateCategorySelects();
					};
				}(c, element), element);
				menuCategories.append(element);
			}
		}
		labelManager.updateLabels(menuCategories);
	};	
	
	var swapManageCategories = function(element, fromIndex, toIndex)
	{
		console.log("swap " + fromIndex + "->" + toIndex);
		let tmp = categories[fromIndex];
		categories[fromIndex] = categories[toIndex];
		categories[toIndex] = tmp
		
		categories[fromIndex].position = fromIndex;
		categories[toIndex].position = toIndex;
		
		// TODO
		let other = element.parentElement.getElementsByClassName("position" + toIndex)[0];
		
		other.classList.add("position" + fromIndex);
		other.classList.remove("position" + toIndex);
		other.style.top = (constants.CATEGORIES_LIST_LINE_HEIGHT * fromIndex) + "em";
		
		element.classList.add("position" + toIndex);
		element.classList.remove("position" + fromIndex);
		element.style.top = (constants.CATEGORIES_LIST_LINE_HEIGHT * toIndex) + "em";
		
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
		if(fromIndex == categories.length-1 && toIndex == categories.length-2)
		{
			other.classList.add("last");
			element.classList.remove("last");
		}
		else if(fromIndex == categories.length-2 && toIndex == categories.length-1)
		{
			element.classList.add("last");
			other.classList.remove("last");
		}
	};	
	
	var populateManageCategories = function()
	{
		let manageCategories = document.getElementById("manage_categories_list")
		Elements.removeChildren(manageCategories);
		
		categories = app.getCategories();
		
		let element;
		for(var c = 0; c < categories.length; c++)
		{
		// populate manage categories	
			var posClasses = "position" + categories[c].position;
			if(c == 0)
				posClasses += " first";
			else if(c == categories.length-1)
				posClasses += " last";
			
			element = Elements.fromString("<li class='draggable selectable " + posClasses + "'><label key='" + categories[c].category.key + ".title'/></li>");
			element.append(Elements.createSVG("0 0 100 100", "image star favorite", "#img_star_active"));	
			element.append(Elements.createSVG("0 0 100 100", "image star no_favorite", "#img_star_inactive"));	
			element.append(Elements.createSVG("0 0 100 100", "image down", "#img_arrow_down"));	
			element.append(Elements.createSVG("0 0 100 100", "image up", "#img_arrow_up"));	

			element.style.top = (constants.CATEGORIES_LIST_LINE_HEIGHT * c) + "em";
				
			console.log(element);
			if(categories[c].favorite)
				element.classList.add("favorite");
			Events.addEventListener(Events.CLICK, function(category, e) {
				return function(event) {
					var i = category.position;
					console.log("click star " + categories[i].category.key + " @ pos=" + i);
					categories[i].favorite = !categories[i].favorite;						
					if(categories[i].favorite)
						e.classList.add("favorite");
					else
						e.classList.remove("favorite");
					app.setCategories(categories);
				};
			}(categories[c], element), element.getElementsByClassName("star"));
			Events.addEventListener(Events.CLICK, function(category, e) {
				return function(event) {
					var i = category.position;
					console.log("click up " + categories[i].category.key + " @ pos=" + i);
					if(i > 0)
					{
						swapManageCategories(e, i, i-1);
					}
					app.setCategories(categories);
				};
			}(categories[c], element), element.getElementsByClassName("up"));
			Events.addEventListener(Events.CLICK, function(category, e) {
				return function(event) {
					var i = category.position;
					console.log("click down " + categories[i].category.key + " @ pos=" + i);
					if(i < categories.length-1)
					{
						swapManageCategories(e, i, i+1);
					}
					app.setCategories(categories);
				};
			}(categories[c], element), element.getElementsByClassName("down"));
			
			manageCategories.append(element);
		}
		
		manageCategories.style.height = (categories.length * constants.CATEGORIES_LIST_LINE_HEIGHT) + "em";
		labelManager.updateLabels(manageCategories);
	};
	
	var populateCategorySelects = function() {
		var categorySelects = document.getElementsByClassName("category_select");
		var option, label;
		for(var i = 0; i < categorySelects.length; i++)
		{
			Elements.removeChildren(categorySelects[i]);
			
			for(var j = 0; j < categories.length; j++)
			{
				if(categories[j].favorite)
				{
					option = document.createElement("option");
					option.setAttribute("value", categories[j].category.id);
					label = document.createElement("label");
					label.setAttribute("key", categories[j].category.key + ".title");
					option.append(label);
					categorySelects[i].append(option);
				}
			}
			labelManager.updateLabels(categorySelects[i]);				
		}
		// calculate default value						
		var numberOfFavorites = 0;	
		var numberOfActives = 0;			
		var firstFavoriteValue = 0;		
		var firstActiveValue = 0;
		for(var j = 0; j < categories.length; j++)
		{
			if(categories[j].favorite)
			{
				numberOfFavorites++;
				if(firstFavoriteValue == 0)
					firstFavoriteValue = categories[j].category.id;
			}	
			if(categories[j].active)
			{
				numberOfActives++;
				if(firstActiveValue == 0)
					firstActiveValue = categories[j].category.id;
			}					
		}
		if(numberOfFavorites == 1)
			defaultCategory = firstFavoriteValue;
		else if(numberOfActives == 1)
			defaultCategory = firstActiveValue;
		else
			defaultCategory = 0;
	};
	
	var populateRatings = function(list, ratings)
	{
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
			// the following is the same as above, but much faster!!! ~ factor 1000:
			// - above = several seconds (dependings on number of elements
			// - below = few milleseconds
			li = document.createElement("li");
				div = document.createElement("div");
				div.classList.add("image");
				if(ratings[r].image)
					div.style.backgroundImage = "url(" + ratings[r].image + ")" ; 
				else
					div.style.backgroundImage = "url(" + getCategory(ratings[r].category).category.defaultImage + ")" ; 
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
				
				Events.addEventListener(Events.CLICK, function(rating) { return function(event) { updateRatingForm(rating, true); }; }(ratings[r]), li);
			list.append(li);
			
			// create ellipsis
			Elements.addEllipsis(div2);
		}
	};
	
	var populateRatingsView = function(view) {
		var scope = 0;
		if(view == constants.VIEW_PERSONAL_RATINGS)
			scope = constants.SCOPE_PERSONAL;
		else if(view == constants.VIEW_FRIENDS_RATINGS)
			scope = constants.SCOPE_FRIENDS;
		if(view == constants.VIEW_GLOBAL_RATINGS)
			scope = constants.SCOPE_GLOBAL;	
		
		var container = document.getElementById(view);
		var list = container.firstElementChild;
		Elements.removeChildren(list);
		var more = container.lastElementChild;
		more.classList.remove("allLoaded");
		
		ratingsRangeStart = 0;
		ratingsRangeEnd = 0;
		
		var loadPage = function(list) {		
			ratingsLoading = true;	
			var page = app.getRatings(scope, ratingsRangeEnd, constants.RATINGS_PAGE_SIZE);
			ratingsRangeEnd += page.length;
			if(page.length > 0)
				populateRatings(list, page);
			if(page.length < constants.RATINGS_PAGE_SIZE)
				list.parentElement.lastElementChild.classList.add("allLoaded");
			ratingsLoading = false;
		};
		
		Events.addEventListener(Events.SCROLL, function(loadPage, list) {
			return function(event) {
				var element = event.target;
				var bottomRemaining = element.scrollHeight - element.offsetHeight - element.scrollTop;
				if(bottomRemaining < container.lastElementChild.offsetHeight/2)
				{
					// more-element is scrolled into view
					if(!ratingsLoading)
					{
						console.log("loading more content");
						loadPage(list);
					}
				}
			};
		} (loadPage, list), container.parentElement);
				
		loadPage(list);
	};
	
	var showView = function(view) {
		var frame = document.getElementById("content_frame");
		view = view;		
		
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
		if(view == constants.VIEW_CALENDAR)
		{
			calendar.clearItems();
			calendarRangeStart 	= new Date(calendar.currentYear, calendar.currentMonth - constants.CALENDAR_INIT_RANGE, 1);	
			calendarRangeEnd   	= new Date(calendar.currentYear, calendar.currentMonth + constants.CALENDAR_INIT_RANGE + 1, 0)
			calendar.addItems(app.getCalendarItems(calendarRangeStart, calendarRangeEnd));
		}
		else if(view == constants.VIEW_PERSONAL_RATINGS)
		{
			populateRatingsView(view);
		}
		else if(view == constants.VIEW_FRIENDS_RATINGS)
		{
			populateRatingsView(view);
		}
		else if(view == constants.VIEW_GLOBAL_RATINGS)
		{
			populateRatingsView(view);
		}
		
		// TODO remove load screen
	};
	
	var showAdd = function()
	{
		var timer = getTimer("ADD");
		clearTimer("ADD");
		
		console.log("showAdd called for '" + view + "' (advanced=" + constants.ADVANCED_ADD + ", timer=" + timer + ")");
		
		if(constants.ADVANCED_ADD && (timer > constants.ADVANCED_ADD_TIMEOUT))
		{
			console.log("advanced add...");
			
			var list = document.getElementById("select_type_list");
			Elements.removeChildren(list);
			
			// event
			element = Elements.fromString("<li class='selectable'><label key='select_type.event'></label></li>");
			element.onclick = function(event) { updateEventForm(null, false); document.getElementById("select_type").classList.add("hidden"); };
			list.append(element);
			// rating
			element = Elements.fromString("<li class='selectable'><label key='select_type.rating'></label></li>");
			element.onclick = function(event) { updateRatingForm(null, false); document.getElementById("select_type").classList.add("hidden"); };
			list.append(element);
						
			labelManager.updateLabels(list);
			document.getElementById("select_type").classList.remove("hidden");
		}
		else
		{
			updateRatingForm(null, false);			
		}
		menu.hide();
	};
	
	var startTimer = function(timer)
	{
		timers[timer] = new Date().getTime();
	};
	
	var getTimer = function(timer)
	{
		return new Date().getTime() - timers[timer];
	};
	
	var clearTimer = function(timer)
	{
		timers[timer] = null;
	};
	
	var updateForm = function(form, object, viewmode)
	{
		form.object = object;
		createElements = form.getElementsByClassName("create");
		editElements = form.getElementsByClassName("edit");
		viewElements = form.getElementsByClassName("view");
		editButton = form.getElementsByClassName("showEdit")[0];
		validatableElements = form.getElementsByClassName("validatable");
		if(viewmode)
		{
			// hide create/edit elements
			for(var i = 0; i < createElements.length; i++)
			{
				createElements[i].classList.add("hidden");
			}
			for(var i = 0; i < editElements.length; i++)
			{
				editElements[i].classList.add("hidden");
			}
			// show view elements
			for(var i = 0; i < viewElements.length; i++)
			{
				viewElements[i].classList.remove("hidden");
			}
			// hide showEdit button
			if(object.editable && editButton)
				editButton.classList.remove("hidden");
			else if(editButton)
				editButton.classList.add("hidden");
				
		}
		else if(object != null)
		{
			// hide create/view elements
			for(var i = 0; i < createElements.length; i++)
			{
				createElements[i].classList.add("hidden");
			}
			for(var i = 0; i < viewElements.length; i++)
			{
				viewElements[i].classList.add("hidden");
			}
			// show edit elements
			for(var i = 0; i < editElements.length; i++)
			{
				editElements[i].classList.remove("hidden");
			}
			// hide showEdit button
			if(editButton)
				editButton.classList.add("hidden");
		}
		else
		{
			// hide edit/view elements
			for(var i = 0; i < editElements.length; i++)
			{
				editElements[i].classList.add("hidden");
			}
			for(var i = 0; i < viewElements.length; i++)
			{
				viewElements[i].classList.add("hidden");
			}
			// show create elements
			for(var i = 0; i < createElements.length; i++)
			{
				createElements[i].classList.remove("hidden");
			}
			// hide showEdit button
			if(editButton)
				editButton.classList.add("hidden");
		}
		// update form elements
		for(var i = 0; i < validatableElements.length; i++)
		{
			// remove input errors
			validatableElements[i].classList.remove("invalid");
			
			// enable/disable form elements
			validatableElements[i].disabled = viewmode;
		}
		form.classList.remove("hidden");
	};
	
	var updateEventForm = function(event, viewmode)
	{
		form = document.getElementById("form_event");	
		if(event != null)
		{
			// populate all fields
			document.getElementById("event_title").value = event.title;
			document.getElementById("event_date").value = new Date(event.date).toDatetimeLocal(); // convert date to datetimelocal ISO-string using lib first	
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
		updateForm(form, event, viewmode);
	};
	
	var submitEventForm = function(form)
	{
		// validate
		valid = true;
		// Note: use "&& valid" at end to ensure method call
		valid = validateElement(document.getElementById("event_title"),	 		"value", constants.TYPE_EVENT, "title") && valid;
		valid = validateElement(document.getElementById("event_date"), 			"value", constants.TYPE_EVENT, "date") && valid;
		valid = validateElement(document.getElementById("event_location"), 		"value", constants.TYPE_EVENT, "location") && valid;
		valid = validateElement(document.getElementById("event_description"), 	"value", constants.TYPE_EVENT, "description") && valid;
		console.log("from valid ? " + valid);
		if(valid)
		{		
			event = form.object;
			if(event == null) event = {};
			// get all fields
			event.title = document.getElementById("event_title").value;
			event.date = new Date(document.getElementById("event_date").value).getTime(); // timezone is applied only, when using ISO-string constructor
			event.location = document.getElementById("event_location").value;
			event.description = document.getElementById("event_description").value;		
			app.saveEvent(event);	
			// update calendar
			calendar.addItems([event]);
		}
		return valid;
	};
	
	var updateRatingForm = function(rating, viewmode)
	{
		form = document.getElementById("form_rating");
		if(rating != null)
		{
			var percent = Math.round(rating.stars*2)*10;
			// populate all fields
			document.getElementById("rating_category").value = rating.category;
			document.getElementById("rating_product").value = rating.product;
			document.getElementById("rating_date").value = new Date(rating.date).toDatetimeLocal(); // convert date to datetimelocal ISO-string using lib first	
			document.getElementById("rating_event").value = (rating.event != null ? rating.event.title : "");
			document.getElementById("rating_event").object = rating.event;
			document.getElementById("rating_location").value = rating.location;
			// TODO image
			document.getElementById("rating_stars").style.width = percent + "%";
			document.getElementById("rating_stars").value = rating.stars;
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
			document.getElementById("rating_category").value = defaultCategory; // calculated on update of categories
			document.getElementById("rating_product").value = "";
			document.getElementById("rating_date").value = null	;
			document.getElementById("rating_event").value = "";
			document.getElementById("rating_event").object = null;
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
		updateForm(form, rating, viewmode);
	};
	
	var submitRatingForm = function(form)
	{
		// validate
		valid = true;
		// Note: use "&& valid" at end to ensure method call
		valid = validateElement(document.getElementById("rating_category"),	 	"value", constants.TYPE_RATING, "category") && valid;
		valid = validateElement(document.getElementById("rating_product"), 		"value", constants.TYPE_RATING, "product") && valid;
		valid = validateElement(document.getElementById("rating_date"), 		"value", constants.TYPE_RATING, "date") && valid;
		valid = validateElement(document.getElementById("rating_event"), 		"object", constants.TYPE_RATING, "event") && valid;
		valid = validateElement(document.getElementById("rating_location"), 	"value", constants.TYPE_RATING, "location") && valid;
			// TODO image
			// TODO stars
		valid = validateElement(document.getElementById("rating_summary"), 		"value", constants.TYPE_RATING, "summary") && valid;
			// TODO spider
		valid = validateElement(document.getElementById("rating_nose_text"), 	"value", constants.TYPE_RATING, "nose_text") && valid;
		valid = validateElement(document.getElementById("rating_nose_tags"), 	"value", constants.TYPE_RATING, "nose_tags") && valid;
		valid = validateElement(document.getElementById("rating_taste_text"), 	"value", constants.TYPE_RATING, "taste_text") && valid;
		valid = validateElement(document.getElementById("rating_taste_tags"), 	"value", constants.TYPE_RATING, "taste_tags") && valid;
		valid = validateElement(document.getElementById("rating_finish_text"), 	"value", constants.TYPE_RATING, "finish_text") && valid;
		valid = validateElement(document.getElementById("rating_finish_tags"), 	"value", constants.TYPE_RATING, "finish_tags") && valid;
		
		if(valid)
		{	
			rating = form.object;
			if(rating == null) rating = {};
			// get all fields
			rating.category = Number(document.getElementById("rating_category").value);
			rating.product = document.getElementById("rating_product").value;
			rating.date = new Date(document.getElementById("rating_date").value).getTime(); // timezone is applied only, when using ISO-string constructor
			rating.event = document.getElementById("rating_event").object; // value contains only the title
			rating.location = document.getElementById("rating_location").value;
			// TODO image
			rating.stars = document.getElementById("rating_stars").value;
			rating.summary = document.getElementById("rating_summary").value;
			// TODO spider	
			rating.noseText = document.getElementById("rating_nose_text").value;	
			rating.noseTags = document.getElementById("rating_nose_tags").value;	
			rating.tasteText = document.getElementById("rating_taste_text").value;	
			rating.tasteText = document.getElementById("rating_taste_tags").value;	
			rating.finishText = document.getElementById("rating_finish_text").value;	
			rating.finishText = document.getElementById("rating_finish_tags").value;	
			app.saveRating(rating);
			// update views
			showView(view);
		}
		return valid;
	};
	
	var submitForm = function(form)
	{
		if(form.getAttribute("type") == constants.TYPE_EVENT)
			return submitEventForm(form);
		else if(form.getAttribute("type") == constants.TYPE_RATING)
			return submitRatingForm(form);
	};
	
	var resetForm = function(form)
	{
		if(form.getAttribute("type") == constants.TYPE_EVENT)
			return updateEventForm(form.object, true);
		else if(form.getAttribute("type") == constants.TYPE_RATING)
			return updateRatingForm(form.object, true);
	};
	
	var validateElement = function(element, property, type, field)
	{
		var valid = app.validate(type, field, element[property]);
		if(valid)
			element.classList.remove("invalid");
		else
			element.classList.add("invalid");
		return valid;
	};
	
	var getCategory = function(id) {
		for(var i = 0; i < categories.length; i++)
		{
			if(categories[i].category.id == id)
				return categories[i];
		}
		return null;
	};
	
	var selectCalendarItem = function(items)
	{
		console.log("calendar select:");
		console.log(items);
		
		if(items.length == 1)
		{
			var item = items[0];
			if(item.itemType == constants.TYPE_EVENT)
				updateEventForm(item.item, true);
			else if(item.itemType == constants.TYPE_RATING)
				updateRatingForm(item.item, true);
		}
		else if(items.length > 1)
		{
			var list = document.getElementById("select_calendar_item_list");
			Elements.removeChildren(list);
			
			var element;
			for(var i = 0; i < items.length; i++)
			{
				element = Elements.fromString("<li class='selectable'>" + items[i].title + "</li>");
				if(items[i].itemType == constants.TYPE_EVENT)
					element.onclick = function(item) { return function() { updateEventForm(item, true); document.getElementById("select_calendar_item").classList.add("hidden"); }; }(items[i].item);
				else if(items[i].itemType == constants.TYPE_RATING)
					element.onclick = function(item) { return function() { updateRatingForm(item, true); document.getElementById("select_calendar_item").classList.add("hidden"); }; }(items[i].item);
				list.append(element);
			}
			
			document.getElementById("select_calendar_item").classList.remove("hidden");
		}
		else
		{
			// nothing to display
		}
	};
	
	var initialize = function()
	{		
		/* create LabelManager for updating locale dependent labels */
		labelManager = new LabelManager(app, app.getString);
		
		/* initialize top bar */
		searchInput = new AutoHide("search", 5000, [Events.KEYDOWN, Events.KEYPRESSED, Events.KEYUP, Events.CLICK, Events.MOUSEDOWN, Events.MOUSEUP]);
		Events.addEventListener(Events.CLICK, 		function(event) { searchInput.show(); 							}, 	document.getElementById("search_button"));
		Events.addEventListener(Events.MOUSEDOWN, 	function(event) { startTimer("ADD"); }, 								document.getElementById("add_button"));
		Events.addEventListener(Events.TOUCHSTART, 	function(event) { startTimer("ADD"); }, 								document.getElementById("add_button"));
		Events.addEventListener(Events.MOUSEUP, 	function(event) { showAdd(); 			event.preventDefault(); }, 	document.getElementById("add_button"));
		Events.addEventListener(Events.TOUCHEND, 	function(event) { showAdd(); 			event.preventDefault(); }, 	document.getElementById("add_button"));
		
		/* initialize menu */
		menu = new Hideable("menu", false);
		populateMenu();
		Events.addEventListener(Events.CLICK, function(event) { menu.toggle(); 		event.preventDefault(); }, document.getElementById("menu_button"));
		//Events.addEventListener(Events.CLICK, function(event) { if(!event.defaultPrevented) menu.hide(); 	}, document.getElementById("main"));
		Events.addEventListener(Events.CLICK, function(event) { menu.hide(); 								}, document.getElementById("overlay"));
		/* menu elements */
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_categories"); 	menu.hide(100); document.getElementById("manage_categories").classList.remove("hidden"); }, document.getElementById("menu_categories"));
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_profile"); 		menu.hide(100); /* TODO */			}, document.getElementById("menu_profile"));
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_settings"); 	menu.hide(100); /* TODO */			}, document.getElementById("menu_settings"));
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_help"); 		menu.hide(100); /* TODO */ app.resetDatabase(true); }, document.getElementById("menu_help"));
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_about"); 		menu.hide(100); /* TODO */			}, document.getElementById("menu_about"));
		Events.addEventListener(Events.CLICK, function(event) { console.log("click menu_exit"); 		menu.hide(100); app.exit(); 			}, document.getElementById("menu_exit"));
		
		/* initialize bottom bar */
		Events.addEventListener(Events.CLICK, function(event) { showView(constants.VIEW_CALENDAR); 			}, document.getElementById(constants.VIEW_CALENDAR 			+ "_button"));
		Events.addEventListener(Events.CLICK, function(event) { showView(constants.VIEW_PERSONAL_RATINGS); 	}, document.getElementById(constants.VIEW_PERSONAL_RATINGS 	+ "_button"));
		Events.addEventListener(Events.CLICK, function(event) { showView(constants.VIEW_FRIENDS_RATINGS); 	}, document.getElementById(constants.VIEW_FRIENDS_RATINGS 	+ "_button"));
		Events.addEventListener(Events.CLICK, function(event) { showView(constants.VIEW_GLOBAL_RATINGS); 		}, document.getElementById(constants.VIEW_GLOBAL_RATINGS 	+ "_button"));
		
				
		/* initialize windows */
		populateCategorySelects();
		/* close buttons */
		let closeButtons = document.querySelectorAll(".window .close");
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
						if(submitForm(element))
							element.classList.add("hidden");
						break;
					}
					element = element.parentElement;
				}
			}, okButtons[i]);
		}
		/* cancel buttons */
		let cancelButtons = document.querySelectorAll(".window .cancel");
		for(var i = 0; i < cancelButtons.length; i++)
		{
			Events.addEventListener(Events.CLICK, function(event) {
				var element = event.target;
				while(element != null)
				{
					if(element.classList.contains("form"))
					{
						var object = form.object;
						console.log("discarding...")
						console.log(object);
						resetForm(form);
						break;
					}
					element = element.parentElement;
				}
			}, cancelButtons[i]);
		}	
		/* edit buttons */
		let editButtons = document.querySelectorAll(".window .showEdit");
		for(var i = 0; i < editButtons.length; i++)
		{
			Events.addEventListener(Events.CLICK, function(event) {
				var element = event.target;
				while(element != null)
				{
					if(element.classList.contains("form"))
					{
						var object = form.object;
						console.log("editing...")
						console.log(object);
						updateForm(form, object, false);
						break;
					}
					element = element.parentElement;
				}
			}, editButtons[i]);
		}	
		/* star selectors */
		let starSelectors = document.querySelectorAll(".stars");
		for(var i = 0; i < starSelectors.length; i++)
		{
			Events.addEventListener(Events.CLICK, function(event) {
				var element = event.target;
				// find correct target element
				while(!element.classList.contains("stars"))
					element = element.parentElement;			
				
				if(!element.parentElement.disabled)
				{
					var stars = Math.floor((event.offsetX/element.offsetWidth)*5+1);
					var percent = Math.round(stars*2)*10;
					console.log("click @ " + event.offsetX + " of " + element.offsetWidth + " => " + stars + " = " + percent + "%");
					console.log(element);
					
					element.getElementsByClassName("percent")[0].style.width = percent + "%";
					element.getElementsByClassName("percent")[0].value = stars;
				}			
			}, starSelectors[i]);
		}	
		/* auto size textareas */
		let textareas = document.getElementsByTagName("textarea");
		var autosize = function(event) {
			console.log(event);
			var element = event.target;
			element.style.height = 'auto';
			element.style.height = element.scrollHeight + "px";						
		};
		var delayAutosize = function(event) {
			// 0-timeout to get the already changed text
			setTimeout(function(event) {return function() { autosize(event); }; }(event), 0);
		};
		for(var i = 0; i < textareas.length; i++)
		{
			Events.addEventListener(Events.CHANGE, 	autosize, textareas[i]);
			Events.addEventListener(Events.CUT, 	delayAutosize, textareas[i]);
			Events.addEventListener(Events.PASTE, 	delayAutosize, textareas[i]);
			Events.addEventListener(Events.DROP, 	delayAutosize, textareas[i]);
			Events.addEventListener(Events.KEYDOWN,	delayAutosize, textareas[i]);
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
				menu.hide();
			}
		}, document.getElementById("main"));
		*/
		
		/* initialize calendar */
		calendar = new Calendar("calendar", true, 1);
		calendar.onUpdate = function() { labelManager.updateLabels(); };
		calendar.onPreviousMonth = function() {
			var oldStart = new Date(calendarRangeStart);
			calendarRangeStart.setMonth(calendarRangeStart.getMonth() - 1);
			calendar.addItems(app.getCalendarItems(calendarRangeStart, oldStart));
		};
		calendar.onNextMonth = function() {
			var oldEnd = new Date(calendarRangeEnd);
			calendarRangeEnd.setMonth(calendarRangeEnd.getMonth() + 1);
			calendar.addItems(app.getCalendarItems(oldEnd, calendarRangeEnd));
		};
		calendar.onSelect = selectCalendarItem;
				
		/* initialize rating lists */

		/* manage categories */
		populateManageCategories();
		let manageCategoriesCloseButton = document.getElementById("manage_categories").getElementsByClassName("close")[0];
		Events.addEventListener(Events.CLICK, function(event) { populateMenu(); populateManageCategories(); populateCategorySelects(); }, manageCategoriesCloseButton);
		
		/* select view */
		showView(constants.VIEW_PERSONAL_RATINGS);
		
		/* update locale dependent labels */
		labelManager.updateLabels();
	};
	
	// export public properties & functions
	return {
		// constants
		constants: constants,
		// elements
		getMenu: function() { return menu; },
		getCalendar: function() { return calendar; },
		// utilities
		getLabelManager: function() { return labelManager; },
		// show view elements
		showView: showView,
		showAdd: showAdd,
		// form handling
		updateEventForm: updateEventForm,
		submitEventForm: submitEventForm,
		updateRatingForm: updateRatingForm,
		submitRatingForm: submitRatingForm,
		submitForm: submitForm,
		resetForm: resetForm,
		// category access
		getCategory: getCategory,
		// initialization
		initialize: initialize,
	};
}();

