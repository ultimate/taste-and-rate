var UI = function() {
	
	this.search = function() {
		this.HIDE_AFTER = 5000;
		this.timeout = null;
		
		this.showInput = function() {
			console.log("search.showInput()");
			$("#search_textfield").removeClass("hidden");
			this.updateTimeout();
		};	
		
		this.hideInput = function() {			
			console.log("search.hideInput()");
			$("#search_textfield").addClass("hidden");
		};
		
		this.updateTimeout = function() {
			if(this.timeout)
				clearTimeout(this.timeout);
			this.timeout = setTimeout(function(s) {
				return function() { s.hideInput(); };
			}(this), this.HIDE_AFTER);
		};
	
		return this;
	}();
	
	return this;
}();

