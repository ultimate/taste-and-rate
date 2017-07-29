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
		else if(parent.getElementsByTagName == undefined)
			parent = document;
		var elements;
		// labels
		elements = parent.getElementsByTagName(this.LABEL_TAGNAME);
		for( var i = 0; i < elements.length; i++)
		{
			console.log("updating label key='" + elements[i].getAttribute(this.KEY_ATTRIBUTE) + "'");
			// remove all current children
			while(elements[i].firstChild)
				elements[i].removeChild(elements[i].firstChild);
			elements[i].appendChild(document.createTextNode(this.getString(elements[i].getAttribute(this.KEY_ATTRIBUTE))));
		}
		// buttons
		elements = document.getElementsByTagName(this.BUTTON_TAGNAME);
		for( var i = 0; i < elements.length; i++)
		{
			if(elements[i].getAttribute("type") == "button")
				elements[i].value = this.getString(elements[i].getAttribute(this.KEY_ATTRIBUTE));
		}
		// ToDo other element types like
		// - selects
		// - iframe (reload in different language)
		//document.getElementById(this.constants.STATIC_FRAME_ID).contentWindow.location.reload(true)
	};
};