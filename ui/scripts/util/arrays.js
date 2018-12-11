if(!Array.prototype.indexOf)
{
	// Find the index of an element
	Array.prototype.indexOf = function(what)
	{ 
		for(var i=0; i<this.length;i++)
		{
			if(this[i] == what) return i;
		}
		return -1;
	};
}

// Sort a numerical Array
Array.prototype.numSort = function()
{
	this.sort(function(a,b) {return a-b;});
};

// delete an object
Array.prototype.remove = function(what)
{
	var index = this.indexOf(what); 
	if(index != -1)
		this.removeAt(index);
	return this;
};

// delete an object
Array.prototype.removeAt = function(index)
{
	this.splice(index, 1);
	return this;
};

// insert an object at the specified index
Array.prototype.insertAt = function(what, index)
{
	this.splice(index, 0, what);
	return this;
};

// perform a binary search for the given entry
Array.prototype.binaryIndexOf = function(what, compFunc)
{
	'use strict';

	var minIndex = 0;
	var maxIndex = this.length - 1;
	var currentIndex;
	var currentElement;
	var resultIndex;

	while (minIndex <= maxIndex) {
		resultIndex = currentIndex = (minIndex + maxIndex) / 2 | 0;
		currentElement = this[currentIndex];

		if (compFunc ? compFunc(currentElement, what) < 0 : currentElement < what) {
			minIndex = currentIndex + 1;
		}
		else if (compFunc ? compFunc(currentElement, what) > 0 : currentElement > what) {
			maxIndex = currentIndex - 1;
		}
		else {
			return currentIndex;
		}
	}

	return ~currentIndex;
};

// perform a binary search for the given array for an element with the given id
Array.prototype.binaryIndexOfId = function(whatId)
{
	return this.binaryIndexOf({id: whatId}, function(o1, o2) { return o1.id - o2.id; });
};

// shuffle an array
Array.prototype.shuffle = function() {
    var j, i;
	var tmp;
    for (i = this.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tmp = this[i];
        this[i] = this[j];
        this[j] = tmp;
    }
}