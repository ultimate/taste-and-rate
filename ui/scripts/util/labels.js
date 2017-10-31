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
		else if(typeof(parent) == "string")		
			parent = document.getElementById(parent);
		else if(parent.getElementsByTagName == undefined)
			parent = document;
		var elements;
		var key;
		// labels
		elements = parent.getElementsByTagName(this.LABEL_TAGNAME);
		for( var i = 0; i < elements.length; i++)
		{
			key = elements[i].getAttribute(this.KEY_ATTRIBUTE);
			if(key == "" || key == null)
				continue;
			console.log("updating label key='" + key + "'");
			// remove all current children
			while(elements[i].firstChild)
				elements[i].removeChild(elements[i].firstChild);
			elements[i].appendChild(document.createTextNode(this.getString(key)));
		}
		// buttons
		elements = document.getElementsByTagName(this.BUTTON_TAGNAME);
		for( var i = 0; i < elements.length; i++)
		{
			key = elements[i].getAttribute(this.KEY_ATTRIBUTE);
			if(key == "" || key == null)
				continue;
			if(elements[i].getAttribute("type") == "button")
				elements[i].value = this.getString(key);
		}
		// ToDo other element types like
		// - selects
		// - iframe (reload in different language)
		//document.getElementById(this.constants.STATIC_FRAME_ID).contentWindow.location.reload(true)
	};
};