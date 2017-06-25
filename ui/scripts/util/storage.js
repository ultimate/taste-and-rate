var Storage = {};

Storage.saveLocalObject = function(key, object)
{
	if(typeof(object) == "object")
	{
		for(var prop in object)
		{
			if(typeof(object[prop]) == "function")
			{
				continue;
			}
			else if(typeof(object[prop]) == "object" && object[prop] != null)
			{
				this.saveLocalObject(key + "." + prop, object[prop]);
			}
			else
			{
				//console.log("saving local object: " + key + "." + prop + " = " + object[prop]);
				localStorage.setItem(key + "." + prop, object[prop]);
			}
		}
	}
	else
	{
		localStorage.setItem(key, object);
	}
};

Storage.loadLocalObject = function(key)
{		
	var value = localStorage[key];
	if(value == "true")
		return true;
	else if(value == "false")
		return false;
	else if(value == "null")
		return null;
	else if(Number(value).toString() == value) // parsing to number successfull
		return Number(value);
	else if(value != null)
		return value;
	
	// not a primitive	
	//console.log("loading local object: " + key);	
	//console.log("check if object: " + key);
	
	var subKeys = [];
	var keyFound = false;
	var indexFound = false;
	for(var prop in localStorage)
	{
		if(prop.startsWith(key + "."))
		{
			var subKey = prop.substring(key.length+1); 
			if(subKey.contains("."))
			{
				subKey = subKey.substring(0, subKey.indexOf("."));
			}
			//console.log(subKey)
			if(subKeys.indexOf(subKey) == -1)
				subKeys.push(subKey);
			keyFound = true;
			if(Number(subKey).toString() == subKey)
				indexFound = true;
		}
	}
	
	var object;
	if(indexFound) // numerical index found -> object is an array
		object = [];
	else
		object = {};
	//console.log(subKeys);
	for(var i = 0; i < subKeys.length; i++)
	{
		var subKey = subKeys[i];
		//console.log("loading sub object: " + key + "." + subKey);	
		object[subKey] = this.loadLocalObject(key + "." + subKey)
	}
	
	if(keyFound)
		return object;
	else
		null;
};

Storage.removeLocalObject = function(key)
{
	for(var prop in localStorage)
	{
		if(prop.startsWith(key + ".") || prop == key)
		{
			localStorage.removeItem(key);
		}
	}	
};

Storage.clear = function()
{
	localStorage.clear();
};