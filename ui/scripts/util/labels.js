var LabelManager = function(labelProvider, labelFunction) {
	
	this.LABEL_TAGNAME = "label";
	this.BUTTON_TAGNAME = "input";
	//this.LINK_TAGNAME = "a";
	this.KEY_ATTRIBUTE = "key";
	//this.KEY_TOOLTIP_SUFFIX = "_tooltip";
	
	this.labelProvider = labelProvider;
	this.labelFunction = labelFunction;
	
	this.getString = function(key) {
		return this.labelFunction.call(this.labelProvider, key);
	};

	this.updateLabels = function(parent)
	{
		if(parent == undefined)
			parent = document;
	
		var elements = $(parent).find("label");
		
		elements.each(function(lm) {
			return function(index, element) {
				console.log("updating label key='" + element.getAttribute(lm.KEY_ATTRIBUTE) + "'");
				// remove text nodes
				$(element).contents().filter(function() {
					return this.nodeType == 3; //Node.TEXT_NODE
				}).remove();
				// append new text
				$(element).append( $(document.createTextNode(lm.getString(element.getAttribute(lm.KEY_ATTRIBUTE)))) );
			};
		}(this) );
		// ToDo other element types like
		// - buttons (set value instead of content)
		// - selects
		// - iframe (reload in different language)
	};
};