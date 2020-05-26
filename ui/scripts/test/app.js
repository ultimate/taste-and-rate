var app = function() {
	
	var CURRENT_USER = 1;
	var FRIENDS = [2,3,4];
	
	var NUMBER_OF_EVENT_SAMPLES = 100;
	var NUMBER_OF_RATING_SAMPLES = 1000;
	
	var LOREM_IPSUM = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\
						Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.\
						Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.\
						Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.\
						Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.\
						At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.\
						Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.";
	var LOREM_IPSUM_ARR = LOREM_IPSUM.split(" ");
	
	var EXAMPLE_TAGS = ["sweet", "old", "dark", "bright", "fruity", "high alcohol", "spicy"];
						
	var loremIpsum = function(maxLength)
	{
		var r = Math.random();
		var l = Math.floor(r*r*Math.min(LOREM_IPSUM_ARR.length,maxLength));
		return LOREM_IPSUM_ARR.slice(0, -(LOREM_IPSUM_ARR.length-l)).join(" ");
	}
	
	var getString = function(key) {
		if(key == null || key == "")
			return key; // otherwise the following eval would fail!
		return eval("lang." + key);
	};
	
	// categories
	
	var getCategoryNames = function() {
		var result = [];
		var categories = getCategories();
		for(var c = 0; c < categories.length; c++)
		{
			result.push(categories[c].category.key);
		}
		return result;
	};
	
	var getCategories = function() {
		console.log("loading categories");
		var categories = _loadLocal("categories");
		if(categories == null)
		{	
			console.log("no categories found in local storage - loading default")
			categories = [
				{ position: 0, favorite: true,  active: true,  category: TEST_CAT_RUM },
				{ position: 1, favorite: true,  active: false, category: TEST_CAT_WHISKEY },
				{ position: 2, favorite: false, active: false, category: TEST_CAT_BEER }
			];
		}
		setCategories(categories);
		return categories;
	};
	
	var setCategories = function(categories) {
		for(var c = 0; c < categories.length; c++)
		{
			console.log(categories[c]);
		}
		_saveLocal("categories", categories);
	};	

	// item validation
	
	var validate = function(type, field, value) {
		console.log(type + "." + field + "?" + value);
		switch(type)
		{
			case UI.constants.TYPE_EVENT:
				switch(field)
				{
					case "title":		if(value == null || value == "") return false;
					case "date":		if(value == null || value == "") return false;
					case "location":	if(value == null) return false;
					case "description":	if(value == null) return false;
				}				
				return true;
			case UI.constants.TYPE_RATING:
				switch(field)
				{
					case "category":	if(value == null || value == "") return false;
					case "product":		if(value == null || value == "") return false;
					case "date":		if(value == null || value == "") return false;
					case "event":		break; // if(value == null) return false;
					case "location":	if(value == null) return false;
					case "summary":		if(value == null) return false;
					case "nose_text":	if(value == null) return false;
					case "nose_tags":	if(value == null) return false;
					case "taste_text":	if(value == null) return false;
					case "taste_tags":	if(value == null) return false;
					case "finish_text":	if(value == null) return false;
					case "finish_tags":	if(value == null) return false;
				}
				return true;
			default:
				throw new Error("unsupported type");
		}
	};
	
	// localStorage
	
	var _saveLocal = function(key, object) {
		localStorage.setItem(key, JSON.stringify(object));
	};
	
	var _loadLocal = function(key) {
		var json = localStorage[key];
		if(json != null)
			return JSON.parse(json);
		return null;
	};
	
	var _removeLocal = function(key) {
		localStorage.removeItem(key);
	};
	
	var _clearLocal = function() {
		localStorage.clear();
	};
	
	// general save & load
	
	
	
	var save = function(type, object) {
		var list = null;
		switch(type)
		{
			case UI.constants.TYPE_EVENT:
				list = events;
				break;
			case UI.constants.TYPE_RATING:
				list = ratings;
				break;
			default:
				throw new Error("unsupported type: '" + type + "'");
		}
		if(object == null)
			return;
		if(object.id == null)
		{
			object.id = _loadLocal(type + "_id") + 1;
			if(object.creator == null)
				object.creator = CURRENT_USER;
			_saveLocal(type + "_id", object.id);
			if(list != null)
				list.push(object);
		}
		_saveLocal(type + "_" + object.id, object);
	};
	
	var load = function(type, id) {
		if(id == null)
			return null;
		var object = _loadLocal(type + "_" + id);
		object.editable = (object.creator == CURRENT_USER);
		return object;
	};
	
	// save & load for events
	
	var events = null;
		
	var saveEvent = function(event) {
		//if(event.id == null)
		//	events.push(event);
		save(UI.constants.TYPE_EVENT, event);
	};	
	
	var loadEvent = function(id) {
		return load(UI.constants.TYPE_EVENT, id);
	};
	
	var getEvents = function() {
		if(events == null)
		{
			console.log("loading events from storage");
			var start = new Date().getTime();
			events = [];
			var maxId = _loadLocal(UI.constants.TYPE_EVENT + "_id");
			for(var i = 1; i <= maxId; i++)
			{
				events.push(loadEvent(i));
				console.log(".");
			}
			console.log("this took " + (new Date().getTime() - start) +  "ms");
		}
		return events;
	};
	
	// save & load for ratings
		
	var ratings = null;
	
	var saveRating = function(rating) {
		//if(rating.id == null)
		//	ratings.push(rating);
		save(UI.constants.TYPE_RATING, rating);
	};	
	
	var loadRating = function(id) {
		return load(UI.constants.TYPE_RATING, id);
	};
	
	var getRatings = function(scope, startIndex, amount) {
		if(ratings == null)
		{	
			console.log("loading ratings from storage");
			var start = new Date().getTime();
			ratings = [];
			var maxId = _loadLocal(UI.constants.TYPE_RATING + "_id");
			for(var i = 1; i <= maxId; i++)
			{
				ratings.push(loadRating(i));
				console.log(".");
			}
			console.log("this took " + (new Date().getTime() - start) +  "ms");
		}
		// get active categories
		var categories = getCategories();
		var activeCategories = [];
		for(var c = 0; c < categories.length; c++)
		{	
			if(categories[c].active)
				activeCategories.push(categories[c].category.id);
		}
		console.log("active categories: " + activeCategories);		
		// filter by scope
		var result = [];
		for(var r = 0; r < ratings.length; r++)
		{
			if(activeCategories.indexOf(ratings[r].category) == -1)
				continue;
			if((scope & UI.constants.SCOPE_PERSONAL) != 0 && CURRENT_USER == ratings[r].creator)
				result.push(ratings[r]);
			if((scope & UI.constants.SCOPE_FRIENDS) != 0 && FRIENDS.indexOf(ratings[r].creator) != -1)
				result.push(ratings[r]);
			if((scope & UI.constants.SCOPE_GLOBAL) != 0 && CURRENT_USER != ratings[r].creator && FRIENDS.indexOf(ratings[r].creator) == -1)
				result.push(ratings[r]);
		}
		return result.slice(startIndex, startIndex + amount);
	};
	
	// fusioned list for events & ratings
		
	var getCalendarItems = function(rangeStart, rangeEnd) {
		
		console.log("loading items");
		console.log("from: " + rangeStart);
		console.log("to:   " + rangeEnd);
		
		if(rangeStart == null)
			rangeStart = 0;
		else if(rangeStart instanceof Date)
			rangeStart = rangeStart.getTime();
		if(rangeEnd == null)
			rangeEnd = new Date(2099, 12, 31).getTime();
		else if(rangeEnd instanceof Date)
			rangeEnd = rangeEnd.getTime();
		
		var calendarItems = [];
		var events = getEvents();
		var ratings = getRatings(UI.constants.SCOPE_PERSONAL, 0, 1000000);
		
		var itemTime;
		
		for(var i = 0; i < events.length; i++)
		{			
			//console.log(events[i]);
			//console.log(rangeStart + " <= " + events[i].date + " < " + rangeEnd + " ? " + (events[i].date >= rangeStart && events[i].date < rangeEnd));
			if(events[i].date >= rangeStart && events[i].date < rangeEnd)
				calendarItems.push({
					title: 		events[i].title,
					date: 		events[i].date,
					group: 		true,
					itemType: 	UI.constants.TYPE_EVENT,
					item: 		events[i],
					subItems: 	(events[i].ratings != null ? events[i].ratings.length : 0),
				});
		}
		for(var i = 0; i < ratings.length; i++)
		{
			//console.log(ratings[i]);
			//console.log(rangeStart + " <= " + ratings[i].date + " < " + rangeEnd + " ? " + (ratings[i].date >= rangeStart && ratings[i].date < rangeEnd));
			if(ratings[i].date >= rangeStart && ratings[i].date < rangeEnd)
				calendarItems.push({
					title: 		ratings[i].product,
					date: 		ratings[i].date,
					group: 		false,
					itemType: 	UI.constants.TYPE_RATING,
					item: 		ratings[i],
					subItems: 	0,
				});
		}
		
		return calendarItems;
	};	
	
	// debug purposes
		
	var randomEvent = function(eventCount) {
		
		var d = new Date(Date.now() + (Math.random()*360-180)*24*3600*1000);
		d.setSeconds(0);
		d.setMilliseconds(0);
		d = d.getTime();
		
		var creator = Math.floor(Math.random()*10);
		
		return {
			id: null,
			type: UI.constants.TYPE_EVENT,
			creator: creator,
			editable: (creator == CURRENT_USER),
			title: "Random Event " + eventCount,
			location: "Somewhere " + eventCount,
			date: d,
			description: "Do something " + eventCount + " somewhere...",
			ratings: [],
		};
	};
	
	var randomRating = function(ratingCount, event, categories) {
			
		var catIndex = Math.floor(Math.random()*categories.length);
		var category = categories[catIndex].category;
		var categoryName = getString(category.key + ".title");
						
		var spiderValues = [];
		for(var si = 0; si < category.spider.length; si++)
		{
			spiderValues.push(Math.round(Math.random()*10));
		}	
						
		var creator = Math.floor(Math.random()*10);
				
		var d;
		if(event != null)
		{
			d = event.date;
		}
		else
		{
			d = new Date(Date.now() + (Math.random()*360-180)*24*3600*1000);
			d.setSeconds(0);
			d.setMilliseconds(0);
			d = d.getTime();
		}
						
		return {
			id: null,
			type: UI.constants.TYPE_RATING,
			category: category.id,
			creator: creator,
			editable: (creator == CURRENT_USER),
			product: "The very special " + categoryName + " #" + ratingCount + " " + loremIpsum(10),
			image: (Math.random() < 0.33 ? "images/bottle1.jpg" : (Math.random() < 0.5 ? "images/bottle2.png" : "images/bottle3.jpg")),
			date: d,
			event: (event != null ? event.id : null),
			location: null, // TODO
			stars: Math.ceil(Math.random()*5),
			summary: "Summary " + ratingCount + ": " + loremIpsum(100),
			noseText: "Nose " + ratingCount + ": " + loremIpsum(20),
			noseTags: new Array(EXAMPLE_TAGS[Math.floor(Math.random()*EXAMPLE_TAGS.length)]),						
			tasteText: "Taste " + ratingCount + ": " + loremIpsum(20),
			tasteTags: new Array(EXAMPLE_TAGS[Math.floor(Math.random()*EXAMPLE_TAGS.length)]),						
			finishText: "Finish " + ratingCount + ": " + loremIpsum(20),
			finishTags: new Array(EXAMPLE_TAGS[Math.floor(Math.random()*EXAMPLE_TAGS.length)]),
			spider: spiderValues,
		};
	};
	
	var resetDatabase = function(createDummyData) {
		console.log("clearing database");
		_clearLocal();
		events = null;
		ratings = null;
		
		if(createDummyData)
		{			
			console.log("creating dummy data");
			var start = new Date().getTime();
			
			events = [];
			ratings = [];
			
			var event;
			var rating;
			
			var eventCount = 0;
			var ratingCount = 0;
			
			var categories = getCategories();
			
			for(;eventCount < NUMBER_OF_EVENT_SAMPLES;)
			{
				eventCount++;
				event = randomEvent(eventCount);				
				saveEvent(event);

				var numberOfRatings = Math.floor(Math.pow(Math.random(),2)*10);	
							
				for(var r = 0; r < numberOfRatings; r++)
				{
					ratingCount++;
					rating = randomRating(ratingCount, event, categories);					
					saveRating(rating);
					
					event.ratings.push(rating.id);
				}				
				
				// save again to persist relation to ratings
				saveEvent(event);
			}
			
			console.log("events  = " + events.length);
			console.log("ratings = " + ratings.length);
			
			for(;ratingCount < NUMBER_OF_RATING_SAMPLES;)
			{
				ratingCount++;
				rating = randomRating(ratingCount, null, categories);					
				saveRating(rating);
			}
			
			console.log("dummy data successfully created - this took " + (new Date().getTime() - start) +  "ms");
			console.log("events  = " + events.length);
			console.log("ratings = " + ratings.length);
		}
	};
	
	// general purposes
	
	var exit = function() {
		window.location.reload(true);
	};
	
	return {
		// localization
		getString: getString,
		// category access
		getCategories: getCategories,
		setCategories: setCategories,
		// item validation
		validate: validate,
		// events
		loadEvent: loadEvent,
		saveEvent: saveEvent,
		getEvents: getEvents,
		// ratings
		loadRating: loadRating,
		saveRating: saveRating,
		getRatings: getRatings,
		// fusioned list for events & ratings
		getCalendarItems: getCalendarItems,
		// general purposes
		exit: exit,
		// debugging purposes
		resetDatabase: resetDatabase,
		_getEvents: function() {return events;},
		_getRatings: function() {return ratings;},
	};
}();