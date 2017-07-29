var Elements = {};

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