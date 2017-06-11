var Storage = {};

Storage.saveLocalObject = function(key, object)
{
	for(var prop in object)
	{
		if(typeof(object[prop]) == Reflections.type.FUNCTION)
		{
			continue;
		}
		else if(typeof(object[prop]) == Reflections.type.OBJECT && object[prop] != null)
		{
			this.saveLocalObject(key + "." + prop, object[prop]);
		}
		else
		{
			console.log("saving local object: " + key + "." + prop + " = " + object[prop]);
			localStorage.setItem(key + "." + prop, object[prop]);
		}
	}
};

Storage.loadLocalObject = function(key)
{
	var object = {};
	var keyFound = false;
	for(var prop in localStorage)
	{
		if(prop.startsWith(key + "."))
		{
			var subKey = prop.substring(key.length+1); 
			if(subKey.contains("."))
			{
				var subKey = subKey.substring(0, subKey.indexOf("."));
				object[subKey] = this.loadLocalObject(key + "." + subKey)
			}
			else
			{
				var value = localStorage[prop];
				if(value == "true")
					object[subKey] = true;
				else if(value == "false")
					object[subKey] = false;
				else if(value == "null")
					object[subKey] = null;
				else if(Number(value).toString() == value) // parsing to number successfull
					object[subKey] = Number(value);
				else
					object[subKey] = value;
			}
			keyFound = true;
		}
	}
	if(keyFound)
		return object;
	else
		return null;
};