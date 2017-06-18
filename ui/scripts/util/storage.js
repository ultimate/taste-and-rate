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

Storage.loadLocalObject = function(key, depth)
{	
	if(depth == null)
		depth = 0;
	else if(depth == 100)
		return null;
	
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
	
	//console.log("loading local object: " + key + " (depth=" + depth + ")");	
	//console.log("check if object: " + key);
	
	var object = {};
	var subKeys = [];
	var keyFound = false;
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
		}
	}
	//console.log(subKeys);
	for(var i = 0; i < subKeys.length; i++)
	{
		var subKey = subKeys[i];
		//console.log("loading sub object: " + key + "." + subKey);	
		object[subKey] = this.loadLocalObject(key + "." + subKey, depth+1)
	}
	
	if(keyFound)
		return object;
	else
		null;
};

Storage.clear = function()
{
	localStorage.clear();
};