var app = function() {
	
	var CURRENT_USER = 1;
	var FRIENDS = [2,3,4];
	
	var NUMBER_OF_SAMPLES = 200;
	
	var LOREM_IPSUM = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\
						Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.\
						Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.\
						Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.\
						Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.\
						At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.\
						Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.";
	var LOREM_IPSUM_ARR = LOREM_IPSUM.split(" ");
						
	var loremIpsum = function()
	{
		var r = Math.random();
		var l = Math.floor(r*r*LOREM_IPSUM_ARR.length);
		return LOREM_IPSUM_ARR.slice(0, -l).join(" ");
	}
	
	var getString = function(key) {
		if(key == null || key == "")
			return key; // otherwise the following eval would fail!
		return eval("lang." + key);
	};
	
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
		var categories = Storage.loadLocalObject("categories");
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
		Storage.removeLocalObject("categories");
		Storage.saveLocalObject("categories", categories);
	};	
	
	
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
					case "event":		if(value == null) return false;
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
				throw new Error("unsupported type");
		}
		if(object == null)
			return;
		if(object.id == null)
		{
			object.id = Storage.loadLocalObject(type + "_id") + 1;
			object.creator = CURRENT_USER;
			Storage.saveLocalObject(type + "_id", object.id);
			if(list != null)
				list.push(object);
		}
		Storage.saveLocalObject(type + "_" + object.id, object);
	};
	
	var load = function(type, id) {
		if(id == null)
			return null;
		var object = Storage.loadLocalObject(type + "_" + id);
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
			events = [];
			var d;
			var creator;
			for(var i = 1; i <= NUMBER_OF_SAMPLES; i++)
			{
				d = new Date(Date.now() + (Math.random()*360-180)*24*3600*1000);
				d.setSeconds(0);
				d.setMilliseconds(0);
				
				creator = Math.round(Math.random()*10);		
				
				events.push({
					id: -i,
					creator: creator,
					editable: (creator == CURRENT_USER),
					title: "Random Event " + i,
					location: "Somewhere " + i,
					date: d,
					description: "Do something " + i + " somewhere..."
				});
			}
			var maxId = Storage.loadLocalObject(UI.constants.TYPE_EVENT + "_id");
			for(var i = 1; i <= maxId; i++)
			{
				events.push(loadEvent(i));
			}
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
			var tags = ["sweet", "old", "dark", "bright", "fruity", "high alcohol", "spicy"];
			
			ratings = [];
			var categories = getCategories();
			var d;
			var category;
			var categoryName;
			var id;
			var spiderValues;
			var group;
			var creator;
			for(var c = 0; c < categories.length; c++)
			{		
				category = categories[c].category;
				categoryName = getString(category.key + ".title");
				for(var i = 1; i <= NUMBER_OF_SAMPLES;)
				{
					d = new Date(Date.now() + (Math.random() * 90 - 45)*24*3600*1000);
					d.setSeconds(0);
					d.setMilliseconds(0);
					
					if(Math.random() > 0.8)
						group = Math.random() * 9 + 2;
					else
						group = 1;
					
					for(var g = 0; g < group; g++)
					{										
						id = (category.id*1000 + i);
						
						spiderValues = [];
						for(var si = 0; si < category.spider.length; si++)
						{
							spiderValues.push(Math.round(Math.random()*10));
						}	
						
						creator = Math.round(Math.random()*10);			 
						
						ratings.push({
							id: -id,
							category: category.id,
							creator: creator,
							editable: (creator == CURRENT_USER),
							product: "The very special " + categoryName + " #" + i + " " + loremIpsum(),
							image: (Math.random() < 0.33 ? "images/bottle1.jpg" : (Math.random() < 0.5 ? "images/bottle2.png" : "images/bottle3.jpg")),
							date: d,
							event: (group > 1 ? "Rating Group " + d : null),
							location: null, // TODO
							stars: Math.ceil(Math.random()*5),
							summary: "Summary " + id + ": " + loremIpsum(),
							noseText: "Nose " + id + ": " + loremIpsum(),
							noseTags: new Array(tags[Math.floor(Math.random()*tags.length)]),						
							tasteText: "Taste " + id + ": " + loremIpsum(),
							tasteTags: new Array(tags[Math.floor(Math.random()*tags.length)]),						
							finishText: "Finish " + id + ": " + loremIpsum(),
							finishTags: new Array(tags[Math.floor(Math.random()*tags.length)]),
							spider: spiderValues,
						});
						i++;
					}
				}
			}
			var maxId = Storage.loadLocalObject(UI.constants.TYPE_RATING + "_id");
			for(var i = 1; i <= maxId; i++)
			{
				ratings.push(loadRating(i));
			}
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
		
	var getCalendarItems = function(scope, rangeStart, rangeEnd) {
		var calendarItems = [];
		var events = getEvents();
		var ratings = getRatings(scope, 0, 1000000);
		
		var itemTime;
		
		for(var i = 0; i < events.length; i++)
		{			
			//console.log(events[i]);
			itemTime = events[i].date.getTime();
			if(itemTime >= rangeStart && itemTime < rangeEnd)
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
			//console.log(ratings[i]);
			itemTime = ratings[i].date.getTime();
			if(itemTime >= rangeStart && itemTime < rangeEnd)
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
	
	// general purposes
	
	var clearDatabase = function() {
		console.log("clearing database");
		Storage.clear();
	};
	
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
		clearDatabase: clearDatabase,
		exit: exit,
	};
}();