var app = function() {
	
	this.getString = function(key) {
		if(key == null || key == "")
			return key; // otherwise the following eval would fail!
		return eval("lang." + key);
	};
	
	this.TYPE_EVENT = "event";
	this.TYPE_RATING = "rating";
	
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
	
	this.save = function(type, object) {
		switch(type)
		{
			case this.TYPE_EVENT:
			case this.TYPE_RATING:
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
		if(event.id == null)
			this.events.push(event);
		this.save(this.TYPE_EVENT, event);
	};	
	
	this.loadEvent = function(id) {
		return this.load(this.TYPE_EVENT, id);
	};
	
	this.getEvents = function() {
		if(this.events == null)
		{
			this.events = [];
			for(var i = 1; i <= 20; i++)
			{
				this.events.push({
					id: -i,
					title: "Random Event " + i,
					date: new Date(Date.now() + (Math.random() * 90 - 45)*24*3600*1000)
				})
			}
			var maxId = Storage.loadLocalObject(this.TYPE_EVENT + "_id");
			for(var i = 1; i <= maxId; i++)
			{
				this.events.push(this.loadEvent(i));
			}
		}
		return this.events;
	};
	
	this.ratings = null;
	
	this.saveRating = function(rating) {
		if(rating.id == null)
			this.ratings.push(rating);
		this.save(this.TYPE_RATING, rating);
	};	
	
	this.loadRating = function(id) {
		return this.load(this.TYPE_RATING, id);
	};
	
	this.clearDatabase = function() {
		Storage.clear();
	};
	
	this.exit = function() {
		window.location.reload(true);
	};
	
	return this;
}();