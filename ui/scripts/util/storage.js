var Storage = {};

Storage.NATIVE_TYPE = "native_type";
Storage.TYPE_DATE = "Date";

Storage.saveLocalObject = function(key, object)
{
	if(object instanceof Date)
	{
		localStorage.setItem(key + "." + this.NATIVE_TYPE, this.TYPE_DATE);
		localStorage.setItem(key + ".time", object.getTime());
	}
	else if(typeof(object) == "object")
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
	var typeFound = false;
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
			if(subKey == this.NATIVE_TYPE)
				typeFound = true;
		}
	}
	
	if(typeFound)
	{
		var type = this.loadLocalObject(key + "." + this.NATIVE_TYPE);
		switch(type)
		{
			case this.TYPE_DATE:	return new Date(this.loadLocalObject(key + ".time"));
			default:				return null;
		}
	}
	else if(keyFound)	
	{
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
			object[subKey] = this.loadLocalObject(key + "." + subKey);
		}
		return object;
	}
	else
	{
		return null;
	}
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