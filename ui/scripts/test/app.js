var app = function() {
	
	this.CURRENT_USER = 1;
	this.FRIENDS = [2,3,4];
	
	this.NUMBER_OF_SAMPLES = 200;
	
	this.getString = function(key) {
		if(key == null || key == "")
			return key; // otherwise the following eval would fail!
		return eval("lang." + key);
	};
	
	this.getCategoryNames = function() {
		var result = [];
		var categories = getCategories();
		for(var c = 0; c < categories.length; c++)
		{
			result.push(categories[c].category.key);
		}
		return result;
	};
	
	this.setCategories = function(categories) {
		for(var c = 0; c < categories.length; c++)
		{
			console.log(categories[c]);
		}
		Storage.removeLocalObject("categories");
		Storage.saveLocalObject("categories", categories);
	};
	
	this.getCategories = function() {
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
		this.setCategories(categories);
		return categories;
	};
	
	this.validate = function(type, field, value) {
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
				return true;
			default:
				throw new Error("unsupported type");
		}
	};
	
	this.save = function(type, object) {
		var list = null;
		switch(type)
		{
			case UI.constants.TYPE_EVENT:
				list = this.events;
				break;
			case UI.constants.TYPE_RATING:
				list = this.ratings;
				break;
			default:
				throw new Error("unsupported type");
		}
		if(object == null)
			return;
		if(object.id == null)
		{
			object.id = Storage.loadLocalObject(type + "_id") + 1;
			Storage.saveLocalObject(type + "_id", object.id);
			if(list != null)
				list.push(object);
		}
		Storage.saveLocalObject(type + "_" + object.id, object);
	};
	
	this.load = function(type, id) {
		if(id == null)
			return null;
		return Storage.loadLocalObject(type + "_" + id);
	};
	
	this.events = null;
		
	this.saveEvent = function(event) {
		//if(event.id == null)
		//	this.events.push(event);
		this.save(UI.constants.TYPE_EVENT, event);
	};	
	
	this.loadEvent = function(id) {
		return this.load(UI.constants.TYPE_EVENT, id);
	};
	
	this.getEvents = function() {
		if(this.events == null)
		{
			this.events = [];
			var d;
			for(var i = 1; i <= NUMBER_OF_SAMPLES; i++)
			{
				d = new Date(Date.now() + (Math.random()*360-180)*24*3600*1000);
				d.setSeconds(0);
				d.setMilliseconds(0);
				
				this.events.push({
					id: -i,
					title: "Random Event " + i,
					location: "Somewhere " + i,
					date: d,
					description: "Do something " + i + " somewhere..."
				});
			}
			var maxId = Storage.loadLocalObject(UI.constants.TYPE_EVENT + "_id");
			for(var i = 1; i <= maxId; i++)
			{
				this.events.push(this.loadEvent(i));
			}
		}
		return this.events;
	};
	
	this.ratings = null;
	
	this.saveRating = function(rating) {
		//if(rating.id == null)
		//	this.ratings.push(rating);
		this.save(UI.constants.TYPE_RATING, rating);
	};	
	
	this.loadRating = function(id) {
		return this.load(UI.constants.TYPE_RATING, id);
	};
	
	this.getRatings = function(categoryId, scope) {
		if(this.ratings == null)
		{
			var tags = ["sweet", "old", "dark", "bright", "fruity", "high alcohol", "spicy"];
			
			this.ratings = [];
			var categories = this.getCategories();
			var d;
			var category;
			var categoryName;
			var id;
			var criteria;
			var spider;
			for(var c = 0; c < categories.length; c++)
			{		
				category = categories[c].category;
				categoryName = this.getString(category.key + ".title");
				for(var i = 1; i <= NUMBER_OF_SAMPLES; i++)
				{
					d = new Date(Date.now() + (Math.random() * 90 - 45)*24*3600*1000);
					d.setSeconds(0);
					d.setMilliseconds(0);
					
					id = (category.id*1000 + i);
					
					criteria = [];
					for(var cr = 0; cr < category.criteria.length; cr++)
					{
						spider = [];
						if(category.criteria[cr].spider)
						{	
							for(var s = 0; s < category.spider.length; s++)
							{
								spider.push({
									ref: category.spider[s].id,
									value: Math.round(Math.random()*10)
								});
							}
						}
						
						criteria.push({
							ref: 		category.criteria[cr].id,
							stars: 		(category.criteria[cr].stars 	? Math.ceil(Math.random()*5) : 0),
							text: 		(category.criteria[cr].text 	? "Criterion " + cr + " text" : ""),
							spider: 	(category.criteria[cr].spider 	? spider : []),
							tags: 		(category.criteria[cr].tags 	? new Array(tags[Math.floor(Math.random()*tags.length)]) : [])
						});
					}					
					
					this.ratings.push({
						id: -id,
						category: category.id,
						creator:	Math.round(Math.random()*10),
						product: "The very special " + categoryName + " #" + i,
						summary: "Random Rating " + id,
						date: d,
						event: null, // TODO
						criteria: criteria,
					});
				}
			}
			var maxId = Storage.loadLocalObject(UI.constants.TYPE_EVENT + "_id");
			for(var i = 1; i <= maxId; i++)
			{
				this.ratings.push(this.loadEvent(i));
			}
		}
		// filter by scope
		var result = [];
		for(var r = 0; r < this.ratings.length; r++)
		{
			if(this.ratings[r].category != categoryId)
				continue;
			if((scope & UI.constants.SCOPE_PERSONAL) != 0 && this.CURRENT_USER == this.ratings[r].creator)
				result.push(this.ratings[r]);
			if((scope & UI.constants.SCOPE_FRIENDS) != 0 && this.FRIENDS.indexOf(this.ratings[r].creator) != -1)
				result.push(this.ratings[r]);
			if((scope & UI.constants.SCOPE_GLOBAL) != 0 && this.CURRENT_USER != this.ratings[r].creator && this.FRIENDS.indexOf(this.ratings[r].creator) == -1)
				result.push(this.ratings[r]);
		}
		return result;
	};
	
	this.clearDatabase = function() {
		console.log("clearing database");
		Storage.clear();
	};
	
	this.exit = function() {
		window.location.reload(true);
	};
	
	return this;
}();