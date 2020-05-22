var Elements = {
	SVG_NAMESPACE: "http://www.w3.org/2000/svg",
	SVG_XML_NAMESPACE: "http://www.w3.org/2000/xmlns/",
	SVG_XLINK_NAMESPACE: "http://www.w3.org/1999/xlink",
};

Elements.isBelow = function(parent, element)
{
	var node = element;
	var below = 0;
	
	do
	{
		if(node == parent)
			return below;
		node = node.parentElement;
		below++;
	} while(node != null);
	return -1;
};

Elements.isChild = function(parent, element, directOnly)
{
	var below = this.isBelow(parent, element); 
	if(directOnly)
		return below == 1;
	else
		return below >= 1;
};

Elements.isChildOrSame = function(parent, element)
{
	var below = this.isBelow(parent, element); 
	return below >= 0;
};

Elements.isVisible = function(element, completeVisibilityRequired)
{
	// https://stackoverflow.com/a/22480938/4090157
	
	var rect = element.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;
	
	if(completeVisibilityRequired)
		// Only completely visible elements return true:
		return (elemTop >= 0) && (elemBottom <= window.innerHeight);   
	else
		// Partially visible elements return true:
		return elemTop < window.innerHeight && elemBottom >= 0;
};

Elements.fromString = function(html)
{	
    var container = document.createElement("container");
    container.innerHTML = html.trim();
	if(container.childNodes.length == 1)
		return container.childNodes[0];
	else
		return container.childNodes;
};

Elements.removeChildren = function(element)
{
	while(element.childNodes.length > 0)
		element.removeChild(element.childNodes[0]);
};

Elements.createSVG = function(viewBox, classes, useID)
{
	var svg = document.createElementNS(this.SVG_NAMESPACE, "svg");
	svg.setAttribute("xmlns", this.SVG_XML_NAMESPACE);
	svg.setAttributeNS(this.SVG_XML_NAMESPACE, "xmlns:xlink", this.SVG_XLINK_NAMESPACE);
	svg.setAttribute("viewBox", viewBox);
	svg.setAttribute("class", classes);
	
	var use = document.createElementNS(this.SVG_NAMESPACE, "use");
	use.setAttributeNS(this.SVG_XLINK_NAMESPACE, "xlink:href", useID);
	svg.append(use);
	
	console.log(svg);
	
	return svg;
};

Elements.addEllipsis = function(element) {
	if(element.scrollHeight > 2*element.offsetHeight)
	{
		// incrementally ADD words until the container scroll size is BIGGER than the display size
		var wordArray = element.innerHTML.split(" ");
		var wordArray2 = [];
		element.innerHTML = wordArray2.join(" ") + "...";
		while(element.scrollHeight <= element.offsetHeight && wordArray.length > 0) {
			wordArray2.push(wordArray.shift());
			element.innerHTML = wordArray2.join(" ") + "...";
		}
		wordArray2.pop();
		element.innerHTML = wordArray2.join(" ") + "...";
	}
	else
	{
		// incrementally REMOVE words until the container scroll size is SMALLER than the display size
		var wordArray = element.innerHTML.split(" ");
		while(element.scrollHeight > element.offsetHeight && wordArray.length > 0) {
			wordArray.pop();
			element.innerHTML = wordArray.join(" ") + "...";
		}
	}
	
	/* alternate option
	var wordArray = element.innerHTML.split(" ");
	Elements.removeChildren(element);
	
	for(var w in wordArray)
	{
		if(w > 0)
			element.appendChild(document.createTextNode(" " + wordArray[w]));
		else 
			element.appendChild(document.createTextNode(wordArray[w]));
		
		if(element.scrollHeight > element.offsetHeight)
		{
			element.replaceChild(document.createTextNode("..."), element.childNodes[element.childNodes.length-1]);
			break;
		}
	}
	*/
};