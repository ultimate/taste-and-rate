var Spider = function(parent, definition, values, size) {
	
	this.definition = definition;
	this.values = values;
	this.size = size;
	
	this.VIEWBOX = "0 0 100 100";
	this.CLASSES = "spider";
	
	var C = 50;
	var R = 40;
	
	if(typeof(parent) == "string")
		parent = document.getElementById(parent);
	this.parent = parent;
	
	this.svg = Elements.createSVG(this.VIEWBOX, this.CLASSES, null);
		
	this.update = function(values)
	{	
		if(values)
			this.values = values;
		
		Elements.removeChildren(this.svg);
		
		var lines = Elements.fromString("<g style='stroke: #FFFFFF; stroke-width: 10;' filter='url(#primaryColor)'/>", Elements.SVG_NAMESPACE);
		for(var i = 0; i < this.definition.length; i++)
		{
			lines.appendChild(Elements.fromString("<line x1='" + C + "' y1='" + C + "' x2='" + C + "' y2='" + (C-R) + "'/>", Elements.SVG_NAMESPACE));
		}
		this.svg.append(lines);
		
		//this.svg.appendChild(Elements.fromString("<rect x='0' y='0' width='100' height='100' style='fill: #000000'/>", Elements.SVG_NAMESPACE));
	};
	
	this.update();
	
	this.parent.appendChild(this.svg);
};