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
	
	var C 	= this.DRAWSIZE * 0.5; // center position
	var LR 	= this.DRAWSIZE * 0.45; // line radius
	var PR 	= this.DRAWSIZE * 0.4; // point radius
	var S 	= 3; // stroke
	var F 	= 10; // font size
	var D 	= 5; // dot size
	
	if(typeof(parent) == "string")
		parent = document.getElementById(parent);
	this.parent = parent;
	
	this.svg = Elements.createSVG(this.VIEWBOX, this.CLASSES, null);
	this.svgValues;
		
	this.draw = function()
	{	
		// copy filters
		if(document.getElementById("defines") != null)
		{
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
		
		// draw coordinate system
		var lines = Elements.fromString("<g filter='url(#" + this.FILTER_SECONDARY + this.FILTER_SUFFIX + ")' style='stroke: #FFFFFF; stroke-width: " + S + ";' />", Elements.SVG_NAMESPACE);
		var names = Elements.fromString("<g filter='url(#" + this.FILTER_SECONDARY + this.FILTER_SUFFIX + ")' style='font-size: " + F + "px;'/>", Elements.SVG_NAMESPACE);
		for(var i = 0; i < this.definition.length; i++)
		{
			var angle = i*360/this.definition.length-90;
			lines.appendChild(Elements.fromString("<line transform='rotate(" + angle + "," + C + "," + C + ")' x1='" + C + "' y1='" + C + "' x2='" + (C+LR) + "' y2='" + C + "' />", Elements.SVG_NAMESPACE));
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
				extraRotation = " rotate(180," + (C+LR) + "," + (C+offset) + ") ";
			}
			
			// TODO localization #48
			names.appendChild(Elements.fromString("<text transform='rotate(" + angle + "," + C + "," + C + ")" + extraRotation + "' x='" + (C+LR) + "' y='" + (C+offset) + "' text-anchor='" + anchor + "'>" + this.definition[i].key + "</text>", Elements.SVG_NAMESPACE));
		}
		this.svg.appendChild(lines);
		this.svg.appendChild(names);
		
		// prepare container for values
		this.svgValues = Elements.fromString("<g filter='url(#" + this.FILTER_PRIMARY + this.FILTER_SUFFIX + ")'/>", Elements.SVG_NAMESPACE);
		this.svg.appendChild(this.svgValues);
	};
	
	this.update = function(values)
	{
		if(values)
			this.values = values;
		
		
		Elements.removeChildren(this.svgValues);
		
		var polygonPoints = "";
		
		for(var i = 0; i < this.definition.length; i++)
		{
			if(this.values[i] == null)
				continue;
			
			var angle = i*360/this.definition.length-90;
			var V = this.values[i]*PR / 10;
						
			this.svgValues.appendChild(Elements.fromString("<circle transform='rotate(" + angle + "," + C + "," + C + ")' cx='" + (C+V) + "' cy='" + C + "' r='" + D + "' style='fill: #FFFFFF;'/>", Elements.SVG_NAMESPACE));
			
			var transformedX = V * Math.cos(angle/180 * Math.PI) + C;
			var transformedY = V * Math.sin(angle/180 * Math.PI) + C;
			polygonPoints += (transformedX + "," + transformedY + " ");			
		}
		
		this.svgValues.appendChild(Elements.fromString("<polygon points='" + polygonPoints + "' style='fill: rgba(255,255,255,0.5);'/>", Elements.SVG_NAMESPACE));
	};
	
	this.draw();
	this.update();
	
	this.parent.appendChild(this.svg);
};