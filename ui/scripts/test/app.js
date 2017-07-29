var app = function() {
	
	this.getString = function(key) {
		if(key == null || key == "")
			return key; // otherwise the following eval would fail!
		return eval("lang." + key);
	};
	
	this.RATING_X = "rating_"
	this.RATING_ID = RATING_X + "id";
	
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
	
	this.saveRating = function(rating) {
		if(rating == null)
			return;
		if(rating.id == null)
		{
			rating.id = Storage.loadLocalObject(this.RATING_ID) + 1;
			Storage.saveLocalObject(this.RATING_ID, rating.id);
		}
		Storage.saveLocalObject(this.RATING_X + rating.id, rating);
	};	
	
	this.loadRating = function(id) {
		if(id == null)
			return null;
		return Storage.loadLocalObject(this.RATING_X + id);
	};
	
	this.clearDatabase = function() {
		Storage.clear();
	};
	
	this.exit = function() {
		window.location.reload(true);
	};
	
	return this;
}();