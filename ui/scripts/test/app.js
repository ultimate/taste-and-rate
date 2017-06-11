var app = function() {
	
	this.getString = function(key) {
		return key;
	};
	
	this.RATING_X = "rating_"
	this.RATING_ID = RATING_X + "id";
	
	this.getCategoryNames = function() {
		var result = [];
		var categories = getCategories();
		for(var c in categories)
		{
			result.push(c);
		}
		return result;
	};
	
	this.getCategories = function() {
		return [
			TEST_CAT_RUM,
			TEST_CAT_WHISKY,
			TEST_CAT_BEER,
		]
	};
	
	this.newRating = function(category) {
		if(category == "Rum") {
			return {
				
			};
		}
		else if(category == "Whisky") {
			return {
				
			};
		}
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
	
	return this;
}();