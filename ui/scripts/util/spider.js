var Spider = function(parent, definition, values, size) {
	
	this.definition = definition;
	this.values = values;
	this.size = size;
	
	this.DRAWSIZE = 300;
	this.VIEWBOX = "0 0 " + this.DRAWSIZE + " " + this.DRAWSIZE;
	this.CLASSES = "spider";
	
	
	this.FILTER_PRIMARY = "primaryColor";
	this.FILTER_SECONDARY = "secondaryColor";
	this.FILTER_SUFFIX;
	
	var C = this.DRAWSIZE * 0.5; // center position
	var R = this.DRAWSIZE * 0.4; // radius
	var S = 3; // stroke
	var F = 10;
	
	if(typeof(parent) == "string")
		parent = document.getElementById(parent);
	this.parent = parent;
	
	this.svg = Elements.createSVG(this.VIEWBOX, this.CLASSES, null);
	
	if(document.getElementById("defines") != null)
	{
		// copy filters
		this.FILTER_SUFFIX = new Date().getTime();
		var svgs = document.getElementById("defines").getElementsByTagName("svg");
		if(svgs.length > 0)
		{
			var filters = svgs[0].getElementsByTagName("filter");
			for(var i = 0; i < filters.length; i++)
			{
				var filter = filters[i].cloneNode(true);
				console.log("copying filter: " + filter.id);
				filter.id = filter.id + this.FILTER_SUFFIX;
				this.svg.appendChild(filter);
			}
		}
	}
		
	this.update = function(values)
	{	
		if(values)
			this.values = values;
		
		//Elements.removeChildren(this.svg);
		
		var lines = Elements.fromString("<g filter='url(#" + this.FILTER_PRIMARY + this.FILTER_SUFFIX + ")'   style='stroke: #FFFFFF; stroke-width: " + S + ";' />", Elements.SVG_NAMESPACE);
		var names = Elements.fromString("<g filter='url(#" + this.FILTER_SECONDARY + this.FILTER_SUFFIX + ")' style='font-size: " + F + "px;'/>", Elements.SVG_NAMESPACE);
		for(var i = 0; i < this.definition.length; i++)
		{
			var angle = i*360/this.definition.length-90;
			lines.appendChild(Elements.fromString("<line transform='rotate(" + angle + "," + C + "," + C + ")' x1='" + C + "' y1='" + C + "' x2='" + (C+R) + "' y2='" + C + "' />", Elements.SVG_NAMESPACE));
			var anchor;
			var extraRotation;
			var offset;
			if(angle < 90)
			{
				offset = F;
				anchor = "end";
				extraRotation = "";
			}
			else
			{
				offset = S;
				anchor = "start";
				extraRotation = " rotate(180," + (C+R) + "," + (C+offset) + ") ";
			}
			names.appendChild(Elements.fromString("<text transform='rotate(" + angle + "," + C + "," + C + ")" + extraRotation + "' x='" + (C+R) + "' y='" + (C+offset) + "' text-anchor='" + anchor + "'>" + this.definition[i].key + "</text>", Elements.SVG_NAMESPACE));
		}
		this.svg.appendChild(lines);
		this.svg.appendChild(names);
		
		//this.svg.appendChild(Elements.fromString("<rect x='0' y='0' width='100' height='100' style='fill: #000000'/>", Elements.SVG_NAMESPACE));
	};
	
	this.update();
	
	this.parent.appendChild(this.svg);
};