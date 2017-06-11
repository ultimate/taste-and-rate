var UI = function() {
	
	this.initialize = function()
	{
		this.search = function() {
			this.HIDE_AFTER = 5000;
			this.timeout = null;
			this.tf = $("#search_textfield");
			
			this.showInput = function() {
				//console.log("search.showInput()");
				tf.removeClass("hidden");
				tf.focus();
				this.autoHide();
			};	
			
			this.hideInput = function() {			
				//console.log("search.hideInput()");
				tf.addClass("hidden");
			};
			
			this.autoHide = function() {
				console.log("search.autoHide()");
				if(this.timeout)
					return;
				this.timeout = setTimeout(function(s) {
					return function() {
						s.hideInput();
						s.timeout = null;
					};
				}(this), this.HIDE_AFTER);
			};
			
			this.cancelAutoHide = function() {
				console.log("search.cancelAutoHide()");
				if(this.timeout)
				{
					clearTimeout(this.timeout);
					this.timeout = null;
				}
			};	
			
			this.delayAutoHide = function() {
				console.log("search.delayAutoHide()");
				this.cancelAutoHide();
				this.autoHide();
			};			
			
			this.tf.bind("keydown keypressed keyup click mousedown mouseup", function(s) { return function() { s.delayAutoHide() }; }(this) );
		
			return this;
		}();
	};	
	
	return this;
}();

